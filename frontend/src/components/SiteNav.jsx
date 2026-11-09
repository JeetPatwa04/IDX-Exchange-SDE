import { Link } from "react-router-dom";
import "./SiteNav.css";

export default function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Main">
      <div className="site-nav__inner">
        <Link to="/" className="site-nav__brand">IDXExchange - Property Listings</Link>
      </div>
    </nav>
  );
}