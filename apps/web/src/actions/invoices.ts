"use server";

import { z } from "zod";

import { InvoiceStatus, Prisma, prisma } from "@invoice/db";
import { requireUser } from "@/lib/auth";

const invoiceItemSchema = z.object({
  description: z.string().min(2).max(240),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().nonnegative(),
});

const invoiceSchema = z.object({
  clientId: z.string().min(1),
  issueDate: z.string(),
  dueDate: z.string(),
  status: z.nativeEnum(InvoiceStatus),
  notes: z.string().max(2000).optional(),
  terms: z.string().max(2000).optional(),
  items: z.array(invoiceItemSchema).min(1),
});

const toDecimal = (value: number) => new Prisma.Decimal(value);

export const createInvoiceAction = async (
  input: z.infer<typeof invoiceSchema>,
) => {
  const user = await requireUser();
  const parsed = invoiceSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid invoice details." };
  }

  const issueDate = new Date(parsed.data.issueDate);
  const dueDate = new Date(parsed.data.dueDate);

  const client = await prisma.client.findFirst({
    where: { id: parsed.data.clientId, userId: user.id },
  });

  if (!client) {
    return { success: false, error: "Client not found." };
  }

  const invoice = await prisma.$transaction(async (tx) => {
    const series = await tx.invoiceNumberSeries.upsert({
      where: { clientId: parsed.data.clientId },
      update: { nextNumber: { increment: 1 } },
      create: {
        clientId: parsed.data.clientId,
        nextNumber: 2,
      },
    });

    const invoiceNumber = series.nextNumber - 1;

    return tx.invoice.create({
      data: {
        userId: user.id,
        clientId: parsed.data.clientId,
        number: invoiceNumber,
        status: parsed.data.status,
        issueDate,
        dueDate,
        notes: parsed.data.notes,
        terms: parsed.data.terms,
        items: {
          create: parsed.data.items.map((item, index) => ({
            description: item.description,
            quantity: toDecimal(item.quantity),
            unitPrice: toDecimal(item.unitPrice),
            lineTotal: toDecimal(item.quantity * item.unitPrice),
            position: index + 1,
          })),
        },
      },
    });
  });

  return { success: true, invoiceId: invoice.id };
};

export const updateInvoiceAction = async (
  invoiceId: string,
  input: z.infer<typeof invoiceSchema>,
) => {
  const user = await requireUser();
  const parsed = invoiceSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid invoice details." };
  }

  const existingInvoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId: user.id },
  });

  if (!existingInvoice) {
    return { success: false, error: "Invoice not found." };
  }

  const issueDate = new Date(parsed.data.issueDate);
  const dueDate = new Date(parsed.data.dueDate);

  const client = await prisma.client.findFirst({
    where: { id: parsed.data.clientId, userId: user.id },
  });

  if (!client) {
    return { success: false, error: "Client not found." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        clientId: parsed.data.clientId,
        status: parsed.data.status,
        issueDate,
        dueDate,
        notes: parsed.data.notes,
        terms: parsed.data.terms,
      },
    });

    await tx.invoiceItem.deleteMany({ where: { invoiceId } });

    await tx.invoiceItem.createMany({
      data: parsed.data.items.map((item, index) => ({
        invoiceId,
        description: item.description,
        quantity: toDecimal(item.quantity),
        unitPrice: toDecimal(item.unitPrice),
        lineTotal: toDecimal(item.quantity * item.unitPrice),
        position: index + 1,
      })),
    });
  });

  return { success: true };
};
