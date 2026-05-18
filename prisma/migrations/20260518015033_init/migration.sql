-- CreateTable
CREATE TABLE "StockIndicators" (
    "Id" SERIAL NOT NULL,
    "assetType" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "name" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "pl" DECIMAL(65,30) NOT NULL,
    "pvp" DECIMAL(65,30) NOT NULL,
    "dy" DECIMAL(65,30) NOT NULL,
    "roe" DECIMAL(65,30) NOT NULL,
    "roic" DECIMAL(65,30) NOT NULL,
    "profitMargin" DECIMAL(65,30) NOT NULL,
    "evEbit" DECIMAL(65,30) NOT NULL,
    "netDebtDivideByEBITDA" DECIMAL(65,30) NOT NULL,
    "grossDebtNetWorth" DECIMAL(65,30) NOT NULL,
    "stockProfitCagrId" INTEGER,
    "stockRevenueCagrId" INTEGER,
    "liquidity" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockIndicators_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "FiiIndicators" (
    "Id" SERIAL NOT NULL,
    "assetType" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "name" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "pvp" DECIMAL(65,30) NOT NULL,
    "vpc" DECIMAL(65,30) NOT NULL,
    "dy" DECIMAL(65,30) NOT NULL,
    "liquidity" DECIMAL(65,30) NOT NULL,
    "fiiRentabilityId" INTEGER,
    "assetsNumber" INTEGER NOT NULL,
    "financialVacancy" DECIMAL(65,30) NOT NULL,
    "physicalVacancy" DECIMAL(65,30) NOT NULL,
    "lastDividend" DECIMAL(65,30) NOT NULL,
    "quotaHolders" DECIMAL(65,30) NOT NULL,
    "fiiType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FiiIndicators_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "FiiRentability" (
    "id" SERIAL NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "periodYears" INTEGER NOT NULL,

    CONSTRAINT "FiiRentability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCagr" (
    "id" SERIAL NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "period" INTEGER NOT NULL,

    CONSTRAINT "StockCagr_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StockIndicators" ADD CONSTRAINT "StockIndicators_stockRevenueCagrId_fkey" FOREIGN KEY ("stockRevenueCagrId") REFERENCES "StockCagr"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockIndicators" ADD CONSTRAINT "StockIndicators_stockProfitCagrId_fkey" FOREIGN KEY ("stockProfitCagrId") REFERENCES "StockCagr"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiiIndicators" ADD CONSTRAINT "FiiIndicators_fiiRentabilityId_fkey" FOREIGN KEY ("fiiRentabilityId") REFERENCES "FiiRentability"("id") ON DELETE SET NULL ON UPDATE CASCADE;
