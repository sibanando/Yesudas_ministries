"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  excerpt: z.string().min(1).max(500),
  author: z.string().min(1),
  authorRole: z.string().optional(),
  readTime: z.string().min(1),
  tags: z.string(),
  category: z.enum(["devotional", "testimony", "ministry-update", "teaching"]),
  content: z.string().optional(),
  published: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  id?: string;
  defaultValues?: Partial<FormValues>;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function BlogForm({ id, defaultValues }: BlogFormProps) {
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
      ...defaultValues,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const url = isEdit ? `/api/admin/blog/${id}` : "/api/admin/blog";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json();
      const msg = typeof data.error === "string" ? data.error : "Failed to save post.";
      toast.error(msg);
      return;
    }

    toast.success(isEdit ? "Post updated!" : "Post created!");
    router.push("/admin/blog");
    router.refresh();
  };

  const title = watch("title");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Title" error={errors.title?.message}>
          <input
            {...register("title")}
            onBlur={(e) => {
              if (!isEdit && !watch("slug")) {
                setValue("slug", generateSlug(e.target.value));
              }
            }}
            className={inputCls}
            placeholder="Post title"
          />
        </Field>
        <Field label="Slug" error={errors.slug?.message}>
          <input {...register("slug")} className={inputCls} placeholder="post-slug" />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Date (YYYY-MM-DD)" error={errors.date?.message}>
          <input {...register("date")} className={inputCls} placeholder="2026-01-15" />
        </Field>
        <Field label="Author" error={errors.author?.message}>
          <input {...register("author")} className={inputCls} placeholder="Fr. Yesudas" />
        </Field>
        <Field label="Author Role" error={errors.authorRole?.message}>
          <input {...register("authorRole")} className={inputCls} placeholder="Senior Pastor" />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Read Time" error={errors.readTime?.message}>
          <input {...register("readTime")} className={inputCls} placeholder="5 min read" />
        </Field>
        <Field label="Category" error={errors.category?.message}>
          <select {...register("category")} className={inputCls}>
            <option value="devotional">Devotional</option>
            <option value="teaching">Teaching</option>
            <option value="testimony">Testimony</option>
            <option value="ministry-update">Ministry Update</option>
          </select>
        </Field>
        <Field label="Published">
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input type="checkbox" {...register("published")} className="w-4 h-4 accent-[#1B2A4A]" />
            <span className="text-sm text-gray-700">Published</span>
          </label>
        </Field>
      </div>

      <Field label="Tags (comma-separated)" error={errors.tags?.message}>
        <input
          {...register("tags")}
          className={inputCls}
          placeholder="faith, gospel, prayer"
        />
      </Field>

      <Field label="Excerpt" error={errors.excerpt?.message}>
        <textarea
          {...register("excerpt")}
          rows={3}
          className={inputCls}
          placeholder="Short excerpt for the blog listing..."
        />
      </Field>

      <Field label="Content (HTML)" error={errors.content?.message}>
        <textarea
          {...register("content")}
          rows={16}
          className={`${inputCls} font-mono text-xs`}
          placeholder="<p>Your content here...</p>"
        />
      </Field>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#1B2A4A] hover:bg-[#2a4070] disabled:opacity-60 text-white font-semibold text-sm rounded-lg transition-colors"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Update Post" : "Create Post"}
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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
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
