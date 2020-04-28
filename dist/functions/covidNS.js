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
const COVIDNS_DOMAIN = process.env.COVIDNS_DOMAIN || "http://localhost:6003";
function getLatestCovidNews() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${COVIDNS_DOMAIN}/latest`);
                if (!response.data.success) {
                    console.log(response.data.message);
                    reject(response.data.message);
                }
                // console.log(response.data);
                resolve(response.data.data);
            }
            catch (e) {
                reject("Error fetching Gas prices: ");
            }
        }));
    });
}
exports.covidNewsRegexp = /^(\?|\uff1f)\s*(?<covid>(cov(id)?(-?19)?)|(\u65b0\u51a0))$/i;
function getCovidNewsText() {
    return __awaiter(this, void 0, void 0, function* () {
        const latestNews = yield getLatestCovidNews();
        const { title, summary } = latestNews;
        return `🇨🇦 ${title}\n🚑 ${summary}`;
    });
}
exports.getCovidNewsText = getCovidNewsText;
//# sourceMappingURL=covidNS.js.map