
export const huiShengRegexp = /^(\?|\uff1f)(\u56de\u58f0)\s*(?<huisheng>.+)$/

export function getHuiSheng(text: string) {
  const textMatch = text.match(huiShengRegexp)?.groups!.huisheng
  if(textMatch.length > 12){
    return ['回声太长啦,12个字内就行']
  }

  let huiSheng = []
  for (let i = 0; i < textMatch.length; i++) {
    huiSheng.push(textMatch.slice(i, textMatch.length))
  }

  return huiSheng
}

// console.log(getHuiSheng("？回声 你好吗"))