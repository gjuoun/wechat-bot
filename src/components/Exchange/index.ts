// load .env environment variables
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import axios from "axios";
import moment from "moment";
import path from "path";
import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileAsync";

import currencies from "./currencies";
// currencyList= "AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG..."
const currencyList = Object.keys(currencies).join(",");

const API_KEY = process.env.CURRENCYLAYER_API_KEY;
const URL = `http://api.currencylayer.com/live?access_key=${API_KEY}&currencies=${currencyList}&format=1`;

/* response example
 data: {
    success: true,
    terms: 'https://currencylayer.com/terms',
    privacy: 'https://currencylayer.com/privacy',
    timestamp: 1585499706,
    source: 'USD',
    quotes: {
      USDUSD: 1,
      USDAUD: 1.622041,
      USDCAD: 1.40235,
      USDPLN: 4.07375,
      USDMXN: 23.391039
    }
  }
*/

const adapter = new FileSync(path.join(__dirname, "db.json"));

async function fetchAndSaveToLowDb(url: string) {
  const db = await lowdb(adapter);

  const response = await axios.get(url);

  db.set("rate", response.data).write();
}

export async function convert(amount: number = 1, from: string, to: string) {
  const db = await lowdb(adapter);
  try {
    const rate = db.get("rate").value();
    const { quotes, timestamp } = rate;

    const USDFromRate = parseFloat(quotes[`USD${from.toUpperCase()}`]);
    const USDToRate = parseFloat(quotes[`USD${to.toUpperCase()}`]);
    console.log(quotes[`USDRMB`]);

    return {
      success: true,
      from,
      to,
      timestamp,
      rate: amount * USDToRate / USDFromRate,
    };
  } catch (e) {
    console.log("Exchange:convert Error fetching rates");
    return null;
  }
}

// {
  // success: true,
  // from: 'CNY',
  // to: 'USD',
  // timestamp: 1587746106,
  // rate: 706.0250198322427
// }

(async () => {
  // fetchAndSaveToLowDb(URL);
  const result = await convert(5000, "CNY", "USD");
  console.log(result);
})();



// /*
//  start server
// */
// const port = process.env.PORT || 5008;
// const host = process.env.HOST || "localhost";

// app.listen(port, () => {
//   console.log(
//     `ExchangeAPI is running on ${host}:${port}, connecting to Redis server...`
//   );

//   // set 4 hours as interval = 14,400,000 milliseconds
//   const fourHours = 1000 * 60 * 60 * 4;

//   // if lastFetchTime within 4 hours, then don't fetch
//   client.get("lastFetchTime", (err, lastFetchTime) => {
//     let lastFetchTimeInt = parseInt(lastFetchTime);

//     // lastFetchTime > 4 hours, fetch rate
//     if (lastFetchTime && Date.now() - lastFetchTimeInt > fourHours) {
//       fetchAndSaveToLowDb();
//     } else if (!lastFetchTime) {
//       // initialize lastFetchTime in redis
//       client.set("lastFetchTime", Date.now());
//       fetchAndSaveToLowDb();
//       console.log("Initialize Redis...");
//     }
//     // lastFetchTIme < 4 hours
//     else {
//       console.log(
//         "Last fetch time was:[",
//         new Date(lastFetchTimeInt).toISOString(),
//         "],it's",
//         moment.unix(lastFetchTimeInt / 1000).fromNow(),
//         ".Don't need to fetch now."
//       );
//       // incase of no "rate" value in Redis
//       client.get("rate", (err, rateStr) => {
//         if (!rateStr) {
//           fetchAndSaveToLowDb();
//         }
//       });
//     }
//   });

//   // fetch every 4 hours
//   setInterval(() => {
//     fetchAndSaveToLowDb();
//   }, fourHours);
// });
