import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Save, Trash2 } from "lucide-react";
import { 
  updateCampaign, 
  updateExpenses, 
  addCampaignUpdate, 
  uploadSupportingDocument, 
  deleteSupportingDocument 
} from "../../api/campaignApi";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";

const tabs = ["Details", "Scope", "Timeline", "Expenses", "Supporting Docs"];

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

export default function EditCampaignModal({ campaign, open, onClose }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);

  // ─── Details state ────────────────────────────────────────────────────────────
  const [values, setValues] = useState({
    title: "",
    description: "",
    category: "",
    goalAmount: "",
    deadline: "",
    urgency: "normal",
    campaignType: "Individual animal rescue",
    location: "",
    coverImage: null,
  });

  const isIndividualOrMedical = ["Individual animal rescue", "Medical treatment"].includes(values.campaignType);

  // ─── Scope state ──────────────────────────────────────────────────────────────
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

  const [groupWelfareDetails, setGroupWelfareDetails] = useState({
    targetGroup: "",
    estimatedCount: "",
    campaignArea: "",
    actionPlan: "",
    requiredMaterials: "",
  });

  const [verificationDetails, setVerificationDetails] = useState({
    partnerDetails: "",
    permissionProofUrl: "",
  });

  // ─── Timeline state ──────────────────────────────────────────────────────────
  const [timelineStage, setTimelineStage] = useState("during");
  const [timelineText, setTimelineText] = useState("");
  const [timelineImage, setTimelineImage] = useState(null);

  // ─── Expenses state ──────────────────────────────────────────────────────────
  const [expenseRows, setExpenseRows] = useState([{ label: "", percentage: "" }]);

  // ─── Docs state ──────────────────────────────────────────────────────────────
  const [docTitle, setDocTitle] = useState("");
  const [docFile, setDocFile] = useState(null);

  // Populate form when campaign changes or modal opens
  useEffect(() => {
    if (campaign && open) {
      setValues({
        title: campaign.title || "",
        description: campaign.description || campaign.story || "",
        category: campaign.category || "Treatment",
        goalAmount: campaign.goalAmount || campaign.goal || "",
        deadline: campaign.deadline
          ? new Date(campaign.deadline).toISOString().split("T")[0]
          : "",
        urgency: campaign.urgencyLevel || campaign.urgency || "normal",
        campaignType: campaign.campaignType || "Individual animal rescue",
        location: campaign.location || "",
        coverImage: null,
      });

      setAnimalDetails({
        type: campaign.animalDetails?.type || "Dog",
        name: campaign.animalDetails?.name || "",
        approxAge: campaign.animalDetails?.approxAge || "",
        gender: campaign.animalDetails?.gender || "Unknown",
        condition: campaign.animalDetails?.condition || "",
      });

      setVetDetails({
        clinicName: campaign.vetDetails?.clinicName || "",
        contactNumber: campaign.vetDetails?.contactNumber || "",
        diagnosis: campaign.vetDetails?.diagnosis || "",
        estimatedCost: campaign.vetDetails?.estimatedCost || "",
      });

      setGroupWelfareDetails({
        targetGroup: campaign.groupWelfareDetails?.targetGroup || "",
        estimatedCount: campaign.groupWelfareDetails?.estimatedCount || "",
        campaignArea: campaign.groupWelfareDetails?.campaignArea || "",
        actionPlan: campaign.groupWelfareDetails?.actionPlan || "",
        requiredMaterials: campaign.groupWelfareDetails?.requiredMaterials || "",
      });

      setVerificationDetails({
        partnerDetails: campaign.verificationDetails?.partnerDetails || "",
        permissionProofUrl: campaign.verificationDetails?.permissionProofUrl || "",
      });

      setActiveTab(0);
      setTimelineStage("during");
      setTimelineText("");
      setTimelineImage(null);

      if (campaign.expenses?.length) {
        setExpenseRows(
          campaign.expenses.map((e) => ({ label: e.label, percentage: e.percentage }))
        );
      } else {
        setExpenseRows([{ label: "", percentage: "" }]);
      }

      setDocTitle("");
      setDocFile(null);
    }
  }, [campaign, open]);

  const campaignId = campaign?._id || campaign?.id;

  const invalidateAll = () => {
    queryClient.invalidateQueries(["campaigns"]);
    queryClient.invalidateQueries(["urgentCampaigns"]);
    queryClient.invalidateQueries(["campaign", campaignId]);
  };

  // ─── Mutations ───────────────────────────────────────────────────────────────
  const detailsMutation = useMutation({
    mutationFn: (formData) => updateCampaign(campaignId, formData),
    onSuccess: () => {
      toast.success("Details updated. Sent for re-approval.");
      invalidateAll();
      onClose();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not update campaign"),
  });

  const timelineMutation = useMutation({
    mutationFn: (formData) => addCampaignUpdate(campaignId, formData),
    onSuccess: () => {
      toast.success("Timeline update posted");
      setTimelineText("");
      setTimelineImage(null);
      invalidateAll();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not post update"),
  });

  const expensesMutation = useMutation({
    mutationFn: (expenses) => updateExpenses(campaignId, expenses),
    onSuccess: () => {
      toast.success("Expenses updated");
      invalidateAll();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not update expenses"),
  });

  const uploadDocMutation = useMutation({
    mutationFn: (formData) => uploadSupportingDocument(campaignId, formData),
    onSuccess: () => {
      toast.success("Document uploaded");
      setDocTitle("");
      setDocFile(null);
      invalidateAll();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not upload document"),
  });

  const deleteDocMutation = useMutation({
    mutationFn: (docId) => deleteSupportingDocument(campaignId, docId),
    onSuccess: () => {
      toast.success("Document removed");
      invalidateAll();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not remove document"),
  });

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const update = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }));
  const updateAnimal = (key) => (event) => setAnimalDetails((current) => ({ ...current, [key]: event.target.value }));
  const updateVet = (key) => (event) => setVetDetails((current) => ({ ...current, [key]: event.target.value }));
  const updateGroup = (key) => (event) => setGroupWelfareDetails((current) => ({ ...current, [key]: event.target.value }));
  const updateVer = (key) => (event) => setVerificationDetails((current) => ({ ...current, [key]: event.target.value }));

  const updateFile = (event) => {
    const file = event.target.files?.[0];
    setValues((current) => ({ ...current, coverImage: file }));
  };

  // ─── Submit handlers ─────────────────────────────────────────────────────────
  const submitDetails = (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (values.title) formData.append("title", values.title);
    if (values.description) formData.append("description", values.description);
    if (values.category) formData.append("category", values.category);
    if (values.goalAmount) formData.append("goalAmount", values.goalAmount);
    if (values.deadline) formData.append("deadline", values.deadline);
    if (values.urgency) formData.append("urgencyLevel", values.urgency);
    if (values.campaignType) formData.append("campaignType", values.campaignType);
    if (values.location) formData.append("location", values.location);
    if (values.coverImage) formData.append("coverImage", values.coverImage);
    
    // Always append whatever the active details are
    if (isIndividualOrMedical) {
      formData.append("animalDetails", JSON.stringify(animalDetails));
      formData.append("vetDetails", JSON.stringify(vetDetails));
    } else {
      formData.append("groupWelfareDetails", JSON.stringify(groupWelfareDetails));
    }
    formData.append("verificationDetails", JSON.stringify(verificationDetails));

    detailsMutation.mutate(formData);
  };

  const submitTimeline = (event) => {
    event.preventDefault();
    if (!timelineText.trim()) {
      toast.error("Please write a description");
      return;
    }
    const formData = new FormData();
    formData.append("stage", timelineStage);
    formData.append("text", timelineText);
    if (timelineImage) formData.append("image", timelineImage);
    timelineMutation.mutate(formData);
  };

  const submitExpenses = (event) => {
    event.preventDefault();
    const valid = expenseRows.filter((r) => r.label.trim() && Number(r.percentage) > 0);
    if (valid.length === 0) {
      toast.error("Add at least one expense with label and percentage");
      return;
    }
    const total = valid.reduce((sum, r) => sum + Number(r.percentage), 0);
    if (total > 100) {
      toast.error("Total percentage cannot exceed 100%");
      return;
    }
    expensesMutation.mutate(valid);
  };

  const submitDoc = (event) => {
    event.preventDefault();
    if (!docTitle.trim() || !docFile) {
      toast.error("Title and document file are required");
      return;
    }
    const formData = new FormData();
    formData.append("title", docTitle);
    formData.append("document", docFile);
    uploadDocMutation.mutate(formData);
  };

  // ─── Expense row helpers ─────────────────────────────────────────────────────
  const updateExpenseRow = (index, field) => (event) => {
    setExpenseRows((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: event.target.value };
      return copy;
    });
  };
  const addExpenseRow = () => setExpenseRows((prev) => [...prev, { label: "", percentage: "" }]);
  const removeExpenseRow = (index) => {
    setExpenseRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };
  const expenseTotal = expenseRows.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0);

  const existingUpdates = campaign?.updates || [];
  const existingDocs = campaign?.supportingDocuments || campaign?.medicalDocuments || []; // fallback for old data

  return (
    <Modal open={open} onClose={onClose} title="Edit campaign">
      <div className="mb-2 rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        <strong>Note:</strong> Editing campaign details or scope will temporarily hide it from the public until an admin re-approves the changes.
      </div>
      
      {/* Tabs */}
      <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-1">
        {tabs.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setActiveTab(index)}
            className={`rounded-full px-2 py-2 text-xs font-bold transition sm:px-3 ${
              index === activeTab
                ? "bg-moss text-white"
                : "bg-cream text-bark hover:bg-sage"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ─── Details tab ────────────────────────────────────────────────────────── */}
      {activeTab === 0 && (
        <form onSubmit={submitDetails} className="grid gap-4">
          <Input label="Campaign title" value={values.title} onChange={update("title")} required />
          <Select label="Campaign Type" value={values.campaignType} onChange={update("campaignType")} required>
            {CAMPAIGN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Textarea label="Rescue story" value={values.description} onChange={update("description")} required />
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Category" value={values.category} onChange={update("category")} required>
              <option value="Treatment">Treatment</option>
              <option value="Surgery">Surgery</option>
              <option value="Recovery">Recovery</option>
              <option value="Vaccination">Vaccination</option>
            </Select>
            <Input label="Location" value={values.location} onChange={update("location")} required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Goal amount" type="number" value={values.goalAmount} onChange={update("goalAmount")} required />
            <Input label="Deadline" type="date" value={values.deadline} onChange={update("deadline")} required />
            <Select label="Urgency" value={values.urgency} onChange={update("urgency")} required>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </Select>
          </div>
          <div>
            <span className="mb-2 block text-sm font-semibold text-bark">Update cover image</span>
            <input type="file" accept="image/*" onChange={updateFile} className="w-full rounded-2xl bg-cream p-3 text-sm" />
          </div>
          <div className="mt-2 flex justify-end gap-3">
            <Button type="submit" disabled={detailsMutation.isPending}>
              <Save size={18} /> Save Details
            </Button>
          </div>
        </form>
      )}

      {/* ─── Scope tab ────────────────────────────────────────────────────────── */}
      {activeTab === 1 && (
        <form onSubmit={submitDetails} className="grid gap-4">
          {isIndividualOrMedical ? (
            <div className="grid gap-4">
              <p className="text-sm font-bold text-moss">Animal Details</p>
              <div className="grid gap-4 md:grid-cols-2">
                <Select label="Animal Type" value={animalDetails.type} onChange={updateAnimal("type")}>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Cow">Cow</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </Select>
                <Input label="Animal Name" value={animalDetails.name} onChange={updateAnimal("name")} />
                <Input label="Approx Age" value={animalDetails.approxAge} onChange={updateAnimal("approxAge")} />
                <Select label="Gender" value={animalDetails.gender} onChange={updateAnimal("gender")}>
                  <option value="Unknown">Unknown</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </div>
              <Textarea label="Current Condition" value={animalDetails.condition} onChange={updateAnimal("condition")} />
              
              <hr className="border-bark/10" />
              <p className="text-sm font-bold text-moss">Vet Details</p>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Vet Clinic Name" value={vetDetails.clinicName} onChange={updateVet("clinicName")} />
                <Input label="Vet Contact Number" value={vetDetails.contactNumber} onChange={updateVet("contactNumber")} />
              </div>
              <Textarea label="Diagnosis / Treatment" value={vetDetails.diagnosis} onChange={updateVet("diagnosis")} />
            </div>
          ) : (
            <div className="grid gap-4">
              <p className="text-sm font-bold text-moss">Group / Welfare Scope</p>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Target Animal Group" value={groupWelfareDetails.targetGroup} onChange={updateGroup("targetGroup")} />
                <Input label="Est. Number Affected" value={groupWelfareDetails.estimatedCount} onChange={updateGroup("estimatedCount")} />
              </div>
              <Input label="Campaign Area" value={groupWelfareDetails.campaignArea} onChange={updateGroup("campaignArea")} />
              <Textarea label="Action Plan" value={groupWelfareDetails.actionPlan} onChange={updateGroup("actionPlan")} />
              <Textarea label="Required Materials / Services" value={groupWelfareDetails.requiredMaterials} onChange={updateGroup("requiredMaterials")} />
            </div>
          )}

          <hr className="border-bark/10" />
          <p className="text-sm font-bold text-moss">Verification Details</p>
          <Input label="Partner Organization / Authority" value={verificationDetails.partnerDetails} onChange={updateVer("partnerDetails")} />

          <div className="mt-2 flex justify-end gap-3">
            <Button type="submit" disabled={detailsMutation.isPending}>
              <Save size={18} /> Save Scope
            </Button>
          </div>
        </form>
      )}

      {/* ─── Timeline tab ───────────────────────────────────────────────────────── */}
      {activeTab === 2 && (
        <div className="space-y-5">
          {existingUpdates.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-bark/50">Past Updates</p>
              {existingUpdates.map((update) => (
                <div key={update._id} className="rounded-2xl bg-cream p-4">
                  <p className="mb-2 text-xs font-bold text-moss">Stage: {update.stage}</p>
                  <p className="text-sm text-ink">{update.text}</p>
                  {update.image && (
                    <img src={update.image} alt="Update" className="mt-3 max-h-32 rounded-xl object-cover" />
                  )}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={submitTimeline} className="grid gap-4 rounded-3xl bg-sage/30 p-4">
            <p className="text-sm font-bold text-ink">Post new update</p>
            <Select label="Stage" value={timelineStage} onChange={(e) => setTimelineStage(e.target.value)}>
              <option value="before">Before</option>
              <option value="during">During</option>
              <option value="after">After</option>
            </Select>
            <Textarea label="Description" value={timelineText} onChange={(e) => setTimelineText(e.target.value)} required />
            <div>
              <span className="mb-2 block text-sm font-semibold text-bark">Image (Optional)</span>
              <input type="file" accept="image/*" onChange={(e) => setTimelineImage(e.target.files?.[0])} className="w-full rounded-2xl bg-white p-3 text-sm" />
            </div>
            <Button type="submit" disabled={timelineMutation.isPending}>
              Post update
            </Button>
          </form>
        </div>
      )}

      {/* ─── Expenses tab ───────────────────────────────────────────────────────── */}
      {activeTab === 3 && (
        <form onSubmit={submitExpenses} className="grid gap-4">
          <p className="text-sm text-bark/60">
            Add expense categories to help donors understand how funds are allocated.
          </p>
          <div className="space-y-3">
            {expenseRows.map((row, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="flex-1">
                  <Input label={index === 0 ? "Label" : undefined} value={row.label} onChange={updateExpenseRow(index, "label")} placeholder="e.g. Surgery" />
                </div>
                <div className="w-24">
                  <Input label={index === 0 ? "%" : undefined} type="number" min="0" max="100" value={row.percentage} onChange={updateExpenseRow(index, "percentage")} placeholder="%" />
                </div>
                <button
                  type="button"
                  onClick={() => removeExpenseRow(index)}
                  className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-coral hover:bg-coral/10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button type="button" onClick={addExpenseRow} className="inline-flex items-center gap-1 text-sm font-bold text-moss hover:underline">
              <Plus size={16} /> Add row
            </button>
            <span className={`text-sm font-bold ${expenseTotal > 100 ? "text-coral" : "text-bark"}`}>Total: {expenseTotal}%</span>
          </div>
          <div className="mt-2 flex justify-end gap-3">
            <Button type="submit" disabled={expensesMutation.isPending}>
              <Save size={18} /> Save Expenses
            </Button>
          </div>
        </form>
      )}

      {/* ─── Supporting Docs tab ─────────────────────────────────────────────────── */}
      {activeTab === 4 && (
        <div className="space-y-5">
          {existingDocs.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-bark/50">
                Uploaded Documents ({existingDocs.length})
              </p>
              {existingDocs.map((doc) => (
                <div key={doc._id} className="flex items-center justify-between rounded-2xl bg-cream p-3">
                  <div>
                    <p className="font-bold text-ink">{doc.title}</p>
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-moss hover:underline">
                      View {doc.fileType === "pdf" ? "PDF" : "Image"}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteDocMutation.mutate(doc._id)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-coral hover:bg-coral/10 disabled:opacity-50"
                    disabled={deleteDocMutation.isPending}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={submitDoc} className="grid gap-4 rounded-3xl bg-sage/30 p-4">
            <p className="text-sm font-bold text-ink">Upload supporting document</p>
            <Input label="Document title" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} required placeholder="e.g. Quotation" />
            <div>
              <span className="mb-2 block text-sm font-semibold text-bark">File</span>
              <input type="file" accept=".pdf, image/*" onChange={(e) => setDocFile(e.target.files?.[0])} required className="w-full rounded-2xl bg-white p-3 text-sm" />
            </div>
            <Button type="submit" disabled={uploadDocMutation.isPending}>
              Upload document
            </Button>
          </form>
        </div>
      )}
    </Modal>
  );
}
