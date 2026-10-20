async function request(path) {
  let res;
  try {
    res = await fetch(path);
  } catch {
    throw new Error("Cannot reach the server. Check your connection and try again.");
  }

  if (!res.ok) {
    let body = null;
    try {
      body = await res.json();
    } catch {
      // response was not JSON
    }
    if (body && body.error) throw new Error(body.error);
    if (res.status >= 500) {
      throw new Error("Cannot reach the server. Is the backend running?");
    }
    throw new Error(`Request failed (${res.status})`);
  }

  return res.json();
}

export function fetchProperties(params = {}) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") qs.set(key, value);
  }
  const query = qs.toString();
  return request(`/api/properties${query ? `?${query}` : ""}`);
}

export function fetchPropertyDetail(id) {
  return request(`/api/properties/${encodeURIComponent(id)}`);
}