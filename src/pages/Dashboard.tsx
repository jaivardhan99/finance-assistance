import { TrendingUp, Percent, LineChart } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-6 space-y-8"
    >
      <h1 className="text-3xl font-bold text-indigo-600">📊 Financial Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-2xl backdrop-blur-md bg-white/70 border border-gray-200 shadow-lg p-5 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Portfolio Value</p>
              <h2 className="text-2xl font-semibold">₹23,458</h2>
              <span className="text-green-500 text-sm">+3.2%</span>
            </div>
            <TrendingUp className="text-green-600 w-7 h-7" />
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-2xl backdrop-blur-md bg-white/70 border border-gray-200 shadow-lg p-5 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Returns</p>
              <h2 className="text-2xl font-semibold">+5.2%</h2>
              <span className="text-red-500 text-sm">↓ 1.1%</span>
            </div>
            <Percent className="text-indigo-600 w-7 h-7" />
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-2xl backdrop-blur-md bg-white/70 border border-gray-200 shadow-lg p-5 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Market Trend</p>
              <h2 className="text-2xl font-semibold text-green-600">Bullish</h2>
              <span className="text-green-500 text-sm">Strong</span>
            </div>
            <LineChart className="text-violet-600 w-7 h-7" />
          </div>
        </motion.div>
      </div>

      {/* AI Insights Section */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="rounded-2xl backdrop-blur-md bg-white/70 border border-gray-200 shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-3">🧠 AI Insights</h3>
        <ul className="space-y-2 list-disc list-inside text-sm text-gray-700">
          <li>💡 Increase your tech sector allocation by 5% to optimize returns.</li>
          <li>⚠️ Emergency fund is below the recommended 6-month threshold.</li>
          <li>📈 Market volatility expected—review your risk tolerance.</li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
