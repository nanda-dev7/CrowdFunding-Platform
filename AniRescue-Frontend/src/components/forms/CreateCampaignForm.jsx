import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ImagePlus, Send, Plus, Trash2 } from "lucide-react";
import { 
  createCampaign, 
  addCampaignUpdate, 
  updateExpenses, 
  uploadSupportingDocument 
} from "../../api/campaignApi";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";

const steps = ["Story", "Scope", "Funding", "Media", "Timeline", "Expenses", "Docs & Verification"];

const CAMPAIGN_TYPES = [
  "Individual animal rescue",
  "Group animal rescue",
  "Medical treatment",
  "Feeding drive",
  "Vaccination / sterilization drive",
  "Safety equipment drive",
  "Wildlife relocation / conflict prevention",
  "Shelter / foster support",
  "Other animal welfare campaign",
];

export default function CreateCampaignForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 0: Story (Basic Campaign Info)
  const [values, setValues] = useState({
    title: "",
    campaignType: "Individual animal rescue",
    description: "",
    category: "Treatment",
    goalAmount: "",
    deadline: "",
    urgency: "normal",
    location: "",
    coverImage: null,
  });

  const isIndividualOrMedical = ["Individual animal rescue", "Medical treatment"].includes(values.campaignType);

  // Step 1: Scope (Conditional based on Campaign Type)
  // 1A. Animal Details (Individual)
  const [animalDetails, setAnimalDetails] = useState({
    type: "Dog",
    name: "",
    approxAge: "",
    gender: "Unknown",
    condition: "",
  });

  const [vetDetails, setVetDetails] = useState({
    clinicName: "",
    contactNumber: "",
    diagnosis: "",
    estimatedCost: "",
  });

  // 1B. Group/Welfare Details
  const [groupWelfareDetails, setGroupWelfareDetails] = useState({
    targetGroup: "",
    estimatedCount: "",
    campaignArea: "",
    actionPlan: "",
    requiredMaterials: "",
  });

  // Step 4: Timeline
  const [timelineStage, setTimelineStage] = useState("before");
  const [timelineText, setTimelineText] = useState("");
  const [timelineImage, setTimelineImage] = useState(null);

  // Step 5: Expenses
  const [expenseRows, setExpenseRows] = useState([{ label: "", percentage: "" }]);

  // Step 6: Docs & Verification
  const [docTitle, setDocTitle] = useState("");
  const [docFile, setDocFile] = useState(null);
  
  const [verificationDetails, setVerificationDetails] = useState({
    partnerDetails: "",
    permissionProofUrl: "",
  });
  const [consentChecked, setConsentChecked] = useState(false);
  const [preview, setPreview] = useState("");

  const update = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }));
  
  const updateAnimal = (key) => (event) => setAnimalDetails((current) => ({ ...current, [key]: event.target.value }));
  const updateVet = (key) => (event) => {
    const val = event.target.value;
    setVetDetails((current) => ({ ...current, [key]: val }));
    if (key === "estimatedCost") {
      setValues((current) => ({ ...current, goalAmount: val }));
    }
  };

  const updateGroupWelfare = (key) => (event) => setGroupWelfareDetails((current) => ({ ...current, [key]: event.target.value }));
  const updateVerification = (key) => (event) => setVerificationDetails((current) => ({ ...current, [key]: event.target.value }));

  const updateFile = (event) => {
    const file = event.target.files?.[0];
    setValues((current) => ({ ...current, coverImage: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  const updateExpenseRow = (index, field) => (event) => {
    setExpenseRows((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: event.target.value };
      return copy;
    });
  };

  const addExpenseRow = () => setExpenseRows((prev) => [...prev, { label: "", percentage: "" }]);
  const removeExpenseRow = (index) => setExpenseRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  const expenseTotal = expenseRows.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0);

  const submit = async (event) => {
    event.preventDefault();

    if (!consentChecked) {
      return toast.error("You must confirm the consent checkbox to proceed.");
    }
    if (expenseTotal > 100) {
      setStep(5);
      return toast.error("Total expenses percentage cannot exceed 100%");
    }

    setIsSubmitting(true);
    
    try {
      // 1. Create Base Campaign
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      
      // Attach conditional scopes
      if (isIndividualOrMedical) {
        formData.append("animalDetails", JSON.stringify(animalDetails));
        formData.append("vetDetails", JSON.stringify(vetDetails));
      } else {
        formData.append("groupWelfareDetails", JSON.stringify(groupWelfareDetails));
      }

      formData.append("verificationDetails", JSON.stringify(verificationDetails));
      formData.append("consentChecked", consentChecked);
      
      const res = await createCampaign(formData);
      const campaignId = res.campaign._id || res.campaign.id;

      // 2. Upload Timeline Update (if provided)
      if (timelineText.trim()) {
        const updateData = new FormData();
        updateData.append("text", timelineText);
        updateData.append("stage", timelineStage);
        if (timelineImage) updateData.append("image", timelineImage);
        await addCampaignUpdate(campaignId, updateData).catch(err => {
          toast.error("Campaign created, but failed to post timeline update");
          console.error(err);
        });
      }

      // 3. Upload Expenses (if provided)
      const validExpenses = expenseRows.filter((r) => r.label.trim() && Number(r.percentage) > 0);
      if (validExpenses.length > 0) {
        await updateExpenses(campaignId, validExpenses).catch(err => {
          toast.error("Campaign created, but failed to save expenses");
          console.error(err);
        });
      }

      // 4. Upload Supporting Doc (if provided)
      if (docTitle.trim() && docFile) {
        const docData = new FormData();
        docData.append("title", docTitle);
        docData.append("document", docFile);
        await uploadSupportingDocument(campaignId, docData).catch(err => {
          toast.error("Campaign created, but failed to upload supporting document");
          console.error(err);
        });
      }

      toast.success("Campaign submitted for approval!");
      navigate("/dashboard/campaigner");

    } catch (error) {
      toast.error(error.response?.data?.message || "Campaign could not be created");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-bark/10 bg-white p-6 shadow-soft">
      <div className="mb-8 flex flex-wrap gap-2">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(index)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold sm:px-4 sm:py-2 sm:text-sm ${
              index === step ? "bg-moss text-white" : "bg-cream text-bark hover:bg-sage"
            }`}
          >
            {index + 1}. {label}
          </button>
        ))}
      </div>

      {step === 0 && (
        <div className="grid gap-4">
          <Input label="Campaign title *" value={values.title} onChange={update("title")} required placeholder="e.g. Feeding 50 stray dogs" />
          <Select label="Campaign Type *" value={values.campaignType} onChange={update("campaignType")} required>
            {CAMPAIGN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Textarea label="Campaign Story / Purpose *" value={values.description} onChange={update("description")} required placeholder="Explain why you are raising funds." />
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Category *" value={values.category} onChange={update("category")} required>
              <option value="Treatment">Treatment</option>
              <option value="Surgery">Surgery</option>
              <option value="Recovery">Recovery</option>
              <option value="Vaccination">Vaccination</option>
            </Select>
            <Input label="Primary Location *" value={values.location} onChange={update("location")} required placeholder="City, locality" />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-4">
          <p className="text-sm font-semibold text-bark/80">
            {isIndividualOrMedical ? "Information about the animal in need" : "Group / Welfare Campaign Scope"}
          </p>
          
          {isIndividualOrMedical ? (
            <div className="grid gap-4">
              <Select label="Animal Type *" value={animalDetails.type} onChange={updateAnimal("type")} required>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Cow">Cow</option>
                <option value="Bird">Bird</option>
                <option value="Other">Other</option>
              </Select>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Animal Name (if available)" value={animalDetails.name} onChange={updateAnimal("name")} placeholder="e.g. Bruno" />
                <Input label="Approx Age" value={animalDetails.approxAge} onChange={updateAnimal("approxAge")} placeholder="e.g. 2 years" />
              </div>
              <Select label="Gender" value={animalDetails.gender} onChange={updateAnimal("gender")}>
                <option value="Unknown">Unknown</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
              <Textarea label="Current Condition *" value={animalDetails.condition} onChange={updateAnimal("condition")} required placeholder="Describe the physical state of the animal." />
              
              <hr className="my-2 border-bark/10" />
              <p className="text-sm font-semibold text-bark/80">Veterinary details</p>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Vet Clinic Name" value={vetDetails.clinicName} onChange={updateVet("clinicName")} placeholder="e.g. City Pet Hospital" />
                <Input label="Vet Contact Number" value={vetDetails.contactNumber} onChange={updateVet("contactNumber")} />
              </div>
              <Textarea label="Diagnosis / Treatment Needed" value={vetDetails.diagnosis} onChange={updateVet("diagnosis")} placeholder="What did the vet diagnose?" />
              <Input label="Estimated Treatment Cost" type="number" value={vetDetails.estimatedCost} onChange={updateVet("estimatedCost")} placeholder="₹" />
              <p className="mt-[-10px] text-xs text-bark/60">This cost will automatically set your Goal Amount in the Funding step.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Target Animal Group *" value={groupWelfareDetails.targetGroup} onChange={updateGroupWelfare("targetGroup")} required placeholder="e.g. Street dogs, Monkeys" />
                <Input label="Est. Number Affected *" value={groupWelfareDetails.estimatedCount} onChange={updateGroupWelfare("estimatedCount")} required placeholder="e.g. 50" />
              </div>
              <Input label="Campaign Area *" value={groupWelfareDetails.campaignArea} onChange={updateGroupWelfare("campaignArea")} required placeholder="City, locality, landmark" />
              <Textarea label="Action Plan *" value={groupWelfareDetails.actionPlan} onChange={updateGroupWelfare("actionPlan")} required placeholder="What exactly will be done?" />
              <Textarea label="Required Materials / Services *" value={groupWelfareDetails.requiredMaterials} onChange={updateGroupWelfare("requiredMaterials")} required placeholder="e.g. Radium bands, transport vehicle, vaccines" />
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Goal amount *" type="number" value={values.goalAmount} onChange={update("goalAmount")} required />
          <Input label="Deadline *" type="date" value={values.deadline} onChange={update("deadline")} required />
          <Select label="Urgency *" value={values.urgency} onChange={update("urgency")} required>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </Select>
        </div>
      )}

      {step === 3 && (
        <div>
          <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-moss/30 bg-sage/40 p-6 text-center">
            <ImagePlus className="mb-3 text-moss" size={34} />
            <span className="font-extrabold text-ink">Upload campaign image *</span>
            <span className="mt-1 text-sm text-bark/60">PNG, JPG or WebP</span>
            <input type="file" accept="image/*" className="sr-only" onChange={updateFile} required={!values.coverImage} />
          </label>
          {preview && <img src={preview} alt="Campaign preview" className="mt-4 max-h-80 w-full rounded-3xl object-cover" />}
        </div>
      )}

      {step === 4 && (
        <div className="grid gap-4">
          <p className="text-sm font-semibold text-bark/80">Add an initial timeline update (Optional)</p>
          <Select label="Stage" value={timelineStage} onChange={(e) => setTimelineStage(e.target.value)}>
            <option value="before">Before</option>
            <option value="during">During</option>
            <option value="after">After</option>
          </Select>
          <Textarea
            label="Update description"
            value={timelineText}
            onChange={(e) => setTimelineText(e.target.value)}
            placeholder="e.g. Just admitted to the clinic, or just started the drive..."
          />
          <div>
            <span className="mb-2 block text-sm font-semibold text-bark">Upload update image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setTimelineImage(e.target.files?.[0])}
              className="w-full rounded-2xl border border-bark/10 bg-cream p-3 text-sm"
            />
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="grid gap-4">
          <p className="text-sm font-semibold text-bark/80">Initial Expense Allocation (Optional)</p>
          <p className="text-xs text-bark/60">Help donors understand how funds are broken down.</p>
          
          <div className="space-y-3">
            {expenseRows.map((row, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    label={index === 0 ? "Expense label" : undefined}
                    placeholder="e.g. Cost per band, Surgery cost"
                    value={row.label}
                    onChange={updateExpenseRow(index, "label")}
                  />
                </div>
                <div className="w-24">
                  <Input
                    label={index === 0 ? "%" : undefined}
                    type="number"
                    min="0"
                    max="100"
                    placeholder="%"
                    value={row.percentage}
                    onChange={updateExpenseRow(index, "percentage")}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeExpenseRow(index)}
                  className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-coral hover:bg-coral/10"
                  aria-label="Remove expense row"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={addExpenseRow}
              className="inline-flex items-center gap-1 text-sm font-bold text-moss hover:underline"
            >
              <Plus size={16} /> Add row
            </button>
            <span className={`text-sm font-bold ${expenseTotal > 100 ? "text-coral" : "text-bark/60"}`}>
              Total: {expenseTotal}%
            </span>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="grid gap-4">
          <p className="text-sm font-semibold text-bark/80">Supporting Documents (Optional)</p>
          <p className="text-xs text-bark/60">Upload vet bills, NGO letters, quotations, or permission documents.</p>
          
          <Input
            label="Document title"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            placeholder="e.g. Quotation for Radium Bands"
          />
          <div className="mb-4">
            <span className="mb-2 block text-sm font-semibold text-bark">Upload Document</span>
            <input
              type="file"
              accept=".pdf, image/*"
              onChange={(e) => setDocFile(e.target.files?.[0])}
              className="w-full rounded-2xl border border-bark/10 bg-cream p-3 text-sm"
            />
          </div>

          <hr className="border-bark/10" />

          <p className="text-sm font-semibold text-bark/80">Verification Details (Optional)</p>
          <Input
            label="Partner Organization / Vet / Authority"
            value={verificationDetails.partnerDetails}
            onChange={updateVerification("partnerDetails")}
            placeholder="e.g. Animal Rescue NGO, City Forest Dept"
          />
          
          <hr className="my-2 border-bark/10" />

          <p className="text-sm font-semibold text-bark/80">Consent & Declaration</p>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-sage/20 p-4">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 shrink-0 rounded text-moss accent-moss"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              required
            />
            <span className="text-sm font-semibold leading-snug text-ink">
              I confirm that the information and documents provided are true, and funds will be used only for this campaign's stated purpose.
            </span>
          </label>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Button type="button" variant="secondary" onClick={() => setStep((current) => Math.max(0, current - 1))}>
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button type="button" onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>
            Continue
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting || !consentChecked}>
            {isSubmitting ? "Submitting..." : <><Send size={18} /> Submit campaign</>}
          </Button>
        )}
      </div>
    </form>
  );
}
