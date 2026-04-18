"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { localeNames, type Locale } from "@/lib/i18n/translations";
import { Globe } from "lucide-react";

const locales = Object.keys(localeNames) as Locale[];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="relative group flex items-center">
      <Globe className="h-4 w-4 text-white/60 shrink-0" />
      <div className="flex items-center gap-0.5 ml-1.5">
        {locales.map((l, i) => (
          <span key={l} className="flex items-center">
            <button
              onClick={() => setLocale(l)}
              className={`text-xs font-body px-1 py-0.5 rounded transition-colors ${
                locale === l
                  ? "text-[#D4A853] font-semibold"
                  : "text-white/60 hover:text-white"
              }`}
              aria-label={`Switch to ${localeNames[l]}`}
              title={localeNames[l]}
            >
              {l.toUpperCase()}
            </button>
            {i < locales.length - 1 && (
              <span className="text-white/20 text-xs">|</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
