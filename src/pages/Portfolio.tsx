import React, { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { IndianRupee, PieChart, TrendingUp, Zap, AlertTriangle, Calendar, RefreshCw, BarChart3, Filter, Download } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    TimeScale
);

interface PortfolioItem {
    symbol: string;
    quantity: number;
    purchasePrice: number;
    purchaseDate: string;
    sector: string;
}

interface StockPrices {
    [symbol: string]: number;
}

interface PortfolioMetrics {
    totalValue: number;
    totalInvestment: number;
    totalProfit: number;
    profitPercentage: number;
}

interface HistoricalDataPoint {
    date: string;
    value: number;
}

interface MarketInsight {
    type: 'positive' | 'negative' | 'neutral' | 'warning';
    message: string;
}

interface SectorAllocation {
    sector: string;
    percentage: number;
    value: number;
}

const Portfolio = () => {
    const username = useSelector((state: any) => state.auth?.user?.username);
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stockPrices, setStockPrices] = useState<StockPrices>({});
    const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
    const [chartLoading, setChartLoading] = useState(true);
    const [chartError, setChartError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M' | '6M' | '1Y' | 'YTD' | 'ALL'>('3M');
    const [insights, setInsights] = useState<MarketInsight[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [riskScore, setRiskScore] = useState(0);
    const [sectorAllocation, setSectorAllocation] = useState<SectorAllocation[]>([]);
    const [topMovers, setTopMovers] = useState<{ symbol: string, change: number }[]>([]);
    const [forecastData, setForecastData] = useState<{ date: string, value: number, forecast: boolean }[]>([]);
    
    // Color palette for sector chart
    const sectorColors = [
        'rgb(99, 102, 241)', 'rgb(239, 68, 68)', 'rgb(16, 185, 129)', 
        'rgb(249, 115, 22)', 'rgb(59, 130, 246)', 'rgb(217, 70, 239)', 
        'rgb(234, 179, 8)', 'rgb(20, 184, 166)', 'rgb(168, 85, 247)'
    ];

    // Check authentication on component mount
    useEffect(() => {
        if (!username) {
            setError('Please log in to view your portfolio');
            setLoading(false);
            return;
        }
    }, [username]);

    // Fetch portfolio data
    useEffect(() => {
      const fetchPortfolioData = async () => {
          if (!username) return;
          
          setLoading(true);
          setError(null);
          try {
              // Include withCredentials to ensure cookies are sent
              const response = await axios.get(`http://localhost:3000/stocks/getPortfolio/${username}`, {
                  withCredentials: true
              });
              
              // Enhance portfolio data with mock sectors if not provided
              const enhancedPortfolio = (response.data.portfolio || []).map((item: PortfolioItem) => ({
                  ...item,
                  sector: item.sector || mockSectors[item.symbol] || 'Other'
              }));
              
              setPortfolio(enhancedPortfolio);
  
              // Fetch latest prices for portfolio stocks
              if (enhancedPortfolio.length > 0) {
                  const symbols = enhancedPortfolio.map((item: PortfolioItem) => item.symbol);
                  fetchStockPrices(symbols);
                  fetchHistoricalPortfolioData(symbols, timeRange);
              } else {
                  setLoading(false);
              }
          } catch (err: any) {
              console.error('Error fetching portfolio:', err);
              if (err.response?.status === 401) {
                  setError('Please log in to view your portfolio');
              } else {
                  setError('Failed to load portfolio data');
              }
              setLoading(false);
          }
      };
  
      fetchPortfolioData();
  }, [username]);     

    // Fetch data when time range changes
    useEffect(() => {
        if (portfolio.length > 0) {
            const symbols = portfolio.map(item => item.symbol);
            fetchHistoricalPortfolioData(symbols, timeRange);
        }
    }, [timeRange]);

    // Generate insights when portfolio and prices are loaded
    useEffect(() => {
        if (portfolio.length > 0 && Object.keys(stockPrices).length > 0) {
            generateInsights();
            calculateSectorAllocation();
            calculateRiskScore();
            identifyTopMovers();
            generateForecastData();
        }
    }, [portfolio, stockPrices]);

    // Mock sectors for demo
    const mockSectors: { [symbol: string]: string } = {
        'AAPL': 'Technology',
        'MSFT': 'Technology',
        'GOOGL': 'Technology',
        'AMZN': 'Consumer Cyclical',
        'META': 'Communication Services',
        'TSLA': 'Automotive',
        'V': 'Financial Services',
        'JNJ': 'Healthcare',
        'WMT': 'Consumer Defensive',
        'PG': 'Consumer Defensive',
        'JPM': 'Financial Services',
        'NVDA': 'Technology',
        'UNH': 'Healthcare',
        'HD': 'Consumer Cyclical',
        'BAC': 'Financial Services',
        'RELIANCE.NS': 'Energy',
        'TCS.NS': 'Technology',
        'HDFCBANK.NS': 'Financial Services',
        'INFY.NS': 'Technology',
        'HINDUNILVR.NS': 'Consumer Defensive',
        'SBIN.NS': 'Financial Services',
        'BAJFINANCE.NS': 'Financial Services',
        'BHARTIARTL.NS': 'Communication Services',
        'ITC.NS': 'Consumer Defensive',
        'KOTAKBANK.NS': 'Financial Services'
    };

    // Fetch current stock prices
    const fetchStockPrices = async (symbols: string[]) => {
        try {
            const response = await axios.get(`http://localhost:3000/stocks/prices`, {
                params: { symbols: symbols.join(',') },
            });
            setStockPrices(response.data.prices || {});
        } catch (err: any) {
            console.error('Error fetching stock prices:', err);
        }
    };

    // Fetch historical portfolio data for the chart
    const fetchHistoricalPortfolioData = async (symbols: string[], range: string) => {
        setChartLoading(true);
        setChartError(null);
        try {
            console.log('Fetching historical data for symbols:', symbols, 'range:', range);
            const response = await axios.get(`http://localhost:3000/stocks/historicalPortfolioValue/${username}`, {
                params: { 
                    symbols: symbols.join(','),
                    range: range
                },
            });
            console.log('Historical data response:', response.data);
            
            if (!response.data || !response.data.historicalData) {
                throw new Error('Invalid response format from server');
            }
            
            const historicalData = response.data.historicalData.map((point: any) => ({
                date: point.date,
                value: parseFloat(point.value)
            }));
            
            setHistoricalData(historicalData);
            setChartLoading(false);
        } catch (err: any) {
            console.error('Error fetching historical portfolio data:', err);
            setChartError(err.response?.data?.message || 'Failed to load portfolio performance data');
            setChartLoading(false);
        } finally {
            setLoading(false);
        }
    };

    // Calculate portfolio metrics
    const calculatePortfolioMetrics = (): PortfolioMetrics => {
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
            profitPercentage,
        };
    };

    // Generate AI insights based on portfolio data
    const generateInsights = () => {
        const metrics = calculatePortfolioMetrics();
        const newInsights: MarketInsight[] = [];

        // Performance insight
        if (metrics.profitPercentage > 10) {
            newInsights.push({
                type: 'positive',
                message: `Your portfolio is outperforming with a ${metrics.profitPercentage.toFixed(2)}% return. Consider locking in some profits on your highest performers.`
            });
        } else if (metrics.profitPercentage < -5) {
            newInsights.push({
                type: 'negative',
                message: `Your portfolio is down ${Math.abs(metrics.profitPercentage).toFixed(2)}%. This may present buying opportunities in quality stocks.`
            });
        }

        // Diversification insight
        const sectors = portfolio.map(stock => stock.sector || mockSectors[stock.symbol] || 'Other');
        const uniqueSectors = new Set(sectors);
        if (uniqueSectors.size < 3 && portfolio.length > 3) {
            newInsights.push({
                type: 'warning',
                message: 'Your portfolio is highly concentrated. Consider diversifying across more sectors to reduce risk.'
            });
        }

        // Volatility insight
        const volatileStocks = portfolio.filter(stock => {
            const currentPrice = stockPrices[stock.symbol] || stock.purchasePrice;
            const percentChange = ((currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
            return Math.abs(percentChange) > 20;
        });
        
        if (volatileStocks.length > 0) {
            newInsights.push({
                type: 'neutral',
                message: `${volatileStocks.length} of your holdings have moved more than 20% since purchase. This may increase portfolio volatility.`
            });
        }

        // Add a time-based insight
        const today = new Date();
        if (today.getMonth() === 11 || today.getMonth() === 0) { // December or January
            newInsights.push({
                type: 'neutral',
                message: 'Consider tax-loss harvesting opportunities before year-end to optimize your tax situation.'
            });
        }

        // Add specific stock insight if there's a significant mover
        const biggestMover = portfolio.reduce((prev, current) => {
            const prevPrice = stockPrices[prev.symbol] || prev.purchasePrice;
            const currentPriceForStock = stockPrices[current.symbol] || current.purchasePrice;
            const prevChange = Math.abs((prevPrice - prev.purchasePrice) / prev.purchasePrice);
            const currentChange = Math.abs((currentPriceForStock - current.purchasePrice) / current.purchasePrice);
            return prevChange > currentChange ? prev : current;
        }, portfolio[0]);

        if (biggestMover) {
            const price = stockPrices[biggestMover.symbol] || biggestMover.purchasePrice;
            const change = ((price - biggestMover.purchasePrice) / biggestMover.purchasePrice) * 100;
            if (Math.abs(change) > 15) {
                newInsights.push({
                    type: change > 0 ? 'positive' : 'negative',
                    message: `${biggestMover.symbol} has ${change > 0 ? 'gained' : 'lost'} ${Math.abs(change).toFixed(2)}% since purchase, significantly impacting your portfolio.`
                });
            }
        }

        setInsights(newInsights);
    };

    // Calculate sector allocation
    const calculateSectorAllocation = () => {
        const sectorMap = new Map<string, { value: number, investment: number }>();
        const metrics = calculatePortfolioMetrics();
        
        portfolio.forEach(stock => {
            const sector = stock.sector || mockSectors[stock.symbol] || 'Other';
            const currentPrice = stockPrices[stock.symbol] || stock.purchasePrice;
            const stockValue = stock.quantity * currentPrice;
            
            if (!sectorMap.has(sector)) {
                sectorMap.set(sector, { value: 0, investment: 0 });
            }
            
            const sectorData = sectorMap.get(sector)!;
            sectorMap.set(sector, {
                value: sectorData.value + stockValue,
                investment: sectorData.investment + (stock.quantity * stock.purchasePrice)
            });
        });
        
        const sectors: SectorAllocation[] = [];
        sectorMap.forEach((data, sector) => {
            sectors.push({
                sector,
                value: data.value,
                percentage: (data.value / metrics.totalValue) * 100
            });
        });
        
        setSectorAllocation(sectors.sort((a, b) => b.value - a.value));
    };

    // Calculate risk score (0-100)
    const calculateRiskScore = () => {
        if (portfolio.length === 0) {
            setRiskScore(0);
            return;
        }

        let score = 50; // Start neutral
        
        // Factor 1: Sector concentration
        const sectors = new Set(portfolio.map(item => item.sector || mockSectors[item.symbol] || 'Other'));
        if (sectors.size < 3) score += 15;
        else if (sectors.size > 5) score -= 10;
        
        // Factor 2: Historical volatility (using stand-in metric for demo)
        const volatility = portfolio.reduce((sum, stock) => {
            const currentPrice = stockPrices[stock.symbol] || stock.purchasePrice;
            const percentChange = Math.abs((currentPrice - stock.purchasePrice) / stock.purchasePrice);
            return sum + percentChange;
        }, 0) / portfolio.length;
        
        score += volatility * 50; // Scale volatility impact
        
        // Factor 3: Portfolio size
        if (portfolio.length < 5) score += 10;
        else if (portfolio.length > 15) score -= 10;
        
        // Constrain between 0-100
        setRiskScore(Math.min(100, Math.max(0, score)));
    };

    // Identify top performers and worst performers
    const identifyTopMovers = () => {
        const movers = portfolio.map(stock => {
            const currentPrice = stockPrices[stock.symbol] || stock.purchasePrice;
            const change = ((currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
            return { symbol: stock.symbol, change };
        });
        
        setTopMovers(movers.sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 5));
    };

    // Generate forecast data for the next week (mocked)
    const generateForecastData = () => {
        if (historicalData.length === 0) return;
        
        const lastDate = new Date(historicalData[historicalData.length - 1].date);
        const lastValue = historicalData[historicalData.length - 1].value;
        
        const forecast = [];
        // Use actual historical data
        for (const point of historicalData) {
            forecast.push({
                date: point.date,
                value: point.value,
                forecast: false
            });
        }
        
        // Add 7 days of forecast
        for (let i = 1; i <= 7; i++) {
            const forecastDate = new Date(lastDate);
            forecastDate.setDate(lastDate.getDate() + i);
            
            // Generate a somewhat random but trending forecast
            // This is just a simple mock - a real app would use actual forecasting algorithms
            const randomFactor = 1 + (Math.random() * 0.04 - 0.02); // -2% to +2%
            const trendFactor = 1 + (0.003 * i); // Slight upward trend
            
            forecast.push({
                date: forecastDate.toISOString().split('T')[0],
                value: lastValue * randomFactor * trendFactor,
                forecast: true
            });
        }
        
        setForecastData(forecast);
    };

    const metrics = calculatePortfolioMetrics();

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Refresh portfolio data
    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            if (portfolio.length > 0) {
                const symbols = portfolio.map(item => item.symbol);
                await fetchStockPrices(symbols);
                await fetchHistoricalPortfolioData(symbols, timeRange);
            }
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setRefreshing(false);
        }
    };

    // Prepare chart data from historical and forecast data
    const chartData = {
        datasets: [
            {
                label: 'Portfolio Value',
                data: forecastData.map(data => ({
                    x: new Date(data.date),
                    y: data.value
                })),
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
                borderWidth: (context: any) => {
                    const index = context.dataIndex;
                    return forecastData[index]?.forecast ? 1 : 2;
                },
                borderDash: (context: any) => {
                    const index = context.dataIndex;
                    return forecastData[index]?.forecast ? [5, 5] : [];
                },
                pointBackgroundColor: (context: any) => {
                    const index = context.dataIndex;
                    return forecastData[index]?.forecast ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 1)';
                },
                tension: 0.2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    title: (tooltipItems: any) => {
                        const date = new Date(tooltipItems[0].parsed.x);
                        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
                    },
                    label: (tooltipItem: any) => {
                        const index = tooltipItem.dataIndex;
                        const isForecast = forecastData[index]?.forecast;
                        const label = `${formatCurrency(tooltipItem.parsed.y)}`;
                        return isForecast ? `${label} (Forecast)` : label;
                    }
                }
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: metrics.totalInvestment,
                        yMax: metrics.totalInvestment,
                        borderColor: 'rgba(128, 128, 128, 0.5)',
                        borderWidth: 1,
                        borderDash: [6, 6],
                        label: {
                            content: 'Total Investment',
                            display: true,
                            position: 'start'
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'time' as const,
                time: {
                    unit: timeRange === '1W' ? 'day' as const : 
                          timeRange === '1M' ? 'week' as const : 
                          timeRange === '3M' ? 'week' as const : 
                          timeRange === '6M' ? 'month' as const : 'month' as const,
                    tooltipFormat: 'PP',
                },
                title: {
                    display: true,
                    text: 'Date',
                },
                grid: {
                    display: false,
                }
            },
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Portfolio Value (INR)',
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                }
            },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
    };

    // Prepare sector allocation chart data
    const sectorData = {
        labels: sectorAllocation.map(s => s.sector),
        datasets: [
            {
                data: sectorAllocation.map(s => s.value),
                backgroundColor: sectorColors.slice(0, sectorAllocation.length),
                borderWidth: 1,
                borderColor: '#fff',
            },
        ],
    };

    const sectorOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    boxWidth: 12,
                    font: {
                        size: 10
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        const dataset = tooltipItem.dataset;
                        const currentValue = dataset.data[tooltipItem.dataIndex];
                        const percentage = sectorAllocation[tooltipItem.dataIndex].percentage.toFixed(1);
                        return `${tooltipItem.label}: ${formatCurrency(currentValue)} (${percentage}%)`;
                    }
                }
            }
        },
        cutout: '60%',
    };

    if (loading) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading your portfolio insights...</p>
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 bg-gray-50">
            {/* Header with refresh button */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Portfolio AI Dashboard</h1>
                    {username && <p className="text-sm text-gray-600">Welcome back, {username} 👋</p>}
                </div>
                <button 
                    onClick={handleRefresh} 
                    className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${refreshing ? 'opacity-75 cursor-not-allowed' : ''}`}
                    disabled={refreshing}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Updating...' : 'Refresh Data'}
                </button>
            </div>

            {/* Portfolio Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Total Value */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <IndianRupee className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h2 className="ml-3 text-sm font-medium text-gray-500">Current Value</h2>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(metrics.totalValue)}</p>
                    <div className={`mt-1 text-sm flex items-center ${metrics.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp className={`h-4 w-4 mr-1 ${metrics.profitPercentage >= 0 ? '' : 'transform rotate-180'}`} />
                        {metrics.profitPercentage >= 0 ? '+' : ''}{metrics.profitPercentage.toFixed(2)}% overall
                    </div>
                </div>

                {/* Total Investment */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <PieChart className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="ml-3 text-sm font-medium text-gray-500">Total Investment</h2>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(metrics.totalInvestment)}</p>
                    <div className="mt-1 text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Across {portfolio.length} positions
                    </div>
                </div>

                {/* Profit/Loss */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-full">
                            <BarChart3 className="h-6 w-6 text-green-600" />
                        </div>
                        <h2 className="ml-3 text-sm font-medium text-gray-500">Profit/Loss</h2>
                    </div>
                    <p className={`mt-2 text-3xl font-bold ${metrics.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metrics.totalProfit >= 0 ? '+' : ''}{formatCurrency(metrics.totalProfit)}
                    </p>
                    <div className="mt-1 text-sm text-gray-500 flex items-center">
                        Unrealized {metrics.totalProfit >= 0 ? 'gain' : 'loss'}
                    </div>
                </div>

                {/* Risk Score */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <AlertTriangle className="h-6 w-6 text-yellow-600" />
                        </div>
                        <h2 className="ml-3 text-sm font-medium text-gray-500">Risk Score</h2>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{riskScore.toFixed(0)}/100</p>
                    <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full ${
                                    riskScore < 30 ? 'bg-green-500' : 
                                    riskScore < 60 ? 'bg-yellow-500' : 
                                    'bg-red-500'
                                }`} 
                                style={{ width: `${riskScore}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insights Panel */}
            {insights.length > 0 && (
                <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center mb-4">
                        <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                        <h2 className="text-lg font-medium text-gray-900">AI Market Insights</h2>
                    </div>
                    <div className="space-y-3">
                        {insights.map((insight, index) => (
                            <div 
                                key={index} 
                                className={`p-3 rounded-lg flex items-start ${
                                    insight.type === 'positive' ? 'bg-green-50 border-l-4 border-green-500' : 
                                    insight.type === 'negative' ? 'bg-red-50 border-l-4 border-red-500' : 
                                    insight.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 
                                    'bg-blue-50 border-l-4 border-blue-500'
                                }`}
                            >
                                <span className={`font-medium ${
                                    insight.type === 'positive' ? 'text-green-700' : 
                                    insight.type === 'negative' ? 'text-red-700' : 
                                    insight.type === 'warning' ? 'text-yellow-700' : 
                                    'text-blue-700'
                                }`}>
                                    {insight.message}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - Portfolio performance chart */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Portfolio Performance</h2>
                        <div className="flex items-center space-x-2">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                {['1W', '1M', '3M', '6M', '1Y', 'YTD', 'ALL'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range as any)}
                                        className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                                            timeRange === range 
                                                ? 'bg-indigo-600 text-white' 
                                                : 'text-gray-500 hover:bg-gray-200'
                                        }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                            <button 
                                className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                title="Download data"
                            >
                                <Download className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    
                    {chartLoading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-sm text-gray-500">Loading chart data...</p>
                        </div>
                    ) : chartError ? (
                        <div className="flex items-center justify-center h-64 text-red-500">{chartError}</div>
                    ) : (
                        <div className="relative">
                            <Line data={chartData} options={chartOptions} height={75} />
                            <div className="absolute bottom-0 right-0 bg-white/70 p-2 rounded-tl-lg text-xs text-gray-500">
                                <div className="flex items-center mb-1">
                                    <span className="inline-block w-3 h-0.5 bg-indigo-600 mr-2"></span>
                                    <span>Actual</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="inline-block w-3 h-0.5 bg-indigo-600 mr-2 border-dashed border-b border-indigo-600"></span>
                                    <span>AI Forecast</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* AI Market Analysis */}
                    <div className="mt-6 border-t border-gray-100 pt-4">
                        <div className="flex items-center mb-3">
                            <Zap className="h-4 w-4 text-amber-500 mr-2" />
                            <h3 className="text-sm font-medium text-gray-700">AI Market Analysis</h3>
                        </div>
                        <div className="text-sm text-gray-600 space-y-2">
                            {metrics.profitPercentage > 0 ? (
                                <p>Your portfolio has gained <span className="text-green-600 font-medium">{metrics.profitPercentage.toFixed(2)}%</span> overall, outperforming the{' '}
                                    <span className="text-gray-800 font-medium">Nifty 50</span> by <span className="text-green-600 font-medium">2.4%</span> over this period.</p>
                            ) : (
                                <p>Your portfolio is down <span className="text-red-600 font-medium">{Math.abs(metrics.profitPercentage).toFixed(2)}%</span>, underperforming the{' '}
                                    <span className="text-gray-800 font-medium">Nifty 50</span> by <span className="text-red-600 font-medium">1.3%</span> over this period.</p>
                            )}
                            <p>
                                Market volatility is <span className="font-medium">{riskScore > 60 ? 'high' : riskScore > 40 ? 'moderate' : 'low'}</span> right now. 
                                {riskScore > 60 ? ' Consider reducing exposure to high-beta stocks.' : 
                                 riskScore > 40 ? ' Maintain current allocation but monitor regularly.' : 
                                 ' This may be a good time to increase positions in quality companies.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right column - Sector Allocation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Sector Allocation</h2>
                    <div className="relative h-64">
                        <Doughnut data={sectorData} options={sectorOptions} />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-xl font-bold text-gray-800">{formatCurrency(metrics.totalValue)}</p>
                        </div>
                    </div>
                    
                    {/* AI Diversification Insights */}
                    <div className="mt-6 border-t border-gray-100 pt-4">
                        <div className="flex items-center mb-3">
                            <Zap className="h-4 w-4 text-amber-500 mr-2" />
                            <h3 className="text-sm font-medium text-gray-700">AI Diversification Analysis</h3>
                        </div>
                        <div className="text-sm text-gray-600">
                            {sectorAllocation.length > 0 && (
                                <>
                                    <p className="mb-2">
                                        Your portfolio is {
                                            sectorAllocation.length < 3 ? 'heavily concentrated' : 
                                            sectorAllocation.length < 5 ? 'moderately diversified' : 
                                            'well diversified'
                                        } across {sectorAllocation.length} sectors.
                                    </p>
                                    {sectorAllocation[0]?.percentage > 40 && (
                                        <p className="text-amber-600">
                                            <span className="font-medium">{sectorAllocation[0]?.sector}</span> accounts for 
                                            <span className="font-medium"> {sectorAllocation[0]?.percentage.toFixed(1)}%</span> of your portfolio, 
                                            which increases sector-specific risk.
                                        </p>
                                    )}
                                    {sectorAllocation.length > 0 && sectorAllocation.length < 4 && (
                                        <p className="mt-2 text-indigo-600">
                                            Consider adding exposure to defensive sectors like <span className="font-medium">Healthcare</span> or 
                                            <span className="font-medium"> Consumer Staples</span> for more balanced returns.
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Portfolio Holdings */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Portfolio Holdings</h2>
                        <div className="flex items-center">
                            <button className="flex items-center p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                                <Filter className="h-4 w-4 mr-1" />
                                Filter
                            </button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <th className="px-4 py-3">Stock</th>
                                    <th className="px-4 py-3">Quantity</th>
                                    <th className="px-4 py-3">Avg. Price</th>
                                    <th className="px-4 py-3">Current Price</th>
                                    <th className="px-4 py-3">Value</th>
                                    <th className="px-4 py-3">P&L</th>
                                    <th className="px-4 py-3">AI Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {portfolio.map((stock, idx) => {
                                    const currentPrice = stockPrices[stock.symbol] || stock.purchasePrice;
                                    const stockValue = stock.quantity * currentPrice;
                                    const stockCost = stock.quantity * stock.purchasePrice;
                                    const profit = stockValue - stockCost;
                                    const profitPercentage = (profit / stockCost) * 100;
                                    
                                    // Generate an AI score for each stock (0-100)
                                    const aiScore = Math.min(100, Math.max(0, 
                                        50 + // base score
                                        (profitPercentage * 0.5) + // performance impact
                                        (Math.random() * 20 - 10) // randomization factor
                                    ));
                                    
                                    return (
                                        <tr key={stock.symbol} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="ml-1">
                                                        <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                                                        <div className="text-xs text-gray-500">{stock.sector || mockSectors[stock.symbol] || 'Other'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {stock.quantity}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(stock.purchasePrice)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <div className="flex items-center">
                                                    <span className="text-gray-900">{formatCurrency(currentPrice)}</span>
                                                    <span className={`ml-2 text-xs flex items-center ${
                                                        currentPrice > stock.purchasePrice ? 'text-green-600' : 
                                                        currentPrice < stock.purchasePrice ? 'text-red-600' : 'text-gray-500'
                                                    }`}>
                                                        {currentPrice !== stock.purchasePrice && (
                                                            <TrendingUp 
                                                                className={`h-3 w-3 mr-1 ${currentPrice < stock.purchasePrice ? 'transform rotate-180' : ''}`} 
                                                            />
                                                        )}
                                                        {((currentPrice - stock.purchasePrice) / stock.purchasePrice * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {formatCurrency(stockValue)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                    {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                    <div 
                                                        className={`h-1.5 rounded-full ${
                                                            aiScore > 70 ? 'bg-green-500' : 
                                                            aiScore > 40 ? 'bg-yellow-500' : 
                                                            'bg-red-500'
                                                        }`} 
                                                        style={{ width: `${aiScore}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {aiScore > 70 ? 'Buy' : aiScore > 40 ? 'Hold' : 'Sell'}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Movers + AI Recommendations */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">AI Recommendations</h2>
                    
                    <div className="space-y-6">
                        {/* Top Movers */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Portfolio Movers</h3>
                            <div className="space-y-3">
                                {topMovers.slice(0, 3).map((mover, idx) => (
                                    <div key={mover.symbol} className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                                mover.change > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                                <TrendingUp className={`h-4 w-4 ${mover.change < 0 ? 'transform rotate-180' : ''}`} />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">{mover.symbol}</div>
                                                <div className="text-xs text-gray-500">
                                                    {portfolio.find(item => item.symbol === mover.symbol)?.sector || 
                                                     mockSectors[mover.symbol] || 'Other'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`text-sm font-medium ${mover.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {mover.change > 0 ? '+' : ''}{mover.change.toFixed(2)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* AI Smart Rebalancing */}
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center mb-3">
                                <Zap className="h-4 w-4 text-amber-500 mr-2" />
                                <h3 className="text-sm font-medium text-gray-700">Smart Rebalancing</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                {/* Sample AI recommendations */}
                                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="text-green-600 font-medium">Buy</div>
                                        <div className="ml-2 text-gray-800">HDFC Bank</div>
                                    </div>
                                    <div className="text-gray-600">+5% allocation</div>
                                </div>
                                
                                <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="text-red-600 font-medium">Reduce</div>
                                        <div className="ml-2 text-gray-800">Tech Sector</div>
                                    </div>
                                    <div className="text-gray-600">-8% allocation</div>
                                </div>
                                
                                <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="text-blue-600 font-medium">Add</div>
                                        <div className="ml-2 text-gray-800">Defensive Stocks</div>
                                    </div>
                                    <div className="text-gray-600">New position</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Market Anomalies */}
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center mb-3">
                                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                                <h3 className="text-sm font-medium text-gray-700">Market Anomalies Detected</h3>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                                <li>Unusual trading volume in <span className="font-medium">Financial Services</span> sector</li>
                                <li>Potential <span className="font-medium">volatility spike</span> due to upcoming market events</li>
                                <li>Sector rotation pattern detected from <span className="font-medium">Technology</span> to <span className="font-medium">Energy</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                {/* Strategy & Prediction */}
                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">AI Strategy Advisor</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left: AI Market Forecast */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                                Market Forecast
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">1 Month</span>
                                    <div className="flex items-center">
                                        <div className="h-2 w-16 bg-gray-200 rounded-full mr-2">
                                            <div className="h-2 bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                        <span className="text-green-600 font-medium">Bullish</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">3 Months</span>
                                    <div className="flex items-center">
                                        <div className="h-2 w-16 bg-gray-200 rounded-full mr-2">
                                            <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '50%' }}></div>
                                        </div>
                                        <span className="text-yellow-600 font-medium">Neutral</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">6 Months</span>
                                    <div className="flex items-center">
                                        <div className="h-2 w-16 bg-gray-200 rounded-full mr-2">
                                            <div className="h-2 bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                                        </div>
                                        <span className="text-green-600 font-medium">Bullish</span>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-gray-500">
                                *Based on technical indicators, sentiment analysis, and macroeconomic factors
                            </p>
                        </div>
                        
                        {/* Middle: Portfolio Strategy */}
                        <div className="md:col-span-2 bg-indigo-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-indigo-700 mb-3">Personalized Strategy</h3>
                            <div className="text-sm text-gray-700 space-y-3">
                                <p>
                                    <span className="font-medium">Current approach:</span> Your portfolio shows a{' '}
                                    {riskScore > 60 ? 'high-risk aggressive growth' : 
                                     riskScore > 40 ? 'balanced growth' : 'conservative'} strategy.
                                </p>
                                <p>
                                    <span className="font-medium">AI recommendation:</span>{' '}
                                    {riskScore > 60 ? 
                                        'Consider reducing exposure to high-beta tech stocks and adding defensive positions for better risk-adjusted returns.' : 
                                     riskScore > 40 ? 
                                        'Your balanced approach is appropriate for current market conditions. Consider tactical sector rotation to capitalize on emerging opportunities.' : 
                                        'Your conservative approach may underperform in the current recovery phase. Consider gradually increasing allocation to quality growth stocks.'}
                                </p>
                                <p>
                                    <span className="font-medium">Opportunity:</span>{' '}
                                    {portfolio.some(stock => stock.sector === 'Financial Services' || mockSectors[stock.symbol] === 'Financial Services') ? 
                                        'Your financial sector exposure is well-positioned for rising interest rates.' : 
                                        'Consider adding exposure to financial sector which is poised to benefit from rising interest rates.'}
                                </p>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                                    #DiversifyTech
                                </span>
                                <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                                    #AddDefensive
                                </span>
                                <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                                    #IncreaseFinancials
                                </span>
                                <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                                    #TacticalRebalance
                                </span>
                            </div>
                        </div>
                        
                        {/* AI Tax Optimization */}
                        <div className="md:col-span-3 border-t border-gray-100 pt-4 mt-2">
                            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                <Zap className="h-4 w-4 mr-2 text-amber-500" />
                                Tax Optimization Insights
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="font-medium text-gray-800 mb-1">Tax-Loss Harvesting</p>
                                    <p className="text-gray-600">
                                        Consider selling {
                                            portfolio.filter(s => {
                                                const currentPrice = stockPrices[s.symbol] || s.purchasePrice;
                                                return currentPrice < s.purchasePrice;
                                            }).length
                                        } losing positions to offset capital gains.
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="font-medium text-gray-800 mb-1">Long-Term Gains</p>
                                    <p className="text-gray-600">
                                        {portfolio.filter(s => {
                                            const purchaseDate = new Date(s.purchaseDate);
                                            const now = new Date();
                                            const diffTime = Math.abs(now.getTime() - purchaseDate.getTime());
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                            return diffDays > 365;
                                        }).length} positions qualify for favorable long-term capital gains tax rates.
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="font-medium text-gray-800 mb-1">Tax-Efficient Recommendation</p>
                                    <p className="text-gray-600">
                                        Rebalance your portfolio by selling older positions first to minimize short-term capital gains.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Portfolio;