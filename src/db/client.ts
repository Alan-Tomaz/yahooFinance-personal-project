import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { SUPABASE_DB_URL } from "../constants/config.js";

const pool = new pg.Pool({ connectionString: SUPABASE_DB_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
