import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import {IndianRupee, PieChart, TrendingUp } from 'lucide-react';

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Portfolio Overview</h1>
      
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <IndianRupee className="h-8 w-8 text-indigo-600" />
            <h2 className="ml-3 text-lg font-medium text-gray-900">Total Value</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">₹15,00,000</p>
          <p className="mt-1 text-sm text-green-600">+12.5% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <PieChart className="h-8 w-8 text-indigo-600" />
            <h2 className="ml-3 text-lg font-medium text-gray-900">Asset Allocation</h2>
          </div>
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Equity (NSE/BSE)</span>
              <span className="text-sm font-medium text-gray-900">60%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            
            <div className="flex justify-between mb-1 mt-3">
              <span className="text-sm text-gray-600">Debt/FD</span>
              <span className="text-sm font-medium text-gray-900">30%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>

            <div className="flex justify-between mb-1 mt-3">
              <span className="text-sm text-gray-600">Gold/Others</span>
              <span className="text-sm font-medium text-gray-900">10%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '10%' }}></div>
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
                <p className="text-sm text-gray-600">YTD Return</p>
                <p className="text-2xl font-bold text-green-600">+15.2%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nifty 50</p>
                <p className="text-2xl font-bold text-green-600">+22.8%</p>
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
        <div className="bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">RELIANCE</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹3,50,000</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">23.3%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+25.4%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TCS</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹2,80,000</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18.7%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+20.1%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">HDFC BANK</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹2,70,000</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18.0%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+15.7%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;