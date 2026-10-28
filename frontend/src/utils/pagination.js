export const ELLIPSIS = "ellipsis";

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// Returns an array of page numbers and ELLIPSIS markers, e.g.
// 24 pages, page 5  =  [1, ELLIPSIS, 4, 5, 6, ELLIPSIS, 24]
export function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 0) return [];

  // Case 1: everything fits, no ellipsis needed
  if (totalPages <= 7) return range(1, totalPages);

  const page = Math.min(Math.max(currentPage, 1), totalPages);
  const left = Math.max(page - 1, 1);
  const right = Math.min(page + 1, totalPages);

  // Only show an ellipsis if it would hide at least 2 pages
  const showLeftEllipsis = left > 3;
  const showRightEllipsis = right < totalPages - 2;

  // Case 2: near the start = 1 2 3 4 5 ... last
  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, 5), ELLIPSIS, totalPages];
  }

  // Case 3: near the end = 1 ... last-4 ... last
  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, ELLIPSIS, ...range(totalPages - 4, totalPages)];
  }

  // Case 4: in the middle = 1 ... prev current next ... last
  return [1, ELLIPSIS, ...range(left, right), ELLIPSIS, totalPages];
}