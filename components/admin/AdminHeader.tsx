"use client";
import { logoutAction } from "@/lib/actions/auth";
import { LogOut } from "lucide-react";

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="font-heading text-xl font-bold text-[#1B2A4A]">{title}</h1>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </form>
    </header>
  );
}
