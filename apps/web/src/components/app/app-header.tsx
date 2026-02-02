"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export const AppHeader = ({ userName }: { userName?: string | null }) => (
  <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="text-lg font-semibold">
          Invoice Studio
        </Link>
        <nav className="hidden items-center gap-4 text-sm text-slate-600 dark:text-slate-300 sm:flex">
          <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-white">
            Dashboard
          </Link>
          <Link href="/invoices/new" className="hover:text-slate-900 dark:hover:text-white">
            New Invoice
          </Link>
          <Link href="/profile" className="hover:text-slate-900 dark:hover:text-white">
            Profile
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
          {userName}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Sign out
        </Button>
      </div>
    </div>
  </header>
);
