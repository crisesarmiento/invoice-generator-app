\"use server\";

import { z } from "zod";
import { Resend } from "resend";

import { prisma } from "@invoice/db";
import { env } from "@/env";
import { hashPassword } from "@/lib/password";
import { createResetToken, hashToken } from "@/lib/tokens";

const signUpSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

const resetRequestSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(32),
  password: z.string().min(8),
});

export const signUpAction = async (input: z.infer<typeof signUpSchema>) => {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid signup details." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser) {
    return { success: false, error: "Email is already registered." };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
    },
  });

  return { success: true };
};

export const requestPasswordResetAction = async (
  input: z.infer<typeof resetRequestSchema>,
) => {
  const parsed = resetRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid email address." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user) {
    return { success: true };
  }

  const { raw, tokenHash } = createResetToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  const resetUrl = `${env.NEXT_PUBLIC_APP_URL}/reset-password?token=${raw}`;
  const resend = new Resend(env.RESEND_API_KEY);

  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: parsed.data.email,
    subject: "Reset your password",
    text: `Reset your password by visiting: ${resetUrl}`,
  });

  return { success: true };
};

export const resetPasswordAction = async (
  input: z.infer<typeof resetPasswordSchema>,
) => {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid reset details." };
  }

  const tokenHash = hashToken(parsed.data.token);
  const now = new Date();
  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (
    !existingToken ||
    existingToken.usedAt ||
    existingToken.expiresAt < now
  ) {
    return { success: false, error: "Reset token is invalid or expired." };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: existingToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: existingToken.id },
      data: { usedAt: now },
    }),
  ]);

  return { success: true };
};
