import { prisma } from "@invoice/db";

import { InvoiceForm } from "@/components/invoices/invoice-form";
import { requireUser } from "@/lib/auth";

export default async function NewInvoicePage() {
  const user = await requireUser();
  const [clients, profile] = await Promise.all([
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
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New invoice</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Create a new invoice and send it to your client.
        </p>
      </div>
      <InvoiceForm
        clients={clients}
        defaults={{
          defaultNotes: profile?.defaultNotes ?? null,
          defaultTerms: profile?.defaultTerms ?? null,
          defaultDueDays: profile?.defaultDueDays ?? 14,
        }}
      />
    </div>
  );
}
