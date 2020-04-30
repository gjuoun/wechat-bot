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
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
// const cangTouShiBaseUrl = `http://www.guabu.com/cangtoushi/?type=guabu&key=你个大傻逼&leixing=1&len=7`
const cangTouShiBaseUrl = `http://www.guabu.com/cangtoushi/?`;
exports.cangToushiRegexp = /^(\?|\uff1f)(\u85cf\u5934\u8bd7)\s*(?<cangtoushi>.+)$/;
function generateCangTouShi(text) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const key = ((_a = text.match(exports.cangToushiRegexp)) === null || _a === void 0 ? void 0 : _a.groups).cangtoushi;
            const query = querystring_1.default.stringify({
                type: "guabu",
                key,
                leixing: 1,
                len: 7,
            });
            const response = yield axios_1.default.get(cangTouShiBaseUrl + query);
            const $ = cheerio_1.default.load(response.data);
            const h3s = $(`div[class=other] `).children();
            let shi = ``;
            h3s.each((h3Index, h3El) => {
                shi += $(h3El).text() + "\n";
            });
            return shi;
        }
        catch (_b) {
            return `请输入中文`;
        }
    });
}
exports.generateCangTouShi = generateCangTouShi;
// (async () => {
// console.log(await generateCangTouShi("?藏头诗 大傻逼")
// )
// })()
//# sourceMappingURL=cangTouShi.js.map