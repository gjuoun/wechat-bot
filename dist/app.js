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
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const wechaty_1 = require("wechaty");
const exchange_1 = require("./functions/exchange");
const gasPrice_1 = require("./functions/gasPrice");
const covidNS_1 = require("./functions/covidNS");
const wechat = wechaty_1.Wechaty.instance();
wechat.on("scan", (qrcode, status) => {
    qrcode_terminal_1.default.generate(qrcode);
    console.log(`Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`);
});
wechat.on("login", (user) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`User ${user} logined`);
    wechat.say("Web client logged in !!!!");
}));
wechat.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const sender = msg.from();
    const receiver = msg.to();
    const text = msg.text();
    const room = msg.room();
    console.log(text);
    // match (?|？)汇率 1加元
    if (text.match(exchange_1.exchangeRegexp)) {
        msg.say(yield exchange_1.getExchangeText(text));
    }
    if (text.match(gasPrice_1.gasRegexp)) {
        msg.say(yield gasPrice_1.getGasPricesText());
    }
    if (text.match(covidNS_1.covidNewsRegexp)) {
        msg.say(yield covidNS_1.getCovidNewsText());
    }
}));
wechat.start();
//# sourceMappingURL=app.js.map