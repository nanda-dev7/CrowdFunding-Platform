import { motion } from "framer-motion";
import { formatDate } from "../../utils/formatDate";
import Badge from "../common/Badge";

export default function Timeline({ updates = [] }) {
  const items = updates.length
    ? updates
    : [
        { stage: "before", text: "Rescue team documented the injury and moved the animal to emergency care.", timestamp: new Date() },
        { stage: "during", text: "Vet team began treatment and stabilisation.", timestamp: new Date() },
      ];
  return (
    <section className="rounded-[2rem] border border-bark/10 bg-white p-5 shadow-card">
      <h2 className="text-2xl font-extrabold text-ink">Rescue Timeline</h2>
      <div className="mt-6 space-y-5">
        {items.map((item, index) => (
          <motion.div key={item._id || item.id || index} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative pl-9">
            <span className="absolute left-2 top-2 h-full w-px bg-oat" />
            <span className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-moss ring-4 ring-sage" />
            <div className="rounded-3xl bg-cream p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant={item.stage === "after" ? "success" : item.stage === "during" ? "teal" : "default"}>{(item.stage || "before").toUpperCase()}</Badge>
                <span className="text-xs font-semibold text-bark/50">{formatDate(item.date || item.timestamp || item.createdAt)}</span>
              </div>
              <p className="text-sm leading-6 text-bark/75">{item.text || item.description}</p>
              {item.image && <img src={item.image} alt="" className="mt-3 max-h-72 w-full rounded-2xl object-cover" loading="lazy" />}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
