import { NextResponse } from "next/server";
import { format } from "date-fns";
import { renderToBuffer } from "@react-pdf/renderer";

import { auth } from "@/auth";
import { prisma } from "@invoice/db";
import { InvoicePdf } from "@/lib/pdf/invoice-pdf";
import { formatCurrency } from "@/lib/format";

const sanitizeFilename = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const GET = async (
  request: Request,
  { params }: { params: { invoiceId: string } },
) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id: params.invoiceId, userId: session.user.id },
    include: {
      client: true,
      items: { orderBy: { position: "asc" } },
      user: { include: { profile: true } },
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const total = invoice.items.reduce(
    (sum, item) => sum + Number(item.lineTotal),
    0,
  );

  const invoiceNumber = invoice.number.toString().padStart(3, "0");
  const pdfBuffer = await renderToBuffer(
    <InvoicePdf
      data={{
        invoiceNumber,
        issueDate: format(invoice.issueDate, "MMM dd, yyyy"),
        dueDate: format(invoice.dueDate, "MMM dd, yyyy"),
        status: invoice.status,
        company: {
          name: invoice.user.profile?.companyName ?? invoice.user.name,
          fullName: invoice.user.profile?.fullName ?? invoice.user.name,
          email: invoice.user.profile?.billingEmail ?? invoice.user.email,
          phone: invoice.user.profile?.phone,
          address: [
            invoice.user.profile?.addressLine1,
            invoice.user.profile?.addressLine2,
            invoice.user.profile?.city,
            invoice.user.profile?.state,
            invoice.user.profile?.postalCode,
            invoice.user.profile?.country,
          ]
            .filter(Boolean)
            .join(", "),
          taxId: invoice.user.profile?.taxId,
        },
        client: {
          name: invoice.client.name,
          email: invoice.client.email,
          phone: invoice.client.phone,
          address: [
            invoice.client.addressLine1,
            invoice.client.addressLine2,
            invoice.client.city,
            invoice.client.state,
            invoice.client.postalCode,
            invoice.client.country,
          ]
            .filter(Boolean)
            .join(", "),
          taxId: invoice.client.taxId,
        },
        items: invoice.items.map((item) => ({
          description: item.description,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          lineTotal: Number(item.lineTotal),
        })),
        total: formatCurrency(total),
        notes: invoice.notes,
        terms: invoice.terms,
      }}
    />,
  );

  const clientSlug = sanitizeFilename(invoice.client.name) || "Client";
  const dateSlug = format(invoice.issueDate, "yyyy-MM-dd");
  const filename = `Invoice-${invoiceNumber}-${clientSlug}-${dateSlug}.pdf`;

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
};
