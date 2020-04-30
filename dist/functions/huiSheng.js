"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.huiShengRegexp = /^(\?|\uff1f)(\u56de\u58f0)\s*(?<huisheng>.+)$/;
function getHuiSheng(text) {
    var _a;
    const textMatch = ((_a = text.match(exports.huiShengRegexp)) === null || _a === void 0 ? void 0 : _a.groups).huisheng;
    let huiSheng = [];
    for (let i = 0; i < textMatch.length; i++) {
        huiSheng.push(textMatch.slice(i, textMatch.length));
    }
    return huiSheng;
}
exports.getHuiSheng = getHuiSheng;
// console.log(getHuiSheng("？回声 你好吗"))
//# sourceMappingURL=huiSheng.js.map