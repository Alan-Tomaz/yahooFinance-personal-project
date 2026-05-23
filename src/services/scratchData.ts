import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Fetches data from the given site
 * @param {string} url The url of the site to scrach
 * @returns {$} - An object of cheerio
 */
export const scratchDataFromSite = async (url: string) => {
  try {
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

    const $ = cheerio.load(data);

    return $;
  } catch (error) {
    throw new Error(`Error fetching site: ${url}. ${error}`);
  }
};
