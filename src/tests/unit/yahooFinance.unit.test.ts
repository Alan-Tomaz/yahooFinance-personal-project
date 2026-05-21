import { describe, it } from "node:test";
import { LANGUAGE } from "../../constants/config.js";
import {
  calcIndicatorsFromYahooFinance,
  calculateROICYahooFinance,
} from "../../services/yahooFinance.js";
import { formatDate } from "../../utils/formatDate.js";
import {
  mockFundamentals,
  mockFundamentalsUndefined,
  mockQuote,
  mockQuoteUndefined,
  mockTicketStock,
} from "../__fixtures__/yahooFinance.js";
import assert from "node:assert";

describe("calculateIndicators units", () => {
  it("should calculate debt to equity correctly", () => {
    const result = calcIndicatorsFromYahooFinance(
      mockQuote,
      mockFundamentals,
      mockTicketStock,
    );

    assert.deepStrictEqual(result, {
      assetType: "STOCK",
      ticker: "AAPL",
      date: formatDate(new Date(), LANGUAGE),
      name: "AAPL",
      sector: "Information Technology: Technology",
      price: 100,
      pl: 10,
      dy: 8,
      pvp: 1.5,
      roe: 15,
      profitMargin: 28.45,
      roic: 18.67,
      evEbit: 86.36625,
      netDebtDivideByEBITDA: 13.120659722222221,
      grossDebtNetWorth: 0.5,
      liquidity: 456465,
      cagrProfit: { create: { value: 25.99210498948732, periodYears: 3 } },
      cagrRevenue: { create: { value: 25.99210498948732, periodYears: 3 } },
    });
  });

  it("should treat undefined values", () => {
    const result = calcIndicatorsFromYahooFinance(
      mockQuoteUndefined,
      mockFundamentalsUndefined,
      mockTicketStock,
    );

    assert.deepStrictEqual(result, {
      assetType: "STOCK",
      ticker: "AAPL",
      date: formatDate(new Date(), LANGUAGE),
      name: "AAPL",
      sector: "",
      price: 0,
      pl: 0,
      dy: 0,
      pvp: 0,
      roe: 0,
      profitMargin: 0,
      roic: 0,
      evEbit: 0,
      netDebtDivideByEBITDA: 0,
      grossDebtNetWorth: 0,
      liquidity: 0,
      cagrProfit: { create: { value: 0, periodYears: 0 } },
      cagrRevenue: { create: { value: 0, periodYears: 0 } },
    });
  });

  it("should return empty object if quote is missing", () => {
    const result = calcIndicatorsFromYahooFinance(null, [], mockTicketStock);

    assert.deepStrictEqual(result, {});
  });

  it("should return empty object when fundamentals are empty", () => {
    const result = calcIndicatorsFromYahooFinance(
      mockQuote,
      [],
      mockTicketStock,
    );

    assert.deepStrictEqual(result, {});
  });

  it("should return null when investedCapital is zero", () => {
    const result = calculateROICYahooFinance({
      EBIT: 1000,
      taxRateForCalcs: 0.3,
      investedCapital: 0,
    });

    assert.strictEqual(result, null);
  });
});
