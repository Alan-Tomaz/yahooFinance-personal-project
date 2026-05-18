import { FII_SINONIMOUS, STOCK_SINONIMOUS } from "../constants/config.js";
import { prisma } from "../db/client.js";

export const sendDataToSupabase = async (ticketsInfo: any) => {
  const createdData = [];
  try {
    for (const ticketInfo of ticketsInfo) {
      let newTicket = {};
      if (STOCK_SINONIMOUS.includes(ticketInfo.assetType)) {
        newTicket = await prisma.stockIndicators.create({
          data: ticketInfo,
        });
      }
      if (FII_SINONIMOUS.includes(ticketInfo.assetType)) {
        newTicket = await prisma.fiiIndicators.create({
          data: ticketInfo,
        });
      }
      createdData.push(newTicket);
    }
    console.log("All Data Successfully Uploaded to Supabase");
  } catch (error) {
    throw new Error(
      `Error uploading ticket to Supabase: ${error}. Data Successfully Updated: ${createdData}`,
    );
  }
};
