import { useState, useRef, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL; // e.g. http://localhost:8000/api

/**
 * AIInsightPanel — Displays a real-time streaming AI analysis card.
 * Uses the native fetch + ReadableStream (no EventSource, so auth header works).
 *
 * Props:
 *   cfData    — Codeforces dashboard summary object (optional)
 *   userName  — the authenticated user's name
 */
export default function AIInsightPanel({ cfData, userName }) {
  const [insight, setInsight]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState(null);
  const [charCount, setCharCount]   = useState(0);
  const abortRef                    = useRef(null);
  const startTimeRef                = useRef(null);
  const [elapsed, setElapsed]       = useState(null);

  const generate = useCallback(async () => {
    // Abort any previous in-flight stream
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setInsight("");
    setLoading(true);
    setDone(false);
    setError(null);
    setCharCount(0);
    setElapsed(null);
    startTimeRef.current = Date.now();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE}/ai/insight/stream`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep incomplete line in buffer

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          try {
            const parsed = JSON.parse(raw);

            if (parsed.done) {
              setDone(true);
              setElapsed(((Date.now() - startTimeRef.current) / 1000).toFixed(1));
            } else if (parsed.error) {
              setError(parsed.error);
            } else if (parsed.content) {
              setInsight((prev) => {
                const next = prev + parsed.content;
                setCharCount(next.length);
                return next;
              });
            }
          } catch {
            // Non-JSON line — ignore
          }
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to connect to AI service.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const stop = () => {
    if (abortRef.current) abortRef.current.abort();
    setLoading(false);
    setDone(true);
    setElapsed(((Date.now() - startTimeRef.current) / 1000).toFixed(1));
  };

  // Format insight into paragraphs for display
  const paragraphs = insight
    .split(/\n\n+/)
    .filter(Boolean)
    .map((p) => p.replace(/\n/g, " ").trim());

  // Paragraph labels
  const labels = ["DIAGNOSIS", "PRESCRIPTION", "TRAJECTORY"];

  const idle = !loading && !insight && !error;

  return (
    <div className="w-full border-[4px] border-black bg-black text-white shadow-[12px_12px_0_0_rgba(0,0,0,0.3)]">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="border-b-[4px] border-white px-6 sm:px-10 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Animated pulse when streaming */}
          <div className={`w-3 h-3 flex-shrink-0 ${loading ? "bg-white animate-pulse" : done ? "bg-white" : "bg-gray-600"}`} />
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-none">
            CodeLens · Live Intelligence
          </h2>
          {loading && (
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 hidden sm:block animate-pulse">
              Thinking...
            </span>
          )}
        </div>

        <div className="flex gap-3 items-center">
          {/* Stats bar */}
          {(loading || done) && (
            <div className="flex gap-4 text-xs font-black uppercase tracking-widest text-gray-500">
              {charCount > 0 && <span>{charCount} chars</span>}
              {elapsed && <span>{elapsed}s</span>}
            </div>
          )}

          {/* Model badge */}
          <div className="border-[2px] border-gray-600 px-3 py-1 text-xs font-black uppercase tracking-widest text-gray-400">
            Powered by AI
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="px-6 sm:px-10 py-8 sm:py-12 min-h-[260px] flex flex-col">

        {/* Idle state */}
        {idle && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 gap-6">
            <div className="text-6xl sm:text-7xl font-black text-gray-800 tracking-tighter leading-none select-none">
              AI
            </div>
            <p className="font-bold uppercase tracking-widest text-sm text-gray-500 max-w-md leading-relaxed">
              {cfData
                ? `Ready to analyse ${userName || "your"}'s Codeforces data — ${cfData.totalSolved ?? 0} problems solved, rating ${cfData.rating ?? "N/A"} — and generate a surgical growth insight.`
                : "Connect your Codeforces account first to unlock personalized AI-driven growth analysis."}
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="border-[4px] border-white px-6 py-5 mb-6">
            <p className="font-black uppercase tracking-widest text-sm leading-relaxed">
              ⚠ {error}
            </p>
          </div>
        )}

        {/* Streaming / done — render paragraphs */}
        {(insight || (loading && !insight)) && (
          <div className="space-y-8 flex-1">
            {paragraphs.length === 0 && loading && (
              /* Skeleton dots while first tokens arrive */
              <div className="flex gap-2 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-white animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}

            {paragraphs.map((para, i) => (
              <div key={i} className="group">
                {/* Paragraph label */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-[3px] bg-white" />
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                    {labels[i] || `Point ${i + 1}`}
                  </span>
                </div>
                {/* Content */}
                <p className="text-base sm:text-lg md:text-xl font-bold leading-relaxed tracking-wide text-white">
                  {para}
                  {/* Blinking cursor on last paragraph while streaming */}
                  {i === paragraphs.length - 1 && loading && (
                    <span className="inline-block w-[3px] h-[1.1em] bg-white ml-1 animate-pulse align-middle" />
                  )}
                </p>
              </div>
            ))}

            {/* Inline raw text while first paragraph forms (no double newlines yet) */}
            {paragraphs.length === 0 && insight && (
              <p className="text-base sm:text-lg font-bold leading-relaxed tracking-wide text-white">
                {insight}
                {loading && (
                  <span className="inline-block w-[3px] h-[1.1em] bg-white ml-1 animate-pulse align-middle" />
                )}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Footer Actions ─────────────────────────────────────────────── */}
      <div className="border-t-[4px] border-white px-6 sm:px-10 py-5 flex flex-col sm:flex-row gap-3">
        {loading ? (
          <>
            <button
              onClick={stop}
              className="w-full sm:w-auto px-8 py-4 border-[3px] border-gray-500 text-gray-400 font-black uppercase tracking-widest text-sm hover:border-white hover:text-white transition-colors"
            >
              ■ Stop
            </button>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-600">
              <div className="w-2 h-2 bg-white animate-ping" />
              Streaming from NVIDIA API...
            </div>
          </>
        ) : (
          <>
            <button
              onClick={generate}
              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-white text-black font-black uppercase tracking-widest text-sm sm:text-base hover:bg-gray-200 transition-colors border-[4px] border-white shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]"
            >
              {done ? "↻ Regenerate Insight" : "⚡ Generate Insight"}
            </button>
            {done && (
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                <div className="w-2 h-2 bg-white" />
                Generated in {elapsed}s
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
