import { MapPin, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ChurchEvent, EventType } from "@/types/event";
import { format } from "date-fns";

const typeConfig: Record<EventType, { label: string; color: string }> = {
  "sunday-service": { label: "Sunday Service", color: "bg-[#1B2A4A] text-white" },
  special: { label: "Special Event", color: "bg-[#D4A853] text-[#1B2A4A]" },
  retreat: { label: "Retreat", color: "bg-purple-600 text-white" },
  prayer: { label: "Prayer", color: "bg-blue-600 text-white" },
  youth: { label: "Youth", color: "bg-green-600 text-white" },
  community: { label: "Community", color: "bg-orange-600 text-white" },
};

interface EventCardProps {
  event: ChurchEvent;
}

export function EventCard({ event }: EventCardProps) {
  const config = typeConfig[event.type] ?? typeConfig.special;
  const eventDate = new Date(event.date);

  return (
    <div className="flex gap-4 bg-white rounded-xl p-5 border border-border/50 hover:shadow-md hover:border-[#D4A853]/40 transition-all duration-200">
      {/* Date column */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[#1B2A4A] text-white">
        <span className="font-heading text-xl font-bold leading-none">
          {format(eventDate, "dd")}
        </span>
        <span className="font-body text-xs uppercase tracking-wider text-[#D4A853]">
          {format(eventDate, "MMM")}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`text-xs font-body font-semibold px-2 py-0.5 rounded-full ${config.color}`}>
            {config.label}
          </span>
          {event.isRecurring && (
            <Badge variant="secondary" className="text-xs">Recurring</Badge>
          )}
        </div>
        <h3 className="font-heading text-base font-semibold text-[#1B2A4A] mb-1 truncate">
          {event.title}
        </h3>
        <p className="font-body text-sm text-gray-500 line-clamp-1 mb-2">
          {event.description}
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-gray-400 font-body">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-[#D4A853]" />
            {event.time}{event.endTime ? ` – ${event.endTime}` : ""}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-[#D4A853]" />
            {event.location}
          </span>
        </div>
      </div>

      {/* Calendar icon */}
      <div className="hidden sm:flex items-center">
        <Calendar className="h-5 w-5 text-[#D4A853]/60" />
      </div>
    </div>
  );
}
