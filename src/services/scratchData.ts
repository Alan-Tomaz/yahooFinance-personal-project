import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

/**
 * Fetches data from the given site
 * @param {string} url The url of the site to scrach
 * @returns {$} - An object of cheerio
 */
export const scratchDataFromSite = async (url: string) => {
  let data;
  let $;
  try {
    data = await fetchWithCheerio(url);
  } catch (err) {
    console.warn(
      `Cheerio Fetch failed for URL: ${url}. Err: ${err}, trying with puppeteer...`,
    );
    data = await fetchWithPuppeteer(url);
  } finally {
    if (!data) {
      throw new Error(
        `Error fetching site: ${url} with Puppeteer. No data returned.`,
      );
    }
    $ = cheerio.load(data);
    return $;
  }
};

const fetchWithCheerio = async (url: string) => {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",

      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",

      "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",

      Referer: "https://www.google.com/",

      Connection: "keep-alive",
    },
  });

  return data;
};

const fetchWithPuppeteer = async (url: string) => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    );

    await page.goto(url, {
      waitUntil: "networkidle2",
    });

    const html = await page.content();

    return html;
  } finally {
    await browser.close();
  }
};
