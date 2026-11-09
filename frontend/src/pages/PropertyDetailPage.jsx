import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPropertyDetail } from "../api/client";
import PropertyImageGallery from "../components/PropertyImageGallery";
import PropertyMap from "../components/PropertyMap";
import OpenHouses from "../components/OpenHouses";
import "./PropertyDetailPage.css";
import SiteNav from "../components/SiteNav";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// 12345 -> "12,345"; missing -> "—"
function num(value) {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString() : "—";
}

// Years must not get a thousands separator
function year(value) {
  return value ? String(value) : "—";
}

// "SingleFamilyResidence" -> "Single Family Residence"
function humanize(value) {
  return typeof value === "string" ? value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/,/g, ", ") : value;
}

function buildDetails(p) {
  const acres = Number(p.LotSizeAcres);
  const stories = Number(p.StoriesTotal);
  const hoa = Number(p.AssociationFee);

  const rows = [
    ["Property type", humanize(p.L_Type_)],
    ["Status", p.L_Status],
    ["Listing ID", p.L_ListingID],
    ["Days on market", p.DaysOnMarket != null ? num(p.DaysOnMarket) : null],
    ["Lot size", acres > 0 ? `${acres.toLocaleString("en-US", { maximumFractionDigits: 2 })} acres` : null],
    ["Stories", stories > 0 ? String(stories) : null],
    ["Cooling", humanize(p.Cooling)],
    ["Heating", humanize(p.Heating)],
    [
      "HOA fee",
      hoa > 0
        ? `${money.format(hoa)}${p.AssociationFeeFrequency ? ` / ${p.AssociationFeeFrequency.toLowerCase()}` : ""}`
        : null,
    ],
    ["Listed by", p.ListAgentFullName],
    ["Brokerage", p.LO1_OrganizationName],
  ];

  // Only show rows that have a value
  return rows.filter(([, value]) => value !== null && value !== undefined && value !== "");
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0); // arriving from a scrolled listings page
    let cancelled = false;
    setLoading(true);
    setError(null);
    setProperty(null);

    fetchPropertyDetail(id)
      .then((result) => {
        if (!cancelled) setProperty(result);
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
  }, [id]);

  const address = property?.L_Address || "Address unavailable";
  const cityLine = property
    ? [[property.L_City, property.L_State].filter(Boolean).join(", "), property.L_Zip]
        .filter(Boolean)
        .join(" ")
    : "";
  const description = property?.L_Remarks
    ? property.L_Remarks.replace(/\r\n?/g, "\n")
    : null;

  return (
    <>
        <SiteNav />
        <main className="detail-page">
        {loading && <p className="detail-status">Loading property…</p>}

        {error && (
          <div className="detail-error" role="alert">
            <strong>Couldn't load this property.</strong> {error}
            <div>
              <Link to="/">Return to all listings</Link>
            </div>
          </div>
        )}

        {property && (
          <>
            <section className="detail-header">
              <div>
                <p className="detail-price">
                  {property.L_SystemPrice != null ? money.format(property.L_SystemPrice) : "Price unavailable"}
                </p>
                <h1 className="detail-address">{address}</h1>
                <p className="detail-city">{cityLine}</p>
              </div>
              <Link to="/" className="detail-back">Back</Link>
            </section>
            
            <ul className="detail-stats">
              <li><strong>{num(property.L_Keyword2)}</strong><span>Beds</span></li>
              <li><strong>{num(property.LM_Dec_3)}</strong><span>Baths</span></li>
              <li><strong>{num(property.LM_Int2_3)}</strong><span>Sq ft</span></li>
              <li><strong>{year(property.YearBuilt)}</strong><span>Year built</span></li>
            </ul>

            <div className="detail-grid">
              <div className="detail-main">
                <PropertyImageGallery photos={property.L_Photos} alt={address} />

                <section>
                  <h2>About this home</h2>
                  <p className="detail-description">
                    {description || "No description available."}
                  </p>
                </section>

                <section>
                  <h2>Property details</h2>
                  <dl className="detail-facts">
                    {buildDetails(property).map(([label, value]) => (
                      <div key={label} className="detail-facts__row">
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              </div>

              <aside className="detail-side">
                <section>
                  <h2>Open houses</h2>
                  <OpenHouses listingId={property.L_ListingID} />
                </section>
                <PropertyMap
                  lat={property.LMD_MP_Latitude}
                  lng={property.LMD_MP_Longitude}
                />
              </aside>
            </div>
          </>
        )}
      </main>
    </>
  );
}