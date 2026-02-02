import { createResetToken, hashToken } from "@/lib/tokens";

describe("reset tokens", () => {
  it("hashes a reset token deterministically", () => {
    const { raw, tokenHash } = createResetToken();
    expect(hashToken(raw)).toBe(tokenHash);
  });

  it("creates unique token values", () => {
    const first = createResetToken();
    const second = createResetToken();
    expect(first.raw).not.toBe(second.raw);
    expect(first.tokenHash).not.toBe(second.tokenHash);
  });
});
