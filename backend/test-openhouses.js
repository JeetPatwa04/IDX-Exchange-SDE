require("dotenv").config();
const pool = require("./db");

async function main() {
  const [ids] = await pool.query("SELECT DISTINCT L_ListingID FROM rets_openhouse");
  console.log(`Checking ${ids.length} listing IDs...`);

  const counts = {};
  for (const { L_ListingID } of ids) {
    let status;
    try {
      const res = await fetch(
        `http://localhost:5000/api/properties/${encodeURIComponent(L_ListingID)}/openhouses`
      );
      status = res.status;
      // Print anything that is not a normal 200 or an expected 404
      if (status !== 200 && status !== 404) {
        console.log(`${status}  ${JSON.stringify(L_ListingID)}  ${await res.text()}`);
      }
    } catch (err) {
      status = "FETCH_ERROR";
      console.log(`FETCH_ERROR  ${JSON.stringify(L_ListingID)}  ${err.message}`);
    }
    counts[status] = (counts[status] || 0) + 1;
  }

  console.log("Totals by status:", counts);
  await pool.end();
}

main();