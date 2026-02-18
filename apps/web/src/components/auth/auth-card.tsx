import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AuthCard = ({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) => (
  <Card className="mx-auto w-full max-w-md border-[color:var(--border)] bg-[color:var(--surface)]/95 shadow-[0_24px_60px_-40px_rgba(10,20,34,0.9)] backdrop-blur">
    <CardHeader>
      <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
        Invoice Scope
      </p>
      <CardTitle className="text-2xl" data-font="display">
        {title}
      </CardTitle>
      {description ? (
        <p className="text-sm text-[color:var(--muted)]">
          {description}
        </p>
      ) : null}
    </CardHeader>
    <CardContent className="space-y-6">
      {children}
      {footer ? <div className="text-sm text-[color:var(--muted)]">{footer}</div> : null}
    </CardContent>
  </Card>
);
