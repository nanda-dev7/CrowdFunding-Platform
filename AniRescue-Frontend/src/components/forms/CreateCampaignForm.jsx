import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ImagePlus, Send } from "lucide-react";
import { createCampaign } from "../../api/campaignApi";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";

const steps = ["Story", "Funding", "Media"];

export default function CreateCampaignForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    title: "",
    description: "",
    category: "treatment",
    goalAmount: "",
    deadline: "",
    urgency: "normal",
    image: null,
  });
  const [preview, setPreview] = useState("");
  const mutation = useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      toast.success("Campaign submitted for approval");
      navigate("/dashboard/campaigner");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Campaign could not be created"),
  });

  const update = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }));
  const updateFile = (event) => {
    const file = event.target.files?.[0];
    setValues((current) => ({ ...current, image: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };
  const submit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-bark/10 bg-white p-6 shadow-soft">
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(index)}
            className={`rounded-full px-4 py-3 text-sm font-bold ${index === step ? "bg-moss text-white" : "bg-cream text-bark"}`}
          >
            {index + 1}. {label}
          </button>
        ))}
      </div>

      {step === 0 && (
        <div className="grid gap-4">
          <Input label="Campaign title" value={values.title} onChange={update("title")} required placeholder="Emergency surgery for Bruno" />
          <Textarea label="Rescue story" value={values.description} onChange={update("description")} required placeholder="Tell donors what happened and what treatment is needed." />
          <Select label="Category" value={values.category} onChange={update("category")}>
            <option value="treatment">Treatment</option>
            <option value="surgery">Surgery</option>
            <option value="recovery">Recovery</option>
            <option value="vaccination">Vaccination</option>
          </Select>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Goal amount" type="number" value={values.goalAmount} onChange={update("goalAmount")} required />
          <Input label="Deadline" type="date" value={values.deadline} onChange={update("deadline")} required />
          <Select label="Urgency" value={values.urgency} onChange={update("urgency")}>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
            <option value="critical">Critical</option>
          </Select>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-moss/30 bg-sage/40 p-6 text-center">
            <ImagePlus className="mb-3 text-moss" size={34} />
            <span className="font-extrabold text-ink">Upload rescue image</span>
            <span className="mt-1 text-sm text-bark/60">PNG, JPG or WebP</span>
            <input type="file" accept="image/*" className="sr-only" onChange={updateFile} />
          </label>
          {preview && <img src={preview} alt="Campaign preview" className="mt-4 max-h-80 w-full rounded-3xl object-cover" />}
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
          <Button type="submit" disabled={mutation.isPending}>
            <Send size={18} /> Submit campaign
          </Button>
        )}
      </div>
    </form>
  );
}
