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
const GASPRICE_DOMAIN = process.env.GASPRICE_DOMAIN || "http://localhost:6002";
function getGasStations() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${GASPRICE_DOMAIN}/cheap?top=5`);
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
exports.gasRegexp = /^(\?|\uff1f)gas$/;
function getGasPricesText() {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const stations = yield getGasStations();
        const stationsArr = [];
        for (let station of stations) {
            const station_brand = station.station_brand;
            const station_address = station.station_address;
            const isCash = (_b = (_a = station.fuels[0]) === null || _a === void 0 ? void 0 : _a.prices[0]) === null || _b === void 0 ? void 0 : _b.isCash;
            const price = (_d = (_c = station.fuels[0]) === null || _c === void 0 ? void 0 : _c.prices[0]) === null || _d === void 0 ? void 0 : _d.price;
            stationsArr.push({ station_brand, station_address, isCash, price });
            // console.log(stationsArr);
        }
        let textOutput = `HFX Gas Price Ranking\n`;
        for (let i = 1; i <= stationsArr.length; i++) {
            const { station_brand, station_address, isCash, price } = stationsArr[i - 1];
            textOutput += `⛽ ${station_brand} - `;
            textOutput += isCash ? "(Cash)" : "";
            textOutput += `${price}¢\n`;
            textOutput += `${station_address}\n`;
            // textOutput += `${station_address}\n`;
        }
        return textOutput;
    });
}
exports.getGasPricesText = getGasPricesText;
//# sourceMappingURL=gasPrice.js.map