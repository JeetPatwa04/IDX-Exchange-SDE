import { Link, useNavigate } from "react-router-dom";
import PropertyImageCarousel from "./PropertyImageCarousel";
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
  const navigate = useNavigate();
  const listingId = property.L_ListingID;
  const detailPath = listingId ? `/property/${encodeURIComponent(listingId)}` : null;

  const price =
    property.L_SystemPrice != null ? money.format(property.L_SystemPrice) : "Price unavailable";
  const cityState = [property.L_City, property.L_State].filter(Boolean).join(", ");
  const address = property.L_Address || "Address unavailable";

  const handleCardClick = (e) => {
    if (e.defaultPrevented || !detailPath) return; // the address Link already handled it
    navigate(detailPath);
  };

  return (
    <article className="property-card" onClick={handleCardClick}>
      <PropertyImageCarousel photos={property.L_Photos} alt={`Photo of ${address}`} />
      <div className="property-card__body">
        <p className="property-card__price">{price}</p>
        <p className="property-card__stats">
          {fmt(property.L_Keyword2)} bd · {fmt(property.LM_Dec_3)} ba · {fmt(property.LM_Int2_3)} sqft
        </p>
        <p className="property-card__address">
          {detailPath ? (
            <Link to={detailPath} className="property-card__link">{address}</Link>
          ) : (
            address
          )}
        </p>
        <p className="property-card__city">{cityState}</p>
      </div>
    </article>
  );
}