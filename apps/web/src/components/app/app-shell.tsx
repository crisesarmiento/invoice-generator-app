"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FilePlus2, LogOut, Menu, ReceiptText, UserRound, X } from "lucide-react";
import { signOut } from "next-auth/react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  userName?: string | null;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    href: "/invoices/new",
    label: "New Invoice",
    icon: FilePlus2,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserRound,
  },
];

const pageTitleByPath: Record<string, string> = {
  "/dashboard": "Freelancer Snapshot",
  "/invoices/new": "Create Invoice",
  "/profile": "Business Profile",
};

const isActiveRoute = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const ShellNav = ({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) => (
  <nav className="space-y-2">
    {navItems.map((item) => {
      const Icon = item.icon;
      const active = isActiveRoute(pathname, item.href);

      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition",
            active
              ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--foreground)]"
              : "border-transparent text-[color:var(--muted)] hover:border-[color:var(--border)] hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--foreground)]",
          )}
          onClick={onNavigate}
        >
          <Icon
            className={cn(
              "h-4 w-4 transition",
              active
                ? "text-[color:var(--accent)]"
                : "text-[color:var(--muted)] group-hover:text-[color:var(--foreground)]",
            )}
          />
          <span>{item.label}</span>
        </Link>
      );
    })}
  </nav>
);

export const AppShell = ({ children, userName }: AppShellProps) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = useMemo(() => {
    if (pathname in pageTitleByPath) {
      return pageTitleByPath[pathname]!;
    }
    if (pathname.startsWith("/invoices/")) {
      return "Invoice Workspace";
    }
    return "Invoice Scope";
  }, [pathname]);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(31,141,99,0.15),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(31,141,99,0.11),transparent_32%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(66,211,154,0.19),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(66,211,154,0.13),transparent_32%)]" />

      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-[color:var(--border)] bg-[color:var(--surface)]/85 p-5 backdrop-blur lg:flex">
          <Link
            href="/dashboard"
            className="mb-8 inline-flex items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-2"
          >
            <span className="grid h-7 w-7 place-content-center rounded-lg bg-[color:var(--accent)] text-sm font-semibold text-[color:var(--accent-foreground)]">
              $
            </span>
            <span data-font="display" className="text-base font-semibold">
              Invoice Scope
            </span>
          </Link>

          <ShellNav pathname={pathname} />

          <div className="mt-auto space-y-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Signed in as
            </p>
            <p className="truncate text-sm font-medium text-[color:var(--foreground)]">
              {userName ?? "Freelancer"}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/35 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            />
            <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <span data-font="display" className="text-lg font-semibold">
                  Invoice Scope
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ShellNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:var(--surface)]/85 px-4 py-3 backdrop-blur sm:px-6 lg:px-10">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </Button>

              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Workspace
                </p>
                <h1
                  data-font="display"
                  className="truncate text-xl font-semibold text-[color:var(--foreground)] sm:text-2xl"
                >
                  {pageTitle}
                </h1>
              </div>

              <div className="hidden min-w-56 max-w-72 flex-1 md:block">
                <Input
                  disabled
                  aria-label="Search placeholder"
                  className="text-[color:var(--muted)]"
                  placeholder="Search (coming soon)"
                />
              </div>

              <ThemeToggle />

              <Button asChild size="sm">
                <Link href="/invoices/new">
                  <ReceiptText className="mr-2 h-4 w-4" />
                  New
                </Link>
              </Button>
            </div>
          </header>

          <main className="flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
            <div className="animate-rise-in">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};
