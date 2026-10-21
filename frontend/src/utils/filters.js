// Trims values and drops anything empty so blank filters are never sent to the API.
export function cleanFilters(values) {
  const out = {};
  for (const [key, value] of Object.entries(values)) {
    const v = typeof value === "string" ? value.trim() : value;
    if (v !== "" && v !== null && v !== undefined) out[key] = v;
  }
  return out;
}