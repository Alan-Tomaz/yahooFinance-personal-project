import assert from "node:assert";
import { describe, it } from "node:test";
import {
  normalizeDy,
  normalizeTickerForYahooFinance,
  parseBrazilianNumber,
  toPercent,
} from "../../utils/normalizes.js";
import { mockTicketStock } from "../__fixtures__/yahooFinance.js";
import { formatDate } from "../../utils/formatDate.js";

describe("normalizers units", () => {
  it("check normalizers", () => {
    assert.strictEqual(toPercent(2), 200.0);
    assert.strictEqual(parseBrazilianNumber(" R$2%,."), 2);
    assert.strictEqual(normalizeDy(0.05), 5);
    assert.strictEqual(normalizeTickerForYahooFinance(mockTicketStock), "AAPL");
    assert.strictEqual(formatDate(new Date(2023, 1, 2)), "2023-02-02"); // Months are zero-indexed in JavaScript Date, so 1 corresponds to February
  });
});
