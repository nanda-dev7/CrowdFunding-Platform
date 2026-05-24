import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getCampaigns } from "../api/campaignApi";
import CampaignCard from "../components/campaign/CampaignCard";
import CampaignFilters from "../components/campaign/CampaignFilters";
import EmptyState from "../components/common/EmptyState";
import PageTransition from "../components/common/PageTransition";
import Skeleton from "../components/common/Skeleton";
const normalizeList = (data) => {
  const list = data?.campaigns || data?.items || data;
  return Array.isArray(list) ? list : [];
};

export default function Campaigns() {
  const [params] = useSearchParams();
  const [filters, setFilters] = useState({ urgency: params.get("urgency") || "", sort: "newest" });

  useEffect(() => {
    if (params.has("urgency") || Array.from(params.entries()).length === 0) {
      setFilters((prev) => ({
        ...prev,
        urgency: params.get("urgency") || "",
      }));
    }
  }, [params]);

  const query = useQuery({ queryKey: ["campaigns", filters], queryFn: () => getCampaigns(filters), select: normalizeList });
  const campaigns = query.data || [];
  const filtered = useMemo(() => {
    const search = filters.search?.toLowerCase() || "";
    return campaigns
      .filter((item) => !filters.urgency || item.urgencyLevel === filters.urgency)
      .filter((item) => !filters.category || item.category === filters.category)
      .filter((item) => !search || item.title.toLowerCase().includes(search) || item.description?.toLowerCase().includes(search));
  }, [campaigns, filters]);

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-coral">Campaigns</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-ink md:text-5xl">Find a rescue that needs you</h1>
        <p className="mt-3 max-w-2xl text-bark/70">Search verified medical fundraisers and support urgent treatment for injured animals.</p>
      </div>
      <CampaignFilters filters={filters} setFilters={setFilters} />
      {query.isLoading ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-96" /><Skeleton className="h-96" /><Skeleton className="h-96" />
        </div>
      ) : filtered.length ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((campaign) => <CampaignCard key={campaign._id || campaign.id} campaign={campaign} />)}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState title="No campaigns found" description="Try a different search or urgency filter." />
        </div>
      )}
    </PageTransition>
  );
}
