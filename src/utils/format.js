export function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function guestLabel(count) {
  const guests = Number(count) || 0;
  return `${guests} ${guests === 1 ? "guest" : "guests"}`;
}

export function nightLabel(count) {
  const nights = Number(count) || 0;
  return `${nights} ${nights === 1 ? "night" : "nights"}`;
}
