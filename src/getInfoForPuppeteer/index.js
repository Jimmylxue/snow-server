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
let count = 0;

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

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
  } catch (error) {
    return -1;
  }

  try {
    await page.waitForSelector('div');
    await page.waitForSelector('span');
    await page.waitForSelector('img', { timeout: 20000 });

    const images = await page.evaluate(() => {
      const labels = document.querySelectorAll('img[class*="Pic--"]');
      return Array.from(labels).map((item) => item.src);
    });

    const price = await page.evaluate(() => {
      const labels = document.querySelectorAll('span');
      return Array.from(labels).map((item) => item);
    });

    if (images.length > 0) {
      console.log('读取成功', images[0], await page.title(), price, ++count);

      await browser.close();
      // images[0] 图片链接。coin。second。

      return 1;
    }
  } catch (error) {
    console.log(error);

    await browser.close();
    return 0;
  }

  await browser.close();
}

async function startTask() {
  const st = +new Date();
  isRunning = true;
  while (globalProductLinkList.length !== 0) {
    const res = await scrapePage(globalProductLinkList[0].url);
    if (res === -1 || res === 1) {
      globalProductLinkList.shift();
    } else {
      console.log('读取失败，重试中...');
      let temp = globalProductLinkList.shift();
      globalProductLinkList.push(temp);
    }
  }
  console.log('读取完成，耗时', (+new Date() - st) / 1000);
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
