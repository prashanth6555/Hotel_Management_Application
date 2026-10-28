export function amenityIcon(label) {
  const name = label.toLowerCase();
  if (name.includes("wi-fi") || name.includes("wifi")) return "wifi";
  if (name.includes("pool")) return "pool";
  if (name.includes("spa")) return "spa";
  if (name.includes("breakfast")) return "breakfast";
  if (name.includes("parking")) return "parking";
  if (name.includes("air")) return "ac";
  if (name.includes("gym")) return "gym";
  if (name.includes("beach")) return "beach";
  if (name.includes("fire")) return "fire";
  if (name.includes("concierge")) return "bell";
  if (name.includes("transfer") || name.includes("airport")) return "car";
  if (name.includes("kitchen")) return "kitchen";
  return "check";
}
