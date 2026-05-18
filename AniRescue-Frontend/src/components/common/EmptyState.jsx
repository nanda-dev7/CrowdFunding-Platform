import { PawPrint } from "lucide-react";
import Button from "./Button";

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-[2rem] border border-bark/10 bg-white p-10 text-center shadow-card">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sage text-moss">
        <PawPrint />
      </div>
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-bark/70">{description}</p>
      {actionLabel && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
