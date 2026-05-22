/*
  Warnings:

  - You are about to drop the column `pl` on the `StockIndicators` table. All the data in the column will be lost.
  - You are about to drop the column `pvp` on the `StockIndicators` table. All the data in the column will be lost.

*/
-- AlterTable

DROP VIEW IF EXISTS latest_stock_indicators;
DROP VIEW IF EXISTS latest_fii_indicators;

ALTER TABLE "StockIndicators" DROP COLUMN "pl",
DROP COLUMN "pvp",
ADD COLUMN     "pbv" DECIMAL(65,30),
ADD COLUMN     "pe" DECIMAL(65,30);

CREATE VIEW latest_stock_indicators AS
SELECT DISTINCT ON (s.ticker)
  s.*,

  cp.value  AS profit_cagr_value,
  cp."periodYears" AS profit_cagr_period,

  cr.value  AS revenue_cagr_value,
  cr."periodYears" AS revenue_cagr_period

FROM "StockIndicators" s

LEFT JOIN "StockCagr" cp
  ON s."stockProfitCagrId" = cp.id

LEFT JOIN "StockCagr" cr
  ON s."stockRevenueCagrId" = cr.id

ORDER BY s.ticker, s."createdAt" DESC;

CREATE VIEW latest_fii_indicators AS
SELECT DISTINCT ON (f.ticker)

  f.*,

  r.value AS rentability_value,
  r."periodYears" AS rentability_period

FROM "FiiIndicators" f

LEFT JOIN "FiiRentability" r
  ON f."fiiRentabilityId" = r.id

ORDER BY f.ticker, f."createdAt" DESC;