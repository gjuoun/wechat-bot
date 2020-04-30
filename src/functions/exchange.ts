import axios from "axios";
import queryString from "querystring";
import { ExchangeRate } from "../types";

const EXCHANGE_DOMAIN = process.env.EXCHANGE_DOMAIN || "http://localhost:6001";

export async function getExchangeRate(
  amount: number,
  from: string,
  to: string
): Promise<ExchangeRate> {
  return new Promise(async (resolve, reject) => {
    try {
      const query = queryString.stringify({ amount, from, to });
      // console.log(`${EXCHANGE_DOMAIN}/convert?${query}`);
      const response = await axios.get(`${EXCHANGE_DOMAIN}/convert?${query}`);

      if (!response.data.success) {
        console.log(response.data.message);
        reject(response.data.message);
      }
      // console.log(response.data);
      resolve(<ExchangeRate>response.data.data);
    } catch (e) {
      reject("Error fetching exchange rate: " + from + to);
    }
  });
}

const exchangeMap = new Map([
  ["加元", "CAD"],
  ["刀", "CAD"],
  ["加币", "CAD"],
  ["CAD", "CAD"],
  ["美元", "USD"],
  ["美刀", "USD"],
  ["USD", "USD"],
  ["RMB", "CNY"],
  ["人民币", "CNY"],
  ["元", "CNY"],
  ["块", "CNY"],
]);

const exchangeEmoji = new Map([
  ["CAD", "🇨🇦"],
  ["CNY", "🇨🇳"],
  ["USD", "🇺🇸"],
]);

// match ?汇率
export const exchangeRegexp = /^(\?|\uff1f)\u6c47\u7387\s*(?<rest>.+)?$/;
// match ?汇率 1美元换人民币
const exchangeDetailRegexp = /^(?<amount>\d+)\s*(?<from>.+)\s*\u6362\s*(?<to>.+)\s*$/;

export async function getExchangeText(text: string): Promise<string> {
  const exchangeMatch = text.match(exchangeRegexp);

  // ?汇率
  if (!exchangeMatch?.groups?.rest) {
    const exchangeRate = await getExchangeRate(1, "CAD", "CNY");
    return `${exchangeEmoji.get("CAD")}1加币 = ${exchangeRate.value.toFixed(
      2
    )}人民币${exchangeEmoji.get("CNY")}`;
  }

  // ?汇率 1加元换人民币
  const exchangeDetail = exchangeMatch.groups?.rest.match(exchangeDetailRegexp);

  if (exchangeDetail) {
    try {
      const amount = parseFloat(exchangeDetail.groups!.amount);
      const from = exchangeDetail.groups!.from.trim();
      const to = exchangeDetail.groups!.to.trim();
      const fromValue = exchangeMap.get(from) ?? "";
      const toValue = exchangeMap.get(to) ?? "";
      // console.log(amount, fromValue, toValue);
      const exchangeRate = await getExchangeRate(amount, fromValue, toValue);
      let result = "";
      result += `${exchangeEmoji.get(fromValue)}${amount}${from}`;
      result += ` = ${exchangeRate.value.toFixed(2)}${to}${exchangeEmoji.get(
        toValue
      )}`;
      return result;
    } catch {
      return "支持的货币有 人民币/加币/美元/RMB/CAD/USD";
    }
  }
  return "格式: \n?汇率\n?汇率 1加元换人民币\n目前支持 人民币/加元/美元";
}

// export async function test(text: string) {
// const exchangeMatch = text.match(exchangeRegexp);
// console.log(exchangeMatch);
// }

// (async () => {
// console.log(await getExchangeText(`?汇率 1美元换人民币`));
// })();
