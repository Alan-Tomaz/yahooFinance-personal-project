import YahooFinance from "yahoo-finance2/src/index.ts";
import { formatDate } from "../utils/formatDate.js";
import type { ITicker } from "../models/financial.js";
import {
  normalizeDy,
  normalizeTickerForYahooFinance,
  toPercent,
} from "../utils/normalizes.js";
import { LANGUAGE } from "../constants/config.js";
import type { Prisma } from "../generated/prisma/client.js";

/**
 * Fetches data from Yahoo Finance for a given ticket and calculates financial indicators based on the fetched data. Get Stock data from US and BR Stocks.
 * @param {ITicker} ticket The stocker ticker symbol to fetch data
 * @returns {Prisma.StockIndicatorsCreateInput} An object containing calculated financial indicators
 */
export const fetchTicketInfoFromYahooFinance = async (
  ticket: ITicker,
): Promise<Prisma.StockIndicatorsCreateInput> => {
  const normalizedTicket = normalizeTickerForYahooFinance(ticket);
  try {
    const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

    const quote = await yahooFinance.quoteSummary(
      normalizedTicket,
      {
        modules: [
          "assetProfile",
          /*           "balanceSheetHistory",
          "balanceSheetHistoryQuarterly",
          "incomeStatementHistory",
          "incomeStatementHistoryQuarterly",
          "cashflowStatementHistory",
          "cashflowStatementHistoryQuarterly", */
          "calendarEvents",
          "defaultKeyStatistics",
          "earnings",
          "earningsTrend",
          "financialData",
          "fundOwnership",
          "fundPerformance",
          "fundProfile",
          "indexTrend",
          "industryTrend",
          "insiderHolders",
          "insiderTransactions",
          "institutionOwnership",
          "majorDirectHolders",
          "majorHoldersBreakdown",
          "netSharePurchaseActivity",
          "price",
          "quoteType",
          "recommendationTrend",
          "secFilings",
          "sectorTrend",
          "summaryDetail",
          "summaryProfile",
          "topHoldings",
          "upgradeDowngradeHistory",
        ],
      },
      { validateResult: false },
    );
    const today = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    const fundamentalsTimeSeries = await yahooFinance.fundamentalsTimeSeries(
      normalizedTicket,
      {
        period1: formatDate(fiveYearsAgo),
        period2: formatDate(today),
        type: "annual",
        module: "all",
      },
    );

    const ticketInfo = calcIndicatorsFromYahooFinance(
      quote,
      fundamentalsTimeSeries,
      ticket,
    );
    console.log(
      `Info for ticket ${normalizedTicket} fetched successfully from Yahoo Finance.`,
    );
    return ticketInfo;
  } catch (error) {
    throw new Error(
      `Error fetching ticket ${normalizedTicket} from Yahoo finance (API): ${error}`,
    );
  }
};

/* CALC ALL FINANCIAL INDICATORS */
export const calcIndicatorsFromYahooFinance = (
  quote: any,
  fundamentalsTimeSeries: any,
  ticket: ITicker,
): Prisma.StockIndicatorsCreateInput => {
  if (!quote || !fundamentalsTimeSeries) {
    console.error("Quote or fundamentalsTimeSeries data is missing.");
    return {} as Prisma.StockIndicatorsCreateInput;
  } else if (fundamentalsTimeSeries.length === 0) {
    console.error("Fundamentals time series data is empty.");
    return {} as Prisma.StockIndicatorsCreateInput;
  }
  /* name */
  const name = quote.price.shortName || quote.price.longName || ticket.ticker;
  /* price */
  const price = quote.price.regularMarketPrice;
  /* PL */
  const pl = quote.summaryDetail.trailingPE;
  /* DY */
  const dy = quote.summaryDetail.dividendYield;
  /* PVP */
  const pvp = quote.defaultKeyStatistics.priceToBook;
  /* ROE */
  const roe = quote.financialData.returnOnEquity || 0;
  /* CAGR PROFIT */
  const firstCagrProfit = calcCagrYahooFinance(
    fundamentalsTimeSeries,
    "netIncome",
  )[0];
  const lastCagrProfit = calcCagrYahooFinance(
    fundamentalsTimeSeries,
    "netIncome",
  )[calcCagrYahooFinance(fundamentalsTimeSeries, "netIncome").length - 1];

  const yearsCagrProfit =
    new Date(lastCagrProfit.date).getFullYear() -
    new Date(firstCagrProfit.date).getFullYear();

  const cagrProfit =
    ((lastCagrProfit.netIncome / firstCagrProfit.netIncome) **
      (1 / yearsCagrProfit) -
      1) *
    100;
  /* CAGR REVENUE */
  const firstCagrRevenue = calcCagrYahooFinance(
    fundamentalsTimeSeries,
    "totalRevenue",
  )[0];
  const lastCagrRevenue = calcCagrYahooFinance(
    fundamentalsTimeSeries,
    "totalRevenue",
  )[calcCagrYahooFinance(fundamentalsTimeSeries, "totalRevenue").length - 1];

  const yearsCagrRevenue =
    new Date(lastCagrRevenue.date).getFullYear() -
    new Date(firstCagrRevenue.date).getFullYear();

  const cagrRevenue =
    ((lastCagrRevenue.totalRevenue / firstCagrRevenue.totalRevenue) **
      (1 / yearsCagrRevenue) -
      1) *
    100;
  /* PROFIT MARGIN */
  const profitMargin = toPercent(quote.financialData.profitMargins);
  /* ROIC */
  const roic = calculateROICYahooFinance(
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1],
  );
  /* liquidity */
  const liquidity = quote.summaryDetail.averageVolume;
  /* ev/ebit */
  const evEbit =
    quote.defaultKeyStatistics.enterpriseValue /
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].EBIT;
  /* netDebtEbitda  */
  const netDebtEbitda =
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].netDebt /
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].EBITDA;
  /* grossDebtNetWorth */
  const debtToEquityPercent =
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].totalDebt /
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1]
      .stockholdersEquity;
  /* ===== STOCK INDICATORS ===== */
  const ticketInfo: Prisma.StockIndicatorsCreateInput = {
    assetType: ticket.assetType,
    ticker: ticket.ticker,
    /* FORMAT DATE IN DD/MM/YYYY FORMAT */
    date: formatDate(new Date(), LANGUAGE),
    name,
    price: price || 0,
    pl: pl || 0,
    dy: normalizeDy(dy) || 0,
    pvp: pvp || 0,
    roe: toPercent(roe) || 0,
    profitMargin: profitMargin || 0,
    roic: roic || 0,
    evEbit: evEbit || 0,
    netDebtDivideByEBITDA: netDebtEbitda || 0,
    grossDebtNetWorth: debtToEquityPercent || 0,
    liquidity: liquidity || 0,
    cagrProfit: {
      create: {
        value: cagrProfit || 0,
        periodYears: yearsCagrProfit || 0,
      },
    },
    cagrRevenue: {
      create: {
        value: cagrRevenue || 0,
        periodYears: yearsCagrRevenue || 0,
      },
    },
  };
  return ticketInfo;
};

const calcCagrYahooFinance = (fundamentalsTimeSeries: any, property: any) =>
  fundamentalsTimeSeries
    .filter(
      (item: any) =>
        item.periodType === "12M" && typeof item[property] === "number",
    )
    .sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

const calculateROICYahooFinance = (fundamentals: any) => {
  const { EBIT, taxRateForCalcs, investedCapital } = fundamentals;

  if (
    typeof EBIT !== "number" ||
    typeof taxRateForCalcs !== "number" ||
    typeof investedCapital !== "number" ||
    investedCapital <= 0
  ) {
    return null;
  }

  const nopat = EBIT * (1 - taxRateForCalcs);

  return Number(((nopat / investedCapital) * 100).toFixed(2));
};
