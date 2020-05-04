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
const cangTouShi_1 = require("./functions/cangTouShi");
const cangTouShiV2_1 = require("./functions/cangTouShiV2");
const huiSheng_1 = require("./functions/huiSheng");
const raider_1 = require("./functions/raider");
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
    if (text.match(cangTouShi_1.cangToushiRegexp)) {
        // msg.say(await generateCangTouShi(text))
        msg.say(yield cangTouShiV2_1.generateCangTouShiV2(text));
    }
    if (text.match(huiSheng_1.huiShengRegexp)) {
        const huiShengArr = huiSheng_1.getHuiSheng(text);
        for (let line of huiShengArr) {
            yield msg.say(line);
        }
    }
    if (text.match(raider_1.raiderRegexp)) {
        console.log(sender === null || sender === void 0 ? void 0 : sender.id);
        const messages = yield raider_1.getRaiderMessages(text);
        // console.log(messages)
        for (let onemsg of messages) {
            yield msg.say(onemsg.text);
        }
    }
}));
wechat.start();
//# sourceMappingURL=app.js.map