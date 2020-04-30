import cheerio from "cheerio";
import axios from 'axios'
import queryString from 'querystring'

const cangTouShiBaseUrlV2 = `https://www.guiyy.com/ajax.php`

export const cangToushiRegexp = /^(\?|\uff1f)(\u85cf\u5934\u8bd7)\s*(?<cangtoushi>.+)$/

export async function generateCangTouShiV2(text: string): Promise<string> {
  try {
    const key = text.match(cangToushiRegexp)?.groups!.cangtoushi
    console.log(key)
    const requestBody = {
      words: key,
      length: 7,
      type: 1,
      mode: 1
    }

    const response = await axios.post(cangTouShiBaseUrlV2, queryString.stringify(requestBody), { headers: { "Content-Type": "application/x-www-form-urlencoded" } })

    const shi: string = response.data.lists[0]

    return shi.replace(/(\<b\>|\<\/b\>)/g, "").replace(/\<br\/?\>/g, "\n")
  }
  catch{
    return `请输入中文`
  }
}

// (async () => {
  // console.log(await generateCangTouShi("?藏头诗 你好吗"))
// 
// })()