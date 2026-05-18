import type { ITicker } from "../models/financial.js";
import axios from "axios";
import * as cheerio from "cheerio";
import { saveTextInFile } from "../utils/saveTextInFile.js";
import { LANGUAGE, NODE_ENV } from "../constants/config.js";
import { formatDate } from "../utils/formatDate.js";
import type { Prisma } from "../generated/prisma/client.js";

/**
 * Fetches data from the site FundsExplorer for a given ticket for a FII and calculates financial indicators based on the fetched data.
 * @param {ITicker} ticker The stocker ticker symbol to fetch data
 * @returns {Prisma.FiiIndicatorsCreateInput} - An object containing calculated financial indicators
 */
export const scratchFIIData = async (ticker: ITicker) => {
  try {
    const url = `https://www.fundsexplorer.com.br/funds/${ticker.ticker}`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);
    const html = $.html();

    /*   if (NODE_ENV === "dev") {
      saveTextInFile(html);
    } */

    const fiiIndicators: Prisma.FiiIndicatorsCreateInput =
      calculateFIIIndicators($, ticker);

    console.log(
      `Info for ticket ${ticker.ticker} fetched successfully Funds Explorer.`,
    );
    return fiiIndicators;
  } catch (error) {
    throw new Error(
      `Error fetching ticket ${ticker.ticker} from Funds Explorer (Site): ${error}`,
    );
  }
};

const calculateFIIIndicators = (
  pageObj: any,
  ticker: ITicker,
): Prisma.FiiIndicatorsCreateInput => {
  //  FII INDICATORS
  const html = pageObj.html();
  const match = html.match(/var dataLayer_content = ({.*?});/s);
  const varData = JSON.parse(match[1]);
  const meta = varData.pagePostTerms.meta;

  const vacanciasFisicas = [
    ...html.matchAll(/"vacancia_(\d+)_vacancia_fisica":([\d.]+)/g),
  ].map((item) => ({
    indice: Number(item[1]),
    valor: Number(item[2]),
  }));

  const ultimaVacanciaFisica = vacanciasFisicas.sort(
    (a, b) => a.indice - b.indice,
  )[vacanciasFisicas.length - 1];

  const vacanciasFinanceiras = [
    ...html.matchAll(/"vacancia_(\d+)_vacancia_financeira":"?([\d.]*)"?/g),
  ].map((item) => ({
    indice: Number(item[1]),
    valor: item[2] ? Number(item[2]) : null,
  }));

  const ultimaVacanciaFinanceira = vacanciasFinanceiras.sort(
    (a, b) => a.indice - b.indice,
  )[vacanciasFinanceiras.length - 1];

  const fiiIndicators: Prisma.FiiIndicatorsCreateInput = {
    assetType: ticker.assetType,
    date: formatDate(new Date(), LANGUAGE),
    dy: meta.dy ?? null,
    financialVacancy: ultimaVacanciaFinanceira?.valor ?? null,
    lastDividend: meta.lastdividend ?? null,
    liquidity: meta.liquidezmediadiaria ?? null,
    assetsNumber:
      (typeof meta.assets_number == "number" ? meta.assets_number : null) ??
      null,
    physicalVacancy: ultimaVacanciaFisica?.valor ?? null,
    pvp: meta.pvp ?? null,
    quotaHolders: meta.numero_cotista ?? null,
    ticker: meta.codigo ?? "",
    vpc: meta.valorpatrimonialcota ?? null,
    name: meta.name ?? "",
    price: meta.valor ?? 0,
    fiiType: meta.setor_atuacao ?? "",
    rentability: {
      create: {
        value: meta.valorizacao_12_meses,
        periodYears: 1,
      },
    },
  };
  return fiiIndicators;
};
