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

// CALC ALL FINANCIAL INDICATORS
// Return values as null if undefined or null
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
  /* industry */
  let sector;
  if (
    quote.summaryProfile.sector != undefined ||
    quote.summaryProfile.sector != null ||
    quote.summaryProfile.industry != undefined ||
    quote.summaryProfile.industry != null
  ) {
    sector = `${quote.summaryProfile.sector}: ${quote.summaryProfile.industry}`;
  }
  /* price */
  const price = quote.price.regularMarketPrice;
  /* PE */
  const pe = quote.summaryDetail.trailingPE;
  /* DY */
  let dy;
  if (
    quote.summaryDetail.dividendYield != undefined &&
    quote.summaryDetail.dividendYield != null
  ) {
    dy = toPercent(quote.summaryDetail.dividendYield);
  }
  /* P/BV */
  const pbv = quote.defaultKeyStatistics.priceToBook;
  /* ROE */
  let roe;
  if (
    quote.financialData.returnOnEquity != undefined &&
    quote.financialData.returnOnEquity != null
  ) {
    roe = toPercent(quote.financialData.returnOnEquity);
  }
  /* CAGR PROFIT */
  let cagrProfit;
  let yearsCagrProfit;

  const firstCagrProfit = calcCagrYahooFinance(
    fundamentalsTimeSeries,
    "netIncome",
  )[0];
  const lastCagrProfit = calcCagrYahooFinance(
    fundamentalsTimeSeries,
    "netIncome",
  )[calcCagrYahooFinance(fundamentalsTimeSeries, "netIncome").length - 1];

  if (
    firstCagrProfit != undefined &&
    firstCagrProfit != null &&
    lastCagrProfit != undefined &&
    lastCagrProfit != null
  ) {
    yearsCagrProfit =
      new Date(lastCagrProfit.date).getFullYear() -
      new Date(firstCagrProfit.date).getFullYear();

    cagrProfit =
      ((lastCagrProfit.netIncome / firstCagrProfit.netIncome) **
        (1 / yearsCagrProfit) -
        1) *
      100;
  }
  /* CAGR REVENUE */
  let cagrRevenue;
  let yearsCagrRevenue;

  const firstCagrRevenue = calcCagrYahooFinance(
    fundamentalsTimeSeries,
    "totalRevenue",
  )[0];
  const lastCagrRevenue = calcCagrYahooFinance(
    fundamentalsTimeSeries,
    "totalRevenue",
  )[calcCagrYahooFinance(fundamentalsTimeSeries, "totalRevenue").length - 1];

  if (
    firstCagrRevenue != undefined &&
    firstCagrRevenue != null &&
    lastCagrRevenue != undefined &&
    lastCagrRevenue != null
  ) {
    yearsCagrRevenue =
      new Date(lastCagrRevenue.date).getFullYear() -
      new Date(firstCagrRevenue.date).getFullYear();

    cagrRevenue =
      ((lastCagrRevenue.totalRevenue / firstCagrRevenue.totalRevenue) **
        (1 / yearsCagrRevenue) -
        1) *
      100;
  }
  /* PROFIT MARGIN */
  let profitMargin;
  if (
    quote.financialData.profitMargins != undefined &&
    quote.financialData.profitMargins != null
  ) {
    profitMargin = toPercent(quote.financialData.profitMargins);
  }
  /* ROIC */
  const roic = calculateROICYahooFinance(
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1],
  );
  /* liquidity */
  const liquidity = quote.summaryDetail.averageVolume;
  /* ev/ebit */
  let evEbit;
  if (
    quote.defaultKeyStatistics.enterpriseValue != undefined &&
    quote.defaultKeyStatistics.enterpriseValue != null &&
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].EBIT !=
      undefined &&
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].EBIT != null
  ) {
    evEbit =
      quote.defaultKeyStatistics.enterpriseValue /
      fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].EBIT;
  }
  /* netDebtEbitda  */
  let netDebtEbitda;
  if (
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].netDebt !=
      undefined &&
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].netDebt != null &&
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].EBITDA !=
      undefined &&
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].EBITDA != null
  ) {
    netDebtEbitda =
      fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].netDebt /
      fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].EBITDA;
  }
  /* grossDebtNetWorth */
  let debtToEquityPercent;
  if (
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].totalDebt !=
      undefined &&
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].totalDebt !=
      null &&
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1]
      .stockholdersEquity != undefined &&
    fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1]
      .stockholdersEquity != null
  ) {
    debtToEquityPercent =
      fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1].totalDebt /
      fundamentalsTimeSeries[fundamentalsTimeSeries.length - 1]
        .stockholdersEquity;
  }
  /* ===== STOCK INDICATORS ===== */
  const ticketInfo: Prisma.StockIndicatorsCreateInput = {
    assetType: ticket.assetType,
    ticker: ticket.ticker,
    /* FORMAT DATE IN DD/MM/YYYY FORMAT */
    date: formatDate(new Date(), LANGUAGE),
    name,
    sector: sector ?? null,
    price: price ?? null,
    pe: pe ?? null,
    dy: dy ?? null,
    pbv: pbv ?? null,
    roe: roe ?? null,
    profitMargin: profitMargin ?? null,
    roic: roic ?? null,
    evEbit: evEbit ?? null,
    netDebtDivideByEBITDA: netDebtEbitda ?? null,
    grossDebtNetWorth: debtToEquityPercent ?? null,
    liquidity: liquidity ?? null,
    cagrProfit: {
      create: {
        value: cagrProfit ?? null,
        periodYears: yearsCagrProfit ?? null,
      },
    },
    cagrRevenue: {
      create: {
        value: cagrRevenue ?? null,
        periodYears: yearsCagrRevenue ?? null,
      },
    },
  };
  return ticketInfo;
};

export const calcCagrYahooFinance = (
  fundamentalsTimeSeries: any,
  property: any,
) =>
  fundamentalsTimeSeries
    .filter(
      (item: any) =>
        item.periodType === "12M" && typeof item[property] === "number",
    )
    .sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

export const calculateROICYahooFinance = (fundamentals: any) => {
  const { EBIT, taxRateForCalcs, investedCapital } = fundamentals;

  if (!EBIT || !taxRateForCalcs || !investedCapital) {
    return null;
  }

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
