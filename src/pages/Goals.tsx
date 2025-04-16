import React, { useState } from 'react';
import { Target, TrendingUp, DollarSign, PlusCircle, X } from 'lucide-react';

interface Goal {
  id: number;
  name: string;
  targetAmount: string;
  targetDate: string;
  monthlyContribution: string;
}

const Goals = () => {
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    monthlyContribution: ''
  });
  const [customGoals, setCustomGoals] = useState<Goal[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create a new goal with a unique id
    const goalToAdd: Goal = {
      id: new Date().getTime(),
      ...newGoal
    };

    // Add the new goal to our custom goals array
    setCustomGoals((prevGoals) => [...prevGoals, goalToAdd]);

    // Reset the form fields and close the modal
    setNewGoal({
      name: '',
      targetAmount: '',
      targetDate: '',
      monthlyContribution: ''
    });
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setCustomGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Financial Goals</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Static Goals */}
        {/* Retirement Goal */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Retirement Fund</h2>
              <p className="text-sm text-gray-500">Target: ₹1,00,00,000 by 2050</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">35%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Current Amount</p>
              <p className="text-xl font-bold text-gray-900">₹35,00,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly SIP</p>
              <p className="text-xl font-bold text-gray-900">₹20,000</p>
            </div>
          </div>
        </div>

        {/* House Down Payment */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">House Down Payment</h2>
              <p className="text-sm text-gray-500">Target: ₹50,00,000 by 2025</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">60%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Current Amount</p>
              <p className="text-xl font-bold text-gray-900">₹30,00,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly SIP</p>
              <p className="text-xl font-bold text-gray-900">₹50,000</p>
            </div>
          </div>
        </div>

        {/* Emergency Fund */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Emergency Fund</h2>
              <p className="text-sm text-gray-500">Target: ₹10,00,000</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">80%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Current Amount</p>
              <p className="text-xl font-bold text-gray-900">₹8,00,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Contribution</p>
              <p className="text-xl font-bold text-gray-900">₹10,000</p>
            </div>
          </div>
        </div>

        {/* Custom (User Added) Goals */}
        {customGoals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-lg shadow p-6 relative">
            {/* Delete Button */}
            <button 
              onClick={() => handleDelete(goal.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              <Target className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">{goal.name}</h2>
                <p className="text-sm text-gray-500">
                  Target: ₹{Number(goal.targetAmount).toLocaleString()}
                  {goal.targetDate && ` by ${goal.targetDate}`}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-700">0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Current Amount</p>
                <p className="text-xl font-bold text-gray-900">₹0</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly SIP</p>
                <p className="text-xl font-bold text-gray-900">
                  ₹{Number(goal.monthlyContribution).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Financial Goal</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Goal Name</label>
                  <input
                    type="text"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., Child's Education"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Amount (₹)</label>
                  <input
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., 2000000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Date</label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly SIP (₹)</label>
                  <input
                    type="number"
                    value={newGoal.monthlyContribution}
                    onChange={(e) => setNewGoal({ ...newGoal, monthlyContribution: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., 25000"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">AI Recommendations</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-green-500">•</span>
              <span className="ml-3 text-gray-700">
                Consider increasing your SIP amount to ₹75,000 to reach your house down payment goal 3 months earlier
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-yellow-500">•</span>
              <span className="ml-3 text-gray-700">
                Based on your age, consider increasing equity allocation in your retirement portfolio through index funds tracking Nifty 50
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
              <span className="ml-3 text-gray-700">
                Your emergency fund is well-funded. Consider investing the additional monthly contribution in a high-yield savings account or liquid funds
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Goals;