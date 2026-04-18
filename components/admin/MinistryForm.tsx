"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  fullDescription: z.string().optional(),
  imageUrl: z.string().min(1),
  leader: z.string().min(1),
  leaderImageUrl: z.string().optional(),
  schedule: z.string().min(1),
  contactEmail: z.string().optional(),
  tags: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface MinistryFormProps {
  id?: string;
  defaultValues?: Partial<FormValues>;
}

export function MinistryForm({ id, defaultValues }: MinistryFormProps) {
  const router = useRouter();
  const isEdit = Boolean(id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: FormValues) => {
    const url = isEdit ? `/api/admin/ministries/${id}` : "/api/admin/ministries";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json();
      const msg = typeof data.error === "string" ? data.error : "Failed to save ministry.";
      toast.error(msg);
      return;
    }

    toast.success(isEdit ? "Ministry updated!" : "Ministry created!");
    router.push("/admin/ministries");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-2xl">
      <Field label="Name" error={errors.name?.message}>
        <input {...register("name")} className={inputCls} placeholder="Worship Ministry" />
      </Field>

      <Field label="Short Description" error={errors.description?.message}>
        <textarea {...register("description")} rows={2} className={inputCls} />
      </Field>

      <Field label="Full Description" error={errors.fullDescription?.message}>
        <textarea {...register("fullDescription")} rows={4} className={inputCls} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Leader Name" error={errors.leader?.message}>
          <input {...register("leader")} className={inputCls} placeholder="Bro. Samuel John" />
        </Field>
        <Field label="Schedule" error={errors.schedule?.message}>
          <input {...register("schedule")} className={inputCls} placeholder="Sundays 8:00 AM" />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Image URL" error={errors.imageUrl?.message}>
          <input {...register("imageUrl")} className={inputCls} placeholder="/images/ministries/worship.jpg" />
        </Field>
        <Field label="Contact Email" error={errors.contactEmail?.message}>
          <input {...register("contactEmail")} className={inputCls} placeholder="worship@ministry.com" />
        </Field>
      </div>

      <Field label="Tags (comma-separated)" error={errors.tags?.message}>
        <input {...register("tags")} className={inputCls} placeholder="music, praise, prayer" />
      </Field>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#1B2A4A] hover:bg-[#2a4070] disabled:opacity-60 text-white font-semibold text-sm rounded-lg transition-colors"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Update Ministry" : "Create Ministry"}
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
