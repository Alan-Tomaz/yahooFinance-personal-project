import { describe, it } from "node:test";
import { fetchTicketInfoFromYahooFinance } from "../../services/yahooFinance.js";
import { mockTicketStock } from "../__fixtures__/yahooFinance.js";
import assert from "node:assert";

describe("collectStockDataFromYahooFinance integration", () => {
  it("should return the indicators from a stock ticker", async () => {
    const result = await fetchTicketInfoFromYahooFinance(mockTicketStock);

    assert.notStrictEqual(result.pbv, null);
  });
});
