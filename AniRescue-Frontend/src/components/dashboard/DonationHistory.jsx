import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import Badge from "../common/Badge";

export default function DonationHistory({ donations = [] }) {
  const rows = donations.length ? donations : [];
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-bark/10 bg-white shadow-card">
      <div className="border-b border-bark/10 p-5">
        <h3 className="text-lg font-bold text-ink">Donation History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wide text-bark/60">
            <tr>
              <th className="px-5 py-4">Campaign</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((donation) => (
              <tr key={donation._id || donation.id} className="border-t border-bark/5">
                <td className="px-5 py-4 font-semibold text-ink">{donation.campaign?.title || donation.campaignTitle || "Rescue campaign"}</td>
                <td className="px-5 py-4">{formatCurrency(donation.amount)}</td>
                <td className="px-5 py-4">{formatDate(donation.createdAt)}</td>
                <td className="px-5 py-4">
                  <Badge variant="success">{donation.status || "confirmed"}</Badge>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="4" className="px-5 py-10 text-center text-bark/60">
                  Your donations will appear here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
