const STYLES: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  APPROVED: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  REJECTED: "bg-red-500/15 text-red-300 border border-red-500/30",
  ACTIVE: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  SUSPENDED: "bg-red-500/15 text-red-300 border border-red-500/30",
};

const LABELS: Record<string, string> = {
  PENDING: "Awaiting review",
  APPROVED: "Live",
  REJECTED: "Rejected",
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge ${STYLES[status] ?? "bg-ink-800 text-ink-300"}`}>
      {LABELS[status] ?? status}
    </span>
  );
}
