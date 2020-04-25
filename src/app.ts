import qrTerm from "qrcode-terminal";
import { IoClient, Wechaty, config, log } from "wechaty";
import axios from "axios";

const baseUrl = `https://res.wx.qq.com/`;
const myid = "";

console.log(`
/* -------------------------------- Jun's Bot ------------------------------- */
`);

let bot: Wechaty;

const token = config.token;

if (token) {
  log.info("Wechaty", "TOKEN: %s", token);

  bot = Wechaty.instance({ profile: token });
  const ioClient = new IoClient({
    token,
    wechaty: bot,
  });

  ioClient.start().catch((e) => {
    log.error("Wechaty", "IoClient.init() exception: %s", e);
    bot.emit("error", e);
  });
} else {
  log.verbose("Wechaty", "TOKEN: N/A");
  bot = Wechaty.instance();
}

bot
  .on("scan", (qrcode, status) => {
    qrTerm.generate(qrcode, { small: true });
    console.log(`${status}: ${qrcode} - Scan QR Code of the url to login:`);
  })
  .on("logout", (user) => log.info("Bot", `${user.name()} logouted`))
  .on("error", (e) => log.info("Bot", "error: %s", e))

  .on("login", async function (user) {
    const msg = `${user.name()} logined`;

    log.info("Bot", msg);
    log.info("Bot - - - logged ", JSON.stringify(msg, null, 2));
    await this.say(msg);
  });

/**
 * Global Event: message
 */

let busyIndicator = false;
let busyAnnouncement = `Automatic Reply: I cannot read your message because I'm busy now, will talk to you when I get back.`;

bot.on("message", async function (msg) {
  log.info("Bot", "(message) %s", msg);

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
    const topic = await room.topic();
    console.log("topic - ", topic);
    if (text.match(/-ping/)) {
      console.log("text -ping matched!");
      const response = await axios.get("https://bigfacenas.ddns.me/ping");
      msg.say(response.data);
    }

    if (text.match(/-gas/)) {
      console.log("text -ping matched!");
      const response = await axios.get("http://bigfacenas.ddns.me:6003/");
      msg.say(response.data);
    }
  }

  if (!room) {
    console.log("personal - ");
    if (text.match(/-ping/)) {
      console.log("text -ping matched!");
      const response = await axios.get("https://bigfacenas.ddns.me/ping");
      msg.say(response.data);
    }
  }

  if (sender.type() !== bot.Contact.Type.Personal) {
    return;
  }
});

bot.start().catch((e) => console.error(e));
