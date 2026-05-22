import { LANGUAGE } from "../../constants/config.js";
import type { StockIndicatorsCreateInput } from "../../generated/prisma/models.js";
import type { ITicker } from "../../models/financial.js";
import { formatDate } from "../../utils/formatDate.js";

// YAHOO FINANCE MOCKS
export const mockQuote = {
  summaryDetail: {
    trailingPE: 10,
    dividendYield: 0.08,
    averageVolume: 456465,
  },
  summaryProfile: {
    industry: "Technology",
    sector: "Information Technology",
  },
  defaultKeyStatistics: {
    priceToBook: 1.5,
    enterpriseValue: 345465,
  },
  financialData: {
    returnOnEquity: 0.15,
    profitMargins: 0.2845,
  },
  price: {
    shortName: "AAPL",
    longName: "Apple Inc.",
    regularMarketPrice: 100,
  },
};

export const mockQuoteUndefined = {
  summaryDetail: {},
  summaryProfile: {},
  defaultKeyStatistics: {},
  financialData: {},
  price: {},
};

export const mockFundamentals = [
  {
    date: "2020-01-01",
    netIncome: 1000,
    totalRevenue: 5000,
    EBIT: 2000,
    investedCapital: 10000,
    taxRateForCalcs: 0.3,
    totalDebt: 5000,
    EBITDA: 4565,
    netDebt: 45645,
    stockholdersEquity: 10000,
    periodType: "12M",
  },
  {
    date: "2023-01-01",
    netIncome: 2000,
    totalRevenue: 10000,
    EBIT: 4000,
    EBITDA: 3456,
    investedCapital: 15000,
    taxRateForCalcs: 0.3,
    netDebt: 45345,
    totalDebt: 6000,
    stockholdersEquity: 12000,
    periodType: "12M",
  },
];

export const mockFundamentalsUndefined = [{}, {}];

export const mockTicketStock: ITicker = {
  assetType: "STOCK",
  exchange: "NASDAQ",
  ticker: "AAPL",
};

export const mockStockCreate: StockIndicatorsCreateInput = {
  date: formatDate(new Date(), LANGUAGE),
  price: 45,
  ticker: mockTicketStock.ticker,
  assetType: mockTicketStock.assetType,
  cagrProfit: {
    create: {
      periodYears: 3,
      value: 15,
    },
  },
  cagrRevenue: {
    create: {
      periodYears: 3,
      value: 10,
    },
  },
  dy: 12,
  evEbit: 3,
  grossDebtNetWorth: 1.97,
  liquidity: 35456,
  name: mockTicketStock.ticker,
  pe: 3.5,
  pbv: 3.2,
  roe: 10,
  roic: 13,
  profitMargin: 10,
  sector: "Information Technology",
  netDebtDivideByEBITDA: 2.35,
};

export const mockYahooFinanceFunctionResponse = {
  assetType: "STOCK",
  ticker: "AAPL",
  date: formatDate(new Date(), LANGUAGE),
  name: "AAPL",
  sector: "Information Technology: Technology",
  price: 100,
  pe: 10,
  dy: 8,
  pbv: 1.5,
  roe: 15,
  profitMargin: 28.45,
  roic: 18.67,
  evEbit: 86.36625,
  netDebtDivideByEBITDA: 13.120659722222221,
  grossDebtNetWorth: 0.5,
  liquidity: 456465,
  cagrProfit: { create: { value: 25.99210498948732, periodYears: 3 } },
  cagrRevenue: { create: { value: 25.99210498948732, periodYears: 3 } },
};

export const mockYahooFinanceFunctionResponseNull = {
  assetType: "STOCK",
  ticker: "AAPL",
  date: formatDate(new Date(), LANGUAGE),
  name: "AAPL",
  sector: null,
  price: null,
  pe: null,
  dy: null,
  pbv: null,
  roe: null,
  profitMargin: null,
  roic: null,
  evEbit: null,
  netDebtDivideByEBITDA: null,
  grossDebtNetWorth: null,
  liquidity: null,
  cagrProfit: { create: { value: null, periodYears: null } },
  cagrRevenue: { create: { value: null, periodYears: null } },
};
