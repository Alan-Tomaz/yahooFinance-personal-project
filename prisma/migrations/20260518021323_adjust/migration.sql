-- AlterTable
ALTER TABLE "FiiIndicators" ALTER COLUMN "assetType" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FiiRentability" ALTER COLUMN "value" DROP NOT NULL,
ALTER COLUMN "periodYears" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StockCagr" ALTER COLUMN "value" DROP NOT NULL,
ALTER COLUMN "period" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StockIndicators" ALTER COLUMN "assetType" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;
