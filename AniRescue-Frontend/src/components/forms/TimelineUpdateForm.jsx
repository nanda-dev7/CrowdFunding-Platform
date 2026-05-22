import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addCampaignUpdate } from "../../api/campaignApi";
import Button from "../common/Button";
import Select from "../common/Select";
import Textarea from "../common/Textarea";

export default function TimelineUpdateForm({ campaignId, campaigns = [] }) {
  const queryClient = useQueryClient();
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaignId || "");
  const [text, setText] = useState("");
  const [stage, setStage] = useState("during");
  const [image, setImage] = useState(null);

  // Use the prop campaignId if provided, otherwise let user pick
  const activeCampaignId = campaigns.length > 0 ? selectedCampaignId : campaignId;

  // Auto-select first campaign if nothing selected
  if (campaigns.length > 0 && !selectedCampaignId && campaigns[0]) {
    setSelectedCampaignId(campaigns[0]._id || campaigns[0].id);
  }

  const mutation = useMutation({
    mutationFn: (formData) => addCampaignUpdate(activeCampaignId, formData),
    onSuccess: () => {
      toast.success("Timeline update posted");
      setText("");
      setImage(null);
      // Invalidate both dashboard and campaign detail queries
      queryClient.invalidateQueries({ queryKey: ["campaigner-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["campaign", activeCampaignId] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Could not post update"),
  });

  const submit = (event) => {
    event.preventDefault();
    if (!activeCampaignId) {
      toast.error("Please select a campaign");
      return;
    }
    const formData = new FormData();
    formData.append("text", text);
    formData.append("stage", stage);
    if (image) formData.append("image", image);
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-3xl bg-cream p-4">
      {campaigns.length > 0 && (
        <Select
          label="Campaign"
          value={selectedCampaignId}
          onChange={(e) => setSelectedCampaignId(e.target.value)}
        >
          {campaigns.map((c) => (
            <option key={c._id || c.id} value={c._id || c.id}>
              {c.title}
            </option>
          ))}
        </Select>
      )}
      <Select label="Stage" value={stage} onChange={(event) => setStage(event.target.value)}>
        <option value="before">Before</option>
        <option value="during">During</option>
        <option value="after">After</option>
      </Select>
      <Textarea label="Update" value={text} onChange={(event) => setText(event.target.value)} required />
      <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0])} className="rounded-2xl bg-white p-3 text-sm" />
      <Button type="submit" disabled={mutation.isPending}>Post update</Button>
    </form>
  );
}
