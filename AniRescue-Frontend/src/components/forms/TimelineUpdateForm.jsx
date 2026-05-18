import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addCampaignUpdate } from "../../api/campaignApi";
import Button from "../common/Button";
import Select from "../common/Select";
import Textarea from "../common/Textarea";

export default function TimelineUpdateForm({ campaignId }) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [stage, setStage] = useState("during");
  const [image, setImage] = useState(null);
  const mutation = useMutation({
    mutationFn: (formData) => addCampaignUpdate(campaignId, formData),
    onSuccess: () => {
      toast.success("Timeline update posted");
      setText("");
      setImage(null);
      queryClient.invalidateQueries({ queryKey: ["campaigner-dashboard"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Could not post update"),
  });
  const submit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("text", text);
    formData.append("stage", stage);
    if (image) formData.append("image", image);
    mutation.mutate(formData);
  };
  return (
    <form onSubmit={submit} className="grid gap-4 rounded-3xl bg-cream p-4">
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
