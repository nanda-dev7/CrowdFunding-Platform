import { Share2 } from "lucide-react";
import Button from "../common/Button";
import { useShareCampaign } from "../../hooks/useShareCampaign";

export default function ShareCampaignButton({ campaign, className = "" }) {
  const share = useShareCampaign(campaign);
  return (
    <Button onClick={share} className={`bg-[#315244] text-white hover:bg-[#29483b] ${className}`} aria-label="Share this campaign">
      <Share2 size={18} /> Share
    </Button>
  );
}
