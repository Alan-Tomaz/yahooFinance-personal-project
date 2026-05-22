/**
 * Example of implementation of indicators search in Google Sheets using Google Apps Script.
 * This code search the indicators from the supabase and update the sheet fields with the new indicators.
 * Is necessary to add your supabase api url and your supabase api public key
 */
function updateIndicators() {
    Logger.log("======= Script Started =======")
    const SUPABASE_API_URL = "";
    const SUPABASE_API_PUBLIC_KEY = "";
    // GET SPREADSHEET DATA
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName("VARIABLE INCOME");

    // FETCH INDICATORS DATA
    const stockIndicators = fetchStockIndicatorsFromSupabase(SUPABASE_API_URL, SUPABASE_API_PUBLIC_KEY);

    // UPDATE INDICATOR FIELDS
    updateSpreadsheetFieldsStock(stockIndicators, sheet)

    Logger.log("======= Script Finished =======")
}

function updateSpreadsheetFieldsStock(indicators, sheet) {
    const START_ROW = 7;
    const TOTAL_ROWS = 31;
    const TOTAL_COLS = 26;

    // SAVES ALL FIELDS UP TO THE SPECIFIED COLUMNS AND ROWS
    const data = sheet
        .getRange(START_ROW, 1, TOTAL_ROWS, TOTAL_COLS)
        .getValues();

    // FIELDS WITH HEADERS
    const headers = data[0];

    // FIELDS TO BE UPDATED
    const cols = {
        symbol: headers.indexOf('Symbol'),
        date: headers.indexOf('Date'),
        sector: headers.indexOf('Sector'),
        assetType: headers.indexOf('Asset Type'),
        pe: headers.indexOf('P/E'),
        pbv: headers.indexOf('P/BV'),
        dy: headers.indexOf('DY'),
        roe: headers.indexOf('ROE'),
        roic: headers.indexOf('ROIC'),
        liquidity: headers.indexOf('Daily Liquidity'),
        revenueCAGR: headers.indexOf('CAGR Profit. (3 anos)'),
        profitCAGR: headers.indexOf('CAGR Revenue. (3 anos)'),
        evEbit: headers.indexOf('EV/EBIT'),
        debtToEquity: headers.indexOf('Debt/Equity'),
        debtToEBITDA: headers.indexOf('NetDebt/EBITDA'),
        profitMargin: headers.indexOf('Profit Margin')
    };

    // VALIDATES IF THE FIELD EXISTS
    Object.entries(cols).forEach(([key, value]) => {
        if (value === -1) {
            throw new Error(`Column not found: ${key}`);
        }
    });

    const tickerToRow = {};

    // MAPS THE SYMBOL WITH ITS RESPECTIVE ROW
    for (let i = 1; i < data.length; i++) {
        const ticker = data[i][cols.symbol];

        tickerToRow[ticker] = START_ROW + i;
    }

    Logger.log(indicators)

    // ITERATES OVER EACH STOCK AND MODIFIES THE FIELDS
    indicators.forEach(stock => {

        const row =
            tickerToRow[stock.ticker];

        if (row == null) return;

        const rowNumber = row;

        sheet.getRange(rowNumber, cols.date + 1)
            .setValue(stock.date ?? "");

        sheet.getRange(rowNumber, cols.sector + 1)
            .setValue(stock.sector ?? "");

        sheet.getRange(rowNumber, cols.pe + 1)
            .setValue(stock.pe ?? "");

        sheet.getRange(rowNumber, cols.pbv + 1)
            .setValue(stock.pbv ?? "");

        sheet.getRange(rowNumber, cols.dy + 1)
            .setValue(typeof stock.dy == "number" ? ((stock.dy ?? 0) / 100) : stock.dy ?? "");

        sheet.getRange(rowNumber, cols.roe + 1)
            .setValue(typeof stock.roe == "number" ? ((stock.roe ?? 0) / 100) : stock.roe ?? "");

        sheet.getRange(rowNumber, cols.roic + 1)
            .setValue(typeof stock.roic == "number" ? ((stock.roic ?? 0) / 100) : stock.roic ?? "");

        sheet.getRange(rowNumber, cols.liquidity + 1)
            .setValue(stock.liquidity ?? "");

        sheet.getRange(rowNumber, cols.profitMargin + 1)
            .setValue(typeof stock.profitMargin == "number" ? ((stock.profitMargin ?? 0) / 100) : stock.profitMargin ?? "");

        sheet.getRange(rowNumber, cols.evEbit + 1)
            .setValue(stock.evEbit ?? "");

        sheet.getRange(rowNumber, cols.debtToEBITDA + 1)
            .setValue(stock.netDebtDivideByEBITDA ?? "");

        sheet.getRange(rowNumber, cols.debtToEquity + 1)
            .setValue(stock.grossDebtNetWorth ?? "");

        sheet.getRange(rowNumber, cols.profitCAGR + 1)
            .setValue(typeof stock.profit_cagr_value == "number" ? ((stock.profit_cagr_value ?? 0) / 100) : stock.profit_cagr_value ?? "");

        sheet.getRange(rowNumber, cols.revenueCAGR + 1)
            .setValue(typeof stock.revenue_cagr_value == "number" ? ((stock.revenue_cagr_value ?? 0) / 100) : stock.revenue_cagr_value ?? "");

    });

    Logger.log("======= STOCK FIELDS UPDATED WITH NEW INDICATORS =======")
}

function fetchStockIndicatorsFromSupabase(supabaseApiUrl, supabaseApiPublicKey) {

    const url = supabaseApiUrl + "latest_stock_indicators";

    const options = {
        method: 'get',
        headers: {
            apikey: supabaseApiPublicKey,
            Authorization: 'Bearer ' + supabaseApiPublicKey,
            'Content-Type': 'application/json'
        }
    };

    // FETCH STOCK INDICATORS DATA
    const response = UrlFetchApp.fetch(url, options);

    const data = JSON.parse(response.getContentText());

    Logger.log("======= STOCKS RETURNED SUCCESSFULLY =======")

    return data;
}

updateIndicators()