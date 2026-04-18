import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/session";

const COOKIE_NAME = "admin_session";

export const verifyAdminSession = cache(async (): Promise<{ adminId: string }> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const payload = await decrypt(token);
  if (!payload?.adminId) {
    redirect("/admin/login");
  }
  return { adminId: payload.adminId };
});

export const verifyAdminSessionForApi = cache(async (): Promise<{ adminId: string } | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const payload = await decrypt(token);
  if (!payload?.adminId) return null;
  return { adminId: payload.adminId };
});
