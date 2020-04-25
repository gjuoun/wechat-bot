"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// load .env environment variables
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config();
}
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const lowdb_1 = __importDefault(require("lowdb"));
const FileAsync_1 = __importDefault(require("lowdb/adapters/FileAsync"));
const currencies_1 = __importDefault(require("./currencies"));
// currencyList= "AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG..."
const currencyList = Object.keys(currencies_1.default).join(",");
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
const adapter = new FileAsync_1.default(path_1.default.join(__dirname, "db.json"));
function fetchAndSaveToLowDb(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield lowdb_1.default(adapter);
        const response = yield axios_1.default.get(url);
        db.set("rate", response.data).write();
    });
}
function convert(amount = 1, from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield lowdb_1.default(adapter);
        try {
            const rate = db.get("rate").value();
            const { quotes, timestamp } = rate;
            const USDFromRate = quotes[`USD${from.toUpperCase()}`];
            const USDToRate = quotes[`USD${to.toUpperCase()}`];
            return {
                success: true,
                from,
                to,
                timestamp,
                rate: amount * (USDToRate / USDFromRate),
            };
        }
        catch (e) {
            console.log("Exchange:convert Error fetching rates");
            return null;
        }
    });
}
exports.convert = convert;
(() => __awaiter(void 0, void 0, void 0, function* () {
    // fetchAndSaveToLowDb(URL);
    const result = yield convert(5000, "RMB", "USD");
    console.log(result);
}))();
// // param: from, to
// app.get("/", (req, res) => {
//   // if have query parameter, convert rate
//   if (req.query.from) {
//     const { from, to } = req.query;
//     client.get("rate", (err, rateStr) => {
//       const { quotes, timestamp } = JSON.parse(rateStr);
//       const USDFromRate = parseFloat(quotes[`USD${from.toUpperCase()}`]);
//       const USDToRate = parseFloat(quotes[`USD${to.toUpperCase()}`]);
//       res.status(200);
//       res.send({
//         success: true,
//         from,
//         to,
//         timestamp,
//         rate: USDToRate / USDFromRate,
//       });
//     });
//   }
//   // if no query parameter is provided, send all rates
//   else {
//     res.status(200);
//     client.get("rate", (err, rateStr) => {
//       res.send(JSON.parse(rateStr));
//     });
//   }
// });
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
//# sourceMappingURL=index.js.map