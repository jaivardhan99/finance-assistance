import { TrendingUp, Percent, LineChart, DollarSign, Activity, Wallet, AlertTriangle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const username = useSelector((state: any) => state.auth?.user?.username);
  const portfolio = useSelector((state: any) => state.portfolio?.portfolio || []);
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
    const calculatePortfolioMetrics = async () => {
      if (!portfolio.length) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        let totalInvestment = 0;
        let currentValue = 0;

        // Process each stock in portfolio
        for (const stock of portfolio) {
          // Calculate investment
          const stockInvestment = stock.quantity * stock.buyPrice;
          totalInvestment += stockInvestment;

          // Get current price
          try {
            const response = await axios.get(`https://financialmodelingprep.com/api/v3/quote-short/${stock.symbol}?apikey=YOUR_API_KEY`);
            const currentPrice = response.data[0]?.price || stock.buyPrice;
            const stockCurrentValue = stock.quantity * currentPrice;
            currentValue += stockCurrentValue;
          } catch (error) {
            console.error(`Error fetching price for ${stock.symbol}:`, error);
            // Fallback to buy price if API fails
            currentValue += stockInvestment;
          }
        }

        // Calculate metrics
        const totalProfit = currentValue - totalInvestment;
        const profitPercentage = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
        
        // Simulate monthly change (in a real app, you'd compare to historical data)
        const monthlyChange = (Math.random() * 8) - 2;

        setPortfolioMetrics({
          totalInvestment,
          currentValue,
          totalProfit,
          profitPercentage,
          monthlyChange
        });

        // Set market trend based on portfolio performance and simulated market conditions
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
        console.error("Error calculating portfolio metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    calculatePortfolioMetrics();
  }, [portfolio]);

  // AI Insights based on portfolio performance
  const getAIInsights = () => {
    const insights = [];
    
    if (portfolioMetrics.profitPercentage < 0) {
      insights.push("💡 Consider dollar-cost averaging in this down market to potentially lower your average cost basis.");
    } else {
      insights.push("💡 Your portfolio is performing well. Consider taking some profits on high-performing assets.");
    }
    
    if (portfolio.length < 5) {
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
          >
            <Activity className="w-4 h-4 mr-2" />
            Refresh Data
          </motion.button>
        </div>
      </div>


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
            {portfolio.length > 0 ? (
              portfolio.slice(0, 3).map((stock, index) => (
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
                    <p className="font-medium">₹{stock.buyPrice.toFixed(2)}</p>
                    <p className="text-xs text-green-500">+2.4%</p>
                  </div>
                </div>
              ))
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