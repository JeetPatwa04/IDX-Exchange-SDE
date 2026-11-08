import "./PropertyMap.css";

// Converts "34.099106000000000" -> 34.099106. Treats null, "" and junk as missing
// (Number(null) is 0, so null must be checked first).
function toCoord(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function PropertyMap({ lat, lng, title = "Property location" }) {
  const latitude = toCoord(lat);
  const longitude = toCoord(lng);

  // Only render when both coordinates are present (0,0 is treated as "no data")
  if (latitude === null || longitude === null) return null;
  if (latitude === 0 && longitude === 0) return null;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const point = `${latitude},${longitude}`;
  const embedUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey)}&q=${point}&zoom=15`
    : null;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${point}`;

  return (
    <section className="property-map">
      <h2>Location</h2>
      {embedUrl ? (
        <iframe
          className="property-map__frame"
          title={title}
          src={embedUrl}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="property-map__missing">
          Map unavailable. Add VITE_GOOGLE_MAPS_API_KEY to frontend/.env and restart the dev server.
        </div>
      )}
      <a
        className="property-map__directions"
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Get Directions
      </a>
    </section>
  );
}