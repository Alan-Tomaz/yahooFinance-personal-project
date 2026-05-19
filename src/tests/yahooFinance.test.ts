import type { ITicker } from "../models/financial.js";
import { calcIndicatorsFromYahooFinance } from "../services/yahooFinance.js";

const mockQuote = {
  summaryDetail: {
    trailingPE: 10,
    dividendYield: 0.08,
  },
  financialData: {
    returnOnEquity: 0.15,
  },
  price: {
    regularMarketPrice: 100,
  },
};

const mockFundamentals = [
  {
    date: "2020-01-01",
    netIncome: 1000,
    totalRevenue: 5000,
    EBIT: 2000,
    investedCapital: 10000,
    taxRateForCalcs: 0.3,
    totalDebt: 5000,
    stockholdersEquity: 10000,
  },
  {
    date: "2023-01-01",
    netIncome: 2000,
    totalRevenue: 10000,
    EBIT: 4000,
    investedCapital: 15000,
    taxRateForCalcs: 0.3,
    totalDebt: 6000,
    stockholdersEquity: 12000,
  },
];

const mockTicket: ITicker = {
  assetType: "STOCK",
  exchange: "BVMF",
  ticker: "CMIG4",
};

describe("calculateIndicators", () => {
  it("should calculate debt to equity correctly", () => {
    const result = calcIndicatorsFromYahooFinance(
      mockQuote,
      mockFundamentals,
      mockTicket,
    );

    expect(result.grossDebtNetWorth).toBeCloseTo(0.5);
  });
});
