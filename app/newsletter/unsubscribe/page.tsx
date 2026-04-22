"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (!email) return;
    setStatus("loading");
    fetch("/api/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => setStatus(data.success ? "success" : "error"))
      .catch(() => setStatus("error"));
  }, [email]);

  if (!email) {
    return <p className="font-body text-gray-500">Invalid unsubscribe link.</p>;
  }

  if (status === "loading") {
    return <p className="font-body text-gray-500">Processing your request...</p>;
  }

  if (status === "success") {
    return (
      <>
        <p className="font-body text-gray-600 mb-2">
          You have been unsubscribed from the Fr. Yesudas Ministries newsletter.
        </p>
        <p className="font-body text-gray-400 text-sm">
          We&apos;re sorry to see you go. You can always re-subscribe on our website.
        </p>
      </>
    );
  }

  if (status === "error") {
    return (
      <p className="font-body text-red-500">
        Something went wrong. Please try again or contact us directly.
      </p>
    );
  }

  return null;
}

export default function UnsubscribePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="max-w-md">
        <h1 className="font-heading text-3xl font-bold text-[#1B2A4A] mb-4">
          Newsletter Unsubscribe
        </h1>
        <Suspense fallback={<p className="font-body text-gray-500">Loading...</p>}>
          <UnsubscribeContent />
        </Suspense>
      </div>
    </div>
  );
}
