import React, { useState } from 'react';
import { BookOpen, Play, Award, Clock, TrendingUp, Zap, DollarSign, BarChart2, ChevronRight, Target } from 'lucide-react';
import { useSelector } from 'react-redux';

const Learn = () => {
  const username = useSelector((state) => state.auth?.user?.username);
  const [activeTab, setActiveTab] = useState('recommended');
  
  // Mock data for financial insights
  const marketInsights = [
    { metric: 'S&P 500', value: '+0.8%', trend: 'up' },
    { metric: 'NASDAQ', value: '+1.2%', trend: 'up' },
    { metric: '10-Yr Treasury', value: '1.63%', trend: 'down' }
  ];
  
  // Mock data for progress
  const completedCourses = 3;
  const totalCourses = 12;
  const progressPercentage = (completedCourses / totalCourses) * 100;

  return (
    <div className="p-6 bg-gray-50">
      {/* Header Section with Financial Data */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white">FinanceAI Learning Hub</h1>
            {username && <p className="text-blue-200">Welcome back, {username} 👋</p>}
            <p className="text-sm text-blue-200 mt-2">Your financial knowledge journey, powered by AI</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
            <p className="text-xs text-blue-100 font-medium">MARKET PULSE</p>
            <div className="flex space-x-4 mt-1">
              {marketInsights.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-sm font-medium text-white">{item.metric}</span>
                  <span className={`ml-1 text-sm ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Learning Progress */}
        <div className="mt-6 bg-white/10 backdrop-blur rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-blue-100">Learning Progress</span>
            <span className="text-sm text-blue-100">{completedCourses}/{totalCourses} Courses</span>
          </div>
          <div className="w-full bg-blue-900/40 rounded-full h-2">
            <div 
              className="bg-green-400 h-2 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* AI-Powered Learning Recommendation */}
      <div className="mt-6 bg-white rounded-xl shadow p-5 border-l-4 border-blue-600">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">AI RECOMMENDATION</h3>
            <p className="text-lg font-medium text-gray-800">
              Based on your recent activity, we recommend focusing on retirement planning this week
            </p>
          </div>
        </div>
        <button className="mt-3 text-blue-600 text-sm font-medium flex items-center">
          View personalized plan <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="mt-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('recommended')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'recommended'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Recommended Courses
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'trending'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Trending in Finance
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Your Progress
          </button>
        </nav>
      </div>

      {/* Course Grid */}
      <div className="mt-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Investment Basics Course */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div className="relative h-48">
              <div className="absolute top-0 right-0 m-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                TOP RATED
              </div>
              <img
                src="/api/placeholder/800/450"
                alt="Investment basics"
                className="w-full h-full object-cover"
              />
              <div
                onClick={() => window.open("https://youtu.be/Xn7KWR9EOGQ?si=PN12-CYr72bncT_V", "_blank")}
                className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center cursor-pointer group"
              >
                <div className="bg-blue-600 rounded-full p-3 group-hover:bg-blue-700 transition-all">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="ml-1 text-xs font-medium text-blue-600">INVESTING</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-2">Investment Basics</h3>
              <p className="mt-1 text-sm text-gray-600">Learn the fundamentals of investing and portfolio management</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="ml-1 text-sm text-gray-500">1.5 hours</span>
                </div>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Retirement Planning */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div className="relative h-48">
              <div className="absolute top-0 right-0 m-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                AI RECOMMENDED
              </div>
              <img
                src="/api/placeholder/800/450"
                alt="Retirement planning"
                className="w-full h-full object-cover"
              />
              <div
                onClick={() => window.open("https://youtu.be/uO8EoK6wUIY?si=D97LWq5QcYwa9ZUQ", "_blank")}
                className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center cursor-pointer group"
              >
                <div className="bg-blue-600 rounded-full p-3 group-hover:bg-blue-700 transition-all">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="ml-1 text-xs font-medium text-blue-600">PLANNING</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-2">Retirement Planning</h3>
              <p className="mt-1 text-sm text-gray-600">Master the strategies for a secure retirement</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="ml-1 text-sm text-gray-500">0.5 hour</span>
                </div>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4].map((star) => (
                      <svg key={star} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tax Strategies */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div className="relative h-48">
              <img
                src="/api/placeholder/800/450"
                alt="Tax strategies"
                className="w-full h-full object-cover"
              />
              <div
                onClick={() => window.open("https://youtu.be/njN6rVIr9gM?si=yQZK1vQqgu4EXC12", "_blank")}
                className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center cursor-pointer group"
              >
                <div className="bg-blue-600 rounded-full p-3 group-hover:bg-blue-700 transition-all">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center">
                <BarChart2 className="h-4 w-4 text-blue-600" />
                <span className="ml-1 text-xs font-medium text-blue-600">TAX PLANNING</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-2">Tax Strategies</h3>
              <p className="mt-1 text-sm text-gray-600">Optimize your tax planning and maximize returns</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="ml-1 text-sm text-gray-500">0.5 hour</span>
                </div>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Insights Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
          AI-Powered Market Insights
        </h2>
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-base font-medium text-gray-900">Market Trend Analysis</h3>
              <p className="mt-1 text-sm text-gray-600">Our AI detects a bullish pattern in tech stocks this week</p>
              <button className="mt-3 px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                Learn More
              </button>
            </div>
            <div className="flex-1 p-4 bg-green-50 rounded-lg">
              <h3 className="text-base font-medium text-gray-900">Personalized Alert</h3>
              <p className="mt-1 text-sm text-gray-600">Based on your portfolio, consider reviewing your tech allocations</p>
              <button className="mt-3 px-3 py-1 text-xs font-medium text-green-600 border border-green-600 rounded-full hover:bg-green-600 hover:text-white transition-colors">
                View Details
              </button>
            </div>
            <div className="flex-1 p-4 bg-purple-50 rounded-lg">
              <h3 className="text-base font-medium text-gray-900">Economic Calendar</h3>
              <p className="mt-1 text-sm text-gray-600">Fed meeting next week may impact markets. Prepare with our guide.</p>
              <button className="mt-3 px-3 py-1 text-xs font-medium text-purple-600 border border-purple-600 rounded-full hover:bg-purple-600 hover:text-white transition-colors">
                Set Reminder
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Learning Modules */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
          Quick Learning Modules
        </h2>
        <div className="bg-white rounded-xl shadow">
          <div className="divide-y divide-gray-100">
            <div className="p-4 hover:bg-blue-50 cursor-pointer transition-colors flex items-center">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900">Understanding Market Cycles</h3>
                <p className="mt-1 text-sm text-gray-500">10 min read</p>
              </div>
              <div className="ml-4">
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="p-4 hover:bg-blue-50 cursor-pointer transition-colors flex items-center">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900">Diversification Strategies</h3>
                <p className="mt-1 text-sm text-gray-500">15 min read</p>
              </div>
              <div className="ml-4">
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="p-4 hover:bg-blue-50 cursor-pointer transition-colors flex items-center">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900">Risk Management Basics</h3>
                <p className="mt-1 text-sm text-gray-500">12 min read</p>
              </div>
              <div className="ml-4">
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Powered Learning Path */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 text-blue-600 mr-2" />
          AI-Personalized Learning Path
        </h2>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow p-6 text-white">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h3 className="ml-3 text-lg font-medium">Your Financial Journey</h3>
          </div>
          <p className="text-blue-100 mb-4">
            Based on your profile and learning history, our AI has crafted this personalized learning path:
          </p>
          <div className="relative">
            <div className="absolute left-4 inset-y-0 w-0.5 bg-white/30"></div>
            <ol className="space-y-6 relative">
              <li className="flex items-start ml-6">
                <span className="absolute left-0 -translate-x-4 flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium border-2 border-white">1</span>
                <div>
                  <h4 className="text-white font-medium">Complete "Investment Basics" course</h4>
                  <p className="text-blue-100 text-sm">Estimated time: 1.5 hours</p>
                  <div className="mt-2">
                    <button className="px-3 py-1 bg-white text-blue-600 rounded-full text-xs font-medium">
                      Start Now
                    </button>
                  </div>
                </div>
              </li>
              <li className="flex items-start ml-6">
                <span className="absolute left-0 -translate-x-4 flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-white/20 text-white text-sm font-medium border-2 border-white/50">2</span>
                <div>
                  <h4 className="text-white/80 font-medium">Read "Understanding Market Cycles" module</h4>
                  <p className="text-blue-100/70 text-sm">Estimated time: 10 minutes</p>
                </div>
              </li>
              <li className="flex items-start ml-6">
                <span className="absolute left-0 -translate-x-4 flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-white/20 text-white text-sm font-medium border-2 border-white/50">3</span>
                <div>
                  <h4 className="text-white/80 font-medium">Start "Retirement Planning" course</h4>
                  <p className="text-blue-100/70 text-sm">Estimated time: 0.5 hour</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;