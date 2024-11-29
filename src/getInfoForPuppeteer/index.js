const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const { chromium } = require('playwright');
const router = express.Router();
const axios = require('axios');

require('dotenv').config();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
console.log(process.env.STATIC_BASE_URL);

async function uploadProductionInfo(data) {
  await axios.post(`${process.env.STATIC_BASE_URL}/link/add`, data);
}

const globalProductLinkList = [];
let isRunning = false;

async function scrapePage(item) {
  const { url, coin, second } = item;
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  const page = await browser.newPage();

  page.route('**/*', (route, request) => {
    if (request.resourceType() === 'font') {
      route.abort();
    } else {
      route.continue();
    }
  });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
  } catch (error) {
    await browser.close();
    return -1;
  }

  try {
    await page.waitForSelector('div:visible');
    await page.waitForSelector('span:visible');
    await page.waitForSelector('img:visible', { timeout: 3000 });

    const firstImgElement = page.locator('img[class*=Pic--]').first();
    const firstImgSrc = await firstImgElement.getAttribute('src');

    let priceText = '';
    const price = await page.$$('span[class*="--"]');
    for (const spanElement of price) {
      const textContent = await spanElement.textContent();
      if (textContent.includes('￥')) {
        const nextSiblingElementHandle = await page.evaluateHandle(
          (el) => el.nextElementSibling,
          spanElement,
        );
        const nextSiblingElement = nextSiblingElementHandle.asElement();
        if (nextSiblingElement) {
          priceText = (await nextSiblingElement.textContent()) || '';
        }
      }
    }

    if (firstImgSrc && priceText) {
      console.log('调用了！');

      await uploadProductionInfo({
        title: await page.title(),
        mainImage: firstImgSrc,
        fullLink: url,
        price: Number(price) || 0,
        coin,
        visitTime: Number(second),
      });

      await browser.close();
      return 1;
    }

    throw new Error('Error');
  } catch (error) {
    await browser.close();
    return 0;
  }
}

async function startTask() {
  isRunning = true;
  while (globalProductLinkList.length !== 0) {
    const res = await scrapePage(globalProductLinkList[0]);
    if (res === -1 || res === 1) {
      globalProductLinkList.shift();
    } else {
      let temp = globalProductLinkList.shift();
      globalProductLinkList.push(temp);
    }
  }
  isRunning = false;
}

router.post('/link/upload', async (req, res) => {
  const { links, coin, second } = req.body;

  links.forEach((url) => globalProductLinkList.push({ url, coin, second }));

  if (!isRunning) {
    startTask();
  }

  res.send({
    code: 200,
    message: '等待读取链接中的信息',
  });
});

app.use(router);

app.listen(9998, '0.0.0.0', () => {
  console.log('Server is running on port 9998');
});
