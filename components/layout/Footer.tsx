import Link from "next/link";
import { Cross, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { YoutubeIcon, FacebookIcon, InstagramIcon } from "@/components/shared/SocialIcons";
import type { ServiceTimeData, SiteSettingsData } from "@/lib/public-data";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/sermons", label: "Sermons" },
  { href: "/events", label: "Events" },
  { href: "/ministries", label: "Ministries" },
  { href: "/give", label: "Give" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

interface FooterProps {
  serviceTimes: ServiceTimeData[];
  settings: SiteSettingsData;
}

export function Footer({ serviceTimes, settings }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1B2A4A] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
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
            <p className="text-white/70 text-sm font-body leading-relaxed mb-5">
              Proclaiming the Gospel of Jesus Christ with love, power, and compassion.
              Reaching the unreached, healing the broken.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.youtube.com/@fryesudasministries"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#D4A853] transition-colors"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#D4A853] transition-colors"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#D4A853] transition-colors"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-[#D4A853] uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-body text-white/70 hover:text-[#D4A853] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-[#D4A853] uppercase tracking-wider mb-4">
              Service Times
            </h3>
            <ul className="space-y-3">
              {serviceTimes.map((service) => (
                <li key={service.id}>
                  <p className="text-sm font-semibold text-white">{service.day}</p>
                  <p className="text-xs text-white/70">{service.time}</p>
                  <p className="text-xs text-[#D4A853]">{service.label}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-[#D4A853] uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#D4A853] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/70 whitespace-pre-line">
                  {settings.contact_address}
                </p>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#D4A853] flex-shrink-0" />
                <a
                  href={settings.contact_phone_href}
                  className="text-sm text-white/70 hover:text-[#D4A853] transition-colors"
                >
                  {settings.contact_phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#D4A853] flex-shrink-0" />
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-sm text-white/70 hover:text-[#D4A853] transition-colors"
                >
                  {settings.contact_email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 font-body">
          <p>© {year} Fr. Yesudas Ministries. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#D4A853] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#D4A853] transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
