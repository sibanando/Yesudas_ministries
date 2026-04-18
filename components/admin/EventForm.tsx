"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().min(1),
  endTime: z.string().optional(),
  location: z.string().min(1),
  type: z.enum(["sunday-service", "special", "retreat", "prayer", "youth", "community"]),
  imageUrl: z.string().optional(),
  isRecurring: z.boolean(),
  registrationUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  id?: string;
  defaultValues?: Partial<FormValues>;
}

export function EventForm({ id, defaultValues }: EventFormProps) {
  const router = useRouter();
  const isEdit = Boolean(id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { isRecurring: false, ...defaultValues },
  });

  const onSubmit = async (values: FormValues) => {
    const url = isEdit ? `/api/admin/events/${id}` : "/api/admin/events";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error?.message ?? "Failed to save event.");
      return;
    }

    toast.success(isEdit ? "Event updated!" : "Event created!");
    router.push("/admin/events");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-2xl">
      <Field label="Title" error={errors.title?.message}>
        <input {...register("title")} className={inputCls} placeholder="Event title" />
      </Field>

      <Field label="Description" error={errors.description?.message}>
        <textarea {...register("description")} rows={3} className={inputCls} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Date (YYYY-MM-DD)" error={errors.date?.message}>
          <input {...register("date")} className={inputCls} placeholder="2026-04-15" />
        </Field>
        <Field label="Start Time" error={errors.time?.message}>
          <input {...register("time")} className={inputCls} placeholder="9:00 AM" />
        </Field>
        <Field label="End Time" error={errors.endTime?.message}>
          <input {...register("endTime")} className={inputCls} placeholder="11:00 AM" />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Location" error={errors.location?.message}>
          <input {...register("location")} className={inputCls} placeholder="Main Sanctuary" />
        </Field>
        <Field label="Type" error={errors.type?.message}>
          <select {...register("type")} className={inputCls}>
            <option value="sunday-service">Sunday Service</option>
            <option value="special">Special</option>
            <option value="retreat">Retreat</option>
            <option value="prayer">Prayer</option>
            <option value="youth">Youth</option>
            <option value="community">Community</option>
          </select>
        </Field>
      </div>

      <Field label="Registration URL" error={errors.registrationUrl?.message}>
        <input {...register("registrationUrl")} className={inputCls} placeholder="https://..." />
      </Field>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" {...register("isRecurring")} className="w-4 h-4 accent-[#1B2A4A]" />
        <span className="text-sm text-gray-700">Recurring event</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#1B2A4A] hover:bg-[#2a4070] disabled:opacity-60 text-white font-semibold text-sm rounded-lg transition-colors"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Update Event" : "Create Event"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent";
