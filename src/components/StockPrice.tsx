import { useEffect, useState } from "react";
import axios from "axios";

// Define props type
interface StockPriceProps {
  symbol: string;
}

const StockPrice: React.FC<StockPriceProps> = ({ symbol }) => {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get("https://finnhub.io/api/v1/quote", {
          params: {
            symbol,
            token: import.meta.env.VITE_FINNHUB_API_KEY,
          },
        });
        setPrice(res.data.c); // c = current price
      } catch (err) {
        console.error("Error fetching stock price:", err);
      }
    };

    fetchStock();
    const interval = setInterval(fetchStock, 5000); // update every 5s
    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-4 rounded-lg shadow-lg w-fit">
      <h2 className="font-semibold">{symbol}</h2>
      <p className="text-2xl font-bold text-green-600">${price ? price.toFixed(2) : "Loading..."}</p>
    </div>
  );
};

export default StockPrice;
