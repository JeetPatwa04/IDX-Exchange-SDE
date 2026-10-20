import { useState } from "react";
import { getFirstPhoto } from "../utils/photos";
import "./PropertyCard.css";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// Shows "—" for missing values instead of "null" or "NaN"
function fmt(value) {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString() : "—";
}

export default function PropertyCard({ property }) {
  const [imgFailed, setImgFailed] = useState(false);
  const photo = getFirstPhoto(property.L_Photos);
  const price =
    property.L_SystemPrice != null ? money.format(property.L_SystemPrice) : "Price unavailable";
  const cityState = [property.L_City, property.L_State].filter(Boolean).join(", ");

    return (
    <article className="property-card">
      {photo && !imgFailed ? (
        <img
          className="property-card__photo"
          src={photo}
          alt={`Photo of ${property.L_Address || "property"}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="property-card__photo property-card__photo--empty">
          No photo available
        </div>
      )}
      <div className="property-card__body">
        <p className="property-card__price">{price}</p>
        <p className="property-card__stats">
          {fmt(property.L_Keyword2)} bd · {fmt(property.LM_Dec_3)} ba · {fmt(property.LM_Int2_3)} sqft
        </p>
        <p className="property-card__address">{property.L_Address || "Address unavailable"}</p>
        <p className="property-card__city">{cityState}</p>
      </div>
    </article>
  );
}