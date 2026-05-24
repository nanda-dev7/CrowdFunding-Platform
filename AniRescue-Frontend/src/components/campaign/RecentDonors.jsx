import { Heart } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

export default function RecentDonors({ donors = [] }) {
  const list = Array.isArray(donors) && donors.length
    ? donors
    : [
        { name: "Anonymous donor", amount: 2500, createdAt: new Date() },
        { name: "Meera S.", amount: 1100, createdAt: new Date() },
      ];
  return (
    <div className="space-y-3">
      {list.slice(0, 4).map((donor, index) => (
        <div key={donor._id || donor.id || index} className="flex items-center gap-3 rounded-2xl bg-cream p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-coral">
            <Heart size={18} fill="currentColor" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{donor.anonymous ? "Anonymous donor" : donor.name || donor.donor?.name || "Anonymous donor"}</p>
            <p className="text-xs text-bark/55">{formatDate(donor.createdAt)}</p>
          </div>
          <p className="text-sm font-extrabold text-moss">{formatCurrency(donor.amount)}</p>
        </div>
      ))}
    </div>
  );
}
