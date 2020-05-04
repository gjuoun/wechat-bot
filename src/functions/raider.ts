import axios from 'axios'

export const raiderRegexp = /^(\?|\uff1f)((\u9b54\u517d)|(wow))\s*(?<all>all)?\s*(?<name>.+)\s*$/

export async function getRaiderMessages(text: string) {

  try {
    const name = text.match(raiderRegexp)?.groups!.name
    const all = text.match(raiderRegexp)?.groups!.all
    console.log("raider name get - ", name)
    console.log("raider all get - ", all)
    const response = await axios.get(`http://localhost:6005/raider?name=${name}`)
    console.log(response)
    
    if (!all) {
      return response.data.data.filter((char: { realm: string }) => {
        return char.realm === "Illidan"
      })
    }
    return response.data.data
  }
  catch (e) {
    return ["请按格式输入, ？魔兽 [all] 人名"]
  }
}