import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { PlusCircle, X } from 'lucide-react';

interface Goal {
  name: string;
  target: string;
  targetDate: string;
  monthSPI: string;
}

const Goals = () => {
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    targetDate: '',
    monthSPI: ''
  });
  const [customGoals, setCustomGoals] = useState<Goal[]>([]);

  // ✅ Get username from Redux store
  const username = useSelector((state: any) => state.auth?.user?.username);

  // ✅ Fetch goals on mount and after adding one
  const fetchGoals = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/goals/getGoals/${username}`);
      setCustomGoals(res.data.goals);
      console.log(res.data) // adjust if response shape is different
    } catch (error) {
      console.log('Failed to fetch goals:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/goals/setGoals', {
        username,
        goal: newGoal
      });
      
      setNewGoal({
        name: '',
        target: '',
        targetDate: '',
        monthSPI: ''
      });
      setShowModal(false);
      fetchGoals(); // refresh the goal list after adding
    } catch (error) {
      console.log('Failed to set goal:', error);
    }
  };

  const handleDelete = async(e: React.FormEvent,id: string) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/goals/deleteGoal', {
        username,
        goal: id
      });
      fetchGoals();
  }
  catch (error) {
    console.log('Failed to set goal:', error);
  }};

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Financial Goals</h1>
          {username && <p className="text-sm text-gray-600">Welcome, {username} 👋</p>}
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Goal
        </button>
      </div>

      {/* Goals List */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customGoals.map((goal) => (
          <div  className="bg-white rounded-lg shadow p-4 relative">
            <h3 className="text-lg font-semibold">{goal.name}</h3>
            <p className="text-sm text-gray-500 mb-1">Target: ₹{goal.target}</p>
            <p className="text-sm text-gray-500 mb-1">Target Date: ₹{goal.targetDate}</p>
            <p className="text-sm text-gray-500">Monthly SIP: ₹{goal.monthSPI}</p>
            <button
              onClick={(e) => handleDelete(e,goal.name)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="e.g., Buy a car"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Amount (₹)</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="e.g., 1000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Date</label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly SIP (₹)</label>
                  <input
                    type="number"
                    value={newGoal.monthSPI}
                    onChange={(e) => setNewGoal({ ...newGoal, monthSPI: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="e.g., 15000"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
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
              <span className="text-green-500 font-bold mr-2">•</span>
              <span>Increase SIP to ₹75,000 to reach house down payment 3 months earlier.</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 font-bold mr-2">•</span>
              <span>Boost equity allocation for retirement through Nifty 50 index funds.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-bold mr-2">•</span>
              <span>Consider investing surplus emergency fund in liquid mutual funds.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Goals;
