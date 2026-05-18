export { formatCurrency, INVOICE_CURRENCY, INVOICE_CURRENCY_LABEL } from "./currency";

export const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(value);
