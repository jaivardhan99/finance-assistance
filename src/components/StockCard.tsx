import React, { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import axios from "axios";

// Types for News
interface NewsItem {
  headline: string;
  url: string;
  summary: string;
  source: string;
  datetime: number;
}

// Utility to fetch stock data
const fetchStockQuote = async (symbol: string) => {
  const API_KEY = "d01k811r01qile604qj0d01k811r01qile604qjg"; // replace with your API key
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

// Utility to fetch news data
const fetchStockNews = async (symbol: string) => {
  const API_KEY = "d01k811r01qile604qj0d01k811r01qile604qjg"; // replace with your API key
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);
  
  const fromDate = oneWeekAgo.toISOString().split('T')[0];
  const toDate = today.toISOString().split('T')[0];
  
  const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${API_KEY}`;
  
  try {
    const response = await axios.get(url);
    return response.data.slice(0, 3); // Get the 3 most recent news items
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

type StockCardProps = {
  symbol: string;
  initialPrice?: number;
  initialChange?: number;
  high?: number;
  low?: number;
  data?: { price: number }[];
  isPortfolio?: boolean;
  quantity?: number;
  purchasePrice?: number;
  purchaseDate?: string;
};

const StockCard: React.FC<StockCardProps> = ({ 
  symbol, 
  initialPrice = 0, 
  initialChange = 0, 
  high = 0, 
  low = 0, 
  data = [],
  isPortfolio = false,
  quantity = 0,
  purchasePrice = 0,
  purchaseDate
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [price, setPrice] = useState(initialPrice);
  const [change, setChange] = useState(initialChange);
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'news' | 'portfolio'>('details');
  const isPositive = change >= 0;

  // Portfolio calculations
  const currentValue = isPortfolio ? price * quantity : 0;
  const investmentValue = isPortfolio ? purchasePrice * quantity : 0;
  const profit = isPortfolio ? currentValue - investmentValue : 0;
  const profitPercentage = isPortfolio && investmentValue > 0 
    ? (profit / investmentValue) * 100 
    : 0;

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsFlipped((prev) => !prev);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchStockQuote(symbol);
        const newPrice = data.c || 0;
        const newChange = (data.c && data.pc) ? (data.c - data.pc) : 0;
        setPrice(newPrice);
        setChange(newChange);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchNews = async () => {
      setNewsLoading(true);
      try {
        const newsData = await fetchStockNews(symbol);
        setNews(newsData);
      } catch (error) {
        console.error("Error fetching news data:", error);
      } finally {
        setNewsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      fetchData();
      fetchNews();
      const interval = setInterval(fetchData, 30000); // Refresh stock data every 30 seconds
      return () => clearInterval(interval);
    }
  }, [symbol]);

  // Safe formatting functions to prevent errors
  const formatPrice = (value: number) => {
    return value !== undefined && value !== null ? value.toFixed(2) : "0.00";
  };

  // Format news date
  const formatNewsDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  // Format purchase date
  const formatPurchaseDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div
      className="relative w-full h-56 md:h-64 cursor-pointer [perspective:1000px] group"
      onClick={handleClick}
      onMouseEnter={() => typeof window !== 'undefined' && window.innerWidth >= 768 && setIsFlipped(true)}
      onMouseLeave={() => typeof window !== 'undefined' && window.innerWidth >= 768 && setIsFlipped(false)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl bg-slate-900 text-white p-4 shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-lg font-semibold">{symbol}</div>
          <div className={`text-2xl font-bold mt-2 ${isPositive ? "text-green-400" : "text-red-400"}`}>
          ₹{formatPrice(price)}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Change:{" "}
            <span className={isPositive ? "text-green-300" : "text-red-300"}>
              {isPositive ? "+" : ""}
              {formatPrice(change)}
            </span>
          </div>
          
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#4ade80" : "#f87171"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Portfolio summary on front card if applicable */}
          {isPortfolio && (
            <div className="mt-2 pt-2 border-t border-slate-700">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Shares: {quantity}</span>
                <span className={`${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {profit >= 0 ? "+" : ""}{formatPrice(profit)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Back Side */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 text-white p-4 shadow-2xl border border-slate-600 flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-600 mb-3">
            <button 
              className={`px-3 py-1 text-xs ${activeTab === 'details' ? 'border-b-2 border-blue-400 font-semibold' : 'text-gray-400'}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('details');
              }}
            >
              Details
            </button>
            <button 
              className={`px-3 py-1 text-xs ${activeTab === 'news' ? 'border-b-2 border-blue-400 font-semibold' : 'text-gray-400'}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('news');
              }}
            >
              News
            </button>
            {isPortfolio && (
              <button 
                className={`px-3 py-1 text-xs ${activeTab === 'portfolio' ? 'border-b-2 border-blue-400 font-semibold' : 'text-gray-400'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('portfolio');
                }}
              >
                Position
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'details' && (
              <div className="flex flex-col items-center justify-center text-center h-full">
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-300">High: </span>
                    <span className="text-green-400">₹{formatPrice(high)}</span>
                  </p>
                  <p>
                    <span className="text-gray-300">Low: </span>
                    <span className="text-red-400">₹{formatPrice(low)}</span>
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'news' && (
              <div className="text-sm overflow-y-auto h-full">
                {newsLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-400">Loading news...</p>
                  </div>
                ) : news.length > 0 ? (
                  <div className="space-y-2">
                    {news.map((item, idx) => (
                      <div key={idx} className="pb-2 border-b border-slate-600 last:border-b-0">
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-200 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.headline}
                        </a>
                        <p className="text-xs text-gray-400 mt-1">{formatNewsDate(item.datetime)} - {item.source}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-400">No recent news available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'portfolio' && isPortfolio && (
              <div className="flex flex-col h-full text-sm">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-slate-800 p-2 rounded">
                    <p className="text-gray-400 text-xs">Shares</p>
                    <p className="font-semibold">{quantity}</p>
                  </div>
                  <div className="bg-slate-800 p-2 rounded">
                    <p className="text-gray-400 text-xs">Avg. Cost</p>
                    <p className="font-semibold">${formatPrice(purchasePrice)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-slate-800 p-2 rounded">
                    <p className="text-gray-400 text-xs">Value</p>
                    <p className="font-semibold">${formatPrice(currentValue)}</p>
                  </div>
                  <div className="bg-slate-800 p-2 rounded">
                    <p className="text-gray-400 text-xs">Cost Basis</p>
                    <p className="font-semibold">${formatPrice(investmentValue)}</p>
                  </div>
                </div>
                
                <div className="bg-slate-800 p-2 rounded mb-2">
                  <p className="text-gray-400 text-xs">Profit/Loss</p>
                  <div className="flex justify-between items-center">
                    <p className={`font-semibold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${formatPrice(profit)}
                    </p>
                    <p className={`text-xs ${profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {profitPercentage >= 0 ? '+' : ''}{formatPrice(profitPercentage)}%
                    </p>
                  </div>
                </div>
                
                {purchaseDate && (
                  <div className="bg-slate-800 p-2 rounded">
                    <p className="text-gray-400 text-xs">Purchase Date</p>
                    <p className="font-semibold">{formatPurchaseDate(purchaseDate)}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-2 italic text-center">
            {typeof window !== "undefined" && window.innerWidth < 768
              ? "Tap to return"
              : "Hover to return"}
          </p>
        </div>
      </div>
      {loading && <div className="absolute inset-0 flex justify-center items-center text-white">Updating...</div>}
    </div>
  );
};

export default StockCard;