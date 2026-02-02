"use server";

import { z } from "zod";

import { prisma } from "@invoice/db";
import { requireUser } from "@/lib/auth";

const clientSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().optional(),
  phone: z.string().max(40).optional(),
  addressLine1: z.string().max(160).optional(),
  addressLine2: z.string().max(160).optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(80).optional(),
  postalCode: z.string().max(40).optional(),
  country: z.string().max(80).optional(),
  taxId: z.string().max(80).optional(),
});

export const createClientAction = async (
  input: z.infer<typeof clientSchema>,
) => {
  const user = await requireUser();
  const parsed = clientSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid client details." };
  }

  const client = await prisma.client.create({
    data: {
      userId: user.id,
      ...parsed.data,
    },
  });

  return {
    success: true,
    client: {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      addressLine1: client.addressLine1,
      addressLine2: client.addressLine2,
      city: client.city,
      state: client.state,
      postalCode: client.postalCode,
      country: client.country,
      taxId: client.taxId,
    },
  };
};
