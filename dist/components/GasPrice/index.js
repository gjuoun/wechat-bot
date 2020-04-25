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
const moment_1 = __importDefault(require("moment"));
// const gasBuddyUrlExample = "https://www.gasbuddy.com/assets-v2/api/stations/16905/fuels"
const gasBuddyAPIBaseUrl = "https://www.gasbuddy.com/assets-v2/api/stations/";
function getFuelPrice(station_id = "16905") {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${gasBuddyAPIBaseUrl}/${station_id}/fuels`);
            let fuelMessage = "Halifax gas price: \n";
            try {
                if (response.data.fuels) {
                    let postedTime = "";
                    // postedTime = "5 hours ago"
                    postedTime =
                        moment_1.default(Date.now()).diff(response.data.fuels[0].prices[0].postedTime, "hours") + " hour(s) ago";
                    for (let fuel of response.data.fuels) {
                        let fuelType = fuel.fuelType;
                        let price = fuel.prices[0].price;
                        // pad space after fuelType
                        fuelType = (fuelType + "     ").slice(0, 8);
                        // pad spaces before price
                        price = ("  " + price).slice(-4);
                        fuelMessage += `${fuelType} - ${price}¢\n`;
                    }
                    fuelMessage += `Updated at ${postedTime}`;
                }
                // console.log(fuelMessage);
                resolve(fuelMessage);
            }
            catch (e) {
                console.error("Failed fetch station_id - ", station_id);
                reject("Failed on fetching gas price");
            }
        }));
    });
}
exports.default = getFuelPrice;
//# sourceMappingURL=index.js.map