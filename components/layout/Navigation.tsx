"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Cross } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  if (pathname.startsWith("/admin")) return null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/sermons", label: t.nav.sermons },
    { href: "/events", label: t.nav.events },
    { href: "/ministries", label: t.nav.ministries },
    { href: "/give", label: t.nav.give },
    { href: "/blog", label: t.nav.blog },
    { href: "/contact", label: t.nav.contact },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-[#1B2A4A] shadow-lg" : "bg-[#1B2A4A]"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4A853]">
              <Cross className="h-4 w-4 text-[#1B2A4A]" strokeWidth={2.5} />
            </div>
            <span className="font-heading text-lg font-bold text-white leading-tight">
              Fr. Yesudas
              <span className="block text-[#D4A853] text-xs font-normal font-body tracking-widest uppercase">
                Ministries
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-body font-medium transition-colors duration-200",
                  "text-white/80 hover:text-white",
                  "after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#D4A853] after:scale-x-0 after:transition-transform after:duration-200",
                  "hover:after:scale-x-100",
                  pathname === link.href && "text-[#D4A853] after:scale-x-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Language + Give CTA (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <ButtonLink
              href="/give"
              className="bg-[#D4A853] hover:bg-[#e8c27a] text-[#1B2A4A] font-semibold text-sm px-5"
            >
              {t.nav.giveNow}
            </ButtonLink>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 bg-[#1B2A4A] border-white/10 p-0"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4A853]">
                    <Cross className="h-3.5 w-3.5 text-[#1B2A4A]" strokeWidth={2.5} />
                  </div>
                  <span className="font-heading text-base font-bold text-white">
                    Fr. Yesudas Ministries
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col px-4 py-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-md text-sm font-body font-medium transition-colors",
                      pathname === link.href
                        ? "bg-[#D4A853]/20 text-[#D4A853]"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-3 px-4">
                  <LanguageSwitcher />
                </div>
                <div className="mt-3 px-4">
                  <ButtonLink
                    href="/give"
                    className="w-full bg-[#D4A853] hover:bg-[#e8c27a] text-[#1B2A4A] font-semibold flex items-center justify-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t.nav.giveNow}
                  </ButtonLink>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
