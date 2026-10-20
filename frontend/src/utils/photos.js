// Returns the first photo URL, or null if there isn't a usable one.
// Handles null, "", malformed JSON, non-arrays, empty arrays, and non-string entries.
export function getFirstPhoto(raw) {
  let list = raw;
    
  if (typeof raw === "string") {
    if (raw.trim() === "") return null;
    try {
      list = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  if (!Array.isArray(list) || list.length === 0) return null;

  const first = list[0];
  if (typeof first !== "string" || !/^https?:\/\//i.test(first)) return null;
  return first;
}