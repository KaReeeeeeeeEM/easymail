import { cn } from "@/lib/utils";

export function AuditHeatmap({
  days,
}: {
  days: Array<{ date: string; count: number }>;
}) {
  const max = Math.max(1, ...days.map((day) => day.count));
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div
        className="grid w-full min-w-[52rem] grid-flow-col grid-rows-7 auto-cols-fr gap-1"
        role="img"
        aria-label={`Audit activity across ${days.length} days. Darker primary cells indicate more events.`}
      >
        {days.map((day) => {
          const intensity =
            day.count === 0 ? 0 : Math.max(1, Math.ceil((day.count / max) * 4));
          return (
            <div
              key={day.date}
              title={`${day.date}: ${day.count} event${day.count === 1 ? "" : "s"}`}
              className={cn(
                "aspect-square w-full rounded-[3px] border border-border/50",
                intensity === 0 && "bg-muted",
                intensity === 1 && "bg-primary/20",
                intensity === 2 && "bg-primary/40",
                intensity === 3 && "bg-primary/65",
                intensity === 4 && "bg-primary",
              )}
            />
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <span className="mr-1">Less</span>
        {[
          "bg-muted",
          "bg-primary/20",
          "bg-primary/40",
          "bg-primary/65",
          "bg-primary",
        ].map((className) => (
          <span
            key={className}
            className={cn(
              "size-3 rounded-[3px] border border-border/50",
              className,
            )}
          />
        ))}
        <span className="ml-1">More</span>
      </div>
    </div>
  );
}
