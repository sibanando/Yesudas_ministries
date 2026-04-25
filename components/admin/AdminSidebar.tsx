"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Cross,
  LayoutDashboard,
  FileText,
  Calendar,
  Church,
  Users,
  Mail,
  MessageSquare,
  Heart,
  Video,
  Clock,
  Settings,
  HandCoins,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/sermons", label: "Sermons", icon: Video },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/ministries", label: "Ministries", icon: Church },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquare },
  { href: "/admin/donations", label: "Donations", icon: Heart },
  { href: "/admin/service-times", label: "Service Times", icon: Clock },
  { href: "/admin/give-settings", label: "Give Settings", icon: HandCoins },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-[#1B2A4A] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4A853]">
          <Cross className="h-3.5 w-3.5 text-[#1B2A4A]" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-white font-heading font-bold text-sm leading-none">Fr. Yesudas</p>
          <p className="text-[#D4A853] text-xs tracking-widest uppercase font-body mt-0.5">
            Admin
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium mb-1 transition-colors",
                active
                  ? "bg-[#D4A853]/20 text-[#D4A853]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className="text-xs text-white/40 hover:text-white/60 transition-colors"
        >
          View public site →
        </Link>
      </div>
    </aside>
  );
}
