import { useState } from "react";
import { cleanFilters } from "../utils/filters";
import "./PropertyFilters.css";

const EMPTY = { city: "", zipcode: "", minPrice: "", maxPrice: "", beds: "", baths: "" };

export default function PropertyFilters({ onSearch, onClear }) {
  const [values, setValues] = useState(EMPTY);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(cleanFilters(values));
  };

  const handleClear = () => {
    setValues(EMPTY);
    onClear();
  };

  return (
    <form className="property-filters" onSubmit={handleSubmit}>
      <div className="property-filters__field">
        <label htmlFor="filter-city">City</label>
        <input id="filter-city" name="city" type="text" placeholder="e.g. Irvine"
          value={values.city} onChange={handleChange} />
      </div>

      <div className="property-filters__field">
        <label htmlFor="filter-zip">ZIP code</label>
        <input id="filter-zip" name="zipcode" type="text" inputMode="numeric"
          maxLength={5} pattern="[0-9]{5}" title="5-digit ZIP code" placeholder="e.g. 92618"
          value={values.zipcode} onChange={handleChange} />
      </div>

      <div className="property-filters__field">
        <label htmlFor="filter-min">Min price</label>
        <input id="filter-min" name="minPrice" type="number" min="0" step="1"
          placeholder="No min" value={values.minPrice} onChange={handleChange} />
      </div>

      <div className="property-filters__field">
        <label htmlFor="filter-max">Max price</label>
        <input id="filter-max" name="maxPrice" type="number" min="0" step="1"
          placeholder="No max" value={values.maxPrice} onChange={handleChange} />
      </div>

      <div className="property-filters__field">
        <label htmlFor="filter-beds">Beds</label>
        <select id="filter-beds" name="beds" value={values.beds} onChange={handleChange}>
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>

      <div className="property-filters__field">
        <label htmlFor="filter-baths">Baths</label>
        <select id="filter-baths" name="baths" value={values.baths} onChange={handleChange}>
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div className="property-filters__actions">
        <button type="submit" className="property-filters__search">Search</button>
        <button type="button" className="property-filters__clear" onClick={handleClear}>
          Clear Filters
        </button>
      </div>
    </form>
  );
}