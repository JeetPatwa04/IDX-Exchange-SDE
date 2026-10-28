import { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import Pagination from "../components/Pagination";
import "./ListingsPage.css";

export default function ListingsPage() {
  const [appliedFilters, setAppliedFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // ignore responses for requests that were replaced
    setLoading(true);
    setError(null);

    fetchProperties({
      ...appliedFilters,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    })
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
  }, [appliedFilters, currentPage, itemsPerPage]);

  // New filters always go back to page 1 (both updates are batched into one fetch)
  const handleSearch = (filters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setAppliedFilters({});
    setCurrentPage(1);
  };

  // Filters stay in appliedFilters, so changing the page keeps them
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const totalPages = data ? Math.ceil(data.total / itemsPerPage) : 0;
  const firstShown = data ? data.offset + 1 : 0;
  const lastShown = data ? data.offset + data.results.length : 0;

  return (
    <main className="listings-page">
      <h1>Property Listings</h1>

      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />

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
              Showing {firstShown.toLocaleString()}-{lastShown.toLocaleString()} of{" "}
              {data.total.toLocaleString()} properties
            </p>
            <div className="listings-grid">
              {data.results.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ))}
    </main>
  );
}