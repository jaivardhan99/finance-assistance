import { FC } from "react";
import StockCard from "../components/StockCard";

const StockPrices: FC = () => {
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

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">📈 Live Stock Prices</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {stockData.map((stock) => (
          <StockCard
            key={stock.symbol}
            symbol={stock.symbol}
            initialPrice={stock.initialPrice}
            initialChange={stock.initialChange}
            high={stock.high}
            low={stock.low}
            data={stock.data}
          />
        ))}
      </div>
    </div>
  );
};

export default StockPrices;
