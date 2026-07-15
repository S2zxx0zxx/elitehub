"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const items = [
  { label: "Home", href: "/", icon: "/assets/navigation_icons/home.png" },
  { label: "Explore", href: "/explore", icon: "/assets/navigation_icons/explore.png" },
  { label: "Create", href: "/create", icon: "/assets/navigation_icons/create.png", center: true },
  { label: "Alerts", href: "/notifications", icon: "/assets/navigation_icons/notification.png" },
  { label: "Profile", href: "/dashboard", icon: "/assets/navigation_icons/profile.png" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
      <nav className="flex items-center justify-around rounded-full bg-white/90 backdrop-blur-xl border border-border px-2 py-2 shadow-glossy-lg">
        {items.map((item) => {
          const active = pathname === item.href;
          if (item.center) {
            return (
              <Link key={item.label} href={item.href} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-brand-yellow flex items-center justify-center -mt-6 shadow-lg shadow-brand-yellow/30">
                  <Image src={item.icon} alt={item.label} width={28} height={28} className="object-contain" />
                </div>
              </Link>
            );
          }
          return (
            <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 px-2 py-1">
              <Image src={item.icon} alt={item.label} width={22} height={22} className={`object-contain ${active ? "" : "opacity-50"}`} />
              <span className={`text-[10px] font-semibold ${active ? "text-brand-yellow" : "text-text-lo"}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
