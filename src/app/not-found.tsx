import Link from "next/link";
import { Button } from "@/components/Button";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg pb-24 flex flex-col">
      <TopBar />
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 text-center mt-[-4rem]">
        <h1 className="text-[120px] font-display font-black text-brand-yellow leading-none tracking-tighter opacity-80 mix-blend-screen drop-shadow-2xl">404</h1>
        <h2 className="text-3xl font-display font-bold text-text-hi mt-4 mb-2">Lost in the sauce?</h2>
        <p className="text-text-lo max-w-sm mb-8 text-lg">
          The creator, post, or page you are looking for doesn&apos;t exist or was removed.
        </p>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="primary" className="px-8 shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:shadow-[0_0_30px_rgba(245,197,24,0.5)]">
              Go Home
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="secondary" className="px-8 border-white/10">
              Explore
            </Button>
          </Link>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
