import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { notification } from 'antd'; // Import Ant Design's notification component

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [occupation, setOccupation] = useState('');
  const [address, setAddress] = useState('');
  const [hasDependents, setHasDependents] = useState(false);
  const [dependents, setDependents] = useState([
    { name: '', age: '', gender: '', relationship: '' }
  ]);
  const [savedDependents, setSavedDependents] = useState([]);
  const [mobileNumber, setMobileNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  // const [showDependentFields, setShowDependentFields] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  

  useEffect(() => {
    const fetchProfileData = async () => {
      setEmail(localStorage.getItem('email'));
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/profiles/${userId}`);
          const profile = response.data;
          setName(profile.name || '');
          setAge(profile.age || '');
          setEmail(profile.email || '');
          setGender(profile.gender || '');
          setMaritalStatus(profile.maritalStatus || '');
          setOccupation(profile.occupation || '');
          setAddress(profile.address || '');
          setMobileNumber(profile.mobileNumber || '');
          
        // ✅ Proper declaration and parsing
        let dependentsArray = [];

        if (typeof profile.dependents === 'string') {
          try {
            dependentsArray = JSON.parse(profile.dependents);
          } catch (err) {
            console.error('Error parsing dependents JSON:', err);
          }
        } else if (Array.isArray(profile.dependents)) {
          dependentsArray = profile.dependents;
        }

        setSavedDependents(dependentsArray);
        setHasDependents(dependentsArray.length > 0);
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
  
          // setShowDependentFields(profile.dependents.length <= 0);
      }
    };

    fetchProfileData();
  }, [API_BASE_URL]);

  const handleDependentChange = (index, e) => {
    const { name, value } = e.target;
    const newDependents = [...dependents];
    newDependents[index][name] = value;
    setDependents(newDependents);
  };

  const addDependent = () => {
    if (dependents.length > 0) {
      const lastDependent = dependents[dependents.length - 1];
      if (lastDependent.name && lastDependent.age && lastDependent.gender && lastDependent.relationship) {
        setDependents([...dependents, { name: '', age: '', gender: '', relationship: '' }]);
        if (!hasDependents) {
          setHasDependents(true);
          // setShowDependentFields(false);
        }
        // Show notification for dependent added
        notification.success({
          message: 'Dependent Added',
          description: 'A new dependent has been added.',
        });
      } else {
        alert('Please fill out all fields for the current dependent before adding a new one.');
      }
    } else {
      // Handle case where dependents array is empty
      setDependents([{ name: '', age: '', gender: '', relationship: '' }]);
      if (!hasDependents) {
        setHasDependents(true);
      }
    }
  };

  const removeDependent = (index) => {
    const newDependents = dependents.filter((_, i) => i !== index);
    setDependents(newDependents);
    if (newDependents.length === 0) {
      setHasDependents(false);
    }
  };

  const handleSaveDependents = () => {
    const allFieldsFilled = dependents.every(dependent => 
      dependent.name && dependent.age && dependent.gender && dependent.relationship
    );

    if (allFieldsFilled) {
      setIsSaving(true);
      setTimeout(() => {
        setSavedDependents(prevSavedDependents => [
          ...prevSavedDependents,
          ...dependents
        ]);
        setDependents([]); // Clear dependents after saving
        setIsSaving(false);
        // Show notification for dependents saved
        notification.success({
          message: 'Dependents Saved',
          description: 'All dependents have been saved successfully.',
        });
      }, 1000);
    } else {
      alert('Please fill out all fields for all dependents before saving.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileData = {
      userId: localStorage.getItem('userId'),
      name,
      age,
      email,
      gender,
      maritalStatus,
      occupation,
      address,
      nationality: 'India',
      mobileNumber,
      dependents: savedDependents,
    };

    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        await axios.post(`${API_BASE_URL}/api/profiles`, profileData);
        // Show notification for profile saved
        notification.success({
          message: 'Profile Updated',
          description: 'Your profile has been updated successfully.',
        });
        navigate('/assets');
      } else {
        alert("Login to continue");
        navigate('/login');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show notification for error
      notification.error({
        message: 'Update Failed',
        description: 'There was an error submitting the form. Please try again later.',
      });
    }
  };

  const removeSavedDependent = (index) => {
    const newSavedDependents = savedDependents.filter((_, i) => i !== index);
    setSavedDependents(newSavedDependents);

    // Uncheck the checkbox if there are no dependents left
    if (newSavedDependents.length === 0) {
      setHasDependents(false);
    }
  };


  return (
    <div className="min-h-screen bg-black text-white bg-cover bg-center" style={{ backgroundImage: 'url(/intro.avif)', fontFamily: 'Poppins, sans-serif', fontSize: '16px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="container mx-auto p-6 bg-transparent min-h-screen">
        <h1 className="text-4xl font-bold mb-6  text-blue-500" style={{ marginTop: '50px' }}>Profile Information</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Fields */}
            <div className="animate_animated animatefadeIn animate_delay-1s">
              <label className="block text-white font-bold mb-2 ml-2">Name</label>
              <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your Name" value={name} 
                onChange={(e) => setName(e.target.value)}
                required />
            </div>
            <div className="animate_animated animatefadeIn animate_delay-1s">
              <label className="block text-white font-bold mb-2 ml-2">Age</label>
              <input type="number" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your Age" value={age} 
                onChange={(e) => setAge(e.target.value)}
                required />
            </div>
            <div className="animate_animated animatefadeIn animate_delay-1s">
              <label className="block text-white font-bold mb-2 ml-2">Gender</label>
              <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500" value={gender} 
                onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="animate_animated animatefadeIn animate_delay-1s">
              <label className="block text-white font-bold mb-2 ml-2">Occupation</label>
              <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your Occupation" value={occupation} 
                onChange={(e) => setOccupation(e.target.value)}
                required />
            </div>
            <div className="animate_animated animatefadeIn animate_delay-1s">
              <label className="block text-white font-bold mb-2 ml-2">Marital Status</label>
              <select className="w-50 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500" value={maritalStatus} 
                onChange={(e) => setMaritalStatus(e.target.value)} required>
                <option value="">Select Marital Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
            <div className="animate_animated animatefadeIn animate_delay-1s">
              <label className="block text-white font-bold mb-2 ml-2">Address</label>
              <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your Address" value={address} 
                onChange={(e) => setAddress(e.target.value)}
                required/>
            </div>
            <div className="animate_animated animatefadeIn animate_delay-1s">
              <label className="block text-white font-bold mb-2 ml-2">Nationality</label>
              <input
                type="text"
                value="India"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white cursor-not-allowed"
                readOnly
                />
            </div>


            <div className="animate_animated animatefadeIn animate_delay-1s">
              <label className="block text-white font-bold mb-2 ml-2">Email</label>
              <input type="email" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your Email" value={email} 
                onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="animate_animated animatefadeIn animate_delay-1s">
              <label className="block text-white font-bold mb-2 ml-2">Mobile Number</label>
              <input 
                type="tel" 
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Mobile Number" 
                value={mobileNumber} 
                onChange={(e) => setMobileNumber(e.target.value)}
                pattern="[7-9][0-9]{9}" 
                minLength={10} 
                maxLength={10}
                required
              />
            </div>

          </div>

          <div className="mt-6">
            <label className="block text-white font-bold text-xl">
              <input 
                type="checkbox" 
                className="mr-2" 
                checked={hasDependents} 
                onChange={(e) => setHasDependents(e.target.checked)} 
              />
              Do you have dependents?
            </label>
          </div>

          {hasDependents && (
        <div className="mt-6">
          {/* {showDependentFields && ( */}
            <div className="flex flex-col space-y-4">
              {dependents.map((dependent, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 border border-gray-700 p-4 rounded-md bg-gray-800"
                >
                  <input
                    type="text"
                    name="name"
                    value={dependent.name}
                    onChange={(e) => handleDependentChange(index, e)}
                    className="w-1/4 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    placeholder="Name"
                  />
                  <input
                    type="number"
                    name="age"
                    value={dependent.age}
                    onChange={(e) => handleDependentChange(index, e)}
                    className="w-1/4 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    placeholder="Age"
                  />
                  <select
                    name="gender"
                    value={dependent.gender}
                    onChange={(e) => handleDependentChange(index, e)}
                    className="w-1/4 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    placeholder="Gender"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="text"
                    name="relationship"
                    value={dependent.relationship}
                    onChange={(e) => handleDependentChange(index, e)}
                    className="w-1/4 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    placeholder="Relationship"
                  />
                  <button
                    type="button"
                    onClick={() => removeDependent(index)}
                    className="ml-4 text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              {/* Buttons for adding and saving dependents */}
              <div className="mt-4 flex space-x-4">
                <button
                  type="button"
                  onClick={addDependent}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded "
                >
                  <label htmlFor="" className='font-bold text-xl'>+</label> Add Dependent
                </button>
                <button
                  type="button"
                  onClick={handleSaveDependents}
                  className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-3 rounded ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Dependents'}
                </button>
              </div>
            </div>
           {/* )} */}
        </div>
      )}

        {savedDependents.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Saved Dependents</h2>
              <table className="min-w-full bg-gray-800 border border-gray-700 rounded-md">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-700 text-left text-white">Name</th>
                    <th className="py-2 px-4 border-b border-gray-700 text-left text-white">Age</th>
                    <th className="py-2 px-4 border-b border-gray-700 text-left text-white">Gender</th>
                    <th className="py-2 px-4 border-b border-gray-700 text-left text-white">Relationship</th>
                    <th className="py-2 px-4 border-b border-gray-700 text-left text-white">Actions</th>
                  </tr>
                </thead>
              <tbody>
          {savedDependents.map((dependent, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b border-gray-700 text-white">{dependent.name}</td>
                    <td className="py-2 px-4 border-b border-gray-700 text-white">{dependent.age}</td>
                    <td className="py-2 px-4 border-b border-gray-700 text-white">{dependent.gender}</td>
                    <td className="py-2 px-4 border-b border-gray-700 text-white">{dependent.relationship}</td>
                    <td className="py-2 px-4 border-b border-gray-700 text-white">
                        <button 
                          type="button" 
                          onClick={() => removeSavedDependent(index)} 
                          className="text-red-600"
                          >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


        <div className="mt-6 flex justify-between items-center">
          <button 
            type="button" 
            onClick={() => navigate('/')} 

            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-3 rounded"
          >
            Back to Home
          </button>
          <button 
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-3 rounded"
          >
            Save & Continue
          </button>
        </div>
        </form>

      </div>
    </div>
  );
};

export default Profile;