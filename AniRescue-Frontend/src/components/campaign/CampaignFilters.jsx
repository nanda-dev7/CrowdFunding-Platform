import { Search } from "lucide-react";
import Input from "../common/Input";
import Select from "../common/Select";

export default function CampaignFilters({ filters, setFilters }) {
  const update = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));
  return (
    <div className="rounded-[2rem] border border-bark/10 bg-white p-4 shadow-card">
      <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bark/35" size={18} />
          <Input aria-label="Search campaigns" placeholder="Search rescues, surgery, location..." value={filters.search || ""} onChange={update("search")} className="pl-11" />
        </div>
        <Select aria-label="Category" value={filters.category || ""} onChange={update("category")}>
          <option value="">All categories</option>
          <option value="Surgery">Surgery</option>
          <option value="Treatment">Treatment</option>
          <option value="Recovery">Recovery</option>
          <option value="Vaccination">Vaccination</option>
        </Select>
        <Select aria-label="Urgency" value={filters.urgency || ""} onChange={update("urgency")}>
          <option value="">Any urgency</option>
          <option value="urgent">Urgent</option>
          <option value="normal">Normal</option>
        </Select>
        <Select aria-label="Sort campaigns" value={filters.sort || "newest"} onChange={update("sort")}>
          <option value="newest">Newest</option>
          <option value="most-funded">Most funded</option>
          <option value="ending-soon">Ending soon</option>
        </Select>
      </div>
    </div>
  );
}
