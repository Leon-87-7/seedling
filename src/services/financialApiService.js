// Financial API Service
// This service handles integration with various financial data providers
// Currently supports Alpha Vantage, IEX Cloud, and Yahoo Finance

import { stockDataService } from './firestoreService';

// API Configuration
const API_CONFIG = {
  ALPHA_VANTAGE: {
    baseUrl: 'https://www.alphavantage.co/query',
    apiKey: process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'demo', // Replace with your API key
    rateLimitPerMinute: 5,
    rateLimitPerDay: 500
  },
  
  IEX_CLOUD: {
    baseUrl: 'https://cloud.iexapis.com/stable',
    apiKey: process.env.REACT_APP_IEX_CLOUD_API_KEY || 'pk_test', // Replace with your API key
    rateLimitPerSecond: 100,
    sandbox: process.env.NODE_ENV !== 'production'
  },
  
  YAHOO_FINANCE: {
    baseUrl: 'https://query1.finance.yahoo.com/v8/finance/chart',
    // Yahoo Finance API doesn't require an API key but has rate limits
    rateLimitPerMinute: 100
  }
};

// API Client for Alpha Vantage
class AlphaVantageClient {
  constructor() {
    this.baseUrl = API_CONFIG.ALPHA_VANTAGE.baseUrl;
    this.apiKey = API_CONFIG.ALPHA_VANTAGE.apiKey;
    this.requestCount = 0;
    this.lastRequestTime = Date.now();
  }

  async makeRequest(params) {
    // Rate limiting
    if (this.requestCount >= API_CONFIG.ALPHA_VANTAGE.rateLimitPerMinute) {
      const timeElapsed = Date.now() - this.lastRequestTime;
      if (timeElapsed < 60000) {
        throw new Error('Alpha Vantage rate limit exceeded. Please wait before making more requests.');
      } else {
        this.requestCount = 0;
        this.lastRequestTime = Date.now();
      }
    }

    const url = new URL(this.baseUrl);
    url.searchParams.append('apikey', this.apiKey);
    
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });

    try {
      const response = await fetch(url);
      this.requestCount++;
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Alpha Vantage API request failed:', error);
      throw error;
    }
  }

  async getQuote(symbol) {
    const data = await this.makeRequest({
      function: 'GLOBAL_QUOTE',
      symbol: symbol
    });

    const quote = data['Global Quote'];
    if (!quote) {
      throw new Error('No quote data available for ' + symbol);
    }

    return {
      symbol: quote['01. symbol'],
      currentPrice: parseFloat(quote['05. price']),
      previousClose: parseFloat(quote['08. previous close']),
      dayChange: parseFloat(quote['09. change']),
      dayChangePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      lastUpdated: new Date(quote['07. latest trading day'])
    };
  }

  async getCompanyOverview(symbol) {
    const data = await this.makeRequest({
      function: 'OVERVIEW',
      symbol: symbol
    });

    if (!data || Object.keys(data).length === 0) {
      throw new Error('No company overview data available for ' + symbol);
    }

    return {
      symbol: data.Symbol,
      name: data.Name,
      sector: data.Sector,
      industry: data.Industry,
      exchange: data.Exchange,
      marketCap: parseFloat(data.MarketCapitalization) || 0,
      peRatio: parseFloat(data.PERatio) || 0,
      pbRatio: parseFloat(data.PriceToBookRatio) || 0,
      pegRatio: parseFloat(data.PEGRatio) || 0,
      roe: parseFloat(data.ReturnOnEquityTTM) || 0,
      roa: parseFloat(data.ReturnOnAssetsTTM) || 0,
      debtToEquity: parseFloat(data.DebtToEquityRatio) || 0,
      currentRatio: parseFloat(data.CurrentRatio) || 0,
      quickRatio: parseFloat(data.QuickRatio) || 0,
      grossMargin: parseFloat(data.GrossProfitTTM) / parseFloat(data.RevenueTTM) || 0,
      bookValue: parseFloat(data.BookValue) || 0,
      dividendYield: parseFloat(data.DividendYield) || 0,
      beta: parseFloat(data.Beta) || 0
    };
  }
}

// API Client for IEX Cloud
class IEXCloudClient {
  constructor() {
    this.baseUrl = API_CONFIG.IEX_CLOUD.baseUrl;
    this.apiKey = API_CONFIG.IEX_CLOUD.apiKey;
    this.sandbox = API_CONFIG.IEX_CLOUD.sandbox;
    
    if (this.sandbox) {
      this.baseUrl = this.baseUrl.replace('cloud.iexapis.com/stable', 'sandbox.iexapis.com/stable');
    }
  }

  async makeRequest(endpoint) {
    const url = `${this.baseUrl}${endpoint}?token=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`IEX Cloud API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('IEX Cloud API request failed:', error);
      throw error;
    }
  }

  async getQuote(symbol) {
    const data = await this.makeRequest(`/stock/${symbol}/quote`);
    
    return {
      symbol: data.symbol,
      name: data.companyName,
      currentPrice: data.latestPrice,
      previousClose: data.previousClose,
      dayChange: data.change,
      dayChangePercent: data.changePercent * 100,
      volume: data.latestVolume,
      marketCap: data.marketCap,
      peRatio: data.peRatio,
      lastUpdated: new Date(data.latestUpdate)
    };
  }

  async getKeyStats(symbol) {
    const data = await this.makeRequest(`/stock/${symbol}/stats`);
    
    return {
      symbol: symbol,
      peRatio: data.peRatio,
      pbRatio: data.priceToBook,
      pegRatio: data.pegRatio,
      roe: data.returnOnEquity,
      roa: data.returnOnAssets,
      currentRatio: data.currentRatio,
      quickRatio: data.quickRatio,
      debtToEquity: data.debtToEquity,
      grossMargin: data.grossProfit / data.revenue,
      operatingMargin: data.operatingIncome / data.revenue,
      netMargin: data.netIncome / data.revenue
    };
  }
}

// Yahoo Finance Client (free, no API key required)
class YahooFinanceClient {
  constructor() {
    this.baseUrl = API_CONFIG.YAHOO_FINANCE.baseUrl;
  }

  async makeRequest(symbol) {
    const url = `${this.baseUrl}/${symbol}?interval=1d&range=1d`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Yahoo Finance API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Yahoo Finance API request failed:', error);
      throw error;
    }
  }

  async getQuote(symbol) {
    const data = await this.makeRequest(symbol);
    const result = data.chart.result[0];
    const meta = result.meta;
    
    return {
      symbol: meta.symbol,
      currentPrice: meta.regularMarketPrice,
      previousClose: meta.previousClose,
      dayChange: meta.regularMarketPrice - meta.previousClose,
      dayChangePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
      volume: meta.regularMarketVolume,
      lastUpdated: new Date()
    };
  }
}

// Main Financial API Service
export class FinancialApiService {
  constructor() {
    this.alphaVantage = new AlphaVantageClient();
    this.iexCloud = new IEXCloudClient();
    this.yahooFinance = new YahooFinanceClient();
    
    // Default to Alpha Vantage, fallback to others
    this.primaryProvider = 'alpha_vantage';
  }

  // Get real-time stock quote
  async getStockQuote(symbol) {
    let quote = null;
    let lastError = null;

    // Try providers in order of preference
    const providers = [
      { name: 'alpha_vantage', client: this.alphaVantage },
      { name: 'iex_cloud', client: this.iexCloud },
      { name: 'yahoo_finance', client: this.yahooFinance }
    ];

    for (const provider of providers) {
      try {
        quote = await provider.client.getQuote(symbol);
        quote.dataSource = provider.name;
        break;
      } catch (error) {
        console.warn(`${provider.name} failed for ${symbol}:`, error.message);
        lastError = error;
      }
    }

    if (!quote) {
      throw new Error(`All providers failed to get quote for ${symbol}: ${lastError?.message}`);
    }

    return quote;
  }

  // Get comprehensive stock data
  async getStockData(symbol) {
    try {
      // Try to get cached data first
      const cachedData = await stockDataService.getStockData(symbol);
      
      // Check if cached data is still fresh (less than 1 hour old)
      if (cachedData && cachedData.lastUpdated) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const lastUpdated = new Date(cachedData.lastUpdated.seconds * 1000);
        
        if (lastUpdated > oneHourAgo) {
          return cachedData;
        }
      }

      // Get fresh data from API
      const [quote, overview] = await Promise.allSettled([
        this.getStockQuote(symbol),
        this.getCompanyOverview(symbol)
      ]);

      const quoteData = quote.status === 'fulfilled' ? quote.value : null;
      const overviewData = overview.status === 'fulfilled' ? overview.value : null;

      if (!quoteData) {
        throw new Error(`Failed to get quote data for ${symbol}`);
      }

      // Combine quote and overview data
      const stockData = {
        symbol: symbol,
        name: overviewData?.name || quoteData.name || symbol,
        sector: overviewData?.sector || 'Unknown',
        exchange: overviewData?.exchange || 'Unknown',
        currentPrice: quoteData.currentPrice,
        previousClose: quoteData.previousClose,
        dayChange: quoteData.dayChange,
        dayChangePercent: quoteData.dayChangePercent,
        volume: quoteData.volume,
        
        metrics: {
          peRatio: overviewData?.peRatio || quoteData.peRatio || 0,
          pbRatio: overviewData?.pbRatio || 0,
          pegRatio: overviewData?.pegRatio || 0,
          roe: overviewData?.roe || 0,
          roa: overviewData?.roa || 0,
          debtToEquity: overviewData?.debtToEquity || 0,
          currentRatio: overviewData?.currentRatio || 0,
          quickRatio: overviewData?.quickRatio || 0,
          grossMargin: overviewData?.grossMargin || 0,
          operatingMargin: overviewData?.operatingMargin || 0,
          netMargin: overviewData?.netMargin || 0
        },
        
        valuation: await this.calculateValuation(symbol, quoteData, overviewData),
        
        dataSource: quoteData.dataSource,
        lastUpdated: new Date(),
        updateFrequency: 'daily'
      };

      // Cache the data
      await stockDataService.cacheStockData(symbol, stockData);
      
      return stockData;
    } catch (error) {
      console.error(`Failed to get stock data for ${symbol}:`, error);
      throw error;
    }
  }

  // Get company overview (fundamental data)
  async getCompanyOverview(symbol) {
    try {
      return await this.alphaVantage.getCompanyOverview(symbol);
    } catch (error) {
      // Fallback to IEX Cloud for key stats
      try {
        return await this.iexCloud.getKeyStats(symbol);
      } catch (fallbackError) {
        console.warn('Both Alpha Vantage and IEX Cloud failed for overview:', error.message);
        return null;
      }
    }
  }

  // Calculate valuation metrics
  async calculateValuation(symbol, quoteData, overviewData) {
    try {
      const currentPrice = quoteData.currentPrice;
      const peRatio = overviewData?.peRatio || 0;
      const pbRatio = overviewData?.pbRatio || 0;
      const bookValue = overviewData?.bookValue || 0;
      const roe = overviewData?.roe || 0;
      
      // Calculate Graham Number (conservative valuation)
      let grahamNumber = 0;
      if (bookValue > 0 && roe > 0) {
        const eps = bookValue * roe / 100; // Approximate EPS
        grahamNumber = Math.sqrt(22.5 * eps * bookValue);
      }
      
      // Simple intrinsic value calculation (DCF approximation)
      const intrinsicValue = this.estimateIntrinsicValue(overviewData);
      
      // Determine rating based on multiple factors
      let rating = 'Fair Value';
      let confidenceScore = 50;
      
      if (grahamNumber > 0 && currentPrice < grahamNumber * 0.8) {
        rating = 'Undervalued';
        confidenceScore = 80;
      } else if (intrinsicValue > 0 && currentPrice < intrinsicValue * 0.9) {
        rating = 'Undervalued';
        confidenceScore = 70;
      } else if (peRatio > 0 && peRatio < 15 && pbRatio > 0 && pbRatio < 1.5) {
        rating = 'Undervalued';
        confidenceScore = 60;
      } else if (peRatio > 25 || pbRatio > 3) {
        rating = 'Overvalued';
        confidenceScore = 65;
      }
      
      return {
        intrinsicValue: intrinsicValue,
        grahamNumber: grahamNumber,
        bookValue: bookValue,
        tangibleBookValue: bookValue, // Simplified
        rating: rating,
        confidenceScore: confidenceScore
      };
    } catch (error) {
      console.error('Error calculating valuation:', error);
      return {
        intrinsicValue: 0,
        grahamNumber: 0,
        bookValue: 0,
        tangibleBookValue: 0,
        rating: 'Unknown',
        confidenceScore: 0
      };
    }
  }

  // Estimate intrinsic value using simplified DCF
  estimateIntrinsicValue(overviewData) {
    if (!overviewData) return 0;
    
    try {
      const { roe, bookValue, peRatio } = overviewData;
      
      if (!roe || !bookValue || roe <= 0 || bookValue <= 0) return 0;
      
      // Simplified DCF: Assume 10% discount rate, 3% perpetual growth
      const discountRate = 0.10;
      const perpetualGrowth = 0.03;
      const growthRate = Math.min(roe / 100 * 0.6, 0.15); // Conservative growth assumption
      
      const eps = bookValue * roe / 100; // Approximate EPS
      const futureEps = eps * Math.pow(1 + growthRate, 5); // 5-year projection
      const terminalValue = futureEps * (1 + perpetualGrowth) / (discountRate - perpetualGrowth);
      
      // Present value
      const presentValue = terminalValue / Math.pow(1 + discountRate, 5);
      
      return presentValue;
    } catch (error) {
      return 0;
    }
  }

  // Get multiple stocks data efficiently
  async getMultipleStocksData(symbols) {
    const batchSize = 5; // Respect API rate limits
    const results = [];
    
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const batchPromises = batch.map(symbol => 
        this.getStockData(symbol).catch(error => {
          console.warn(`Failed to get data for ${symbol}:`, error.message);
          return null;
        })
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(result => result !== null));
      
      // Wait between batches to respect rate limits
      if (i + batchSize < symbols.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
}

// Export singleton instance
export const financialApiService = new FinancialApiService();

// Helper functions for sector analysis
export const sectorAnalysisHelpers = {
  // Calculate sector metrics from stock data
  calculateSectorMetrics(stocksData) {
    if (!stocksData || stocksData.length === 0) {
      return null;
    }
    
    const validStocks = stocksData.filter(stock => 
      stock && stock.currentPrice > 0 && stock.metrics
    );
    
    if (validStocks.length === 0) return null;
    
    const sum = (arr) => arr.reduce((a, b) => a + b, 0);
    const avg = (arr) => sum(arr) / arr.length;
    
    const prices = validStocks.map(stock => stock.currentPrice);
    const peRatios = validStocks.map(stock => stock.metrics.peRatio).filter(pe => pe > 0);
    const pbRatios = validStocks.map(stock => stock.metrics.pbRatio).filter(pb => pb > 0);
    const roeValues = validStocks.map(stock => stock.metrics.roe).filter(roe => roe > 0);
    
    return {
      stockCount: validStocks.length,
      meanPrice: avg(prices),
      medianPrice: prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)],
      averagePE: peRatios.length > 0 ? avg(peRatios) : 0,
      averagePB: pbRatios.length > 0 ? avg(pbRatios) : 0,
      averageROE: roeValues.length > 0 ? avg(roeValues) : 0,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    };
  },
  
  // Find undervalued stocks in a sector
  findUndervaluedStocks(stocksData, sectorMetrics) {
    if (!stocksData || !sectorMetrics) return [];
    
    return stocksData
      .filter(stock => {
        if (!stock || !stock.valuation) return false;
        
        const isBelowMean = stock.currentPrice < sectorMetrics.meanPrice;
        const isRatedUndervalued = stock.valuation.rating === 'Undervalued';
        const hasHighConfidence = stock.valuation.confidenceScore > 60;
        
        return isBelowMean && isRatedUndervalued && hasHighConfidence;
      })
      .sort((a, b) => a.currentPrice - b.currentPrice) // Sort by price ascending
      .slice(0, 10); // Return top 10 opportunities
  }
};