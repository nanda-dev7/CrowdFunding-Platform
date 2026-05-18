import { Bell } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import Badge from "../common/Badge";

export default function NotificationPanel({ notifications = [], onRead }) {
  return (
    <div className="rounded-[1.75rem] border border-bark/10 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage text-moss">
          <Bell size={20} />
        </div>
        <h3 className="text-lg font-bold text-ink">Notifications</h3>
      </div>
      <div className="space-y-3">
        {notifications.length ? (
          notifications.map((item) => (
            <button
              key={item._id || item.id}
              onClick={() => onRead?.(item._id || item.id)}
              className="w-full rounded-2xl border border-bark/10 p-4 text-left transition hover:border-moss/30 hover:bg-cream"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-ink">{item.title || item.message}</p>
                {(item.type === "urgent" || item.urgent) && <Badge variant="urgent">Urgent</Badge>}
              </div>
              {item.title && <p className="mt-1 text-sm text-bark/65">{item.message}</p>}
              <p className="mt-2 text-xs font-semibold text-bark/45">{formatDate(item.createdAt)}</p>
            </button>
          ))
        ) : (
          <p className="rounded-2xl bg-cream p-4 text-sm text-bark/65">No notifications yet.</p>
        )}
      </div>
    </div>
  );
}
