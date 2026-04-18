import type { Metadata } from "next";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/events/EventCard";
import { prisma } from "@/lib/db";
import { mapEvent } from "@/lib/mappers";
import type { ChurchEvent } from "@/types/event";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming events at Fr. Yesudas Ministries — worship services, prayer nights, retreats, and community outreach.",
};

export default async function EventsPage() {
  const rows = await prisma.churchEvent.findMany({ orderBy: { date: "asc" } }) as Awaited<ReturnType<typeof prisma.churchEvent.findMany>>;
  const allEvents: ChurchEvent[] = rows.map(mapEvent);
  const today = new Date();
  const upcoming = allEvents
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past = allEvents
    .filter((e) => new Date(e.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group upcoming by month
  const byMonth: Record<string, ChurchEvent[]> = {};
  for (const event of upcoming) {
    const key = format(new Date(event.date), "MMMM yyyy");
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(event);
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-[#1B2A4A] py-14 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[#D4A853]/20 text-[#D4A853] border-[#D4A853]/30 text-xs tracking-widest uppercase">
              What&apos;s Happening
            </Badge>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">
              Events
            </h1>
            <p className="font-body text-white/70 text-lg">
              Join us for worship, prayer, fellowship, and outreach. All are welcome.
            </p>
          </div>
        </div>
      </section>

      {/* Service times quick reference */}
      <section className="bg-[#D4A853]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-6 items-center">
            <p className="font-body text-[#1B2A4A] font-semibold text-sm">Regular Services:</p>
            {[
              { day: "Sunday", time: "9:00 AM", label: "Main Service" },
              { day: "Wednesday", time: "7:00 PM", label: "Prayer Night" },
              { day: "Friday", time: "6:00 AM", label: "Morning Prayer" },
            ].map((s) => (
              <div key={s.day} className="flex items-center gap-2 text-sm font-body text-[#1B2A4A]">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-semibold">{s.day}</span>
                <span className="opacity-70">{s.time} · {s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-14 bg-[#FDF6EC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {upcoming.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="h-12 w-12 text-[#D4A853] mx-auto mb-4" />
              <p className="font-heading text-xl text-[#1B2A4A]">No upcoming events scheduled.</p>
              <p className="font-body text-gray-500 mt-2">Check back soon!</p>
            </div>
          ) : (
            Object.entries(byMonth).map(([month, events]) => (
              <div key={month} className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="font-heading text-xl font-bold text-[#1B2A4A]">{month}</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex flex-col gap-3">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Special event highlight */}
          <div className="mt-10 bg-[#1B2A4A] rounded-2xl p-8 text-white flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-[#D4A853] text-[#1B2A4A]">
              <span className="font-heading text-2xl font-bold leading-none">05</span>
              <span className="font-body text-xs uppercase tracking-wider">Apr</span>
            </div>
            <div className="flex-1">
              <Badge className="mb-2 bg-[#D4A853]/20 text-[#D4A853] border-[#D4A853]/30 text-xs">
                Featured Event
              </Badge>
              <h3 className="font-heading text-2xl font-bold text-white mb-1">
                Easter Sunday Celebration
              </h3>
              <p className="font-body text-white/70 text-sm mb-3">
                Celebrate the Resurrection of Jesus! Special worship, testimonies, and a
                festive message. Invite your friends and family.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white/60 font-body">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#D4A853]" />
                  8:00 AM – 10:30 AM
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#D4A853]" />
                  Main Sanctuary
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Events */}
      {past.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-heading text-xl font-bold text-[#1B2A4A]">Past Events</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="flex flex-col gap-3 opacity-60">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
