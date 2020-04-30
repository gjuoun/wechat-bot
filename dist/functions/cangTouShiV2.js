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
const cangTouShiBaseUrlV2 = `https://www.guiyy.com/ajax.php`;
exports.cangToushiRegexp = /^(\?|\uff1f)(\u85cf\u5934\u8bd7)\s*(?<cangtoushi>.+)$/;
function generateCangTouShiV2(text) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const key = ((_a = text.match(exports.cangToushiRegexp)) === null || _a === void 0 ? void 0 : _a.groups).cangtoushi;
            console.log(key);
            const requestBody = {
                words: key,
                length: 7,
                type: 1,
                mode: 1
            };
            const response = yield axios_1.default.post(cangTouShiBaseUrlV2, querystring_1.default.stringify(requestBody), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
            const shi = response.data.lists[0];
            return shi.replace(/(\<b\>|\<\/b\>)/g, "").replace(/\<br\/?\>/g, "\n");
        }
        catch (_b) {
            return `请输入中文`;
        }
    });
}
exports.generateCangTouShiV2 = generateCangTouShiV2;
// (async () => {
// console.log(await generateCangTouShi("?藏头诗 你好吗"))
// 
// })()
//# sourceMappingURL=cangTouShiV2.js.map