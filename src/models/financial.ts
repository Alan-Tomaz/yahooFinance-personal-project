export interface IFinancialIndicatorsBRL {
  ticker: string;
  date: string;
  name?: string;
  price?: number;
  pl?: number;
  pvp?: number;
  dy?: number;
  roe?: number;
  roic?: number;
  profitMargin?: number;
  evEbit: number;
  netDebtDivideByEBITDA?: number;
  grossDebtNetWorth?: number;
  cagrRevenue?: { value: number; period: number };
  cagrProfit?: { value: number; period: number };
  liquidity?: number;
  lastDividend?: number;
  vacancy?: number;
  financialVacancy?: number;
  delinquency?: number;
  numberOfAssets?: number;
}
