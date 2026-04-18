import { Clock, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Ministry } from "@/types/ministry";

interface MinistryCardProps {
  ministry: Ministry;
}

export function MinistryCard({ ministry }: MinistryCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg hover:border-[#D4A853]/40 transition-all duration-300">
      {/* Colour top bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#1B2A4A] to-[#D4A853]" />

      <div className="p-6">
        <h3 className="font-heading text-xl font-bold text-[#1B2A4A] mb-2 group-hover:text-[#D4A853] transition-colors">
          {ministry.name}
        </h3>

        <p className="font-body text-sm text-gray-600 leading-relaxed mb-4">
          {ministry.fullDescription ?? ministry.description}
        </p>

        <div className="flex flex-col gap-2 text-sm font-body text-gray-500 mb-4">
          <span className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#D4A853] flex-shrink-0" />
            <span className="font-semibold text-[#1B2A4A]">{ministry.leader}</span>
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#D4A853] flex-shrink-0" />
            {ministry.schedule}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ministry.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs font-body bg-[#FDF6EC] text-[#1B2A4A] border border-[#D4A853]/30 rounded-full px-2.5 py-0.5"
            >
              <Tag className="h-2.5 w-2.5 text-[#D4A853]" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {ministry.contactEmail && (
        <div className="border-t border-border/50 px-6 py-3">
          <a
            href={`mailto:${ministry.contactEmail}`}
            className="font-body text-xs text-[#D4A853] hover:underline"
          >
            {ministry.contactEmail}
          </a>
        </div>
      )}
    </div>
  );
}
