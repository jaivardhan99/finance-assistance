import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';

const TotalAmountCard = () => {
  const username = useSelector((state: any) => state.auth?.user?.username);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState(0); // to store the total amount

  // Fetch total amount from the backend
  const fetchTotalAmount = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/user/profile/?username=${username}`);
      console.log(response.data.user)
      if (response.data?.user) {
        setTotal(response.data.user.totalAmount); // Set the total from the response
      }
    } catch (err) {
      console.error("Error fetching total amount:", err);
    }
  };

  useEffect(() => {
    if (username) {
      fetchTotalAmount();
    }
  }, [username, isAddOpen, isRemoveOpen]); // Refetch when component opens, or amount changes

  const handleAdd = async () => {
    try {
      console.log(amount)
      const response = await axios.post("http://localhost:3000/user/amount/add", { money: Number(amount), username });
      console.log("Add Response:", response.data);
      setIsAddOpen(false);
      setAmount("");
      fetchTotalAmount(); // Re-fetch the total amount after adding
    } catch (err) {
      console.error("Error adding amount:", err);
    }
  };

  const handleRemove = async () => {
    try {
      const response = await axios.post("http://localhost:3000/user/amount/remove", { money: Number(amount), username });
      console.log("Remove Response:", response.data);
      setIsRemoveOpen(false);
      setAmount("");
      fetchTotalAmount(); // Re-fetch the total amount after removing
    } catch (err) {
      console.error("Error removing amount:", err);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Total Amount</h2>
        <div className="text-3xl font-bold text-center text-green-600 mb-4">₹ {total}</div>
        <div className="flex justify-between">
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl w-full mr-2"
          >
            Add Amount
          </button>
          <button
            onClick={() => setIsRemoveOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl w-full ml-2"
          >
            Remove Amount
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Add Amount</h3>
            <input
              type="number"
              className="w-full border rounded-lg px-4 py-2 mb-4"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsAddOpen(false)}
                className="mr-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Modal */}
      {isRemoveOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Remove Amount</h3>
            <input
              type="number"
              className="w-full border rounded-lg px-4 py-2 mb-4"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsRemoveOpen(false)}
                className="mr-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalAmountCard;
