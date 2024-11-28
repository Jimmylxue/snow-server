/**
 * 动态获取链接中的指定内容
 */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const puppeteer = require('puppeteer');
const router = express.Router();

require('dotenv').config();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const globalProductLinkList = [];
let isRunning = false;

// -1 无效URL 0 需要重试 1 识别成功
async function scrapePage(url) {
  console.log('在执行', url);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on('request', (req) => {
    if (req.resourceType() === 'font') {
      req.abort();
    } else {
      req.continue();
    }
  });

  let attempt = 0;
  const maxAttempts = 3;

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
  } catch (error) {
    return -1;
  }

  while (attempt < maxAttempts) {
    try {
      await page.waitForSelector('img[class^="mainPic"]', { timeout: 3000 });

      const images = await page.evaluate(() => {
        const labels = document.querySelectorAll('img[class^="mainPic"]');
        return Array.from(labels).map((item) => item.src);
      });

      if (images.length > 0) {
        await browser.close();
        // images[0] 图片链接。coin。second。

        return 1;
      }
    } catch (error) {
      attempt++;
      if (attempt === maxAttempts) {
        await browser.close();
        return 0;
      }
    }
  }

  await browser.close();
}

async function startTask() {
  isRunning = true;
  while (globalProductLinkList.length !== 0) {
    const res = await scrapePage(globalProductLinkList[0].url);
    if (res === -1 || res === 1) {
      globalProductLinkList.shift();
    }
  }
  isRunning = false;
}

router.post('/upload/link', async (req, res) => {
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

app.listen(3001, '0.0.0.0', () => {
  console.log('Server is running on port 3000');
});
