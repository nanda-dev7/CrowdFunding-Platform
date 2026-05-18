import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FileUp } from "lucide-react";
import { uploadMedicalDocument } from "../../api/campaignApi";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";

export default function MedicalDocumentUploadForm({ campaigns = [] }) {
  const queryClient = useQueryClient();
  const [campaignId, setCampaignId] = useState(campaigns[0]?._id || campaigns[0]?.id || "");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const mutation = useMutation({
    mutationFn: ({ id, formData }) => uploadMedicalDocument(id, formData),
    onSuccess: () => {
      toast.success("Medical document uploaded");
      setTitle("");
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["campaigner-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["campaign"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Document upload failed"),
  });
  const submit = (event) => {
    event.preventDefault();
    if (!campaignId || !file) {
      toast.error("Select a campaign and document file");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("document", file);
    mutation.mutate({ id: campaignId, formData });
  };
  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[1.75rem] border border-bark/10 bg-white p-5 shadow-card">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mist text-teal-700">
          <FileUp size={20} />
        </span>
        <h3 className="text-lg font-extrabold text-ink">Upload medical document</h3>
      </div>
      <Select label="Campaign" value={campaignId} onChange={(event) => setCampaignId(event.target.value)} required>
        <option value="">Select campaign</option>
        {campaigns.map((campaign) => (
          <option key={campaign._id || campaign.id} value={campaign._id || campaign.id}>
            {campaign.title}
          </option>
        ))}
      </Select>
      <Input label="Document title" value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Vet prescription, surgery estimate..." />
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-bark">Upload file</span>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={(event) => setFile(event.target.files?.[0])}
          className="w-full rounded-2xl border border-bark/10 bg-cream p-3 text-sm"
          required
        />
      </label>
      <Button type="submit" disabled={mutation.isPending}>Submit document</Button>
    </form>
  );
}
