/**
 * 动态获取链接中的指定内容
 */
const puppeteer = require("puppeteer")

const arr = [
  "aaa",
  "https://detail.tmall.com/item.htm?spm=a21n57.sem.item.2.26ef3903V3Of8O&priceTId=214782b317315888608474132eb2ad&utparam=%7B%22aplus_abtest%22%3A%22af1eaa10ac90097ebbaa299cd2b7baf3%22%7D&id=706768759272&xxc=ad_ztc",
  "https://item.taobao.com/item.htm?spm=a21n57.sem.item.51.26ef3903V3Of8O&priceTId=214782b317315891600037243eb2ad&utparam=%7B%22aplus_abtest%22%3A%223af7a57eae99207961b6165fa57b1430%22%7D&id=846624170353&ns=1&abbucket=10#detail&xxc=taobaoSearch",
  "https://item.taobao.com/item.htm?spm=a21n57.sem.item.58.26ef3903V3Of8O&priceTId=214782b317315891600037243eb2ad&utparam=%7B%22aplus_abtest%22%3A%22ae4cd6c81c72a87535d097ea2a444a31%22%7D&id=848660741702&ns=1&abbucket=10#detail&xxc=taobaoSearch",
  "https://item.taobao.com/item.htm?spm=a21n57.sem.item.58.26ef3903V3Of8O&priceTId=214782b317315891600037243eb2ad&utparam=%7B%22aplus_abtest%22%3A%22ae4cd6c81c72a87535d097ea2a444a31%22%7D&id=848660741702&ns=1&abbucket=10#detail&xxc=taobaoSearch",
  "https://item.taobao.com/item.htm?id=816659028423&spm=a21n57.sem.item.95.26ef3903V3Of8O&priceTId=214782b317315892186623044eb2ad&utparam=%7B%22aplus_abtest%22%3A%228173560d984d163bc30e9dfe158c1c35%22%7D&xxc=ad_ztc",
  "https://detail.tmall.com/item.htm?id=797830992822&spm=a21n57.sem.item.98.26ef3903V3Of8O&priceTId=214782b317315892186623044eb2ad&utparam=%7B%22aplus_abtest%22%3A%2250329a20554c767c9b55a7b29555ad3f%22%7D&xxc=ad_ztc",
  "https://item.taobao.com/item.htm?id=823257576880&spm=a21n57.sem.item.102.26ef3903V3Of8O&priceTId=214782b317315892186623044eb2ad&utparam=%7B%22aplus_abtest%22%3A%2260fe25afe51f259a3f257167721d3c7c%22%7D&xxc=ad_ztc",
  "https://item.taobao.com/item.htm?spm=a21n57.sem.item.103.26ef3903V3Of8O&priceTId=214782b317315892186623044eb2ad&utparam=%7B%22aplus_abtest%22%3A%226c2d842d267a13990803847c70f83681%22%7D&id=713934533519&ns=1&xxc=ad_ztc",
  "https://item.taobao.com/item.htm?id=673166820970&spm=a21n57.sem.item.110.26ef3903V3Of8O&priceTId=214782b317315892186623044eb2ad&utparam=%7B%22aplus_abtest%22%3A%22c83b3decc3f88e8a327810e2dfd60de9%22%7D&xxc=ad_ztc",
  "https://detail.tmall.com/item.htm?spm=a21n57.sem.p4pright.2.4b863903ab2u24&priceTId=214782b317315892787267416eb2ad&utparam=%7B%22aplus_abtest%22%3A%229237289fcbf0987f2e0ef454eb41a752%22%7D&id=733069259166&ns=1&xxc=ad_ztc",
  "https://item.taobao.com/item.htm?id=704804383954&spm=a21n57.sem.item.2.4b863903ab2u24&priceTId=214782b317315892939528653eb2ad&utparam=%7B%22aplus_abtest%22%3A%229c404255abe0c535d89e14ed4ed2ed5e%22%7D&&xxc=ad_ztc",
  "https://item.taobao.com/item.htm?id=795389152368&spm=a21n57.sem.item.3.4b863903ab2u24&priceTId=214782b317315892939528653eb2ad&utparam=%7B%22aplus_abtest%22%3A%224447ed316dd535ede25db9b080697836%22%7D&xxc=ad_ztc",
  "https://item.taobao.com/item.htm?id=760810168870&spm=a21n57.sem.item.6.4b863903ab2u24&priceTId=214782b317315892939528653eb2ad&utparam=%7B%22aplus_abtest%22%3A%229b210f5d960027421da778cd469e0d7d%22%7D&xxc=ad_ztc",
  "https://item.taobao.com/item.htm?id=638174384377&spm=a21n57.sem.item.7.4b863903ab2u24&priceTId=214782b317315892939528653eb2ad&utparam=%7B%22aplus_abtest%22%3A%2244a8cb1c501865bb558f74404b1a71db%22%7D&xxc=ad_ztc",
  "https://item.taobao.com/item.htm?spm=a21n57.sem.item.50.4b863903ab2u24&priceTId=214782b317315893301543449eb2ad&utparam=%7B%22aplus_abtest%22%3A%22a9ef7c1495687bb1fa67059adeea4539%22%7D&id=737774400806&ns=1&xxc=ad_ztc",
  "https://detail.tmall.com/item.htm?id=745594897329&spm=a21n57.sem.item.51.4b863903ab2u24&priceTId=214782b317315893301543449eb2ad&utparam=%7B%22aplus_abtest%22%3A%229d03099cf1c6de7aa9ba62dfcdb4113a%22%7D&xxc=ad_ztc",
  "https://item.taobao.com/item.htm?id=657627779767&spm=a21n57.sem.item.52.4b863903ab2u24&priceTId=214782b317315893301543449eb2ad&utparam=%7B%22aplus_abtest%22%3A%22b451d3a0b8b98dbfab0b8fc28803f222%22%7D&xxc=ad_ztc",
  "https://detail.tmall.com/item.htm?id=729692860126&spm=a21n57.sem.item.59.4b863903ab2u24&priceTId=214782b317315893301543449eb2ad&utparam=%7B%22aplus_abtest%22%3A%222891d316fe2ea2c5d4ac67b63e04b901%22%7D&xxc=ad_ztc",
  "https://detail.tmall.com/item.htm?id=798758340532&spm=a21n57.sem.item.97.4b863903ab2u24&priceTId=214782b317315893743516001eb2ad&utparam=%7B%22aplus_abtest%22%3A%22c0eddc62fe9a5525319bcf5a2ee4cbdd%22%7D&&xxc=ad_ztc",
  "https://item.taobao.com/item.htm?id=840598040326&spm=a21n57.sem.item.98.4b863903ab2u24&priceTId=214782b317315893743516001eb2ad&utparam=%7B%22aplus_abtest%22%3A%22b81c1a6112e50f35ba3766254fb1f7ca%22%7D&xxc=ad_ztc",
  "https://detail.tmall.com/item.htm?spm=a21n57.sem.p4pright.17.4b863903ab2u24&priceTId=214782b317315893743516001eb2ad&utparam=%7B%22aplus_abtest%22%3A%228a60d66f3088d8c45573e63dfc5bcab0%22%7D&id=844232602440&ns=1&xxc=ad_ztc",
  "https://item.taobao.com/item.htm?id=818119529964&spm=a21n57.sem.item.102.4b863903ab2u24&priceTId=214782b317315893743516001eb2ad&utparam=%7B%22aplus_abtest%22%3A%2242ec740be58cc2166b83cc376fc186e2%22%7D&xxc=ad_ztc",
  "https://item.taobao.com/item.htm?id=734351138138&spm=a21n57.sem.item.105.4b863903ab2u24&priceTId=214782b317315893743516001eb2ad&utparam=%7B%22aplus_abtest%22%3A%224455134aa84fc5745a36e49068df7e3f%22%7D&xxc=ad_ztc",
  "https://detail.tmall.com/item.htm?spm=a21n57.sem.item.104.4b863903ab2u24&priceTId=214782b317315893743516001eb2ad&utparam=%7B%22aplus_abtest%22%3A%22bbda1ae3a62aa06947e09bdb0c9a7ac8%22%7D&id=654264924152&xxc=ad_ztc",
  "https://detail.tmall.com/item.htm?id=851589509495&spm=a21n57.sem.item.113.4b863903ab2u24&priceTId=214782b317315893743516001eb2ad&utparam=%7B%22aplus_abtest%22%3A%22f47bee48f714b8691098e6403a554fc0%22%7D&xxc=ad_ztc",
  "https://item.taobao.com/item.htm?id=836969595238&spm=a21n57.sem.item.147.4b863903ab2u24&priceTId=214782b317315894396682318eb2ad&utparam=%7B%22aplus_abtest%22%3A%22948a70867d2efc03eea03bb350757c8c%22%7D&&xxc=ad_ztc",
  "https://detail.tmall.com/item.htm?id=807737268574&spm=a21n57.sem.item.146.4b863903ab2u24&priceTId=214782b317315894396682318eb2ad&utparam=%7B%22aplus_abtest%22%3A%22bbeb73b47190b9ae6b255e359a5cb1f0%22%7D&xxc=ad_ztc",
  "https://item.taobao.com/item.htm?id=825974764142&spm=a21n57.sem.item.149.4b863903ab2u24&priceTId=214782b317315894396682318eb2ad&utparam=%7B%22aplus_abtest%22%3A%228a5f177fc83fcf57cf120025ff3c19c6%22%7D&xxc=ad_ztc",
  "https://detail.tmall.com/item.htm?id=835275480350&spm=a21n57.sem.item.153.4b863903ab2u24&priceTId=214782b317315894396682318eb2ad&utparam=%7B%22aplus_abtest%22%3A%22db6fc79ec33c28dc8111760421db6372%22%7D&xxc=ad_ztc",
  "https://detail.tmall.com/item.htm?id=820360251837&spm=a21n57.sem.item.152.4b863903ab2u24&priceTId=214782b317315894396682318eb2ad&utparam=%7B%22aplus_abtest%22%3A%22375243c2c5d3742d8c55c27b88a223ec%22%7D&xxc=ad_ztc"
]

async function scrapePage(url) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true
  })

  const page = await browser.newPage()
  await page.setRequestInterception(true)

  page.on("request", (req) => {
    if (req.resourceType() === "font") {
      req.abort()
    } else {
      req.continue()
    }
  })

  let attempt = 0
  const maxAttempts = 3

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" })
  } catch (error) {
    return {
      url,
      message: "无效URL"
    }
  }

  while (attempt < maxAttempts) {
    try {
      await page.waitForSelector('img[class^="mainPic"]', { timeout: 3000 })

      const images = await page.evaluate(() => {
        const labels = document.querySelectorAll('img[class^="mainPic"]')
        return Array.from(labels).map((item) => item.src)
      })

      if (images.length > 0) {
        await browser.close()
        return images[0]
      }
    } catch (error) {
      attempt++
      if (attempt === maxAttempts) {
        await browser.close()
        return {
          url
        }
      }
    }
  }

  await browser.close()
}

async function main() {
  console.log(+new Date())

  for (let i = 0; i < arr.length; i++) {
    const src = await scrapePage(arr[i])
    if (src?.message) {
      console.log("无效url！", src.url)
    } else if (src?.url) {
      console.log("Error：", src.url)
    } else {
      console.log(src)
    }
  }
  console.log(+new Date())
}

main()
