"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1).max(200),
  role: z.string().min(1),
  bio: z.string().min(1),
  imageUrl: z.string().min(1),
  email: z.string().optional(),
  sortOrder: z.number().int(),
});

type FormValues = z.infer<typeof formSchema>;

interface TeamMemberFormProps {
  id?: string;
  defaultValues?: Partial<FormValues>;
}

export function TeamMemberForm({ id, defaultValues }: TeamMemberFormProps) {
  const router = useRouter();
  const isEdit = Boolean(id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { sortOrder: 0, ...defaultValues },
  });

  const onSubmit = async (values: FormValues) => {
    const url = isEdit ? `/api/admin/team/${id}` : "/api/admin/team";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error?.message ?? "Failed to save team member.");
      return;
    }

    toast.success(isEdit ? "Team member updated!" : "Team member added!");
    router.push("/admin/team");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-xl">
      <Field label="Name" error={errors.name?.message}>
        <input {...register("name")} className={inputCls} placeholder="Fr. Yesudas" />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Role" error={errors.role?.message}>
          <input {...register("role")} className={inputCls} placeholder="Senior Pastor" />
        </Field>
        <Field label="Sort Order" error={errors.sortOrder?.message}>
          <input {...register("sortOrder", { valueAsNumber: true })} type="number" className={inputCls} />
        </Field>
      </div>

      <Field label="Bio" error={errors.bio?.message}>
        <textarea {...register("bio")} rows={4} className={inputCls} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Image URL" error={errors.imageUrl?.message}>
          <input {...register("imageUrl")} className={inputCls} placeholder="/images/team/name.jpg" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input {...register("email")} className={inputCls} placeholder="optional@email.com" />
        </Field>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#1B2A4A] hover:bg-[#2a4070] disabled:opacity-60 text-white font-semibold text-sm rounded-lg transition-colors"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Update Member" : "Add Member"}
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
