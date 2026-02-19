export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(31,141,99,0.2),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(31,141,99,0.12),transparent_36%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(66,211,154,0.22),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(66,211,154,0.14),transparent_36%)]" />
      <div className="w-full max-w-4xl">{children}</div>
    </div>
  );
}
