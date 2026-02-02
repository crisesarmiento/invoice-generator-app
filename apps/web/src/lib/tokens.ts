import { createHash, randomBytes } from "crypto";

export const hashToken = (raw: string) =>
  createHash("sha256").update(raw).digest("hex");

export const createResetToken = () => {
  const raw = randomBytes(32).toString("hex");
  const tokenHash = hashToken(raw);
  return { raw, tokenHash };
};
