import dotenv from "dotenv";
dotenv.config();
import { updateFinancial } from "./scripts/updateFinancial.js";

console.log("============ Script Iniciado ============");

await updateFinancial();

console.log("============ Script Finalizado ============");
