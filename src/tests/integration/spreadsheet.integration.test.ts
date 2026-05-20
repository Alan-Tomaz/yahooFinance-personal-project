import assert from "node:assert";
import { describe, it } from "node:test";
import { getSpreadsheetTickets } from "../../services/spreadsheet.js";
import {
  SPREAD_SHEET_ID,
  SPREAD_SHEET_RANGES,
} from "../../constants/config.js";
import type { ITicker } from "../../models/financial.js";

describe("collectDataSpreadsheet integration", () => {
  it("should return camps from the spreadsheet", async () => {
    const result: ITicker[] = await getSpreadsheetTickets(
      SPREAD_SHEET_RANGES!,
      SPREAD_SHEET_ID!,
    );

    assert.notStrictEqual(result.length, 0);
  });
});
