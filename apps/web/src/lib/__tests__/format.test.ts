import {
  calculateInvoiceTotal,
  calculateLineTotal,
  formatCurrency,
  hasAtMostTwoDecimalPlaces,
  INVOICE_CURRENCY,
} from "@/lib/currency";
import { formatDate } from "@/lib/format";

describe("format helpers", () => {
  it("formats currency as USD", () => {
    const result = formatCurrency(1234.56);

    expect(INVOICE_CURRENCY).toBe("USD");
    expect(result).toBe("$1,234.56");
  });

  it("rounds invoice line totals to USD cents", () => {
    expect(calculateLineTotal(3, 19.995)).toBe(59.99);
    expect(calculateLineTotal(2, 10.125)).toBe(20.25);
  });

  it("calculates invoice totals from USD line totals", () => {
    expect(
      calculateInvoiceTotal([
        { lineTotal: 25.5 },
        { quantity: 2, unitPrice: 19.99 },
      ]),
    ).toBe(65.48);
  });

  it("validates USD cents precision", () => {
    expect(hasAtMostTwoDecimalPlaces(12.34)).toBe(true);
    expect(hasAtMostTwoDecimalPlaces(12.345)).toBe(false);
    expect(hasAtMostTwoDecimalPlaces(Number.NaN)).toBe(false);
  });

  it("formats dates in a human readable format", () => {
    const result = formatDate(new Date("2026-01-15T00:00:00.000Z"));
    expect(result).toContain("Jan");
    expect(result).toContain("2026");
  });
});
