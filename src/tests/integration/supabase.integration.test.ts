import { after, before, describe, it } from "node:test";
import { prisma } from "../../db/client.js";
import assert from "node:assert";
import { mockStockCreate, mockTicket } from "../__fixtures__/yahooFinance.js";
import { LANGUAGE } from "../../constants/config.js";
import { formatDate } from "../../utils/formatDate.js";

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

  it("should return only latest ticker", async () => {
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
