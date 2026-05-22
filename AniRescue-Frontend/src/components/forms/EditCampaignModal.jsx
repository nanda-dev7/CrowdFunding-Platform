import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Save, Trash2 } from "lucide-react";
import { updateCampaign, updateExpenses, addCampaignUpdate } from "../../api/campaignApi";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";

const tabs = ["Details", "Timeline", "Expenses"];

export default function EditCampaignModal({ campaign, open, onClose }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);

  // ─── Details state ────────────────────────────────────────────────────────────
  const [values, setValues] = useState({
    title: "",
    description: "",
    goalAmount: "",
    deadline: "",
    urgency: "normal",
    coverImage: null,
  });

  // ─── Timeline state ──────────────────────────────────────────────────────────
  const [timelineStage, setTimelineStage] = useState("during");
  const [timelineText, setTimelineText] = useState("");
  const [timelineImage, setTimelineImage] = useState(null);

  // ─── Expenses state ──────────────────────────────────────────────────────────
  const [expenseRows, setExpenseRows] = useState([{ label: "", percentage: "" }]);

  // Populate form when campaign changes or modal opens
  useEffect(() => {
    if (campaign && open) {
      setValues({
        title: campaign.title || "",
        description: campaign.description || campaign.story || "",
        goalAmount: campaign.goalAmount || campaign.goal || "",
        deadline: campaign.deadline
          ? new Date(campaign.deadline).toISOString().split("T")[0]
          : "",
        urgency: campaign.urgencyLevel || campaign.urgency || "normal",
        coverImage: null,
      });
      setActiveTab(0);
      setTimelineStage("during");
      setTimelineText("");
      setTimelineImage(null);

      // Load existing expenses
      if (campaign.expenses?.length) {
        setExpenseRows(
          campaign.expenses.map((e) => ({ label: e.label, percentage: e.percentage }))
        );
      } else {
        setExpenseRows([{ label: "", percentage: "" }]);
      }
    }
  }, [campaign, open]);

  const campaignId = campaign?._id || campaign?.id;

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["campaigner-dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
  };

  // ─── Details mutation ────────────────────────────────────────────────────────
  const detailsMutation = useMutation({
    mutationFn: (formData) => updateCampaign(campaignId, formData),
    onSuccess: () => {
      toast.success("Campaign updated successfully");
      invalidateAll();
      onClose();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not update campaign"),
  });

  // ─── Timeline mutation ───────────────────────────────────────────────────────
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

  // ─── Expenses mutation ───────────────────────────────────────────────────────
  const expensesMutation = useMutation({
    mutationFn: (expenses) => updateExpenses(campaignId, expenses),
    onSuccess: () => {
      toast.success("Expenses updated");
      invalidateAll();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not update expenses"),
  });

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const update = (key) => (event) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

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
    if (values.goalAmount) formData.append("goalAmount", values.goalAmount);
    if (values.deadline) formData.append("deadline", values.deadline);
    if (values.urgency) formData.append("urgencyLevel", values.urgency);
    if (values.coverImage) formData.append("coverImage", values.coverImage);
    detailsMutation.mutate(formData);
  };

  const submitTimeline = (event) => {
    event.preventDefault();
    if (!timelineText.trim()) {
      toast.error("Please enter an update text");
      return;
    }
    const formData = new FormData();
    formData.append("text", timelineText);
    formData.append("stage", timelineStage);
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

  // ─── Existing timeline updates ───────────────────────────────────────────────
  const existingUpdates = campaign?.updates || [];

  return (
    <Modal open={open} onClose={onClose} title="Edit campaign">
      {/* Tabs */}
      <div className="mb-6 grid grid-cols-3 gap-2">
        {tabs.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setActiveTab(index)}
            className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
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
          <Input
            label="Campaign title"
            value={values.title}
            onChange={update("title")}
            required
            placeholder="Emergency surgery for Bruno"
          />
          <Textarea
            label="Rescue story"
            value={values.description}
            onChange={update("description")}
            required
            placeholder="Tell donors what happened and what treatment is needed."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Goal amount"
              type="number"
              value={values.goalAmount}
              onChange={update("goalAmount")}
              required
            />
            <Input
              label="Deadline"
              type="date"
              value={values.deadline}
              onChange={update("deadline")}
              required
            />
          </div>
          <Select label="Urgency" value={values.urgency} onChange={update("urgency")}>
            <option value="normal">Normal</option>
            <option value="critical">Critical</option>
            <option value="surgery">Surgery</option>
          </Select>
          <div>
            <span className="mb-2 block text-sm font-semibold text-bark">
              Replace cover image (optional)
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={updateFile}
              className="block w-full text-sm text-bark file:mr-3 file:rounded-full file:border-0 file:bg-sage file:px-4 file:py-2 file:text-sm file:font-semibold file:text-moss hover:file:bg-sage/80"
            />
          </div>
          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={detailsMutation.isPending}>
              <Save size={18} /> Save changes
            </Button>
          </div>
        </form>
      )}

      {/* ─── Timeline tab ───────────────────────────────────────────────────────── */}
      {activeTab === 1 && (
        <div className="space-y-5">
          {/* Existing updates list */}
          {existingUpdates.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-bark/50">
                Existing updates ({existingUpdates.length})
              </p>
              {existingUpdates.map((upd, i) => (
                <div
                  key={upd._id || i}
                  className="rounded-2xl bg-cream p-3"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        upd.stage === "after"
                          ? "bg-moss/15 text-moss"
                          : upd.stage === "during"
                          ? "bg-teal-100 text-teal-700"
                          : "bg-bark/10 text-bark"
                      }`}
                    >
                      {(upd.stage || "before").toUpperCase()}
                    </span>
                    <span className="text-xs text-bark/40">
                      {upd.date ? new Date(upd.date).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="text-sm text-bark/70">{upd.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add new update */}
          <form onSubmit={submitTimeline} className="grid gap-4 rounded-3xl bg-sage/30 p-4">
            <p className="text-sm font-bold text-ink">Add new timeline update</p>
            <Select
              label="Stage"
              value={timelineStage}
              onChange={(e) => setTimelineStage(e.target.value)}
            >
              <option value="before">Before</option>
              <option value="during">During</option>
              <option value="after">After</option>
            </Select>
            <Textarea
              label="Update"
              value={timelineText}
              onChange={(e) => setTimelineText(e.target.value)}
              required
              placeholder="Describe the current state of the rescue..."
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setTimelineImage(e.target.files?.[0])}
              className="rounded-2xl bg-white p-3 text-sm"
            />
            <Button type="submit" disabled={timelineMutation.isPending}>
              Post update
            </Button>
          </form>
        </div>
      )}

      {/* ─── Expenses tab ───────────────────────────────────────────────────────── */}
      {activeTab === 2 && (
        <form onSubmit={submitExpenses} className="grid gap-4">
          <p className="text-sm text-bark/60">
            Add expense categories to help donors understand how funds are allocated.
          </p>
          <div className="space-y-3">
            {expenseRows.map((row, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    label={index === 0 ? "Expense label" : undefined}
                    placeholder="e.g. Surgery cost"
                    value={row.label}
                    onChange={updateExpenseRow(index, "label")}
                    required
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
                    required
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

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={addExpenseRow}
              className="inline-flex items-center gap-1 text-sm font-bold text-moss hover:underline"
            >
              <Plus size={16} /> Add row
            </button>
            <span
              className={`text-sm font-bold ${
                expenseTotal > 100 ? "text-coral" : "text-bark/60"
              }`}
            >
              Total: {expenseTotal}%
            </span>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={expensesMutation.isPending}>
              <Save size={18} /> Save expenses
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
