import { google } from "googleapis";
import { GOOGLE_AUTH } from "../constants/config.js";

/**
 * Fetches information from a Google Spreadsheet based on the provided range and spreadsheet ID. Can be used to fetch data from your financial assets.
 * @param {string[]} range - An array of strings representing the ranges to fetch from the spreadsheet. Ex: ["Sheet1!A1:B2", "Sheet2!C3:D4"]
 * @param {string} spreadsheetId - The ID of the Google Spreadsheet to fetch data from. Encountered in the URL of the spreadsheet. Ex: "1aBcD2eFgHiJkLmNoPqRsTuVwXyZ1234567890"
 * @return {[{ticker: string, exchange: string}]} An array of objects containing the values fetched from the specified ranges in the spreadsheet. Especifically the tickers and the exchanges of the financial assets. Ex: [{ticker: "AAPL", exchange: "NASDAQ"}]
 */
export const getSpreadsheetTickets = async (
  range: string[],
  spreadsheetId: string,
) => {
  try {
    const sheets = google.sheets({
      version: "v4",
      auth: GOOGLE_AUTH,
    });

    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: range,
    });

    const tickets = [];

    if (!response.data.valueRanges) {
      throw new Error("No data found in the spreadsheet");
    }

    for (const values of response.data.valueRanges) {
      if (!values.values) {
        throw new Error(`No values found in the range: ${values.range}`);
      }
      for (const ticket of values.values) {
        tickets.push({
          ticker: ticket[0],
          exchange: ticket[1],
        });
      }
    }
    console.log("Spreadsheet info fetched successfully.");
    return tickets;
  } catch (error) {
    console.error("Error in getSpreadsheetInfo: " + error);
    throw new Error("Error in getSpreadsheetInfo: " + error);
  }
};
