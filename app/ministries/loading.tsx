import { Skeleton } from "@/components/ui/skeleton";

export default function MinistriesLoading() {
  return (
    <div className="flex flex-col">
      <section className="bg-[#1B2A4A] py-14 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-32 mb-4 bg-white/10" />
          <Skeleton className="h-12 w-48 mb-3 bg-white/10" />
          <Skeleton className="h-5 w-96 bg-white/10" />
        </div>
      </section>
      <section className="py-12 lg:py-16 bg-[#FDF6EC] flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
