import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B2A4A]/10">
          <Icon className="h-4 w-4 text-[#1B2A4A]" />
        </div>
      </div>
      <p className="font-heading text-3xl font-bold text-[#1B2A4A]">{value}</p>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
    </div>
  );
}
