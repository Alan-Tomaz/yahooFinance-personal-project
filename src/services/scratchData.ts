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
    data = await fetchWithCheerio(`${url}`);
  } catch (err) {
    console.warn(
      `Cheerio Fetch failed for URL: ${url}. Err: ${err}, trying with puppeteer...`,
    );
    try {
      data = await fetchWithPuppeteer(`${url}`);
    } catch (puppeteerErr) {
      console.error(
        `Puppeteer Fetch failed for URL: ${url}. Error: ${puppeteerErr}`,
      );
      throw puppeteerErr;
    }
  } finally {
    if (!data) {
      throw new Error(
        `Failed to fetch data from URL: ${url} using both Cheerio and Puppeteer.`,
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
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    );

    const reponse = await page.goto(url, {
      waitUntil: "networkidle2",
    });

    if (!reponse?.ok()) {
      throw new Error(
        `Page failed to load with status: ${reponse?.status()} using Puppeteer for URL: ${url}`,
      );
    }

    const html = await page.content();

    return html;
  } catch (error) {
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
