/**
 * Money helpers shared by server and client components.
 * Shopify sends `{ amount: "1450.0", currencyCode: "INR" }`; the sample catalogue uses the same shape.
 */
const formatters = new Map();

export function formatMoney(money) {
  if (!money) return "";
  const amount = Number(money.amount);
  const currency = money.currencyCode || "INR";
  const whole = Number.isInteger(amount);
  const key = `${currency}-${whole}`;
  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        minimumFractionDigits: whole ? 0 : 2,
        maximumFractionDigits: 2,
      }),
    );
  }
  return formatters.get(key).format(amount);
}

export function multiplyMoney(money, quantity) {
  return { amount: String(Number(money.amount) * quantity), currencyCode: money.currencyCode };
}
