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
exports.raiderRegexp = /^(\?|\uff1f)((\u9b54\u517d)|(wow))\s*(?<all>all)?\s*(?<name>.+)\s*$/;
function getRaiderMessages(text) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const name = ((_a = text.match(exports.raiderRegexp)) === null || _a === void 0 ? void 0 : _a.groups).name;
            const all = ((_b = text.match(exports.raiderRegexp)) === null || _b === void 0 ? void 0 : _b.groups).all;
            console.log("raider name get - ", name);
            console.log("raider all get - ", all);
            const response = yield axios_1.default.get(`http://localhost:6005/raider?name=${name}`);
            console.log(response);
            if (!all) {
                return response.data.data.filter((char) => {
                    return char.realm === "Illidan";
                });
            }
            return response.data.data;
        }
        catch (e) {
            return ["请按格式输入, ？魔兽 [all] 人名"];
        }
    });
}
exports.getRaiderMessages = getRaiderMessages;
//# sourceMappingURL=raider.js.map