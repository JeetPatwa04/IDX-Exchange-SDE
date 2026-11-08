import { useEffect, useState } from "react";
import { fetchOpenHouses } from "../api/client";
import { formatDate, formatTime, getRemarks } from "../utils/openHouse";
import "./OpenHouses.css";

export default function OpenHouses({ listingId }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setRows(null);
    setError(null);

    fetchOpenHouses(listingId)
      .then((result) => {
        if (!cancelled) setRows(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [listingId]);

  if (error) {
    return (
      <p className="open-houses__message" role="alert">
        Couldn't load open houses: {error}
      </p>
    );
  }
  if (rows === null) return <p className="open-houses__message">Loading open houses…</p>;
  if (rows.length === 0) return <p className="open-houses__message">No open houses scheduled</p>;

  return (
    <ul className="open-houses">
      {rows.map((row) => {
        const remarks = getRemarks(row);
        return (
          <li key={row.id} className="open-house">
            <p className="open-house__date">{formatDate(row.OpenHouseDate)}</p>
            <p className="open-house__time">
              {formatTime(row.OH_StartTime)} – {formatTime(row.OH_EndTime)}
            </p>
            {remarks && <p className="open-house__remarks">{remarks}</p>}
          </li>
        );
      })}
    </ul>
  );
}