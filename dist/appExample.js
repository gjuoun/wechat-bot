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
const axios_1 = __importDefault(require("axios"));
const baseUrl = `https://res.wx.qq.com/`;
const myid = "";
console.log(`
/* -------------------------------- Jun's Bot ------------------------------- */
`);
let bot;
const token = wechaty_1.config.token;
if (token) {
    wechaty_1.log.info("Wechaty", "TOKEN: %s", token);
    bot = wechaty_1.Wechaty.instance({ profile: token });
    const ioClient = new wechaty_1.IoClient({
        token,
        wechaty: bot,
    });
    ioClient.start().catch((e) => {
        wechaty_1.log.error("Wechaty", "IoClient.init() exception: %s", e);
        bot.emit("error", e);
    });
}
else {
    wechaty_1.log.verbose("Wechaty", "TOKEN: N/A");
    bot = wechaty_1.Wechaty.instance();
}
bot
    .on("scan", (qrcode, status) => {
    qrcode_terminal_1.default.generate(qrcode, { small: true });
    console.log(`${status}: ${qrcode} - Scan QR Code of the url to login:`);
})
    .on("logout", (user) => wechaty_1.log.info("Bot", `${user.name()} logouted`))
    .on("error", (e) => wechaty_1.log.info("Bot", "error: %s", e))
    .on("login", function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        const msg = `${user.name()} logined`;
        wechaty_1.log.info("Bot", msg);
        wechaty_1.log.info("Bot - - - logged ", JSON.stringify(msg, null, 2));
        yield this.say(msg);
    });
});
/**
 * Global Event: message
 */
let busyIndicator = false;
let busyAnnouncement = `Automatic Reply: I cannot read your message because I'm busy now, will talk to you when I get back.`;
bot.on("message", function (msg) {
    return __awaiter(this, void 0, void 0, function* () {
        wechaty_1.log.info("Bot", "(message) %s", msg);
        console.log(JSON.stringify(msg, null, 2));
        const filehelper = bot.Contact.load("filehelper");
        const sender = msg.from();
        const receiver = msg.to();
        const text = msg.text();
        const room = msg.room();
        // if (msg.age() > 60) {
        //   log.info('Bot', 'on(message) skip age(%d) > 60 seconds: %s', msg.age(), msg)
        //   return
        // }
        if (!sender || !receiver) {
            return;
        }
        // if (text.match(/\/ping/g)) {
        // console.log("text /ping matched!");
        // const response = await axios.get("https://bigfacenas.ddns.me/ping");
        // await msg.say(response.data);
        // }
        if (room) {
            const topic = yield room.topic();
            console.log("topic - ", topic);
            if (text.match(/-ping/)) {
                console.log("text -ping matched!");
                const response = yield axios_1.default.get("https://bigfacenas.ddns.me/ping");
                msg.say(response.data);
            }
            if (text.match(/-gas/)) {
                console.log("text -ping matched!");
                const response = yield axios_1.default.get("http://bigfacenas.ddns.me:6003/");
                msg.say(response.data);
            }
        }
        if (!room) {
            console.log("personal - ");
            if (text.match(/-ping/)) {
                console.log("text -ping matched!");
                const response = yield axios_1.default.get("https://bigfacenas.ddns.me/ping");
                msg.say(response.data);
            }
        }
        if (sender.type() !== bot.Contact.Type.Personal) {
            return;
        }
    });
});
bot.start().catch((e) => console.error(e));
//# sourceMappingURL=appExample.js.map