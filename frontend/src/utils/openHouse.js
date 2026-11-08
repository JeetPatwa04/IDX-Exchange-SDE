// Remarks live INSIDE the all_data JSON string, not in their own column.
// Parse it, then read the OpenHouseRemarks key. Never throws.
export function getRemarks(row) {
  if (!row || typeof row.all_data !== "string") return null;
  try {
    const remarks = JSON.parse(row.all_data)?.OpenHouseRemarks;
    return typeof remarks === "string" && remarks.trim() !== "" ? remarks.trim() : null;
  } catch {
    return null;
  }
}

// Convert military time to 12-hour format
export function formatTime(value) {
  const m = typeof value === "string" ? value.match(/^(\d{1,2}):(\d{2})/) : null;
  if (!m || Number(m[1]) > 23) return "TBD";
  const hour = Number(m[1]);
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m[2]} ${hour >= 12 ? "PM" : "AM"}`;
}

// Reads the date portion of "2027-01-16" or "2027-01-16T06:00:00.000Z" and builds a
// local date from it, so the browser's timezone can't shift the day.
export function formatDate(value) {
  const m = typeof value === "string" ? value.match(/^(\d{4})-(\d{2})-(\d{2})/) : null;
  if (!m) return "Date TBD";
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}