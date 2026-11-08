import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function Lightbox({ photos, index, onIndexChange, onClose, alt }) {
  const overlayRef = useRef(null);
  const [failed, setFailed] = useState({});
  const count = photos.length;
  const current = photos[index];

  const prev = () => onIndexChange((index - 1 + count) % count);
  const next = () => onIndexChange((index + 1) % count);

  // A <div> is not focusable by default, so it never receives keyboard events.
  // tabIndex={-1} makes it focusable, and we focus it as soon as the lightbox opens.
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    overlayRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // stop the page scrolling behind it

    return () => {
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
  };

  // Only a click on the dark backdrop itself closes it
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      ref={overlayRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
    >
      <button type="button" className="lightbox__close" aria-label="Close" onClick={onClose}>
        ×
      </button>

      {failed[current] ? (
        <p className="lightbox__fallback">Photo unavailable</p>
      ) : (
        <img
          className="lightbox__img"
          src={current}
          alt={`${alt} (photo ${index + 1} of ${count})`}
          referrerPolicy="no-referrer"
          onError={() => setFailed((f) => ({ ...f, [current]: true }))}
        />
      )}

      {count > 1 && (
        <>
          <button type="button" className="lightbox__btn lightbox__btn--prev"
            aria-label="Previous photo" onClick={prev}>
            ‹
          </button>
          <button type="button" className="lightbox__btn lightbox__btn--next"
            aria-label="Next photo" onClick={next}>
            ›
          </button>
          <span className="lightbox__counter">{index + 1} / {count}</span>
        </>
      )}
    </div>,
    document.body
  );
}