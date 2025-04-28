import { TrendingUp, Percent, LineChart, DollarSign, Activity, Wallet, AlertTriangle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Import the same stockData used in StockPrices component
const stockData = [
  {
    symbol: "AAPL",
    initialPrice: 196.98,
    initialChange: 1.42,
    high: 200,
    low: 192,
    data: [{ price: 190 }, { price: 192 }, { price: 194 }, { price: 196 }, { price: 198 }]
  },
  {
    symbol: "GOOGL",
    initialPrice: 151.16,
    initialChange: -0.85,
    high: 155,
    low: 149,
    data: [{ price: 150 }, { price: 152 }, { price: 151 }, { price: 149 }, { price: 151 }]
  },
  {
    symbol: "TSLA",
    initialPrice: 241.37,
    initialChange: 2.03,
    high: 245,
    low: 235,
    data: [{ price: 230 }, { price: 233 }, { price: 238 }, { price: 240 }, { price: 241 }]
  },
  {
    symbol: "MSFT",
    initialPrice: 367.78,
    initialChange: 0.73,
    high: 370,
    low: 360,
    data: [{ price: 362 }, { price: 365 }, { price: 366 }, { price: 368 }, { price: 367 }]
  },
  {
    symbol: "AMZN",
    initialPrice: 143.12,
    initialChange: -1.25,
    high: 147,
    low: 141,
    data: [{ price: 144 }, { price: 142 }, { price: 143 }, { price: 144 }, { price: 143 }]
  },
  {
    symbol: "META",
    initialPrice: 318.77,
    initialChange: 0.92,
    high: 322,
    low: 310,
    data: [{ price: 312 }, { price: 315 }, { price: 317 }, { price: 319 }, { price: 318 }]
  },
  {
    symbol: "NFLX",
    initialPrice: 388.11,
    initialChange: 2.45,
    high: 395,
    low: 380,
    data: [{ price: 384 }, { price: 386 }, { price: 387 }, { price: 389 }, { price: 388 }]
  },
  {
    symbol: "NVDA",
    initialPrice: 839.23,
    initialChange: -5.64,
    high: 850,
    low: 825,
    data: [{ price: 830 }, { price: 832 }, { price: 835 }, { price: 838 }, { price: 839 }]
  }
];

interface Stock {
  symbol: string;
  initialPrice: number;
  initialChange: number;
  high: number;
  low: number;
  data: { price: number }[];
}

interface PortfolioStock extends Stock {
  quantity: number;
  purchasePrice: number;
  purchaseDate?: string;
}

export default function Dashboard() {
  const username = useSelector((state: any) => state.auth?.user?.username);
  const [userStocks, setUserStocks] = useState<PortfolioStock[]>([]);
  const [portfolioMetrics, setPortfolioMetrics] = useState({
    totalInvestment: 0,
    currentValue: 0,
    totalProfit: 0,
    profitPercentage: 0,
    monthlyChange: 0
  });
  const [marketTrend, setMarketTrend] = useState({ status: 'Bullish', strength: 'Strong', color: 'text-green-600' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      if (!username) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        // Use the same API call as StockPrices component
        const res = await axios.get(`http://localhost:3000/stocks/getPortfolio/${username}`);
        const portfolioStocks = res.data.portfolio;

        // Map the portfolio data with the stock market data (same as StockPrices)
        const enrichedStocks = portfolioStocks.map((portfolioItem: any) => {
          const marketData = stockData.find(stock => stock.symbol === portfolioItem.symbol);
          if (!marketData) return null;
          
          return {
            ...marketData,
            quantity: portfolioItem.quantity,
            purchasePrice: portfolioItem.purchasePrice,
            purchaseDate: portfolioItem.purchaseDate
          };
        }).filter(Boolean);

        setUserStocks(enrichedStocks);

        // Calculate metrics using the same methods as StockPrices
        const totalValue = enrichedStocks.reduce((sum, stock) => {
          return sum + (stock.initialPrice * stock.quantity);
        }, 0);
        
        const totalInvestment = enrichedStocks.reduce((sum, stock) => {
          return sum + (stock.purchasePrice * stock.quantity);
        }, 0);
        
        const totalProfit = totalValue - totalInvestment;
        const profitPercentage = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
        
        // Simulate monthly change based on current performance trend
        // In a real app, you would compare with historical data
        const monthlyChange = profitPercentage > 0 
          ? profitPercentage * (0.8 + Math.random() * 0.4) 
          : profitPercentage * (0.6 + Math.random() * 0.8);

        setPortfolioMetrics({
          totalInvestment,
          currentValue: totalValue,
          totalProfit,
          profitPercentage,
          monthlyChange
        });

        // Set market trend based on portfolio performance
        if (profitPercentage > 5) {
          setMarketTrend({ status: 'Bullish', strength: 'Strong', color: 'text-green-600' });
        } else if (profitPercentage > 0) {
          setMarketTrend({ status: 'Bullish', strength: 'Moderate', color: 'text-green-500' });
        } else if (profitPercentage > -5) {
          setMarketTrend({ status: 'Bearish', strength: 'Moderate', color: 'text-red-500' });
        } else {
          setMarketTrend({ status: 'Bearish', strength: 'Strong', color: 'text-red-600' });
        }
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStocks();
  }, [username]);

  // AI Insights based on portfolio performance
  const getAIInsights = () => {
    const insights = [];
    
    if (portfolioMetrics.profitPercentage < 0) {
      insights.push("💡 Consider dollar-cost averaging in this down market to potentially lower your average cost basis.");
    } else {
      insights.push("💡 Your portfolio is performing well. Consider taking some profits on high-performing assets.");
    }
    
    if (userStocks.length < 5) {
      insights.push("⚠️ Your portfolio diversity is limited. Consider adding assets from different sectors.");
    }
    
    if (marketTrend.status === 'Bearish') {
      insights.push("📈 Market volatility detected—consider reviewing your risk tolerance and asset allocation.");
    }
    
    // Always add this recommendation
    insights.push("💰 Emergency fund recommendation: Maintain 3-6 months of expenses in liquid assets.");
    
    return insights;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
    const fetchStocks = async () => {
      if (!username) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Re-fetch portfolio data
        const res = await axios.get(`http://localhost:3000/stocks/getPortfolio/${username}`);
        const portfolioStocks = res.data.portfolio;

        const enrichedStocks = portfolioStocks.map((portfolioItem: any) => {
          const marketData = stockData.find(stock => stock.symbol === portfolioItem.symbol);
          if (!marketData) return null;
          
          return {
            ...marketData,
            quantity: portfolioItem.quantity,
            purchasePrice: portfolioItem.purchasePrice,
            purchaseDate: portfolioItem.purchaseDate
          };
        }).filter(Boolean);

        setUserStocks(enrichedStocks);

        // Recalculate metrics
        const totalValue = enrichedStocks.reduce((sum, stock) => {
          return sum + (stock.initialPrice * stock.quantity);
        }, 0);
        
        const totalInvestment = enrichedStocks.reduce((sum, stock) => {
          return sum + (stock.purchasePrice * stock.quantity);
        }, 0);
        
        const totalProfit = totalValue - totalInvestment;
        const profitPercentage = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
        
        // Update monthly change with slight variation to simulate market movement
        const monthlyChange = profitPercentage > 0 
          ? profitPercentage * (0.75 + Math.random() * 0.5) 
          : profitPercentage * (0.5 + Math.random() * 0.9);

        setPortfolioMetrics({
          totalInvestment,
          currentValue: totalValue,
          totalProfit,
          profitPercentage,
          monthlyChange
        });

        // Update market trend
        if (profitPercentage > 5) {
          setMarketTrend({ status: 'Bullish', strength: 'Strong', color: 'text-green-600' });
        } else if (profitPercentage > 0) {
          setMarketTrend({ status: 'Bullish', strength: 'Moderate', color: 'text-green-500' });
        } else if (profitPercentage > -5) {
          setMarketTrend({ status: 'Bearish', strength: 'Moderate', color: 'text-red-500' });
        } else {
          setMarketTrend({ status: 'Bearish', strength: 'Strong', color: 'text-red-600' });
        }
      } catch (error) {
        console.error("Failed to refresh portfolio data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStocks();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-6 space-y-8"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-indigo-600">📊 Financial Dashboard</h1>
          {username && <p className="text-sm text-gray-600">Welcome, {username} 👋</p>}
        </div>
        <div className="mt-2 md:mt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
            onClick={handleRefreshData}
            disabled={isLoading}
          >
            <Activity className="w-4 h-4 mr-2" />
            {isLoading ? "Refreshing..." : "Refresh Data"}
          </motion.button>
        </div>
      </div>

      Portfolio Summary (Same as in StockPrices)
      {userStocks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >

        </motion.div>
      )}

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Portfolio Value Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-2xl backdrop-blur-md bg-white/70 border border-gray-200 shadow-lg p-5 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Portfolio Value</p>
              <h2 className="text-2xl font-semibold">
                {isLoading ? "Loading..." : formatCurrency(portfolioMetrics.currentValue)}
              </h2>
              <span className={`text-sm ${portfolioMetrics.profitPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {isLoading ? "" : `${portfolioMetrics.profitPercentage >= 0 ? '+' : ''}${portfolioMetrics.profitPercentage.toFixed(2)}%`}
              </span>
            </div>
            <TrendingUp className={`w-7 h-7 ${portfolioMetrics.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </motion.div>
        
        {/* Monthly Returns Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-2xl backdrop-blur-md bg-white/70 border border-gray-200 shadow-lg p-5 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Returns</p>
              <h2 className={`text-2xl font-semibold ${portfolioMetrics.monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {isLoading ? "Loading..." : `${portfolioMetrics.monthlyChange >= 0 ? '+' : ''}${portfolioMetrics.monthlyChange.toFixed(2)}%`}
              </h2>
              <span className="text-gray-500 text-sm">vs. previous month</span>
            </div>
            <Percent className="text-indigo-600 w-7 h-7" />
          </div>
        </motion.div>
        
        {/* Market Trend Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-2xl backdrop-blur-md bg-white/70 border border-gray-200 shadow-lg p-5 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Market Trend</p>
              <h2 className={`text-2xl font-semibold ${marketTrend.color}`}>
                {marketTrend.status}
              </h2>
              <span className={`text-sm ${marketTrend.color}`}>{marketTrend.strength}</span>
            </div>
            <LineChart className="text-violet-600 w-7 h-7" />
          </div>
        </motion.div>
      </div>

      {/* AI Insights Section */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="rounded-2xl backdrop-blur-md bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-100 shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-indigo-800">🧠 AI Insights</h3>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">Updated Today</span>
        </div>
        
        <ul className="space-y-3">
          {getAIInsights().map((insight, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start p-3 bg-white/80 rounded-lg shadow-sm"
            >
              <span className="text-gray-700">{insight}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Risk Alert */}
      {portfolioMetrics.profitPercentage < -5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-center"
        >
          <AlertTriangle className="text-red-500 w-5 h-5 mr-3" />
          <div>
            <h4 className="font-medium text-red-800">Risk Alert</h4>
            <p className="text-sm text-red-600">Your portfolio is experiencing significant volatility. Consider reviewing your asset allocation.</p>
          </div>
        </motion.div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performers */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="rounded-2xl backdrop-blur-md bg-white/70 border border-gray-200 shadow-lg p-5"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Performers</h3>
          <div className="space-y-2">
            {userStocks.length > 0 ? (
              // Sort by performance and get top 3
              [...userStocks]
                .sort((a, b) => {
                  const aReturn = ((a.initialPrice - a.purchasePrice) / a.purchasePrice) * 100;
                  const bReturn = ((b.initialPrice - b.purchasePrice) / b.purchasePrice) * 100;
                  return bReturn - aReturn;
                })
                .slice(0, 3)
                .map((stock, index) => {
                  const stockReturn = ((stock.initialPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <span className="font-medium text-indigo-700">{stock.symbol.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{stock.symbol}</p>
                          <p className="text-xs text-gray-500">{stock.quantity} shares</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{stock.initialPrice.toFixed(2)}</p>
                        <p className={`text-xs ${stockReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stockReturn >= 0 ? '+' : ''}{stockReturn.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-sm text-gray-500 p-2">No stocks in portfolio</p>
            )}
          </div>
          <button className="w-full mt-3 text-sm text-indigo-600 flex items-center justify-center hover:text-indigo-800">
            View all stocks <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </motion.div>
        
        {/* Market News */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="rounded-2xl backdrop-blur-md bg-white/70 border border-gray-200 shadow-lg p-5"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Market News</h3>
          <div className="space-y-3">
            <div className="p-2 hover:bg-gray-50 rounded-lg">
              <p className="font-medium">RBI Announces New Monetary Policy</p>
              <p className="text-xs text-gray-500">2 hours ago · Financial Times</p>
            </div>
            <div className="p-2 hover:bg-gray-50 rounded-lg">
              <p className="font-medium">Tech Sector Sees Strong Growth in Q2</p>
              <p className="text-xs text-gray-500">5 hours ago · Economic Times</p>
            </div>
            <div className="p-2 hover:bg-gray-50 rounded-lg">
              <p className="font-medium">Global Markets React to Economic Data</p>
              <p className="text-xs text-gray-500">Yesterday · Bloomberg</p>
            </div>
          </div>
          <button className="w-full mt-3 text-sm text-indigo-600 flex items-center justify-center hover:text-indigo-800">
            Read more news <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}