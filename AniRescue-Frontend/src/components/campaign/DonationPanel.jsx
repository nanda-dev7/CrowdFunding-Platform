import { useState } from "react";
import { Heart, IndianRupee, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../common/Button";
import CircularProgress from "../common/CircularProgress";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import RecentDonors from "./RecentDonors";
import ShareCampaignButton from "./ShareCampaignButton";
import { useRazorpay } from "../../hooks/useRazorpay";
import { calculateProgress } from "../../utils/calculateProgress";
import { formatCurrency } from "../../utils/formatCurrency";

export default function DonationPanel({ campaign, onDonationSuccess }) {
  const [amount, setAmount] = useState(1500);
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const { donate } = useRazorpay();
  const progress = calculateProgress(campaign.raisedAmount || campaign.raised, campaign.goalAmount || campaign.goal);

  const submitDonation = async () => {
    if (!amount || Number(amount) < 10) {
      toast.error("Please enter a valid donation amount");
      return;
    }
    setLoading(true);
    try {
      await donate({ campaign, amount: Number(amount), message, anonymous, onSuccess: onDonationSuccess });
    } catch (error) {
      toast.error(error.response?.data?.message || "Donation could not be started");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="rounded-[2rem] border border-bark/10 bg-white p-5 shadow-soft lg:sticky lg:top-28">
      <div className="flex flex-col items-center text-center">
        <CircularProgress value={progress} />
        <p className="mt-4 text-3xl font-extrabold text-ink">{formatCurrency(campaign.raisedAmount || campaign.raised)}</p>
        <p className="text-sm text-bark/60">raised of {formatCurrency(campaign.goalAmount || campaign.goal)} goal</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-cream p-4">
          <Heart className="mb-2 text-coral" size={20} />
          <p className="text-xl font-extrabold text-ink">{campaign.donationCount || campaign.donorsCount || 0}</p>
          <p className="text-xs font-semibold text-bark/55">Donations</p>
        </div>
        <div className="rounded-2xl bg-sage p-4">
          <TrendingUp className="mb-2 text-moss" size={20} />
          <p className="text-xl font-extrabold text-ink">{progress}%</p>
          <p className="text-xs font-semibold text-bark/55">Funded</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <Input label="Donation amount" type="number" min="10" value={amount} onChange={(event) => setAmount(event.target.value)} icon={IndianRupee} />
        <Textarea label="Message to organizer" placeholder="Add a note of support" value={message} onChange={(event) => setMessage(event.target.value)} />
        <label className="flex items-center gap-3 rounded-2xl bg-cream p-3 text-sm font-semibold text-bark">
          <input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} className="h-5 w-5 rounded border-bark/20 text-moss" />
          Donate anonymously
        </label>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <Button onClick={submitDonation} disabled={loading} className="bg-[#5f936e] text-white hover:bg-moss">
          <Heart size={18} /> Donate now
        </Button>
        <ShareCampaignButton campaign={campaign} />
      </div>
      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-extrabold text-ink">Recent donations</h3>
          <div className="flex gap-2 text-xs font-bold text-moss">
            <button>See all</button>
            <span className="text-bark/25">/</span>
            <button>See top</button>
          </div>
        </div>
        <RecentDonors donors={campaign.recentDonors || campaign.donations || []} />
      </div>
    </aside>
  );
}
