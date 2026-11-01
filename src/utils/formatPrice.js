const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currencyWithDecimalsFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(amount, includeDecimals = false) {
  const numeric = Number(amount) || 0;
  return includeDecimals
    ? currencyWithDecimalsFormatter.format(numeric)
    : currencyFormatter.format(numeric);
}

export default formatPrice;

