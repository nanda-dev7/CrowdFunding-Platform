import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Siren } from "lucide-react";
import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";
import { calculateProgress } from "../../utils/calculateProgress";
import { formatCurrency } from "../../utils/formatCurrency";

export default function UrgentCampaignStrip({ campaigns = [] }) {
  if (!campaigns.length) return null;
  return (
    <section className="relative overflow-hidden border-y border-coral/15 bg-gradient-to-r from-white via-coral/5 to-sage/70 py-5">
      <div className="mx-auto mb-4 flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-coral text-white">
          <span className="absolute inset-0 animate-ping rounded-full bg-coral/40" />
          <Siren size={20} />
        </span>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-coral">Urgent rescues</p>
          <h2 className="text-xl font-extrabold text-ink">Cases that need help now</h2>
        </div>
      </div>
      <div className="flex gap-4 overflow-hidden">
        <motion.div
          className="flex min-w-max gap-4 px-4 sm:px-6 lg:px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        >
          {[...campaigns, ...campaigns].map((campaign, index) => {
            const progress = calculateProgress(campaign.raisedAmount || campaign.raised, campaign.goalAmount || campaign.goal);
            return (
              <Link
                key={`${campaign._id || campaign.id}-${index}`}
                to={`/campaigns/${campaign._id || campaign.id}`}
                className="w-80 shrink-0 rounded-3xl border border-coral/20 bg-white p-4 shadow-card"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Badge variant="urgent">Urgent</Badge>
                  <Badge variant="success" className="gap-1">
                    <Activity size={12} /> Live
                  </Badge>
                </div>
                <h3 className="line-clamp-2 font-extrabold text-ink">{campaign.title}</h3>
                <p className="mt-2 text-sm font-semibold text-bark/60">Needs Surgery</p>
                <ProgressBar value={progress} className="mt-4 h-2" />
                <p className="mt-3 text-sm text-bark/65">
                  <span className="font-extrabold text-ink">{formatCurrency(campaign.raisedAmount || campaign.raised)}</span> raised
                </p>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
