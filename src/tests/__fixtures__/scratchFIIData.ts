import { create } from "node:domain";
import { LANGUAGE } from "../../constants/config.js";
import type { FiiIndicatorsCreateInput } from "../../generated/prisma/models.js";
import type { ITicker } from "../../models/financial.js";
import { formatDate } from "../../utils/formatDate.js";

// FII MOCKS

export const mockTicketFii: ITicker = {
  assetType: "FII",
  exchange: "BVMF",
  ticker: "XPML11",
};

export const mockFiiCreate: FiiIndicatorsCreateInput = {
  date: formatDate(new Date(), LANGUAGE),
  price: 99,
  ticker: mockTicketFii.ticker,
  assetType: mockTicketFii.assetType,
  name: "XP MALLS",
  assetsNumber: 14,
  dy: 12,
  fiiType: "Setor de Tijolos",
  financialVacancy: 0.2,
  lastDividend: 0.8,
  liquidity: 24564,
  physicalVacancy: 1,
  quotaHolders: 3454,
  pvp: 0.9,
  vpc: 100,
  rentability: {
    create: {
      periodYears: 1,
      value: 12,
    },
  },
};
