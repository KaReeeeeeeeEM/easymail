import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlaygroundLoading() {
  return <div className="flex flex-col gap-8" aria-label="Loading playground" aria-busy="true">
    <div className="flex flex-col gap-3"><Skeleton className="h-4 w-28" /><Skeleton className="h-9 w-64" /><Skeleton className="h-5 w-[34rem] max-w-full" /></div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Card><CardHeader className="flex flex-col gap-3"><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-80 max-w-full" /></CardHeader><CardContent className="flex flex-col gap-5">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="flex flex-col gap-2"><Skeleton className="h-4 w-24" /><Skeleton className={index === 4 ? "h-48 w-full" : "h-9 w-full"} /></div>)}<Skeleton className="h-9 w-full" /></CardContent></Card>
      <Card><CardHeader className="flex flex-col gap-3"><Skeleton className="h-6 w-44" /><Skeleton className="h-4 w-96 max-w-full" /></CardHeader><CardContent className="flex flex-col gap-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-9 w-24 self-end" /><Skeleton className="h-[34rem] w-full" /></CardContent></Card>
    </div>
  </div>;
}
