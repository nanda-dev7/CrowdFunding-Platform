import Button from "../common/Button";
import Badge from "../common/Badge";

export default function ApprovalTable({ rows = [], type = "campaign", onApprove, onReject, onPreview }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-bark/10 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wide text-bark/60">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Details</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id || row.id} className="border-t border-bark/5">
                <td className="px-5 py-4 font-bold text-ink">{row.title || row.name || row.applicantName}</td>
                <td className="px-5 py-4"><Badge variant="teal">{row.status || "pending"}</Badge></td>
                <td className="px-5 py-4 text-bark/65">{type === "campaign" ? row.category : row.organization || row.email}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {onPreview && <Button size="sm" variant="secondary" onClick={() => onPreview(row)}>Preview</Button>}
                    <Button size="sm" onClick={() => onApprove?.(row._id || row.id)}>Approve</Button>
                    <Button size="sm" variant="urgent" onClick={() => onReject?.(row._id || row.id)}>Reject</Button>
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="4" className="px-5 py-10 text-center text-bark/60">Nothing pending right now.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
