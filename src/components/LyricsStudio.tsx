import { YouTubeVideo, LyricsData } from "../types";
import { X, Sparkles, BookOpen, MessageSquare, AlertTriangle, Lightbulb } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface LyricsStudioProps {
  video: YouTubeVideo | null;
  onClose: () => void;
}

export default function LyricsStudio({ video, onClose }: LyricsStudioProps) {
  if (!video) return null;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LyricsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLyrics() {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const response = await fetch("/api/lyrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: video.title,
            artist: video.channelName,
          }),
        });
        if (!response.ok) {
          throw new Error("נכשלה הבאת מילות השיר משרת Gemini");
        }
        const json = await response.json();
        setData(json);
      } catch (err: any) {
        console.error(err);
        setError("לא הצלחנו לטעון את מילות השיר. נסה שוב מאוחר יותר.");
      } finally {
        setLoading(false);
      }
    }

    loadLyrics();
  }, [video]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-right text-neutral-200 rounded-none"
        dir="rtl"
      >
        {/* Banner with visual glow */}
        <div className="relative p-6 bg-radial from-amber-500/5 via-transparent to-transparent border-b border-white/10 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <button
              onClick={onClose}
              className="p-2 bg-[#050505]/80 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 rounded-none transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-grow">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-550/30 text-amber-500 text-[10px] uppercase tracking-widest font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                ניתוח ועובדות Gemini AI
              </span>
              <h3 className="text-lg font-light text-white mt-2 line-clamp-1" style={{ fontFamily: 'Georgia, serif' }}>
                {video.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
                ערוץ: {video.channelName}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-amber-500 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-medium tracking-widest text-[#E0E0E0] uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                  מנתח את השיר ומחלץ מילים...
                </h4>
                <p className="text-[11px] text-neutral-450 mt-1 uppercase tracking-wider">
                  Gemini סוקר את הליריקה, בודק רקע אמנותי ומייצר עובדות מעניינות לשיר
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-950/25 border border-red-500/20 text-red-400 p-5 rounded-none flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold">שגיאה בחיבור ל-Gemini</h4>
                <p className="text-xs mt-1 leading-relaxed">{error}</p>
                <button
                  onClick={onClose}
                  className="mt-3 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-xs rounded-none transition-colors cursor-pointer"
                >
                  סגור ונסה שוב
                </button>
              </div>
            </div>
          )}

          {!loading && !error && data && (
            <div className="flex flex-col gap-6" dir="auto">
              
              {/* Lyrics Panel */}
              <div className="bg-[#050505] border border-white/5 p-5 rounded-none">
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-350 flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                  <BookOpen className="w-4 h-4 text-amber-500/80" />
                  מילות השיר (המקור ותרגום לעברית במידת הצורך)
                </h4>
                <div 
                  className="max-h-[300px] overflow-y-auto pr-2 text-sm leading-relaxed text-neutral-300 select-text font-sans whitespace-pre-line text-center"
                  style={{ direction: 'rtl' }}
                >
                  {data.lyrics}
                </div>
              </div>

              {/* Sentimental fact description */}
              {data.songFacts && (
                <div className="bg-[#050505]/60 border border-white/5 p-5 rounded-none">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-350 flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                    <MessageSquare className="w-4 h-4 text-amber-500/80" />
                    המשמעות מאחורי השיר
                  </h4>
                  <p className="text-xs leading-relaxed text-neutral-400">
                    {data.songFacts}
                  </p>
                </div>
              )}

              {/* Trivia bullet points */}
              {data.artistTrivia && data.artistTrivia.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 animate-pulse" />
                    3 עובדות מרתקות שלא ידעתם
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {data.artistTrivia.map((item, index) => (
                      <div
                        key={index}
                        className="bg-[#050505] p-4 border border-white/5 hover:border-amber-500/20 transition-all duration-300 rounded-none animate-fade-in"
                      >
                        <span className="text-xs font-bold text-amber-500 font-mono">
                          #{(index + 1).toString()}
                        </span>
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Studio Footer */}
        <div className="bg-[#050505] py-4 px-6 text-center border-t border-white/5 text-[10px] text-neutral-550 font-mono tracking-wider">
          מילים ועובדות אלו מיוצרות ומנותחות דינמית על ידי מודל Google Gemini Pro.
        </div>
      </motion.div>
    </div>
  );
}
