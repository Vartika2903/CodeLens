import { useState } from "react";

/**
 * Two-step verification modal for Codeforces surname-based verification.
 *
 * Step 1: User types their handle
 * Step 2: We show the verification code — they update their CF surname
 * Step 3: They click Verify and we confirm.
 *
 * Props:
 *   isOpen          — boolean
 *   onClose         — () => void
 *   initiateConnect — (handle: string) => Promise<{ verificationCode, ... }>
 *   verifyConnect   — () => Promise
 *   verificationCode — string | null
 *   connectLoading  — boolean
 *   connectError    — string | null
 */
export default function VerifyModal({
  isOpen,
  onClose,
  initiateConnect,
  verifyConnect,
  verificationCode,
  connectLoading,
  connectError,
}) {
  const [handle, setHandle] = useState("");
  const [step, setStep] = useState(1); // 1 = enter handle, 2 = set surname
  const [localError, setLocalError] = useState("");

  if (!isOpen) return null;

  const handleInitiate = async () => {
    if (!handle.trim()) {
      setLocalError("Please enter your Codeforces handle.");
      return;
    }
    setLocalError("");
    try {
      await initiateConnect(handle.trim());
      setStep(2);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleVerify = async () => {
    setLocalError("");
    try {
      await verifyConnect();
      setStep(1);
      setHandle("");
      onClose();
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const error = localError || connectError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-2xl bg-white border-[4px] border-black shadow-[16px_16px_0_0_rgba(0,0,0,1)]">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b-[4px] border-black">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none">
            {step === 1 ? "Connect Codeforces" : "Verify Identity"}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl font-black hover:bg-black hover:text-white w-10 h-10 flex items-center justify-center border-[3px] border-black transition-colors"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-10 space-y-8">
          {step === 1 && (
            <>
              <p className="font-bold uppercase tracking-widest text-sm leading-relaxed text-gray-700">
                Enter your Codeforces handle below. We will generate a unique code for you to set as your Codeforces Last Name to prove ownership.
              </p>
              <div className="flex flex-col sm:flex-row gap-0">
                <input
                  type="text"
                  placeholder="e.g. tourist"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleInitiate()}
                  className="flex-1 px-6 py-4 border-[4px] border-black text-lg font-bold uppercase tracking-widest focus:outline-none bg-gray-50 rounded-none"
                />
                <button
                  onClick={handleInitiate}
                  disabled={connectLoading}
                  className="px-8 py-4 bg-black text-white font-black uppercase tracking-widest border-[4px] border-black sm:border-l-0 hover:bg-gray-800 transition-colors disabled:opacity-50 rounded-none"
                >
                  {connectLoading ? "Checking..." : "Generate Code →"}
                </button>
              </div>
            </>
          )}

          {step === 2 && verificationCode && (
            <>
              <p className="font-bold uppercase tracking-widest text-sm leading-relaxed text-gray-700">
                Follow these steps carefully:
              </p>
              <ol className="space-y-4 list-none">
                {[
                  `Go to codeforces.com/settings`,
                  `Set your Last Name to the code below`,
                  `Click Save and return here`,
                  `Click Verify — we will check and link your account`,
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-black text-white font-black text-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="font-bold uppercase tracking-widest text-sm leading-relaxed pt-1">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>

              {/* Code display */}
              <div className="border-[4px] border-black bg-black text-white px-8 py-6 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                  Your Verification Code
                </p>
                <p className="text-4xl sm:text-5xl font-black tracking-widest font-mono">
                  {verificationCode}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">
                  Expires in 15 minutes
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => { setStep(1); setLocalError(""); }}
                  className="flex-1 px-6 py-4 border-[4px] border-black bg-white font-black uppercase tracking-widest hover:bg-gray-100 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleVerify}
                  disabled={connectLoading}
                  className="flex-1 px-6 py-4 bg-black text-white border-[4px] border-black font-black uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {connectLoading ? "Verifying..." : "Verify Now ✓"}
                </button>
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <div className="border-[3px] border-black bg-black text-white px-6 py-4">
              <p className="font-black uppercase tracking-widest text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
