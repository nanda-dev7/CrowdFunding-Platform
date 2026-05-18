import { ShieldCheck, UserRound } from "lucide-react";
import Badge from "../common/Badge";

const fallbackImage = "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=1400&q=80";

export default function CampaignDetailHeader({ campaign }) {
  const creator = campaign.creator || campaign.campaigner || {};
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="teal">{campaign.category || "Emergency treatment"}</Badge>
        {(campaign.isUrgent || campaign.urgency === "urgent") && <Badge variant="urgent">Urgent rescue</Badge>}
      </div>
      <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-ink md:text-6xl">{campaign.title}</h1>
      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-bark/70">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
          <UserRound size={17} /> By <strong className="text-ink">{creator.name || "AniRescue organizer"}</strong>
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-sage px-4 py-2 font-semibold text-moss">
          <ShieldCheck size={17} /> Donation protected
        </span>
      </div>
      <div className="mt-8 overflow-hidden rounded-[2rem] border border-bark/10 bg-white shadow-soft">
        <img src={campaign.coverImage || campaign.image || fallbackImage} alt={campaign.title} className="aspect-[16/10] w-full object-cover md:aspect-[16/8]" />
      </div>
    </div>
  );
}
