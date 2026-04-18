"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to subscribe.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section className="py-14 lg:py-20 bg-[#1B2A4A]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4A853]/20 mx-auto mb-5">
            <Mail className="h-6 w-6 text-[#D4A853]" />
          </div>

          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-3">
            Stay Connected
          </h2>
          <p className="font-body text-white/70 text-base mb-8 leading-relaxed">
            Receive devotionals, ministry updates, and event reminders straight to
            your inbox. No spam — just encouragement.
          </p>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <CheckCircle className="h-10 w-10 text-[#D4A853]" />
              <p className="font-body text-white font-semibold text-lg">
                You&apos;re subscribed!
              </p>
              <p className="font-body text-white/60 text-sm">
                Thank you. We&apos;ll be in touch with encouraging content.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#D4A853] focus:ring-[#D4A853]"
              />
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#D4A853] focus:ring-[#D4A853]"
              />
              <Button
                type="submit"
                disabled={status === "loading"}
                className="bg-[#D4A853] hover:bg-[#e8c27a] text-[#1B2A4A] font-semibold shrink-0 px-6"
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm font-body text-red-400">{errorMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
}
