import { useEffect, useMemo, useRef, useState } from "react";
import { getPhotos } from "../utils/photos";
import Lightbox from "./Lightbox";
import "./PropertyImageGallery.css";

export default function PropertyImageGallery({ photos, alt = "Property photo" }) {
  const urls = useMemo(() => getPhotos(photos), [photos]);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState({});
  const stripRef = useRef(null);
  const activeRef = useRef(null);

  // Keep the active thumbnail centered in the strip (scrolls the strip only, not the page)
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = activeRef.current;
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2;
    strip.scrollTo?.({ left, behavior: "smooth" });
  }, [index]);

  if (urls.length === 0) {
    return <div className="gallery gallery--empty">No photos available</div>;
  }

  const safeIndex = Math.min(index, urls.length - 1);
  const current = urls[safeIndex];
  const markFailed = (url) => setFailed((f) => ({ ...f, [url]: true }));

  return (
    <div className="gallery">
      <button
        type="button"
        className="gallery__main"
        aria-label="Open photo in full screen"
        onClick={() => setOpen(true)}
      >
        {failed[current] ? (
          <span className="gallery__fallback">Photo unavailable</span>
        ) : (
          <img
            src={current}
            alt={`${alt} (photo ${safeIndex + 1} of ${urls.length})`}
            referrerPolicy="no-referrer"
            onError={() => markFailed(current)}
          />
        )}
        <span className="gallery__counter">{safeIndex + 1} / {urls.length}</span>
      </button>

      {urls.length > 1 && (
        <div className="gallery__thumbs" ref={stripRef}>
          {urls.map((url, i) => (
            <button
              key={url}
              type="button"
              ref={i === safeIndex ? activeRef : null}
              className={`gallery__thumb${i === safeIndex ? " gallery__thumb--active" : ""}`}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === safeIndex ? "true" : undefined}
              onClick={() => setIndex(i)}
            >
              {failed[url] ? null : (
                <img
                  src={url}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => markFailed(url)}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {open && (
        <Lightbox
          photos={urls}
          index={safeIndex}
          onIndexChange={setIndex}
          onClose={() => setOpen(false)}
          alt={alt}
        />
      )}
    </div>
  );
}