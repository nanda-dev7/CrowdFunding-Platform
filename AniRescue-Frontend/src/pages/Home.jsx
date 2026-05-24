import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake, IndianRupee, ShieldCheck, Users } from "lucide-react";
import { getUrgentCampaigns, getCampaigns } from "../api/campaignApi";
import { getAdminStats } from "../api/adminApi";
import CampaignCard from "../components/campaign/CampaignCard";
import UrgentCampaignStrip from "../components/campaign/UrgentCampaignStrip";
import Button from "../components/common/Button";
import PageTransition from "../components/common/PageTransition";
import StatCard from "../components/dashboard/StatCard";
import { fadeUp, staggerContainer } from "../animations/motionVariants";
import { formatCurrency } from "../utils/formatCurrency";

import rescueImage from "../../assets/homepage.jpg";
const normalizeList = (data) => data?.campaigns || data?.items || data || [];

export default function Home() {
  const urgentQuery = useQuery({ queryKey: ["urgent-campaigns"], queryFn: getUrgentCampaigns, select: normalizeList });
  const campaignsQuery = useQuery({ queryKey: ["campaigns", "home"], queryFn: () => getCampaigns({ limit: 6 }), select: normalizeList });
  const statsQuery = useQuery({ queryKey: ["platform-stats"], queryFn: getAdminStats, retry: false });
  const urgent = urgentQuery.data || [];
  const campaigns = campaignsQuery.data || [];
  const stats = statsQuery.data?.stats || statsQuery.data || {};

  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(73,112,91,0.22),transparent_32%),radial-gradient(circle_at_right,rgba(184,128,93,0.24),transparent_30%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.p variants={fadeUp} className="mb-6 inline-flex rounded-full bg-mist px-5 py-2 text-xs font-black uppercase tracking-widest text-coral">
              Transparent emergency rescue crowdfunding
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl font-black tracking-tighter leading-[1.02] text-ink md:text-[5.5rem] md:leading-[0.95]">
              Help Save Injured and Suffering Animals
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-bark/75">
              Your donation can fund life-saving surgeries, treatments, and rescue missions.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/campaigns" size="lg">
                Donate Now <ArrowRight size={19} />
              </Button>
              <Button as={Link} to="/campaigns?urgency=urgent" size="lg" variant="secondary">
                View Urgent Cases
              </Button>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative">
            <img src={rescueImage} alt="Animal receiving care" className="aspect-[4/5] w-full rounded-[2.5rem] object-cover shadow-soft" />
            <div className="absolute -bottom-6 left-6 right-6 rounded-[2rem] border border-white/60 bg-white/85 p-5 shadow-soft backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage text-moss">
                  <ShieldCheck />
                </span>
                <div>
                  <p className="font-extrabold text-ink">Verified rescue campaigns</p>
                  <p className="text-sm text-bark/60">Medical documents, updates, and organizer transparency.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <UrgentCampaignStrip campaigns={urgent} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard icon={HeartHandshake} label="Total Donations" value={stats.totalDonations?.toLocaleString?.() || 0} hint="Community-backed rescue care" />
          <StatCard icon={Users} label="Total Donors" value={stats.totalDonors?.toLocaleString?.() || 0} tone="teal" />
          <StatCard icon={IndianRupee} label="Total Funds Raised" value={formatCurrency(stats.totalFundsRaised)} />
          <StatCard icon={ShieldCheck} label="Animals Rescued" value={stats.aniRescued?.toLocaleString?.() || 0} tone="coral" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-moss">Campaign discovery</p>
            <h2 className="mt-2 text-4xl font-extrabold text-ink">Fund a rescue today</h2>
          </div>
          <Button as={Link} to="/campaigns" variant="secondary">View all campaigns</Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.slice(0, 6).map((campaign) => <CampaignCard key={campaign._id || campaign.id} campaign={campaign} />)}
        </div>
      </section>
    </PageTransition>
  );
}
