import dotenv from "dotenv";

dotenv.config();

/**
 * CONSTANTS
 * @var {string} SUPABASE_DB_PASSWORD - Password of the supabase db
 * @var {string} SUPABASE_DB_ID - id of the supabase db
 * @var {string} SUPABASE_DB_AWS_REGION - region of the supabase db
 * @var {string} SUPABASE_DB_URL - the string connection of the supabase db
 * @var {string} SPREAD_SHEET_ID - The ID of the Google Spreadsheet to fetch data from. Encountered in the URL of the spreadsheet. Ex: "1aBcD2eFgHiJkLmNoPqRsTuVwXyZ1234567890"
 * @var {string[]} SPREAD_SHEET_RANGES - An array of ranges to fetch data from the spreadsheet. Each range should be in the format "SheetName!Range,SheetName!Range". They will be converted in the apropriate array format.
 * @var {string} GOOGLE_PROJECT_ID - The ID of the Google Cloud project.
 * @var {string} GOOGLE_CLIENT_EMAIL - The email address of the service account.
 * @var {string} GOOGLE_PRIVATE_KEY - The private key of the service account. Make sure to replace the \n characters with actual newlines when setting the environment variable. Ex: "-----
 * @var {string} LANGUAGE - The language to normalize and filter some data.
 * @var {string[]} STOCK_SINONIMOUS - Some words that correspond to stock in some filters
 * * @var {string[]} FII_SINONIMOUS - Some words that correspond to FII in some filters
 * @var {string} NODE_ENV - Type of execution of the script
 */

export const SUPABASE_DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;
export const SUPABASE_DB_ID = process.env.SUPABASE_DB_ID;
export const SUPABASE_DB_AWS_REGION = process.env.SUPABASE_DB_AWS_REGION;
export const SUPABASE_DB_URL = `postgresql://postgres.${SUPABASE_DB_ID}:${SUPABASE_DB_PASSWORD}@aws-1-${SUPABASE_DB_AWS_REGION}.pooler.supabase.com:5432/postgres`;
export const SPREAD_SHEET_ID = process.env.SPREADSHEET_ID;
export const SPREAD_SHEET_RANGES = process.env.SPREADSHEET_RANGES?.split(",");
export const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
export const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
export const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
export const LANGUAGE = process.env.LANGUAGE || "en-US";
export const STOCK_SINONIMOUS = ["STOCK", "AÇÃO", "ETF US", "ETF BR"];
export const FII_SINONIMOUS = ["FII"];
export const NODE_ENV = process.env.NODE_ENV ?? "dev";
