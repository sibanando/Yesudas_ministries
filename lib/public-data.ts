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
