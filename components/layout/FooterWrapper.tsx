import { getServiceTimes, getSiteSettings } from "@/lib/public-data";
import { Footer } from "./Footer";

export async function FooterWrapper() {
  const [serviceTimes, settings] = await Promise.all([getServiceTimes(), getSiteSettings()]);
  return <Footer serviceTimes={serviceTimes} settings={settings} />;
}
