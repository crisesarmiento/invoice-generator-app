"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { resetPasswordAction } from "@/actions/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await resetPasswordAction({ token, password });
      if (!result.success) {
        setError(result.error ?? "Unable to reset password.");
        return;
      }
      setMessage("Password updated. You can sign in now.");
    });
  };

  return (
    <AuthCard
      title="Choose a new password"
      description="Set a new password to access your account."
      footer={
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Ready to sign in?{" "}
          <Link href="/login" className="hover:underline">
            Back to login
          </Link>
        </div>
      }
    >
      {!token ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Missing reset token. Please use the link from your email.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Updating..." : "Update password"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
