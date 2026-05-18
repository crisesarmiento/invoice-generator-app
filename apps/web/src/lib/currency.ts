export const INVOICE_CURRENCY = "USD" as const;
export const INVOICE_CURRENCY_LABEL = "USD";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: INVOICE_CURRENCY,
});

export const formatCurrency = (value: number) => usdFormatter.format(value);

export const hasAtMostTwoDecimalPlaces = (value: number) =>
  Number.isFinite(value) && Number.isInteger(value * 100);

export const calculateLineTotal = (quantity: number, unitPrice: number) =>
  Math.round(quantity * unitPrice * 100) / 100;

export const calculateInvoiceTotal = (
  items: Array<{ lineTotal?: number; quantity?: number; unitPrice?: number }>,
) =>
  Math.round(
    items.reduce((sum, item) => {
      if (typeof item.lineTotal === "number") {
        return sum + item.lineTotal;
      }

      return sum + calculateLineTotal(item.quantity ?? 0, item.unitPrice ?? 0);
    }, 0) * 100,
  ) / 100;
