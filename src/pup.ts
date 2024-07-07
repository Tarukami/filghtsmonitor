import puppeteer from "puppeteer"; // or import puppeteer from 'puppeteer-core';

const AVIASALES_URL = "https://www.aviasales.ru/?filter_stops=true&params=LEDAYT1";
const SELECTOR = "*[data-test-id='start-date-field']";

const getPdf = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto(AVIASALES_URL);

  // await page.waitForNavigation({
  //     waitUntil: 'networkidle2',
  //   });
  await page.waitForSelector(SELECTOR);

  const postfix = +new Date();

  await page.pdf({
    path: `file${postfix}.pdf`,
  });

  await browser.close();
};

export { getPdf };
