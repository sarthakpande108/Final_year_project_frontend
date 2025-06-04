import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { notification } from 'antd'; // Import Ant Design notification

const FinancialGoals = () => {
  const navigate = useNavigate();
  const [financialGoal, setFinancialGoal] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetYear, setTargetYear] = useState('');
  const [userId, setUserId] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  useEffect(() => {
    // Retrieve userId from local storage
    const id = localStorage.getItem('userId');
    if (id) {
      setUserId(id);

      // Fetch existing financial goal data for this user
      const fetchFinancialGoal = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/financialgoals/${id}`);
          const data = response.data;
          setFinancialGoal(data.goal || '');
          setTargetAmount(data.targetAmount || '');
          setTargetYear(data.deadline || '');
        } catch (error) {
          console.error('Error fetching financial goal:', error);
        }
      };

      fetchFinancialGoal();
    }
  }, [API_BASE_URL]);

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Generate years from the current year to 2099
  const years = [];
  for (let year = currentYear; year <= 2099; year++) {
    years.push(year);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs if needed
    if (!financialGoal || !targetAmount || !targetYear) {
      notification.error({
        message: 'Validation Error',
        description: 'Please fill out all fields.',
      });
      return;
    }
  
    // Prepare the data to send
    const financialGoalData = {
      userId: userId,
      goal: financialGoal,
      targetAmount: targetAmount,
      deadline: targetYear
    };
    
    try {
      // Send a POST request to the backend
      const response = await axios.post(`${API_BASE_URL}/api/financialgoals`, financialGoalData);
  
      // Handle the response as needed
      console.log('Financial Goal Created:', response.data);
      notification.success({
        message: 'Success',
        description: 'Financial goal saved successfully!',
      });
      // Navigate to the next page on success
      navigate('/result');
      
    } catch (error) {
      console.error('Error creating financial goal:', error);
      notification.error({
        message: 'Submission Error',
        description: 'There was an error submitting the form. Please try again later.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white bg-cover bg-center" style={{ backgroundImage: 'url(/intro.avif)' }}>
      <div className="container mx-auto p-6 bg-transparent min-h-screen">
        <h1 className="text-4xl font-bold mb-6 mt-8 text-5xl text-blue-500" style={{ marginTop: '50px' }}>Financial Goals</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Financial Goal Fields */}
            <div>
              <label className="block text-white text-xl font-semibold mb-2 ml-2">Financial Goal</label>
              <input
                type="text"
                value={financialGoal}
                onChange={(e) => setFinancialGoal(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Financial Goal"
                required
              />
            </div>
            <div>
              <label className="block text-white text-xl font-semibold mb-2 ml-2">Target Amount</label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Target Amount"
                required
              />
            </div>
            <div>
              <label className="block text-white text-xl font-semibold mb-2 ml-2">Target Year</label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select a year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate('/assets')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-3 rounded"

            >
              Go Back
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-3 rounded"

            >
              Generate Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancialGoals;