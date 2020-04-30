import axios from "axios";
import { CovidNewsNS } from "types";

const COVIDNS_DOMAIN = process.env.COVIDNS_DOMAIN || "http://localhost:6003";

async function getLatestCovidNews(): Promise<CovidNewsNS> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${COVIDNS_DOMAIN}/latest`);

      if (!response.data.success) {
        console.log(response.data.message);
        reject(response.data.message);
      }
      // console.log(response.data);
      resolve(<CovidNewsNS>response.data.data);
    } catch (e) {
      reject("Error fetching Gas prices: ");
    }
  });
}

export const covidNewsRegexp = /^(\?|\uff1f)\s*(?<covid>(cov(id)?(-?19)?)|(\u65b0\u51a0))$/i;

export async function getCovidNewsText() {
  const latestNews = await getLatestCovidNews();

  const { title, summary } = latestNews;

  return `🇨🇦 ${title}\n🚑 ${summary}`;
}
