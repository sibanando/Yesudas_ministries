"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormField, inputCls } from "@/components/admin/FormField";

const formSchema = z.object({
  videoId: z.string().min(1, "YouTube video ID is required"),
  title: z.string().min(1).max(300),
  description: z.string().min(1),
  thumbnailUrl: z.string().min(1),
  publishedAt: z.string().min(1),
  duration: z.string().optional(),
  tags: z.string(),
  series: z.string().optional(),
  viewCount: z.string().optional(),
  published: z.boolean(),
  sortOrder: z.number().int(),
});

type FormValues = z.infer<typeof formSchema>;

interface SermonFormProps {
  id?: string;
  defaultValues?: Partial<FormValues>;
}

export function SermonForm({ id, defaultValues }: SermonFormProps) {
  const router = useRouter();
  const isEdit = Boolean(id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      published: true,
      sortOrder: 0,
      ...defaultValues,
    },
  });

  const videoId = watch("videoId");

  const onSubmit = async (values: FormValues) => {
    const url = isEdit ? `/api/admin/sermons/${id}` : "/api/admin/sermons";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json();
      const msg = typeof data.error === "string" ? data.error : "Failed to save sermon.";
      toast.error(msg);
      return;
    }

    toast.success(isEdit ? "Sermon updated!" : "Sermon created!");
    router.push("/admin/sermons");
    router.refresh();
  };

  const handleAutoFill = () => {
    const vid = watch("videoId");
    if (vid) {
      setValue("thumbnailUrl", `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="YouTube Video ID" error={errors.videoId?.message}>
          <div className="flex gap-2">
            <input {...register("videoId")} className={inputCls} placeholder="dQw4w9WgXcQ" />
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Auto-fill thumbnail
            </button>
          </div>
        </FormField>
        <FormField label="Title" error={errors.title?.message}>
          <input {...register("title")} className={inputCls} placeholder="Sermon title" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Published Date" error={errors.publishedAt?.message}>
          <input {...register("publishedAt")} className={inputCls} placeholder="2026-03-23T10:00:00Z" />
        </FormField>
        <FormField label="Duration" error={errors.duration?.message}>
          <input {...register("duration")} className={inputCls} placeholder="52:18" />
        </FormField>
        <FormField label="Series" error={errors.series?.message}>
          <input {...register("series")} className={inputCls} placeholder="Gospel of John" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Thumbnail URL" error={errors.thumbnailUrl?.message}>
          <input {...register("thumbnailUrl")} className={inputCls} placeholder="https://i.ytimg.com/vi/.../hqdefault.jpg" />
        </FormField>
        <FormField label="View Count" error={errors.viewCount?.message}>
          <input {...register("viewCount")} className={inputCls} placeholder="12345" />
        </FormField>
        <FormField label="Sort Order" error={errors.sortOrder?.message}>
          <input type="number" {...register("sortOrder", { valueAsNumber: true })} className={inputCls} placeholder="0" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Tags (comma-separated)" error={errors.tags?.message}>
          <input {...register("tags")} className={inputCls} placeholder="faith, gospel, prayer" />
        </FormField>
        <FormField label="Published">
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input type="checkbox" {...register("published")} className="w-4 h-4 accent-[#1B2A4A]" />
            <span className="text-sm text-gray-700">Published</span>
          </label>
        </FormField>
      </div>

      <FormField label="Description" error={errors.description?.message}>
        <textarea {...register("description")} rows={5} className={inputCls} placeholder="Sermon description..." />
      </FormField>

      {videoId && (
        <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
          <p className="text-xs font-medium text-gray-500 mb-2">YouTube Preview</p>
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt="Thumbnail preview"
            className="rounded-lg max-w-xs"
          />
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#1B2A4A] hover:bg-[#2a4070] disabled:opacity-60 text-white font-semibold text-sm rounded-lg transition-colors"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Update Sermon" : "Create Sermon"}
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
