import { verifyAdminSession } from "@/lib/dal";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function NewBlogPage() {
  await verifyAdminSession();
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="New Blog Post" />
        <main className="flex-1 p-6">
          <BlogForm />
        </main>
      </div>
    </div>
  );
}
