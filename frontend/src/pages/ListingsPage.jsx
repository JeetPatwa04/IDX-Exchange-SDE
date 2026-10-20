import { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import "./ListingsPage.css";

const PAGE_SIZE = 20;

export default function ListingsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProperties({ limit: PAGE_SIZE, offset: 0 })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="listings-page">
      <h1>Property Listings</h1>

      {loading && <p className="listings-status">Loading properties…</p>}

      {error && (
        <div className="listings-error" role="alert">
          <strong>Something went wrong.</strong> {error}
        </div>
      )}

      {data && !loading && !error && (
        <>
          <p className="listings-count">
            Showing {data.results.length} of {data.total.toLocaleString()} properties
          </p>
          <div className="listings-grid">
            {data.results.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}