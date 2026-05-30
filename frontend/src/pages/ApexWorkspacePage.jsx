import { useState, useRef, useEffect } from "react";

export default function ApexWorkspacePage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content: "Workspace Initialized. I am APEX, your Advanced Performance Excellence eXecutive. I have full context on your connected profiles (Codeforces, GitHub, LeetCode). How shall we architect your next project or optimize your algorithmic approach today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollChatToBottom = (behavior = "auto") => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior,
    });
  };

  useEffect(() => {
    scrollChatToBottom(messages.length > 1 ? "smooth" : "auto");
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: "assistant",
        content: `Analyzing your request: "${userMessage.content}". Based on your recent GitHub commits and Codeforces performance, I recommend a modular architecture pattern. Let's break this down step-by-step to ensure it meets professional engineering standards.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleContextSettings = () => {
    alert("Context Configuration options coming soon! Here you will be able to select which platforms (GitHub, Codeforces, etc.) APEX uses to generate advice.");
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#fdfdfd] flex flex-col pt-16">
      <div className="flex-1 w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 flex flex-col h-full">
        
        {/* Workspace Header */}
        <div className="border-4 border-black bg-black text-white px-5 py-3 flex items-center justify-between shadow-[6px_6px_0_0_rgba(0,0,0,0.15)] mb-4 shrink-0">
          <div>
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-widest">APEX Workspace</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Encrypted • Context-Aware • Active</p>
          </div>
          <button 
            onClick={handleContextSettings}
            className="flex items-center gap-2 border-2 border-white px-3 py-1.5 hover:bg-white hover:text-black transition-colors font-black text-[10px] uppercase tracking-widest"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Context Settings
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 border-4 border-black bg-white flex flex-col min-h-0 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          
          {/* Messages Container */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] ${
                    message.type === "user"
                      ? "border-2 border-black bg-black text-white"
                      : "border-2 border-black bg-gray-50 text-black"
                  } p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]`}
                >
                  <div className="flex justify-between items-center mb-2 border-b-2 border-current pb-2 opacity-80">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em]">
                      {message.type === "user" ? "You" : "APEX AI"}
                    </span>
                    <span className="text-[9px] font-bold">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold leading-relaxed break-words whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="border-2 border-black bg-gray-50 p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest">Processing</span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-black animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-black animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-black animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t-4 border-black bg-gray-50 p-4 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-3 max-w-5xl mx-auto w-full">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask APEX to architect a project, review algorithms, or analyze your progress..."
                disabled={isLoading}
                className="flex-1 border-2 border-black px-4 py-3 font-semibold text-sm placeholder:text-gray-500 focus:outline-none focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-shadow disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-6 sm:px-8 py-3 border-2 border-black bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
              >
                Send
              </button>
            </form>
            <div className="mt-2 text-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
              APEX AI is currently in Beta. Responses are generated based on your synchronized developer data.
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
          border-left: 1px solid #e5e7eb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #111;
          border: 2px solid #f9fafb;
        }
      `}</style>
    </div>
  );
}
