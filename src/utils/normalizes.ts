/**
 * Normalizes the dy value
 * @param {number} dy the dy value
 * @returns {number} the dy value normalized
 */
export const normalizeDy = (dy: number): number => {
  return dy > 1 ? dy : dy * 100;
};

/**
 * Normalizes ticker to correct check
 * @param {string} ticker the ticker to be normalized
 * @param {string} exchange exchange of the ticke
 * @returns {string} the ticker normalized
 */
export function normalizeTicker(ticker: string, exchange: string) {
  switch (exchange) {
    case "BVMF":
      return `${ticker}.SA`;

    case "NASDAQ":
      return ticker;

    case "NYSE":
      return ticker;

    case "CRYPTO":
      switch (ticker) {
        case "BITCOIN":
          return "BTC-USD";
        case "ETHEREUM":
          return "ETH-USD";
        default:
          return ticker;
      }

    default:
      return ticker;
  }
}

export function toPercent(value: number) {
  return Number((value * 100).toFixed(2));
}
