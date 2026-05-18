import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, MapPin, Siren } from "lucide-react";
import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";
import { formatCurrency } from "../../utils/formatCurrency";
import { calculateProgress } from "../../utils/calculateProgress";
import { getDaysLeft } from "../../utils/getDaysLeft";

const fallbackImage = "https://images.unsplash.com/photo-1601758064224-c3c14733a968?auto=format&fit=crop&w=1200&q=80";

export default function CampaignCard({ campaign }) {
  const progress = calculateProgress(campaign.raisedAmount || campaign.raised, campaign.goalAmount || campaign.goal);
  const urgent = campaign.isUrgent || campaign.urgency === "urgent" || campaign.urgencyLevel === "critical";
  return (
    <motion.article
      whileHover={{ y: -7 }}
      className={`group overflow-hidden rounded-[2rem] border bg-white shadow-card transition ${urgent ? "border-coral/30 ring-4 ring-coral/5" : "border-bark/10"}`}
    >
      <Link to={`/campaigns/${campaign._id || campaign.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={campaign.coverImage || campaign.image || fallbackImage}
            alt={campaign.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {urgent && (
              <Badge variant="urgent" className="gap-1">
                <Siren size={12} /> Critical
              </Badge>
            )}
            <Badge variant="teal">{campaign.category || "Treatment"}</Badge>
          </div>
        </div>
        <div className="p-5">
          <h3 className="line-clamp-2 text-xl font-extrabold text-ink">{campaign.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-bark/70">{campaign.description}</p>
          <div className="mt-5">
            <ProgressBar value={progress} />
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="font-extrabold text-ink">{formatCurrency(campaign.raisedAmount || campaign.raised)}</span>
              <span className="text-bark/60">of {formatCurrency(campaign.goalAmount || campaign.goal)}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-bark/60">
            <span className="inline-flex items-center gap-1">
              <Clock size={15} /> {getDaysLeft(campaign.deadline)} days left
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={15} /> {campaign.location || "India"}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
