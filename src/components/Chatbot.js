import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const CHAT_BOT_API_URL = process.env.REACT_APP_CHATBOT_API_URL || 'http://localhost:5000';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef(null);

  const userId = localStorage.getItem('userId');
  

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages((msgs) => [...msgs, { text: input, sender: 'user' }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${CHAT_BOT_API_URL}/chatbot`, { message: input,  userId: userId });
      setMessages((msgs) => [...msgs, { text: data.response, sender: 'bot' }]);
    } catch (err) {
      console.error(err);
      setMessages((msgs) => [...msgs, { text: "Sorry, I couldn't process that.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white font-sans antialiased">
            <header className="bg-gradient-to-r from-blue-700 to-purple-800 p-4 text-center shadow-lg">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          FinAI
        </h1>
        <p className="text-sm text-blue-200 mt-1">Your Personalized Financial Assistant</p>
      </header>

      {/* Message window */}
      <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`relative p-3 rounded-xl max-w-[80%] transition-all duration-300 ease-in-out transform origin-bottom animate-fade-in  ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white ml-auto rounded-br-md shadow-md '
                : 'bg-gray-800 text-gray-100 mr-auto rounded-bl-md shadow-md'
            }`}
          >
            {msg.sender === 'bot' ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center justify-center space-x-2 bg-gray-700 p-3 rounded-xl max-w-[150px] mr-auto shadow-md animate-fade-in">
            <span className="dot animate-bounce delay-0 bg-gray-400"></span>
            <span className="dot animate-bounce delay-100 bg-gray-400"></span>
            <span className="dot animate-bounce delay-200 bg-gray-400"></span>
            <span className="text-gray-400 text-sm italic ml-2">Thinking...</span>

          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-gray-900 border-t border-gray-800 shadow-xl flex items-center space-x-3">
        <input
          type="text"
          className="flex-grow p-3 rounded-full bg-gray-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading} >
         
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
