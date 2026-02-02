"use server";

import { z } from "zod";

import { prisma } from "@invoice/db";
import { requireUser } from "@/lib/auth";

const profileSchema = z.object({
  fullName: z.string().min(2).max(120).optional(),
  companyName: z.string().min(2).max(120).optional(),
  addressLine1: z.string().max(160).optional(),
  addressLine2: z.string().max(160).optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(80).optional(),
  postalCode: z.string().max(40).optional(),
  country: z.string().max(80).optional(),
  phone: z.string().max(40).optional(),
  billingEmail: z.string().email().optional(),
  taxId: z.string().max(80).optional(),
  defaultTerms: z.string().max(2000).optional(),
  defaultNotes: z.string().max(2000).optional(),
  defaultDueDays: z.coerce.number().int().min(1).max(365).optional(),
});

export const saveProfileAction = async (
  input: z.infer<typeof profileSchema>,
) => {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid profile details." };
  }

  await prisma.profile.upsert({
    where: { userId: user.id },
    update: parsed.data,
    create: {
      userId: user.id,
      ...parsed.data,
    },
  });

  return { success: true };
};
