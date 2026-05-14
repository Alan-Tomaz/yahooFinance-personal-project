import { googleAuthentication } from "../config/config.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * CONSTANTS
 * @var {google.auth.GoogleAuth} GOOGLE_AUTH - An Authenticated GoogleAuth instance that can be used to access Google APIs.
 * @var {string} SPREAD_SHEET_ID - The ID of the Google Spreadsheet to fetch data from. Encountered in the URL of the spreadsheet. Ex: "1aBcD2eFgHiJkLmNoPqRsTuVwXyZ1234567890"
 * @var {string[]} SPREAD_SHEET_RANGES - An array of ranges to fetch data from the spreadsheet. Each range should be in the format "SheetName!Range,SheetName!Range". They will be converted in the apropriate array format.
 * @var {string} GOOGLE_PROJECT_ID - The ID of the Google Cloud project.
 * @var {string} GOOGLE_CLIENT_EMAIL - The email address of the service account.
 * @var {string} GOOGLE_PRIVATE_KEY - The private key of the service account. Make sure to replace the \n characters with actual newlines when setting the environment variable. Ex: "-----
 */

export const SPREAD_SHEET_ID = process.env.SPREADSHEET_ID;
export const SPREAD_SHEET_RANGES = process.env.SPREADSHEET_RANGES?.split(",");
export const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
export const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
export const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
export const GOOGLE_AUTH = await googleAuthentication();
export const LANGUAGE = process.env.LANGUAGE || "en-US";
