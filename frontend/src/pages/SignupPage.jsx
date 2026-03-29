import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-8 py-20 bg-white">
      <div className="w-full max-w-md border-[4px] border-black p-12 bg-white shadow-[16px_16px_0_0_rgba(0,0,0,1)]">
        <h2 className="text-5xl font-black uppercase tracking-tighter text-black mb-12">
          Sign Up
        </h2>
        <form className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-black">
              Full Name
            </label>
            <input 
              type="text" 
              className="w-full p-5 border-[4px] border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
              placeholder="JOHN DOE"
            />
          </div>
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-black">
              Email
            </label>
            <input 
              type="email" 
              className="w-full p-5 border-[4px] border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
              placeholder="YOUR@EMAIL.COM"
            />
          </div>
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-black">
              Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full p-5 border-[4px] border-black rounded-none text-black font-bold focus:outline-none focus:ring-0 focus:border-gray-500"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                  ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full mt-4 py-6 bg-white text-black text-xl font-black uppercase tracking-widest hover:bg-gray-100 transition-colors border-[4px] border-black rounded-none"
          >
            Create Account
          </button>
        </form>
        <div className="mt-10 text-center border-t-[4px] border-black pt-8">
          <p className="text-sm font-black uppercase tracking-widest text-black">
            Already have an account? <Link to="/login" className="underline underline-offset-8 decoration-[3px] hover:text-gray-600">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
