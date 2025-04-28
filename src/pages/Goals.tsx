import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { PlusCircle, X, Lightbulb } from 'lucide-react';

interface Goal {
  name: string;
  target: string;
  targetDate: string;
  monthSPI: string;
}

interface Recommendation {
  type: 'success' | 'warning' | 'info';
  message: string;
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
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Get username from Redux store
  const username = useSelector((state: any) => state.auth?.user?.username);

  // ✅ Fetch goals on mount and after adding one
  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/goals/getGoals/${username}`);
      setCustomGoals(res.data.goals);
      // Generate recommendations based on goals
      generateRecommendations(res.data.goals);
    } catch (error) {
      console.log('Failed to fetch goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [username]);

  // Generate AI recommendations based on goals
  const generateRecommendations = (goals: Goal[]) => {
    if (!goals || goals.length === 0) {
      setRecommendations([
        {
          type: 'info',
          message: 'Add your first financial goal to receive personalized recommendations.'
        }
      ]);
      return;
    }

    // Create personalized recommendations based on goals
    const newRecommendations: Recommendation[] = [];

    goals.forEach(goal => {
      const targetAmount = parseFloat(goal.target);
      const monthlyAmount = parseFloat(goal.monthSPI);
      const targetDate = new Date(goal.targetDate);
      const currentDate = new Date();
      
      // Calculate months until target date
      const monthsRemaining = (targetDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                            (targetDate.getMonth() - currentDate.getMonth());
      
      // Calculate if current SIP is sufficient
      const requiredMonthlySIP = targetAmount / monthsRemaining;
      
      // Goal is time-constrained
      if (monthsRemaining < 12 && targetAmount > 100000) {
        newRecommendations.push({
          type: 'warning',
          message: `${goal.name}: Consider extending your timeline or increasing your monthly SIP to ₹${Math.ceil(requiredMonthlySIP).toLocaleString()} to meet your goal on time.`
        });
      }
      
      // SIP is too low
      if (monthlyAmount < requiredMonthlySIP * 0.8) {
        newRecommendations.push({
          type: 'warning',
          message: `Increase your ${goal.name} SIP by ₹${Math.ceil(requiredMonthlySIP - monthlyAmount).toLocaleString()} to reach your target by ${goal.targetDate}.`
        });
      }
      
      // SIP is higher than needed (with buffer)
      if (monthlyAmount > requiredMonthlySIP * 1.3 && monthsRemaining > 24) {
        newRecommendations.push({
          type: 'success',
          message: `You're ahead on your ${goal.name} goal! You could redirect ₹${Math.floor(monthlyAmount - requiredMonthlySIP * 1.1).toLocaleString()} to other investments.`
        });
      }
      
      // Investment vehicles suggestions based on goal timeline
      if (monthsRemaining > 60) {
        newRecommendations.push({
          type: 'info',
          message: `For your long-term ${goal.name} goal, consider allocating more to equity mutual funds for potentially higher returns.`
        });
      } else if (monthsRemaining < 24) {
        newRecommendations.push({
          type: 'info',
          message: `As your ${goal.name} goal approaches, consider shifting investments to more stable options like debt funds.`
        });
      }
    });
    
    // Limit to 5 most relevant recommendations
    setRecommendations(newRecommendations.slice(0, 5));
  };

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

  const handleDelete = async(e: React.FormEvent, id: string) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/goals/deleteGoal', {
        username,
        goal: id
      });
      fetchGoals();
    } catch (error) {
      console.log('Failed to delete goal:', error);
    }
  };

  // Get color based on recommendation type
  const getRecommendationColor = (type: 'success' | 'warning' | 'info') => {
    switch(type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-blue-500';
    }
  };

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
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 flex justify-center py-12">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : customGoals.length === 0 ? (
          <div className="col-span-3 text-center py-12 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">You haven't set any financial goals yet. Click the button above to add your first goal!</p>
          </div>
        ) : (
          customGoals.map((goal) => (
            <div key={goal.name} className="relative rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              
              {/* Goal Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">{goal.name}</h3>
                <button
                  onClick={(e) => handleDelete(e, goal.name)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Goal Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">🎯 Target:</span> ₹{parseInt(goal.target).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium text-gray-700">📅 Target Date:</span> {new Date(goal.targetDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium text-gray-700">💸 Monthly SIP:</span> ₹{parseInt(goal.monthSPI).toLocaleString()}
                </p>
              </div>
              
              {/* Goal Progress */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">45% of the way there</p>
              </div>
            </div>
          ))
        )}
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
                    required
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
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Date</label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
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
                    required
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
        <div className="flex items-center mb-4">
          <Lightbulb className="h-5 w-5 text-indigo-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">AI Recommendations</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ) : recommendations.length > 0 ? (
            <ul className="space-y-4">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className={`${getRecommendationColor(rec.type)} font-bold mr-2`}>•</span>
                  <span>{rec.message}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No recommendations available. Add goals to receive personalized advice.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;