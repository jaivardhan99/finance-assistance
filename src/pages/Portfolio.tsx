import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { IndianRupee, PieChart, TrendingUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Portfolio = () => {
  const username = useSelector((state: any) => state.auth?.user?.username);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockPrices, setStockPrices] = useState({});
  
  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        if (!username) return;
        
        const response = await axios.get(`http://localhost:3000/stocks/getPortfolio/${username}`);
        setPortfolio(response.data.portfolio || []);
        
        // Fetch latest prices for portfolio stocks
        if (response.data.portfolio && response.data.portfolio.length > 0) {
          const symbols = response.data.portfolio.map(item => item.symbol);
          fetchStockPrices(symbols);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio data');
        setLoading(false);
      }
    };
    
    fetchPortfolio();
  }, [username]);
  
  // Fetch current stock prices
  const fetchStockPrices = async (symbols) => {
    try {
      // Replace with your actual stock price API call
      const response = await axios.get(`http://localhost:3000/stocks/prices`, {
        params: { symbols: symbols.join(',') }
      });
      
      setStockPrices(response.data.prices || {});
    } catch (err) {
      console.error('Error fetching stock prices:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate portfolio metrics - Updated to match StockPrices.tsx calculations
  const calculatePortfolioMetrics = () => {
    if (!portfolio.length) return { totalValue: 0, totalInvestment: 0, totalProfit: 0, profitPercentage: 0 };
    
    let totalValue = 0;
    let totalInvestment = 0;
    
    portfolio.forEach(stock => {
      const currentPrice = stockPrices[stock.symbol] || stock.purchasePrice;
      const stockValue = stock.quantity * currentPrice;
      const stockCost = stock.quantity * stock.purchasePrice;
      
      totalValue += stockValue;
      totalInvestment += stockCost;
    });
    
    const totalProfit = totalValue - totalInvestment;
    const profitPercentage = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
    
    return {
      totalValue,
      totalInvestment,
      totalProfit,
      profitPercentage
    };
  };
  
  const metrics = calculatePortfolioMetrics();
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [100000, 120000, 115000, 130000, 145000, 150000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Portfolio Performance',
      },
    },
  };

  if (loading) {
    return <div className="p-6 flex justify-center">Loading portfolio data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Portfolio Overview</h1>
      {username && <p className="text-sm text-gray-600">Welcome, {username} 👋</p>}
      
      {/* Portfolio Summary Component - Added from stockprices.tsx with corrected calculation */}
      {/* <div className="bg-white p-6 rounded-lg shadow-md mb-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Current Value</p>
            <p className="text-2xl font-bold">₹{metrics.totalValue.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Investment</p>
            <p className="text-2xl font-bold">₹{metrics.totalInvestment.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Profit/Loss</p>
            <p className={`text-2xl font-bold ${metrics.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{metrics.totalProfit.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Return</p>
            <p className={`text-2xl font-bold ${metrics.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.profitPercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
       */}
      {/* Original Cards Layout */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <IndianRupee className="h-8 w-8 text-indigo-600" />
            <h2 className="ml-3 text-lg font-medium text-gray-900">Total Value</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(metrics.totalValue)}</p>
          <div className={`mt-1 text-sm ${metrics.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.profitPercentage >= 0 ? '+' : ''}{metrics.profitPercentage.toFixed(2)}% overall
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <PieChart className="h-8 w-8 text-indigo-600" />
            <h2 className="ml-3 text-lg font-medium text-gray-900">Investment Summary</h2>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Investment Cost</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(metrics.totalInvestment)}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Value</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(metrics.totalValue)}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Gain/Loss</span>
                <span className={`text-sm font-medium ${metrics.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.totalProfit >= 0 ? '+' : ''}{formatCurrency(metrics.totalProfit)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-indigo-600" />
            <h2 className="ml-3 text-lg font-medium text-gray-900">Performance</h2>
          </div>
          <div className="mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Return %</p>
                <p className={`text-2xl font-bold ${metrics.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.profitPercentage >= 0 ? '+' : ''}{metrics.profitPercentage.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Positions</p>
                <p className="text-2xl font-bold text-gray-900">{portfolio.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <Line options={options} data={chartData} />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Holdings</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portfolio.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No stocks in portfolio. Add stocks to see them here.
                  </td>
                </tr>
              ) : (
                portfolio.map((stock, index) => {
                  const currentPrice = stockPrices[stock.symbol] || stock.purchasePrice;
                  const stockValue = stock.quantity * currentPrice;
                  const costBasis = stock.quantity * stock.purchasePrice;
                  const gain = stockValue - costBasis;
                  const gainPercent = costBasis > 0 ? (gain / costBasis) * 100 : 0;
                  
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stock.symbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stock.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(stock.purchasePrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(currentPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(stockValue)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${gainPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;