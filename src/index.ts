import dotenv from "dotenv";
dotenv.config();
import { updateFinancial } from "./scripts/updateFinancial.js";

console.log("============ Script Started ============");

await updateFinancial();

console.log("============ Script Completed ============");
