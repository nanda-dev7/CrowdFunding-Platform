import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Save, Trash2 } from "lucide-react";
import { updateExpenses } from "../../api/campaignApi";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";

const defaultRow = { label: "", percentage: "" };

export default function TransparencyExpenseForm({ campaigns = [] }) {
  const queryClient = useQueryClient();
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [rows, setRows] = useState([{ ...defaultRow }]);

  const selectedCampaign = campaigns.find(
    (c) => (c._id || c.id) === selectedCampaignId
  );

  // Auto-select first campaign
  useEffect(() => {
    if (campaigns.length > 0 && !selectedCampaignId) {
      setSelectedCampaignId(campaigns[0]._id || campaigns[0].id);
    }
  }, [campaigns, selectedCampaignId]);

  // Load existing expenses when campaign changes
  useEffect(() => {
    if (selectedCampaign?.expenses?.length) {
      setRows(
        selectedCampaign.expenses.map((e) => ({
          label: e.label,
          percentage: e.percentage,
        }))
      );
    } else {
      setRows([{ ...defaultRow }]);
    }
  }, [selectedCampaignId, selectedCampaign]);

  const mutation = useMutation({
    mutationFn: (expenses) => updateExpenses(selectedCampaignId, expenses),
    onSuccess: () => {
      toast.success("Transparency expenses updated");
      queryClient.invalidateQueries({ queryKey: ["campaigner-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["campaign", selectedCampaignId] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not update expenses"),
  });

  const updateRow = (index, field) => (event) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: event.target.value };
      return copy;
    });
  };

  const addRow = () => setRows((prev) => [...prev, { ...defaultRow }]);

  const removeRow = (index) => {
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const total = rows.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0);

  const submit = (event) => {
    event.preventDefault();
    if (!selectedCampaignId) {
      toast.error("Please select a campaign");
      return;
    }
    const valid = rows.filter((r) => r.label.trim() && Number(r.percentage) > 0);
    if (valid.length === 0) {
      toast.error("Add at least one expense with label and percentage");
      return;
    }
    if (total > 100) {
      toast.error("Total percentage cannot exceed 100%");
      return;
    }
    mutation.mutate(valid);
  };

  return (
    <div className="rounded-[1.75rem] border border-bark/10 bg-white p-5 shadow-card">
      <h3 className="mb-4 text-lg font-extrabold text-ink">Transparency expenses</h3>
      <form onSubmit={submit} className="grid gap-3">
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

        <div className="mt-2 space-y-3">
          {rows.map((row, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label={index === 0 ? "Expense label" : undefined}
                  placeholder="e.g. Surgery cost"
                  value={row.label}
                  onChange={updateRow(index, "label")}
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
                  onChange={updateRow(index, "percentage")}
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => removeRow(index)}
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
            onClick={addRow}
            className="inline-flex items-center gap-1 text-sm font-bold text-moss hover:underline"
          >
            <Plus size={16} /> Add row
          </button>
          <span
            className={`text-sm font-bold ${total > 100 ? "text-coral" : "text-bark/60"}`}
          >
            Total: {total}%
          </span>
        </div>

        <Button type="submit" disabled={mutation.isPending} className="mt-2">
          <Save size={18} /> Save expenses
        </Button>
      </form>
    </div>
  );
}
