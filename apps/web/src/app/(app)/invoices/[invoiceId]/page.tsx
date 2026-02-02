import { notFound } from "next/navigation";

import { prisma } from "@invoice/db";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { requireUser } from "@/lib/auth";

export default async function EditInvoicePage({
  params,
}: {
  params: { invoiceId: string };
}) {
  const user = await requireUser();
  const [clients, profile, invoice] = await Promise.all([
    prisma.client.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        taxId: true,
      },
    }),
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.invoice.findFirst({
      where: { id: params.invoiceId, userId: user.id },
      include: { items: { orderBy: { position: "asc" } } },
    }),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit invoice</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Update the invoice details and line items.
        </p>
      </div>
      <InvoiceForm
        clients={clients}
        defaults={{
          defaultNotes: profile?.defaultNotes ?? null,
          defaultTerms: profile?.defaultTerms ?? null,
          defaultDueDays: profile?.defaultDueDays ?? 14,
        }}
        invoice={{
          id: invoice.id,
          clientId: invoice.clientId,
          issueDate: invoice.issueDate.toISOString().slice(0, 10),
          dueDate: invoice.dueDate.toISOString().slice(0, 10),
          status: invoice.status,
          notes: invoice.notes,
          terms: invoice.terms,
          items: invoice.items.map((item) => ({
            description: item.description,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          })),
        }}
      />
    </div>
  );
}
