import { SPREAD_SHEET_ID, SPREAD_SHEET_RANGES } from "../constants/config.js";
import { getSpreadsheetTickets } from "../services/spreadsheet.js";
import { fetchTicketInfoFromYahooFinance } from "../services/yahooFinance.js";

/**
 * This function is responsible for updating the financial data of the tickets listed in the spreadsheet and save in the supabase db.
 */
export const updateFinancial = async () => {
  try {
    if (!SPREAD_SHEET_RANGES || !SPREAD_SHEET_ID) {
      throw new Error("Spreadsheet ranges or ID not defined");
    }
    // TICKETS FROM SPREADSHEET
    const tickets = await getSpreadsheetTickets(
      SPREAD_SHEET_RANGES,
      SPREAD_SHEET_ID,
    );

    console.log("List of tickets to be fetched", tickets);
    const ticketsInfo = [];
    // GET TICKET INFO FROM YAHOO FINANCE
    for (const ticket of tickets) {
      const ticketInfo = await fetchTicketInfoFromYahooFinance(ticket);
      ticketsInfo.push(ticketInfo);
    }
    console.log("Financial data updated successfully.", ticketsInfo);

    console.log(ticketsInfo);
  } catch (error) {
    console.error("Error updating financial data: ", error);
  }
};
