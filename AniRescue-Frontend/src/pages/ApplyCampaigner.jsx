import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { applyCampaigner } from "../api/campaignerApi";
import DashboardShell from "../components/dashboard/DashboardShell";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Textarea from "../components/common/Textarea";
import Select from "../components/common/Select";
import { useAuthStore } from "../store/authStore";

export default function ApplyCampaigner() {
  const user = useAuthStore((state) => state.user);
  
  const [values, setValues] = useState({
    campaignerType: "Individual",
    publicDisplayName: "",
    campaignerReason: "",
    location: "",
    animalWelfareRole: "",
    organizationType: "",
    authorizedPersonRole: "",
    organizationEmailPhone: "",
    referenceContact: "",
    payoutMethod: "upi",
    upiId: "",
  });

  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const [files, setFiles] = useState({
    identityProof: null,
    animalWelfareProof: null,
    payoutProof: null,
    organizationProof: null,
    authorizationLetter: null,
  });

  const mutation = useMutation({
    mutationFn: applyCampaigner,
    onSuccess: () => {
      toast.success("Campaigner application submitted successfully.");
      window.location.reload();
    },
    onError: (error) => toast.error(error.response?.data?.message || "Application could not be submitted"),
  });

  const handleValueChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });
  const handleBankChange = (e) => setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFiles({ ...files, [e.target.name]: e.target.files?.[0] });

  const submit = (event) => {
    event.preventDefault();
    const isIndividual = values.campaignerType === "Individual";

    if (!files.animalWelfareProof) return toast.error("Animal welfare proof is required.");
    if (!files.payoutProof) return toast.error("Payout proof is required.");
    if (isIndividual && !files.identityProof) return toast.error("Identity proof is required for Individuals.");
    if (!isIndividual && !files.organizationProof) return toast.error("Organization proof is required for Groups/NGOs.");

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    
    if (values.payoutMethod === "bank_account") {
      formData.append("bankDetails", JSON.stringify(bankDetails));
    }

    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    mutation.mutate(formData);
  };

  const isIndividual = values.campaignerType === "Individual";

  return (
    <DashboardShell title="Apply as campaigner" subtitle="Provide your verification details to get approved for creating rescue campaigns.">
      <form onSubmit={submit} className="mx-auto grid max-w-4xl gap-8 rounded-[2rem] border border-bark/10 bg-white p-6 shadow-soft sm:p-8">
        
        {/* Section: Applicant Type */}
        <section>
          <h3 className="mb-4 text-xl font-black text-ink">1. Applicant Profile</h3>
          <div className="rounded-2xl bg-cream p-4 mb-6">
            <p className="text-sm font-semibold text-bark">Applying from account</p>
            <p className="mt-1 font-extrabold text-ink">{user?.name}</p>
            <p className="text-sm text-bark/70">{user?.email}</p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Application Type" name="campaignerType" value={values.campaignerType} onChange={handleValueChange} required>
              <option value="Individual">Individual Campaigner</option>
              <option value="NGO/Nonprofit">Group / NGO / Clinic</option>
            </Select>
            <Input label="Public Display Name" name="publicDisplayName" value={values.publicDisplayName} onChange={handleValueChange} required placeholder="E.g., Ravi Street Dog Rescuer" />
            <Input label="Location (City, State, Country)" name="location" value={values.location} onChange={handleValueChange} required />
          </div>
        </section>

        <hr className="border-bark/10" />

        {/* Section: Specific Details */}
        <section>
          <h3 className="mb-4 text-xl font-black text-ink">2. {isIndividual ? "Individual Details" : "Organization Details"}</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {isIndividual ? (
              <>
                <Select label="Animal Welfare Role" name="animalWelfareRole" value={values.animalWelfareRole} onChange={handleValueChange} required>
                  <option value="">Select a role</option>
                  <option value="Rescuer">Rescuer</option>
                  <option value="Feeder">Feeder</option>
                  <option value="Foster Caregiver">Foster Caregiver</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Vet Assistant">Vet Assistant</option>
                  <option value="Animal Ambulance Helper">Animal Ambulance Helper</option>
                  <option value="Other">Other</option>
                </Select>
              </>
            ) : (
              <>
                <Select label="Organization Type" name="organizationType" value={values.organizationType} onChange={handleValueChange} required>
                  <option value="">Select an organization type</option>
                  <option value="NGO">NGO</option>
                  <option value="Registered Trust">Registered Trust</option>
                  <option value="Society">Society</option>
                  <option value="Animal Shelter">Animal Shelter</option>
                  <option value="Veterinary Clinic">Veterinary Clinic</option>
                  <option value="Rescue Group">Rescue Group</option>
                  <option value="Foster Network">Foster Network</option>
                  <option value="Unregistered Volunteer Group">Unregistered Volunteer Group</option>
                </Select>
                <Input label="Authorized Person Role" name="authorizedPersonRole" value={values.authorizedPersonRole} onChange={handleValueChange} required placeholder="Founder, Trustee, Admin, etc." />
                <Input label="Organization Email/Phone" name="organizationEmailPhone" value={values.organizationEmailPhone} onChange={handleValueChange} required />
              </>
            )}
          </div>

          <div className="mt-4">
            <Textarea label={isIndividual ? "Rescue Experience & Reason" : "Organization Background & Mission"} name="campaignerReason" value={values.campaignerReason} onChange={handleValueChange} required placeholder="Explain your past rescues, your work, and why donors should trust you." />
          </div>
          
          <div className="mt-4">
            <Input label="Vet / Shelter Reference" name="referenceContact" value={values.referenceContact} onChange={handleValueChange} required placeholder="Reference name, clinic/organization name, phone/email" />
          </div>
        </section>

        <hr className="border-bark/10" />

        {/* Section: Documents */}
        <section>
          <h3 className="mb-4 text-xl font-black text-ink">3. Verification Documents</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            
            {isIndividual ? (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-bark">Identity Proof *</span>
                <input type="file" name="identityProof" accept=".pdf, .jpg, .jpeg, .png" onChange={handleFileChange} className="w-full rounded-2xl border border-bark/10 bg-cream p-3 text-sm" required />
                <p className="mt-2 text-xs text-bark/60">Aadhaar, PAN, passport, voter ID, or driving license. Name must match account.</p>
              </label>
            ) : (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-bark">Organization Proof *</span>
                  <input type="file" name="organizationProof" accept=".pdf, .jpg, .jpeg, .png" onChange={handleFileChange} className="w-full rounded-2xl border border-bark/10 bg-cream p-3 text-sm" required />
                  <p className="mt-2 text-xs text-bark/60">NGO registration, trust deed, shelter registration, clinic certificate, etc.</p>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-bark">Authorization Letter (Optional)</span>
                  <input type="file" name="authorizationLetter" accept=".pdf, .jpg, .jpeg, .png" onChange={handleFileChange} className="w-full rounded-2xl border border-bark/10 bg-cream p-3 text-sm" />
                  <p className="mt-2 text-xs text-bark/60">Required if you are not the founder/owner/trustee.</p>
                </label>
              </>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-bark">Animal Welfare Proof *</span>
              <input type="file" name="animalWelfareProof" accept=".pdf, .jpg, .jpeg, .png" onChange={handleFileChange} className="w-full rounded-2xl border border-bark/10 bg-cream p-3 text-sm" required />
              <p className="mt-2 text-xs text-bark/60">Vet bills, rescue photos, shelter references, or vet clinic letter.</p>
            </label>
          </div>
        </section>

        <hr className="border-bark/10" />

        {/* Section: Payout Details */}
        <section>
          <h3 className="mb-4 text-xl font-black text-ink">4. Payout Details</h3>
          <div className="mb-4">
            <Select label="Payout Method" name="payoutMethod" value={values.payoutMethod} onChange={handleValueChange} required>
              <option value="upi">UPI</option>
              <option value="bank_account">Bank Account</option>
            </Select>
          </div>

          {values.payoutMethod === "upi" ? (
            <div className="mb-4">
              <Input label="UPI ID" name="upiId" value={values.upiId} onChange={handleValueChange} required placeholder="example@okhdfcbank" />
            </div>
          ) : (
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <Input label="Account Holder Name" name="accountHolderName" value={bankDetails.accountHolderName} onChange={handleBankChange} required />
              <Input label="Bank Name" name="bankName" value={bankDetails.bankName} onChange={handleBankChange} required />
              <Input label="Account Number" name="accountNumber" value={bankDetails.accountNumber} onChange={handleBankChange} required />
              <Input label="IFSC Code" name="ifscCode" value={bankDetails.ifscCode} onChange={handleBankChange} required />
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-bark">Payout Proof *</span>
            <input type="file" name="payoutProof" accept=".pdf, .jpg, .jpeg, .png" onChange={handleFileChange} className="w-full rounded-2xl border border-bark/10 bg-cream p-3 text-sm" required />
            <p className="mt-2 text-xs text-bark/60">Cancelled cheque, passbook first page, bank statement header, or UPI ownership screenshot.</p>
          </label>
        </section>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting Application..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </DashboardShell>
  );
}
