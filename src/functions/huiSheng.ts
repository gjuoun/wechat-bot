
export const huiShengRegexp = /^(\?|\uff1f)(\u56de\u58f0)\s*(?<huisheng>.+)$/

export function getHuiSheng(text: string) {
  const textMatch = text.match(huiShengRegexp)?.groups!.huisheng

  let huiSheng = []
  for (let i = 0; i < textMatch.length; i++) {
    huiSheng.push(textMatch.slice(i, textMatch.length))
  }

  return huiSheng
}

// console.log(getHuiSheng("？回声 你好吗"))