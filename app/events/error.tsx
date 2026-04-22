"use client";

export default function EventsError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
      <h2 className="font-heading text-2xl font-bold text-[#1B2A4A]">
        Something went wrong
      </h2>
      <p className="font-body text-gray-500 text-center max-w-md">
        We couldn&apos;t load the events. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2 bg-[#1B2A4A] text-white rounded-full font-body text-sm hover:bg-[#1B2A4A]/90 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
