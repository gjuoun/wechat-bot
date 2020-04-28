import qrCode from "qrcode-terminal";
import { Wechaty } from "wechaty";
import { getExchangeText, exchangeRegexp } from "./functions/exchange";
import { getGasPricesText, gasRegexp } from "./functions/gasPrice";
import { covidNewsRegexp, getCovidNewsText } from "./functions/covidNS";

const wechat = Wechaty.instance();

wechat.on("scan", (qrcode, status) => {
  qrCode.generate(qrcode);
  console.log(
    `Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      qrcode
    )}`
  );
});
wechat.on("login", async (user) => {
  console.log(`User ${user} logined`);
  wechat.say("Web client logged in !!!!");
});

wechat.on("message", async (msg) => {
  const sender = msg.from();
  const receiver = msg.to();
  const text = msg.text();
  const room = msg.room();

  console.log(text);

  // match (?|？)汇率 1加元
  if (text.match(exchangeRegexp)) {
    msg.say(await getExchangeText(text));
  }

  if (text.match(gasRegexp)) {
    msg.say(await getGasPricesText());
  }

  if (text.match(covidNewsRegexp)) {
    msg.say(await getCovidNewsText());
  }
});

wechat.start();
