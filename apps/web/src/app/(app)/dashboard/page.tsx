import Link from "next/link";
import { format } from "date-fns";

import { prisma } from "@invoice/db";
import { DashboardMetrics } from "@/components/dashboard/metrics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();
  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    include: {
      client: true,
      items: true,
    },
    orderBy: {
      issueDate: "desc",
    },
  });

  const enrichedInvoices = invoices.map((invoice) => {
    const total = invoice.items.reduce(
      (sum, item) => sum + Number(item.lineTotal),
      0,
    );
    return { ...invoice, total };
  });

  const byClient = new Map<string, { name: string; total: number }>();
  const byMonth = new Map<string, { name: string; total: number }>();
  const byYear = new Map<string, { name: string; total: number }>();

  enrichedInvoices.forEach((invoice) => {
    const clientKey = invoice.clientId;
    const clientMetric = byClient.get(clientKey) ?? {
      name: invoice.client.name,
      total: 0,
    };
    clientMetric.total += invoice.total;
    byClient.set(clientKey, clientMetric);

    const monthKey = format(invoice.issueDate, "yyyy-MM");
    const monthMetric = byMonth.get(monthKey) ?? {
      name: format(invoice.issueDate, "MMM yyyy"),
      total: 0,
    };
    monthMetric.total += invoice.total;
    byMonth.set(monthKey, monthMetric);

    const yearKey = format(invoice.issueDate, "yyyy");
    const yearMetric = byYear.get(yearKey) ?? {
      name: yearKey,
      total: 0,
    };
    yearMetric.total += invoice.total;
    byYear.set(yearKey, yearMetric);
  });

  const groupedByClient = new Map<string, typeof enrichedInvoices>();
  enrichedInvoices.forEach((invoice) => {
    const list = groupedByClient.get(invoice.clientId) ?? [];
    list.push(invoice);
    groupedByClient.set(invoice.clientId, list);
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track your invoices and revenue trends.
          </p>
        </div>
        <Button asChild>
          <Link href="/invoices/new">New invoice</Link>
        </Button>
      </div>

      <DashboardMetrics
        byClient={[...byClient.values()].sort((a, b) => b.total - a.total)}
        byMonth={Array.from(byMonth.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map((entry) => entry[1])}
        byYear={Array.from(byYear.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map((entry) => entry[1])}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoices by client</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {groupedByClient.size === 0 ? (
            <div className="rounded-md border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              No invoices yet. Create your first invoice to see it here.
            </div>
          ) : (
            [...groupedByClient.values()].map((clientInvoices) => {
              const clientName = clientInvoices[0].client.name;
              return (
                <div key={clientInvoices[0].clientId} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {clientName}
                    </h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            #{invoice.number.toString().padStart(3, "0")}
                          </TableCell>
                          <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                          <TableCell>{formatCurrency(invoice.total)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                invoice.status === "PAID"
                                  ? "success"
                                  : invoice.status === "OVERDUE"
                                    ? "warning"
                                    : "default"
                              }
                            >
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/invoices/${invoice.id}`}>Edit</Link>
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <a
                                  href={`/api/invoices/${invoice.id}/pdf`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  PDF
                                </a>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
