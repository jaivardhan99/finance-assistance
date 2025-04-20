import { FC, useEffect, useState } from "react";
import StockCard from "../components/StockCard";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { PlusCircle, X } from 'lucide-react';

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

const StockPrices: FC = () => {
  const username = useSelector((state: any) => state.auth?.user?.username);
  const [userStocks, setUserStocks] = useState<Stock[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState("");

  useEffect(() => {
    const fetchStocks = async () => {
      if (!username) return;
      try {
        const res = await axios.get(`http://localhost:3000/stocks/getStocks/${username}`);
        const symbols: string[] = res.data.stocks;

        const matchedStocks = symbols
          .map((symbol) => stockData.find((stock) => stock.symbol === symbol))
          .filter((stock): stock is Stock => !!stock);

        setUserStocks(matchedStocks);
      } catch (error) {
        console.error("Failed to fetch stocks:", error);
      }
    };

    fetchStocks();
  }, [username]);

  const otherStocks = stockData.filter(
    (stock) => !userStocks.some((userStock) => userStock.symbol === stock.symbol)
  );

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;

    try {
      await axios.post("http://localhost:3000/stocks/addStock", {
        username,
        stock: selectedStock
      });
      setShowModal(false);
      setSelectedStock("");
      // Refetch user stocks
      const res = await axios.get(`http://localhost:3000/stocks/getStocks/${username}`);
      const symbols: string[] = res.data.stocks;
      const matchedStocks = symbols
        .map((symbol) => stockData.find((stock) => stock.symbol === symbol))
        .filter((stock): stock is Stock => !!stock);
      setUserStocks(matchedStocks);
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">📈 Live Stock Prices</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Stock
        </button>
      </div>

      {username && <p className="text-sm text-gray-600 mb-4">Welcome, {username} 👋</p>}

      <h2 className="text-xl font-semibold mt-6 mb-2">Your Stocks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {userStocks.map((stock) => (
          <StockCard key={stock.symbol} {...stock} />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add a Stock</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddStock}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Stock</label>
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">-- Select a stock --</option>
                {otherStocks.map((stock) => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol}
                  </option>
                ))}
              </select>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                >
                  Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPrices;
