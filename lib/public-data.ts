import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

export type ServiceTimeData = {
  id: string;
  day: string;
  time: string;
  label: string;
  sortOrder: number;
};

export type SiteSettingsData = {
  contact_address: string;
  contact_phone: string;
  contact_phone_href: string;
  contact_email: string;
};

export type GiveCause = { value: string; label: string };

export type GiveSettings = {
  presetAmountsINR: number[];
  presetAmountsUSD: number[];
  causes: GiveCause[];
  enableRazorpay: boolean;
  enableStripe: boolean;
  enableUPI: boolean;
  upiId: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
};

const DEFAULT_SERVICE_TIMES: ServiceTimeData[] = [
  { id: "_1", day: "Sunday", time: "9:00 AM – 11:00 AM", label: "Main Worship Service", sortOrder: 0 },
  { id: "_2", day: "Wednesday", time: "7:00 PM – 9:00 PM", label: "Prayer Night", sortOrder: 1 },
  { id: "_3", day: "Friday", time: "6:00 AM – 7:30 AM", label: "Early Morning Prayer", sortOrder: 2 },
];

const DEFAULT_SETTINGS: SiteSettingsData = {
  contact_address: "Fr. Yesudas Ministries,\nVisakhapatnam, Andhra Pradesh,\nIndia",
  contact_phone: "+91 XXXXX XXXXX",
  contact_phone_href: "tel:+91XXXXXXXXXX",
  contact_email: "info@fryesudasministries.com",
};

export const getServiceTimes = unstable_cache(
  async (): Promise<ServiceTimeData[]> => {
    try {
      const rows = await prisma.serviceTime.findMany({ orderBy: { sortOrder: "asc" } });
      if (rows.length === 0) return DEFAULT_SERVICE_TIMES;
      return rows.map((r: any) => ({
        id: r.id as string,
        day: r.day as string,
        time: r.time as string,
        label: r.label as string,
        sortOrder: r.sortOrder as number,
      }));
    } catch {
      return DEFAULT_SERVICE_TIMES;
    }
  },
  ["service-times"],
  { revalidate: 3600, tags: ["service-times"] }
);

const DEFAULT_GIVE_SETTINGS: GiveSettings = {
  presetAmountsINR: [500, 1000, 2500, 5000],
  presetAmountsUSD: [10, 25, 50, 100],
  causes: [
    { value: "general", label: "General Fund" },
    { value: "building", label: "Building & Facilities" },
    { value: "missions", label: "Mission Support" },
    { value: "compassion", label: "Compassion Ministry" },
    { value: "youth", label: "Youth Ministry" },
  ],
  enableRazorpay: true,
  enableStripe: true,
  enableUPI: true,
  upiId: "fryesudasministries@upi",
  bankAccountName: "Fr. Yesudas Ministries",
  bankAccountNumber: "XXXX XXXX XXXX",
  bankIfsc: "XXXXXXXXXX",
  bankName: "State Bank of India",
};

export const getGiveSettings = unstable_cache(
  async (): Promise<GiveSettings> => {
    try {
      const rows = await prisma.siteSettings.findMany({
        where: { key: { startsWith: "give_" } },
      });
      if (rows.length === 0) return DEFAULT_GIVE_SETTINGS;
      const map = Object.fromEntries(rows.map((r: any) => [r.key as string, r.value as string]));

      const parseAmounts = (str: string | undefined, fallback: number[]): number[] => {
        if (!str) return fallback;
        const parsed = str.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n) && n > 0);
        return parsed.length > 0 ? parsed : fallback;
      };

      const parseCauses = (str: string | undefined, fallback: GiveCause[]): GiveCause[] => {
        if (!str) return fallback;
        try {
          const parsed = JSON.parse(str);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
        } catch {
          return fallback;
        }
      };

      return {
        presetAmountsINR: parseAmounts(map.give_preset_amounts_inr, DEFAULT_GIVE_SETTINGS.presetAmountsINR),
        presetAmountsUSD: parseAmounts(map.give_preset_amounts_usd, DEFAULT_GIVE_SETTINGS.presetAmountsUSD),
        causes: parseCauses(map.give_causes, DEFAULT_GIVE_SETTINGS.causes),
        enableRazorpay: map.give_enable_razorpay !== "false",
        enableStripe: map.give_enable_stripe !== "false",
        enableUPI: map.give_enable_upi !== "false",
        upiId: map.give_upi_id || DEFAULT_GIVE_SETTINGS.upiId,
        bankAccountName: map.give_bank_account_name || DEFAULT_GIVE_SETTINGS.bankAccountName,
        bankAccountNumber: map.give_bank_account_number || DEFAULT_GIVE_SETTINGS.bankAccountNumber,
        bankIfsc: map.give_bank_ifsc || DEFAULT_GIVE_SETTINGS.bankIfsc,
        bankName: map.give_bank_name || DEFAULT_GIVE_SETTINGS.bankName,
      };
    } catch {
      return DEFAULT_GIVE_SETTINGS;
    }
  },
  ["give-settings"],
  { revalidate: 3600, tags: ["give-settings"] }
);

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettingsData> => {
    try {
      const rows = await prisma.siteSettings.findMany();
      if (rows.length === 0) return DEFAULT_SETTINGS;
      const map = Object.fromEntries(rows.map((r: any) => [r.key as string, r.value as string]));
      return { ...DEFAULT_SETTINGS, ...map } as SiteSettingsData;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },
  ["site-settings"],
  { revalidate: 3600, tags: ["site-settings"] }
);
