// Parses L_Photos (a JSON string) into an array of valid http(s) URLs.
// Handles null, "", malformed JSON, non-arrays, empty arrays, and junk entries.
export function getPhotos(raw) {
  let list = raw;

  if (typeof raw === "string") {
    if (raw.trim() === "") return [];
    try {
      list = JSON.parse(raw);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(list)) return [];
  return list.filter((url) => typeof url === "string" && /^https?:\/\//i.test(url));
}

export function getFirstPhoto(raw) {
  return getPhotos(raw)[0] ?? null;
}