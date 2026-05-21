import { after, before, describe, it } from "node:test";
import { prisma } from "../../db/client.js";
import assert from "node:assert";
import { mockStockCreate } from "../__fixtures__/yahooFinance.js";
import { mockFiiCreate } from "../__fixtures__/scratchFIIData.js";

describe("stockIndicators integration", () => {
  before(async () => {
    await prisma.stockIndicators.deleteMany();
    await prisma.stockCagr.deleteMany();
  });

  after(async () => {
    await prisma.$disconnect();
  });

  it("should create stock with cagr relation", async () => {
    const stock = await prisma.stockIndicators.create({
      data: mockStockCreate,
      include: {
        cagrProfit: true,
        cagrRevenue: true,
      },
    });

    assert.notStrictEqual(stock.cagrProfit, null);
    assert.notStrictEqual(stock.cagrRevenue, null);
    assert.notStrictEqual(stock.assetType, null);
    assert.notStrictEqual(stock.date, null);
    assert.notStrictEqual(stock.dy, null);
    assert.notStrictEqual(stock.evEbit, null);
    assert.notStrictEqual(stock.grossDebtNetWorth, null);
    assert.notStrictEqual(stock.liquidity, null);
    assert.notStrictEqual(stock.netDebtDivideByEBITDA, null);
    assert.notStrictEqual(stock.pl, null);
    assert.notStrictEqual(stock.price, null);
    assert.notStrictEqual(stock.profitMargin, null);
    assert.notStrictEqual(stock.roe, null);
    assert.notStrictEqual(stock.roic, null);
    assert.notStrictEqual(stock.sector, null);
    assert.notStrictEqual(stock.ticker, null);

    assert.strictEqual(stock.assetType, mockStockCreate.assetType);
    assert.strictEqual(stock.sector, mockStockCreate.sector);
    assert.strictEqual(stock.ticker, mockStockCreate.ticker);
    assert.strictEqual(stock.name, mockStockCreate.name);
    assert.strictEqual(stock.date, mockStockCreate.date);
    assert.strictEqual(Number(stock.price), mockStockCreate.price);
    assert.strictEqual(Number(stock.dy), mockStockCreate.dy);
    assert.strictEqual(Number(stock.evEbit), mockStockCreate.evEbit);
    assert.strictEqual(
      Number(stock.grossDebtNetWorth),
      mockStockCreate.grossDebtNetWorth,
    );
    assert.strictEqual(Number(stock.liquidity), mockStockCreate.liquidity);
    assert.strictEqual(Number(stock.pl), mockStockCreate.pl);
    assert.strictEqual(Number(stock.pvp), mockStockCreate.pvp);
    assert.strictEqual(
      Number(stock.profitMargin),
      mockStockCreate.profitMargin,
    );
    assert.strictEqual(Number(stock.roic), mockStockCreate.roic);
    assert.strictEqual(
      Number(stock.netDebtDivideByEBITDA),
      mockStockCreate.netDebtDivideByEBITDA,
    );
    assert.strictEqual(Number(stock.roe), mockStockCreate.roe);
    assert.strictEqual(
      Number(stock.cagrProfit?.value),
      mockStockCreate.cagrProfit?.create?.value,
    );
    assert.strictEqual(
      Number(stock.cagrRevenue?.value),
      mockStockCreate.cagrRevenue?.create?.value,
    );
  });

  it("should return only latest stock ticker", async () => {
    await prisma.stockIndicators.create({
      data: mockStockCreate,
    });

    const result: any[] = await prisma.$queryRaw`
    SELECT * FROM latest_stock_indicators
  `;

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].ticker, mockStockCreate.ticker);
  });
});

describe("fiiIndicators integration", () => {
  before(async () => {
    await prisma.fiiIndicators.deleteMany();
    await prisma.fiiRentability.deleteMany();
  });

  after(async () => {
    await prisma.$disconnect();
  });

  it("should create fii with rentability relation", async () => {
    const fii = await prisma.fiiIndicators.create({
      data: mockFiiCreate,
      include: {
        rentability: true,
      },
    });

    assert.notStrictEqual(fii.assetType, null);
    assert.notStrictEqual(fii.assetsNumber, null);
    assert.notStrictEqual(fii.dy, null);
    assert.notStrictEqual(fii.date, null);
    assert.notStrictEqual(fii.financialVacancy, null);
    assert.notStrictEqual(fii.fiiType, null);
    assert.notStrictEqual(fii.lastDividend, null);
    assert.notStrictEqual(fii.rentability, null);
    assert.notStrictEqual(fii.liquidity, null);
    assert.notStrictEqual(fii.name, null);
    assert.notStrictEqual(fii.physicalVacancy, null);
    assert.notStrictEqual(fii.price, null);
    assert.notStrictEqual(fii.pvp, null);
    assert.notStrictEqual(fii.quotaHolders, null);
    assert.notStrictEqual(fii.ticker, null);

    assert.strictEqual(fii.assetType, mockFiiCreate.assetType);
    assert.strictEqual(fii.assetsNumber, mockFiiCreate.assetsNumber);
    assert.strictEqual(fii.name, mockFiiCreate.name);
    assert.strictEqual(fii.fiiType, mockFiiCreate.fiiType);
    assert.strictEqual(fii.ticker, mockFiiCreate.ticker);
    assert.strictEqual(fii.date, mockFiiCreate.date);
    assert.strictEqual(Number(fii.price), mockFiiCreate.price);
    assert.strictEqual(Number(fii.dy), mockFiiCreate.dy);
    assert.strictEqual(
      Number(fii.financialVacancy),
      mockFiiCreate.financialVacancy,
    );
    assert.strictEqual(Number(fii.lastDividend), mockFiiCreate.lastDividend);
    assert.strictEqual(Number(fii.liquidity), mockFiiCreate.liquidity);
    assert.strictEqual(Number(fii.pvp), mockFiiCreate.pvp);
    assert.strictEqual(Number(fii.vpc), mockFiiCreate.vpc);
    assert.strictEqual(Number(fii.quotaHolders), mockFiiCreate.quotaHolders);
    assert.strictEqual(
      Number(fii.rentability?.value),
      mockFiiCreate.rentability?.create?.value,
    );
    assert.strictEqual(
      Number(fii.physicalVacancy),
      mockFiiCreate.physicalVacancy,
    );
  });

  it("should return only latest fii ticker", async () => {
    await prisma.fiiIndicators.create({
      data: mockFiiCreate,
    });

    const result: any[] = await prisma.$queryRaw`
    SELECT * FROM latest_fii_indicators
  `;

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].ticker, mockFiiCreate.ticker);
  });
});
