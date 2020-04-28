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
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const EXCHANGE_DOMAIN = process.env.EXCHANGE_DOMAIN || "http://localhost:6001";
function getExchangeRate(amount, from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const query = querystring_1.default.stringify({ amount, from, to });
                // console.log(`${EXCHANGE_DOMAIN}/convert?${query}`);
                const response = yield axios_1.default.get(`${EXCHANGE_DOMAIN}/convert?${query}`);
                if (!response.data.success) {
                    console.log(response.data.message);
                    reject(response.data.message);
                }
                // console.log(response.data);
                resolve(response.data.data);
            }
            catch (e) {
                reject("Error fetching exchange rate: " + from + to);
            }
        }));
    });
}
exports.getExchangeRate = getExchangeRate;
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
exports.exchangeRegexp = /^(\?|\uff1f)\u6c47\u7387\s*(?<rest>.+)?$/;
// match ?汇率 1美元换人民币
const exchangeDetailRegexp = /^(?<amount>\d+)\s*(?<from>.+)\s*\u6362\s*(?<to>.+)\s*$/;
function getExchangeText(text) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const exchangeMatch = text.match(exports.exchangeRegexp);
        // ?汇率
        if (!((_b = (_a = exchangeMatch) === null || _a === void 0 ? void 0 : _a.groups) === null || _b === void 0 ? void 0 : _b.rest)) {
            const exchangeRate = yield getExchangeRate(1, "CAD", "CNY");
            return `${exchangeEmoji.get("CAD")}1加币 = ${exchangeRate.value.toFixed(2)}人民币${exchangeEmoji.get("CNY")}`;
        }
        // ?汇率 1加元换人民币
        const exchangeDetail = (_c = exchangeMatch.groups) === null || _c === void 0 ? void 0 : _c.rest.match(exchangeDetailRegexp);
        if (exchangeDetail) {
            try {
                const amount = parseFloat(exchangeDetail.groups.amount);
                const from = exchangeDetail.groups.from.trim();
                const to = exchangeDetail.groups.to.trim();
                const fromValue = (_d = exchangeMap.get(from), (_d !== null && _d !== void 0 ? _d : ""));
                const toValue = (_e = exchangeMap.get(to), (_e !== null && _e !== void 0 ? _e : ""));
                // console.log(amount, fromValue, toValue);
                const exchangeRate = yield getExchangeRate(amount, fromValue, toValue);
                let result = "";
                result += `${exchangeEmoji.get(fromValue)}${amount}${from}`;
                result += ` = ${exchangeRate.value.toFixed(2)}${to}${exchangeEmoji.get(toValue)}`;
                return result;
            }
            catch (_f) {
                return "支持的货币有 人民币/加币/美元/RMB/CAD/USD";
            }
        }
        return "格式: \n?汇率\n?汇率 1加元换人民币\n目前支持 人民币/加元/美元";
    });
}
exports.getExchangeText = getExchangeText;
// export async function test(text: string) {
// const exchangeMatch = text.match(exchangeRegexp);
// console.log(exchangeMatch);
// }
// (async () => {
// console.log(await getExchangeText(`?汇率 1美元换人民币`));
// })();
//# sourceMappingURL=exchange.js.map