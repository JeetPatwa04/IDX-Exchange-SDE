import { getPageNumbers, ELLIPSIS } from "../utils/pagination";
import "./Pagination.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Pagination is hidden when there is only one page
  if (totalPages <= 1) return null;

  const items = getPageNumbers(currentPage, totalPages);

  const go = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination__btn"
        onClick={() => go(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </button>

      {items.map((item, index) =>
        item === ELLIPSIS ? (
          <span key={`ellipsis-${index}`} className="pagination__ellipsis">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`pagination__btn${item === currentPage ? " pagination__btn--active" : ""}`}
            aria-label={`Page ${item}`}
            aria-current={item === currentPage ? "page" : undefined}
            onClick={() => go(item)}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        className="pagination__btn"
        onClick={() => go(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
    </nav>
  );
}