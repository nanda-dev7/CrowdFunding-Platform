import toast from "react-hot-toast";

export function useShareCampaign(campaign) {
  return async () => {
    const shareUrl = campaign?.shareUrl || window.location.href;
    const shareText = campaign?.shareText || `Support this AniRescue campaign: ${campaign?.title || "rescue"}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: campaign?.title || "AniRescue campaign", text: shareText, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Campaign link copied");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Unable to share campaign");
      }
    }
  };
}
