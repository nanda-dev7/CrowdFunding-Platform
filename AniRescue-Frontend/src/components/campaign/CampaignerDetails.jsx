import { Mail, MapPin } from "lucide-react";
import Button from "../common/Button";
import { getInitials } from "../../utils/getInitials";

export default function CampaignerDetails({ creator = {} }) {
  return (
    <section className="rounded-[2rem] border border-bark/10 bg-white p-6 shadow-card">
      <h2 className="text-3xl font-extrabold text-ink">Organizer</h2>
      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {creator.avatar ? (
            <img src={creator.avatar} alt={creator.name} className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage text-xl font-extrabold text-moss">
              {getInitials(creator.name)}
            </div>
          )}
          <div>
            <h3 className="text-xl font-extrabold text-ink">{creator.name || "AniRescue Organizer"}</h3>
            <p className="text-sm font-bold text-moss">Organizer</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-bark/60">
              <MapPin size={15} /> {creator.location || "India"}
            </p>
            {creator.organization && <p className="text-sm text-bark/60">{creator.organization}</p>}
            {creator.email && <p className="mt-1 text-sm text-bark/60">{creator.email}</p>}
          </div>
        </div>
        {creator.email && (
          <Button as="a" href={`mailto:${creator.email}`} variant="outline">
            <Mail size={18} /> Message
          </Button>
        )}
      </div>
    </section>
  );
}
