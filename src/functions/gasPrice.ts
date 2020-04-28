import axios from "axios";
import queryString from "querystring";
import { ExchangeRate, GasStation } from "../types";

const GASPRICE_DOMAIN = process.env.GASPRICE_DOMAIN || "http://localhost:6002";

async function getGasStations(): Promise<GasStation[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${GASPRICE_DOMAIN}/cheap?top=5`);

      if (!response.data.success) {
        console.log(response.data.message);
        reject(response.data.message);
      }
      // console.log(response.data);
      resolve(<GasStation[]>response.data.data);
    } catch (e) {
      reject("Error fetching Gas prices: ");
    }
  });
}

export const gasRegexp = /^(\?|\uff1f)gas$/

export async function getGasPricesText() {
  const stations = await getGasStations();

  const stationsArr = [];
  for (let station of stations) {
    const station_brand = station.station_brand;
    const station_address = station.station_address;
    const isCash = station.fuels[0]?.prices[0]?.isCash;
    const price = station.fuels[0]?.prices[0]?.price;
    stationsArr.push({ station_brand, station_address, isCash, price });
    // console.log(stationsArr);
  }

  let textOutput = `HFX Gas Price Ranking\n`;
  for (let i = 1; i <= stationsArr.length; i++) {
    const { station_brand, station_address, isCash, price } = stationsArr[
      i - 1
    ];
    textOutput += `⛽ ${station_brand} - `;
    textOutput += isCash ? "(Cash)" : "";
    textOutput += `${price}¢\n`;
    textOutput += `${station_address}\n`;
    // textOutput += `${station_address}\n`;
  }
  return textOutput;
}
