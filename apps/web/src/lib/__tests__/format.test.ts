import { formatCurrency, formatDate } from "@/lib/format";

describe("format helpers", () => {
  it("formats currency with USD symbol", () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain("$");
    expect(result).toContain("1,234");
  });

  it("formats dates in a human readable format", () => {
    const result = formatDate(new Date("2026-01-15T00:00:00.000Z"));
    expect(result).toContain("Jan");
    expect(result).toContain("2026");
  });
});
