import cheerio from "cheerio";
import axios from 'axios'
import queryString from 'querystring'

// const cangTouShiBaseUrl = `http://www.guabu.com/cangtoushi/?type=guabu&key=你个大傻逼&leixing=1&len=7`
const cangTouShiBaseUrl = `http://www.guabu.com/cangtoushi/?`

export const cangToushiRegexp = /^(\?|\uff1f)(\u85cf\u5934\u8bd7)\s*(?<cangtoushi>.+)$/

export async function generateCangTouShi(text: string): Promise<string> {
  try {
    const key = text.match(cangToushiRegexp)?.groups!.cangtoushi

    const query = queryString.stringify({
      type: "guabu",
      key,
      leixing: 1,
      len: 7,
    })

    const response = await axios.get(cangTouShiBaseUrl + query)

    const $ = cheerio.load(response.data)

    const h3s = $(`div[class=other] `).children()

    let shi = ``
    h3s.each((h3Index, h3El) => {
      shi += $(h3El).text() +  "\n"
    })

    return shi
  }
  catch{
    return `请输入中文`
  }
}

// (async () => {
  // console.log(await generateCangTouShi("?藏头诗 大傻逼")
  // )
// })()