import React, { useState, useEffect, useRef } from "react";
import { Layout, Button, Card, Typography, Space, Spin, Modal } from "antd";
import axios from "axios";
import { FaRobot } from "react-icons/fa"; // Changed to FaRobot for chatbot
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom"; // Import useNavigate

ChartJS.register(ArcElement, Tooltip, Legend);
const { Header, Content } = Layout;
const { Title: AntTitle, Paragraph } = Typography;

const Result = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [assets, setAssets] = useState({});
  const [financialGoal, setFinancialGoal] = useState({});
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [timeoutError, setTimeoutError] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const currentYear = new Date().getFullYear();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const RESULT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:5000'; // Default to local server if not set
  const userId = localStorage.getItem("userId");



  const planRef = useRef(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchData = async () => {
      try {
        const [profileResponse, assetsResponse, goalResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/profiles/${userId}`),
          axios.get(`${API_BASE_URL}/api/assets/${userId}`),
          axios.get(`${API_BASE_URL}/api/financialgoals/${userId}`),
        ]);

        setProfile(profileResponse.data);
        setAssets(assetsResponse.data);
        setFinancialGoal(goalResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

const generatePrompt = () => {
const name = profile?.name || "";
const age = profile?.age || "";
const occupation = profile?.occupation || "";
const maritalStatus = profile?.maritalStatus || "";
const dependents = Array.isArray(profile?.dependents) ? profile.dependents : [];

const monthlyIncome = assets?.monthlyIncome || 0;
const monthlyExpenditure = assets?.monthlyExpenditure || 0;
const currentSavings = assets?.currentSavings || 0;
const emergencyFund = assets?.emergencyFund || 0;
const investments = Array.isArray(assets?.investments) ? assets.investments : [];
const insurance = Array.isArray(assets?.insurance) ? assets.insurance : [];
const loans = Array.isArray(assets?.loans) ? assets.loans : [];

const goal = financialGoal?.goal || "";
const targetAmount = financialGoal?.targetAmount || "";
const deadline = financialGoal?.deadline || "";


  let prompt = `My name is ${name}, and I am ${age} years old, currently working as an ${occupation}. I am ${maritalStatus}.`;

if (Array.isArray(dependents) && dependents.length > 0) {
    const dependentsDetails = dependents.map(dep =>
      ` ${dep.relationship} ${dep.name} (${dep.age} years old)`
    ).join(', ');
    prompt += ` I have dependents: ${dependentsDetails}.`;
  }

  prompt += ` My financial goal is to ${goal} by the year ${deadline}, with a target amount of ₹${targetAmount}. My monthly income is ₹${monthlyIncome}, and my monthly expenditure is ₹${monthlyExpenditure}. I have current savings of ₹${currentSavings} and an emergency fund of ₹${emergencyFund}.`;

  if (loans.length > 0) {
    const loanDetails = loans.map(loan => {
      const loanTenure = new Date(loan.expiryDate).getFullYear() - new Date(loan.startDate).getFullYear();
      const yearsPaid = new Date().getFullYear() - new Date(loan.startDate).getFullYear();
      return `${loan.type} of ₹${loan.amount} at ${loan.interest}% interest, with a monthly installment of ₹${loan.installamount}. It has a tenure of ${loanTenure} years, and ${yearsPaid} years of installments have been paid.`;
    }).join(' ');
    prompt += ` I have the following loans: ${loanDetails}`;
  }

  if (investments.length > 0) {
    const investmentDetails = investments.map(inv => ` ${inv.type} worth ₹${inv.amount}`).join(', ');
    prompt += ` I have investments in ${investmentDetails}.`;
  }

  if (insurance.length > 0) {
    const insuranceDetails = insurance.map(ins =>
      ` ${ins.type} with ${ins.provider}, paying a premium of ₹${ins.premium} for coverage of ₹${ins.coverage}`
    ).join(', ');
    prompt += ` I also have insurance policies including ${insuranceDetails}.`;
  }

  if (loans.length > 0) {
    prompt += ` Given the existing loans, I recommend prioritizing repayment of these debts to reduce financial burden before giving plans for financial goal.`;
  }

  if (!emergencyFund || emergencyFund < (monthlyExpenditure * 6)) {
    prompt += ` Also, please advise on building an emergency fund that covers at least 6 months of your monthly expenditure, if it's not already sufficient.`;
  }

  prompt += ` Give me 3 distinct plans to achieve my financial goal within the required timeframe. Each plan should include actionable recommendations such as increasing SIP (Systematic Investment Plan), increasing investments, adding funds to fixed deposits, recurring deposits, or other suitable financial instruments. Calculate my risk assessment based on my assets and dependents, and incorporate it into the plan recommendations. Ensure the plans are detailed and practical.`;
  return prompt;
};



  const generatePlan = async () => {
    setIsPlanLoading(true);
    setGeneratedText("");
    setDisplayedText("");
    setTextIndex(0);
    setTimeoutError(false);

    const prompt = generatePrompt();
    console.log(prompt)

    if (planRef.current) {
      planRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const apiRequest = axios.post(`${RESULT_API_URL}/generate`, { userId}, { timeout: 300000 });
    console.log(userId)
    console.log("API Request:", apiRequest);
    try {
      const response = await apiRequest;
      setGeneratedText(response.data.generated_text || ""); 
      console.log("Generated Text:", response.data.generatedText)
    } catch (error) {
      console.error("Error generating text:", error);
      if (error.code === 'ECONNABORTED' || error.message === "Request timed out") {
        setGeneratedText("The request timed out. Please try generating the plan again.");
        setTimeoutError(true);
      } else {
        setGeneratedText("Sorry, the plan could not be generated at this time due to an error.");
      }
    } finally {
      setIsPlanLoading(false);
    }
  };
useEffect(() => {
  let intervalId;

  // ✅ Only run if generatedText is a valid non-empty string
  if (
    typeof generatedText === "string" &&
    generatedText.length > 0 &&
    textIndex < generatedText.length
  ) {
    intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + generatedText[textIndex]);
      setTextIndex((prev) => prev + 1);
    }, 15);
  }

  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}, [generatedText, textIndex]);


  const handleGeneratePlanClick = () => {
    if (profile && assets && financialGoal) {
      generatePlan();
    } else {
      Modal.warning({
        title: 'Data Not Loaded',
        content: 'Please wait a moment for your financial data to load before generating a plan.',
        centered: true,
        okText: 'Understood',
      });
      console.error("Data is not fully loaded yet");
    }
  };

  const handleOpenChatbot = () => {
    navigate("/chatbot"); // Navigate to the /chatbot page
  };
  const deadlineYear = financialGoal?.deadline;
  const yearsRemaining = deadlineYear ? deadlineYear - currentYear : "";

  return (
    <Layout className="min-h-screen bg-gray-950 text-white font-sans antialiased">
      {/* --- Global Loading Spinner --- */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 fixed inset-0 z-50">
          <Spin size="large" tip="Loading your financial data..." />
        </div>
      )}

      {/* --- Main Content (Hidden during global loading) --- */}
      <div className={`flex flex-col flex-grow ${loading ? 'hidden' : 'visible'}`}>
        {/* --- Header --- */}
  

        <Content className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          {/* --- Welcome Section --- */}
          <section className="text-center mb-10">
            <span className="text-white font-bold text-3xl ">Hello, {profile.name || <Skeleton width={200} />}!</span>
            <Paragraph className="text-gray-300 mt-2 text-lg animate-fade-in-up delay-200">
              
              Here's a summary of your financial journey and your tailored plan.
            </Paragraph>
          </section>

          {/* --- Financial Details Card --- */}
          <section className="mb-10 bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 animate-fade-in-up delay-400">
            <h2 className="text-3xl font-bold mb-6 text-blue-400 border-b border-gray-700 pb-3">
              Your Financial Snapshot
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
              {/* Profile Details */} 
              <div className="flex flex-col">
                <span className="font-bold text-gray-400 text-lg mb-1">Occupation:</span>
                <span className="text-lg text-white">{profile.occupation || <Skeleton width={100} />}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-400 text-lg mb-1">Marital Status:</span>
                <span className="text-lg text-white">{profile.maritalStatus || <Skeleton width={100} />}</span>
              </div>

              {/* Asset Details */}
              <div className="flex flex-col">
                <span className="font-bold text-gray-400 text-lg mb-1">Monthly Income:</span>
                <span className="text-lg text-green-400">₹{assets.monthlyIncome?.toLocaleString() || <Skeleton width={100} />}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-400 text-lg mb-1">Monthly Expenditure:</span>
                <span className="text-lg text-red-400">₹{assets.monthlyExpenditure?.toLocaleString() || <Skeleton width={100} />}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-400 text-lg mb-1">Emergency Fund:</span>
                <span className="text-lg text-yellow-400">₹{assets.emergencyFund?.toLocaleString() || <Skeleton width={100} />}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-400 text-lg mb-1">Current Savings:</span>
                <span className="text-lg text-blue-300">₹{assets.currentSavings?.toLocaleString() || <Skeleton width={100} />}</span>
              </div>

              {/* Financial Goal Details */}
              <div className="flex flex-col">
                <span className="font-bold text-gray-400 text-lg mb-1">Financial Goal:</span>
                <span className="text-lg text-purple-400">{financialGoal.goal || <Skeleton width={100} />}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-400 text-lg mb-1">Target Amount:</span>
                <span className="text-lg text-purple-400">₹{financialGoal.targetAmount?.toLocaleString() || <Skeleton width={100} />}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-400 text-lg mb-1">Timeframe:</span>
                <span className="text-lg text-purple-400">
                  {yearsRemaining ? `${yearsRemaining} years` : <Skeleton width={100} />}
                </span>
              </div>
            </div>
          </section>

          {/* --- Generate Plan Section --- */}
          <section ref={planRef} className="mb-10 animate-fade-in-up delay-600">
            <h2 className="text-3xl font-bold mb-6 text-blue-400 text-center">
              Your Personalized Financial Plan
            </h2>
            <div className="flex justify-center mb-6">
              <Button
                type="primary"
                size="large"
                className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleGeneratePlanClick}
                disabled={isPlanLoading}
              >
                {isPlanLoading ? (
                  <Space>
                    <Spin size="small" /> Generating Plan...
                  </Space>
                ) : (
                  "Generate My Plan"
                )}
              </Button>
            </div>

            <Card className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-6">
              {isPlanLoading ? (
                <div className="w-full">
                  <div className="bg-gray-700 h-6 w-11/12 mb-3 rounded-md animate-pulse"></div>
                  <div className="bg-gray-700 h-6 w-full mb-3 rounded-md animate-pulse"></div>
                  <div className="bg-gray-700 h-6 w-9/10 mb-3 rounded-md animate-pulse"></div>
                  <div className="bg-gray-700 h-6 w-7/10 mb-3 rounded-md animate-pulse"></div>
                  <div className="bg-gray-700 h-6 w-1/2 rounded-md animate-pulse"></div>
                </div>
              ) : (
                <siv className="text-gray-200 text-base leading-relaxed whitespace-pre-line prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {displayedText}
                  </ReactMarkdown>
                </siv>
              )}
            </Card>
          </section>

          {/* --- Chatbot Button (Fixed to bottom right) --- */}
          <Button
            type="primary"
            // Ensure button is round and visually appealing
            className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 border-none shadow-lg w-16 h-16 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
            onClick={handleOpenChatbot}
          >
            <FaRobot className="text-2xl  text-white" />  {/* Larger icon and white color */}
          </Button>

          {/* No longer using a modal for chatbot, it navigates */}
          {/* <Modal
            title={<AntTitle level={3} className="text-white">FinAI Chatbot</AntTitle>}
            open={isChatbotOpen}
            onCancel={() => setIsChatbotOpen(false)}
            footer={null}
            centered
            width={700}
            className="bg-gray-800 rounded-lg shadow-lg"
            bodyStyle={{ backgroundColor: '#1f2937', padding: '24px', borderRadius: '0 0 8px 8px' }}
            closeIcon={<span className="text-white hover:text-gray-300">&times;</span>}
          >
            <div className="text-gray-300 text-center p-4">
              <p>Welcome to the FinAI Chatbot!</p>
              <p className="mt-2">This is where you can interact with the AI for financial advice or clarifications.</p>
              <p className="mt-4">You can integrate your chatbot component here.</p>
            </div>
          </Modal> */}
        </Content>
      </div>
    </Layout>
  );
};

export default Result;