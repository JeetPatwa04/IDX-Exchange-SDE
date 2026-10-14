const express = require("express");
const pool = require("../db");
const router = express.Router();

const COL = {
  city: "L_City",
  zipcode: "L_Zip",
  price: "L_SystemPrice",
  beds: "L_Keyword2",
  baths: "LM_Dec_3",
};

class ValidationError extends Error {}

function getString(value, name) {
  if (typeof value !== "string") {
    throw new ValidationError(`${name} must be a single value`);
  }
  return value.trim();
}

function parseInteger(raw, name, { min = 0, max = Infinity } = {}) {
  const s = getString(raw, name);
  if (!/^\d+$/.test(s)) throw new ValidationError(`${name} must be a whole number`);
  const n = Number(s);
  if (n < min) throw new ValidationError(`${name} must be at least ${min}`);
  if (n > max) throw new ValidationError(`${name} must be ${max} or less`);
  return n;
}

function parseDecimal(raw, name) {
  const s = getString(raw, name);
  if (!/^\d+(\.\d+)?$/.test(s)) {
    throw new ValidationError(`${name} must be a non-negative number`);
  }
  return Number(s);
}

// Listing ID: 1-50 letters, numbers, dashes or underscores
function parseListingId(raw) {
  const s = getString(raw, "id");
  if (!/^[A-Za-z0-9_-]{1,50}$/.test(s)) {
    throw new ValidationError("listing ID must be 1-50 letters, numbers, dashes or underscores");
  }
  return s;
}

// 400 for bad input, 500 for anything else (logged, never crashes)
function sendError(err, res) {
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}


// GET /api/properties  (search + filters + pagination)
router.get("/", async (req, res) => {
  try {
    const { city, zipcode, minPrice, maxPrice, beds, baths } = req.query;
    const conditions = [];
    const values = [];

    // Pagination (defaults: 20 / 0)
    const limit = req.query.limit === undefined ? 20 : parseInteger(req.query.limit, "limit", { min: 1, max: 100 });
    const offset = req.query.offset === undefined ? 0 : parseInteger(req.query.offset, "offset");

    // Filters: each condition and its value are pushed together
    if (city !== undefined) {
      const c = getString(city, "city");
      if (!c) throw new ValidationError("city cannot be empty");
      conditions.push(`LOWER(TRIM(${COL.city})) = LOWER(TRIM(?))`);
      values.push(c);
    }
    if (zipcode !== undefined) {
      const z = getString(zipcode, "zipcode");
      if (!/^\d{5}$/.test(z)) throw new ValidationError("zipcode must be a 5-digit code");
      conditions.push(`${COL.zipcode} = ?`);
      values.push(z);
    }

    const min = minPrice === undefined ? undefined : parseInteger(minPrice, "minPrice");
    const max = maxPrice === undefined ? undefined : parseInteger(maxPrice, "maxPrice");
    if (min !== undefined && max !== undefined && min > max) {
      throw new ValidationError("minPrice cannot be greater than maxPrice");
    }
    if (min !== undefined) {
      conditions.push(`${COL.price} >= ?`);
      values.push(min);
    }
    if (max !== undefined) {
      conditions.push(`${COL.price} <= ?`);
      values.push(max);
    }
    if (beds !== undefined) {
      conditions.push(`${COL.beds} >= ?`);
      values.push(parseInteger(beds, "beds"));
    }
    if (baths !== undefined) {
      conditions.push(`${COL.baths} >= ?`);
      values.push(parseDecimal(baths, "baths"));
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM rets_property ${where}`,
      values
    );
    const [results] = await pool.query(
      `SELECT * FROM rets_property ${where} ORDER BY id LIMIT ? OFFSET ?`,
      [...values, limit, offset] // copy, so `values` stays clean for the count query
    );

    res.json({ total, limit, offset, results });
  } catch (err) {
    sendError(err, res);
  }
});

// GET /api/properties/:id/openhouses  (must be registered BEFORE /:id)
router.get("/:id/openhouses", async (req, res) => {
  try {
    const id = parseListingId(req.params.id);

    const [props] = await pool.query(
      "SELECT L_ListingID FROM rets_property WHERE L_ListingID = ? LIMIT 1",
      [id]
    );
    if (props.length === 0) {
      return res.status(404).json({ error: `No property found with listing ID ${id}` });
    }

    const [rows] = await pool.query(
      "SELECT * FROM rets_openhouse WHERE L_ListingID = ? ORDER BY OpenHouseDate, OH_StartTime",
      [id]
    );
    res.json(rows); // an empty array is fine
  } catch (err) {
    sendError(err, res);
  }
});


// GET /api/properties/:id
router.get("/:id", async (req, res) => {
  try {
    const id = parseListingId(req.params.id);

    const [rows] = await pool.query(
      "SELECT * FROM rets_property WHERE L_ListingID = ? LIMIT 1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: `No property found with listing ID ${id}` });
    }
    res.json(rows[0]);
  } catch (err) {
    sendError(err, res);
  }
});


module.exports = router;