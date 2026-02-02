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
  <Card className="w-full max-w-md shadow-xl">
    <CardHeader>
      <CardTitle className="text-2xl">{title}</CardTitle>
      {description ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      ) : null}
    </CardHeader>
    <CardContent className="space-y-6">
      {children}
      {footer ? <div className="text-sm text-slate-500">{footer}</div> : null}
    </CardContent>
  </Card>
);
