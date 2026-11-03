import { useMemo, useState } from "react";
import { getPhotos } from "../utils/photos";
import "./PropertyImageCarousel.css";

export default function PropertyImageCarousel({ photos, alt = "Property photo" }) {
  const urls = useMemo(() => getPhotos(photos), [photos]);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState({});

  if (urls.length === 0) {
    return <div className="carousel carousel--empty">No photo available</div>;
  }

  const safeIndex = Math.min(index, urls.length - 1);
  const current = urls[safeIndex];

  // stopPropagation keeps arrow clicks from triggering the card's navigation
  const step = (e, delta) => {
    e.stopPropagation();
    e.preventDefault();
    setIndex((safeIndex + delta + urls.length) % urls.length);
  };

  return (
    <div className="carousel">
      {failed[current] ? (
        <div className="carousel__fallback">Photo unavailable</div>
      ) : (
        <img
          className="carousel__img"
          src={current}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed((f) => ({ ...f, [current]: true }))}
        />
      )}

      {urls.length > 1 && (
        <>
          <button type="button" className="carousel__btn carousel__btn--prev"
            aria-label="Previous photo" onClick={(e) => step(e, -1)}>
            ‹
          </button>
          <button type="button" className="carousel__btn carousel__btn--next"
            aria-label="Next photo" onClick={(e) => step(e, 1)}>
            ›
          </button>
          <span className="carousel__counter">
            {safeIndex + 1} / {urls.length}
          </span>
        </>
      )}
    </div>
  );
}