import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { applyCampaigner } from "../api/campaignerApi";
import DashboardShell from "../components/dashboard/DashboardShell";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Textarea from "../components/common/Textarea";

export default function ApplyCampaigner() {
  const [values, setValues] = useState({ organization: "", location: "", reason: "" });
  const [file, setFile] = useState(null);
  const mutation = useMutation({
    mutationFn: applyCampaigner,
    onSuccess: () => toast.success("Campaigner application submitted"),
    onError: (error) => toast.error(error.response?.data?.message || "Application could not be submitted"),
  });
  const submit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));
    if (file) formData.append("document", file);
    mutation.mutate(formData);
  };
  return (
    <DashboardShell title="Apply as campaigner" subtitle="Share verification details so admins can approve rescue campaign creation.">
      <form onSubmit={submit} className="grid max-w-3xl gap-4 rounded-[2rem] border border-bark/10 bg-white p-6 shadow-soft">
        <Input label="Organization" value={values.organization} onChange={(event) => setValues({ ...values, organization: event.target.value })} />
        <Input label="Location" value={values.location} onChange={(event) => setValues({ ...values, location: event.target.value })} required />
        <Textarea label="Why do you want to create campaigns?" value={values.reason} onChange={(event) => setValues({ ...values, reason: event.target.value })} required />
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-bark">Verification document</span>
          <input type="file" onChange={(event) => setFile(event.target.files?.[0])} className="w-full rounded-2xl border border-bark/10 bg-cream p-3 text-sm" />
        </label>
        <Button type="submit" disabled={mutation.isPending}>Submit application</Button>
      </form>
    </DashboardShell>
  );
}
