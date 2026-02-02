"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import { requestPasswordResetAction } from "@/actions/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");

    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await requestPasswordResetAction({ email });
      if (!result.success) {
        setError(result.error ?? "Unable to send reset email.");
        return;
      }
      setMessage("Check your inbox for a reset link.");
    });
  };

  return (
    <AuthCard
      title="Reset your password"
      description="We'll email you a link to reset your password."
      footer={
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Remembered your password?{" "}
          <Link href="/login" className="hover:underline">
            Sign in
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </AuthCard>
  );
}
