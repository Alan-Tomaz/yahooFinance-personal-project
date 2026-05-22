import { describe, it } from "node:test";
import { LANGUAGE } from "../../constants/config.js";
import assert from "node:assert";
import { calculateFIIIndicators } from "../../services/scratchFIIData.js";
import {
  mockCheerioHtml,
  mockCheerioSiteFunctionResponse,
  mockTicketFii,
} from "../__fixtures__/scratchFIIData.js";

describe("calculateIndicatorsFii units", () => {
  it("should calculate indicators correctly", () => {
    const result = calculateFIIIndicators(mockCheerioHtml, mockTicketFii);

    assert.deepStrictEqual(result, mockCheerioSiteFunctionResponse);
  });

  it("should treat undefined values", () => {
    const unmatchedHtml = mockCheerioHtml.replace(
      /var dataLayer_content = ({.*?});/s,
      "",
    );

    assert.throws(
      () => calculateFIIIndicators(unmatchedHtml, mockTicketFii),

      {
        name: "Error",
        message: "Could not find dataLayer_content in the HTML.",
      },
    );
  });
});
