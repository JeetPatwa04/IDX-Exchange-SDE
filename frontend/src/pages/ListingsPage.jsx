import { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import "./ListingsPage.css";

const PAGE_SIZE = 20;

export default function ListingsPage() {
  const [appliedFilters, setAppliedFilters] = useState({});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // set to true when these filters are replaced
    setLoading(true);
    setError(null);

    fetchProperties({ ...appliedFilters, limit: PAGE_SIZE, offset: 0 })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [appliedFilters]);

  return (
    <main className="listings-page">
      <h1>IDX Exchange - Property Listings</h1>

      <PropertyFilters
        onSearch={(filters) => setAppliedFilters(filters)}
        onClear={() => setAppliedFilters({})}
      />

      {loading && <p className="listings-status">Loading properties…</p>}

      {error && (
        <div className="listings-error" role="alert">
          <strong>Something went wrong.</strong> {error}
        </div>
      )}

      {data && !loading && !error &&
        (data.results.length === 0 ? (
          <div className="listings-empty">
            <p><strong>No properties found.</strong></p>
            <p>Try widening your price range, removing a filter, or clearing all filters.</p>
          </div>
        ) : (
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
        ))}
    </main>
  );
}