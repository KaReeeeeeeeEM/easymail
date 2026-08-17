import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative isolate grid min-h-screen overflow-hidden place-items-center bg-background px-5 py-12">
      <div aria-hidden className="pointer-events-none absolute -start-32 top-[8%] -z-10 size-96 rounded-full bg-primary/12 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -end-28 bottom-[5%] -z-10 size-80 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute end-[20%] top-[18%] -z-10 size-44 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute end-5 top-5">
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="self-center">
          <Logo />
        </div>
        {children}
      </div>
    </main>
  );
}
