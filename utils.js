class NumberParser {
  static map = {}
  static parse = () => {}
}
class ChineseNumberParser extends NumberParser {
  static map = {
    "零": 0,

    "一": 1,
    "壹": 1,

    "二": 2,
    "贰": 2,
    "两": 2,

    "三": 3,
    "叁": 3,

    "四": 4,
    "肆": 4,

    "五": 5,
    "伍": 5,

    "六": 6,
    "陆": 6,

    "七": 7,
    "柒": 7,

    "八": 8,
    "捌": 8,

    "九": 9,
    "玖": 9,

    "十": 10,
    "拾": 10,

    "百": 100,
    "佰": 100,

    "千": 1000,
    "仟": 1000,

    "万": 10000,
    "十万": 100000,
    "百万": 1000000,
    "千万": 10000000,
    "亿": 100000000,
  }
  static parse = (str) => {
    var len = str.length
    if (len == 0) return -1
    if (len == 1) return this.map[str] <= 10 ? this.map[str] : -1
    var summary = 0
    if (this.map[str[0]] == 10) {
      str = "一" + str
      len++
    }
    if (len >= 3 && this.map[str[len - 1]] < 10) {
      var last_second_num = this.map[str[len - 2]]
      if (
        last_second_num == 100 ||
        last_second_num == 1000 ||
        last_second_num == 10000 ||
        last_second_num == 100000000
      ) {
        for (var key in this.map) {
          if (this.map[key] == last_second_num / 10) {
            str += key
            len += key.length
            break
          }
        }
      }
    }
    if (str.match(/亿/g) && str.match(/亿/g).length > 1) return -1
    var splited = str.split("亿")
    if (splited.length == 2) {
      var rest = splited[1] == "" ? 0 : this.parse(splited[1])
      return summary + this.parse(splited[0]) * 100000000 + rest
    }
    splited = str.split("万")
    if (splited.length == 2) {
      var rest = splited[1] == "" ? 0 : this.parse(splited[1])
      return summary + this.parse(splited[0]) * 10000 + rest
    }
    var i = 0
    while (i < len) {
      var first_char_num = this.map[str[i]]
      var second_char_num = this.map[str[i + 1]]
      if (second_char_num > 9) summary += first_char_num * second_char_num
      i++
      if (i == len) summary += first_char_num <= 9 ? first_char_num : 0
    }
    return summary
  }
}
class RomanNumberParser extends NumberParser {
  static map = {
    M: 1000,
    D: 500,
    C: 100,
    L: 50,
    X: 10,
    V: 5,
    I: 1,
    m: 1000,
    d: 500,
    c: 100,
    l: 50,
    x: 10,
    v: 5,
    i: 1,
  }
  static parse = (str) => {
    return str
      .split("")
      .reduce(
        (r, a, i, aa) =>
          r + (this.map[a] < this.map[aa[i + 1]] ? -this.map[a] : this.map[a]),
        0
      )
  }
}

const parsers = [ChineseNumberParser, RomanNumberParser]

/**
 *
 * @param {string|number} s
 */
function parseNumber(s) {
  if (typeof s === "number") {
    return [s, "number"]
  }
  for (let p of parsers) {
    const regex = new RegExp(`(${Object.keys(p.map).join("|")})+`)
    const matches = s.match(regex)
    if (matches) {
      return [p.parse(matches[0]), p.name]
    }
  }
  return [parseInt(s), "parseInt"]
}
exports.parseNumber = parseNumber
