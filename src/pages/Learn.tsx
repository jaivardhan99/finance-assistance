import React from 'react';
import { BookOpen, Play, Award, Clock } from 'lucide-react';

const Learn = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Financial Education</h1>
      
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recommended Courses</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Investment Basics Course */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Investment basics"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <Play className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">Investment Basics</h3>
              <p className="mt-1 text-sm text-gray-500">Learn the fundamentals of investing and portfolio management</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="ml-1 text-sm text-gray-500">2.5 hours</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-yellow-400" />
                  <span className="ml-1 text-sm text-gray-500">Certificate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Retirement Planning */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Retirement planning"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <Play className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">Retirement Planning</h3>
              <p className="mt-1 text-sm text-gray-500">Master the strategies for a secure retirement</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="ml-1 text-sm text-gray-500">3 hours</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-yellow-400" />
                  <span className="ml-1 text-sm text-gray-500">Certificate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tax Strategies */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Tax strategies"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <Play className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">Tax Strategies</h3>
              <p className="mt-1 text-sm text-gray-500">Optimize your tax planning and maximize returns</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="ml-1 text-sm text-gray-500">2 hours</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-yellow-400" />
                  <span className="ml-1 text-sm text-gray-500">Certificate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Learning Modules</h2>
        <div className="bg-white rounded-lg shadow">
          <div className="divide-y divide-gray-200">
            <div className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <div className="ml-3">
                  <h3 className="text-base font-medium text-gray-900">Understanding Market Cycles</h3>
                  <p className="mt-1 text-sm text-gray-500">10 min read</p>
                </div>
              </div>
            </div>
            <div className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <div className="ml-3">
                  <h3 className="text-base font-medium text-gray-900">Diversification Strategies</h3>
                  <p className="mt-1 text-sm text-gray-500">15 min read</p>
                </div>
              </div>
            </div>
            <div className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <div className="ml-3">
                  <h3 className="text-base font-medium text-gray-900">Risk Management Basics</h3>
                  <p className="mt-1 text-sm text-gray-500">12 min read</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">AI-Powered Learning Path</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Based on your profile and learning history, we recommend the following personalized learning path:
          </p>
          <ol className="space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm">1</span>
              <span className="ml-3 text-gray-700">Complete "Investment Basics" course (2.5 hours)</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm">2</span>
              <span className="ml-3 text-gray-700">Read "Understanding Market Cycles" module (10 min)</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm">3</span>
              <span className="ml-3 text-gray-700">Start "Retirement Planning" course (3 hours)</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Learn;