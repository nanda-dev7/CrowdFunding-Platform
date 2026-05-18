import { Download, ExternalLink, FileText, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import { formatDate } from "../../utils/formatDate";

const fileType = (document) => {
  const type = document.fileType || document.mimeType || document.type || "";
  const url = document.url || document.fileUrl || "";
  if (type.includes("pdf") || url.toLowerCase().endsWith(".pdf")) return "PDF";
  if (type.includes("image") || /\.(png|jpe?g|webp|gif)$/i.test(url)) return "Image";
  return "Other";
};

export default function MedicalDocuments({ documents = [], canManage = false, onDelete }) {
  return (
    <section className="rounded-[2rem] border border-bark/10 bg-white p-5 shadow-card">
      <div className="mb-6 border-b border-bark/10">
        <div className="inline-flex items-center gap-2 border-b-4 border-cyan-300 pb-3 text-lg font-extrabold text-ink">
          <FileText className="text-teal-600" size={22} /> Documents
        </div>
      </div>
      <h2 className="text-2xl font-extrabold text-ink">Medical Documents</h2>
      {!documents.length ? (
        <div className="mt-5">
          <EmptyState
            title="No medical documents uploaded yet."
            description="Documents shared by the campaigner will appear here."
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {documents.map((document) => {
            const href = document.url || document.fileUrl || document.secureUrl || "#";
            return (
              <motion.article
                key={document._id || document.id || document.title}
                whileHover={{ y: -3 }}
                className="rounded-3xl border border-bark/10 bg-cream p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700">
                    <FileText />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-extrabold text-ink">{document.title || document.name || "Medical document"}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="teal">{fileType(document)}</Badge>
                      <span className="text-xs font-semibold text-bark/55">{formatDate(document.createdAt || document.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-moss">
                    <ExternalLink size={16} /> View document
                  </a>
                  <a href={href} target="_blank" rel="noreferrer" download className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-bark">
                    <Download size={16} /> Download
                  </a>
                  {canManage && (
                    <button
                      onClick={() => onDelete?.(document._id || document.id)}
                      className="inline-flex items-center gap-2 rounded-full bg-coral/10 px-4 py-2 text-sm font-bold text-coral"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}
