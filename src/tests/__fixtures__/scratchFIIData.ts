import { create } from "node:domain";
import { LANGUAGE } from "../../constants/config.js";
import type { FiiIndicatorsCreateInput } from "../../generated/prisma/models.js";
import type { ITicker } from "../../models/financial.js";
import { formatDate } from "../../utils/formatDate.js";
import fs from "fs";

// FII MOCKS
export const mockCheerioHtml = fs.readFileSync(
  "./src/tests/__fixtures__/cheerioFIIFetchedHtml.html",
  "utf-8",
);

export const mockCheerioSiteFunctionResponse = {
  assetType: "FII",
  date: formatDate(new Date(), LANGUAGE),
  dy: 14.027,
  financialVacancy: null,
  lastDividend: 1.1,
  liquidity: 15449490.32,
  assetsNumber: 14,
  physicalVacancy: null,
  pvp: 1.0194,
  quotaHolders: 549972,
  ticker: "KNCR11",
  vpc: 102.38,
  name: "Kinea Rendimentos Imobiliários",
  price: 105.91,
  fiiType: "Fundo de Papel",
  rentability: { create: { value: 14.34, periodYears: 1 } },
};

export const mockCheerioSiteFunctionResponseNull = {
  assetType: "FII",
  date: formatDate(new Date(), LANGUAGE),
  dy: null,
  financialVacancy: null,
  lastDividend: null,
  liquidity: null,
  assetsNumber: null,
  physicalVacancy: null,
  pvp: null,
  quotaHolders: null,
  ticker: "KNCR11",
  vpc: null,
  name: null,
  price: null,
  fiiType: null,
  rentability: { create: { value: null, periodYears: null } },
};

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
