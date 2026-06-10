import React from "react";
import { motion } from "motion/react";
import { Sparkles, Search, Youtube, Music, Calendar } from "lucide-react";
import { SongRecommendation } from "../types";

interface RecommendationsListProps {
  recommendations: SongRecommendation[];
  onSelectSong: (query: string) => void;
  isLoading: boolean;
  searchedTerm: string;
}

export default function RecommendationsList({
  recommendations,
  onSelectSong,
  isLoading,
  searchedTerm,
}: RecommendationsListProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-[#0A0A0A] border border-white/5 p-6 rounded-none text-right">
        <div className="flex items-center gap-3 mb-4 animate-pulse">
          <div className="w-5 h-5 rounded-full bg-amber-500/20" />
          <div className="h-4 w-48 bg-white/10" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 border border-white/5 animate-pulse w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-[#0A0A0A] border border-white/5 p-6 md:p-8 rounded-none text-right shadow-xl"
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] uppercase tracking-widest font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            המלצות מוזיקה חכמות
          </span>
          <h3 className="text-xl font-light text-white" style={{ fontFamily: "Georgia, serif" }}>
            שירים דומים ל-&quot;<span className="text-amber-400 italic font-medium">{searchedTerm}</span>&quot;
          </h3>
          <p className="text-xs text-neutral-450 mt-1">
            מבוסס על סגנון, ז׳אנר ותקופה. לחצו על כפתור החיפוש בכדי להאזין ולהוריד אותם ישירות בחינם!
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(rec.searchQuery)}`;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative bg-[#050505] hover:bg-[#121212] border border-white/5 hover:border-amber-500/20 p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 rounded-none text-right"
            >
              {/* Background amber subtle hover glow */}
              <div className="absolute inset-0 bg-radial from-amber-500/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Left/Content section */}
              <div className="flex items-start gap-4 flex-grow w-full md:w-2/3">
                <div className="w-10 h-10 shrink-0 bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300">
                  <Music className="w-4 h-4" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h4 className="text-base font-light text-white group-hover:text-amber-400 transition-colors truncate" style={{ fontFamily: "Georgia, serif" }}>
                      {rec.title}
                    </h4>
                    {rec.year && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-500 px-1.5 py-0.5 bg-white/5 border border-white/5">
                        <Calendar className="w-2.5 h-2.5" />
                        {rec.year}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-neutral-300 mt-0.5">
                    {rec.artist}
                  </p>
                  <p className="text-xs text-neutral-450 mt-1.5 leading-relaxed line-clamp-2 italic">
                    {rec.reason}
                  </p>
                </div>
              </div>

              {/* Right/Actions Section */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0 justify-end">
                {/* YouTube Link */}
                <a
                  href={ytSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-red-950/20 text-neutral-300 hover:text-red-400 border border-white/10 hover:border-red-900/30 text-[10px] uppercase tracking-widest font-bold transition-all rounded-none cursor-pointer"
                  title="צפה ביוטיוב"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  <span>קישור ליוטיוב</span>
                </a>

                {/* Instant search/download */}
                <button
                  onClick={() => onSelectSong(rec.searchQuery)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold text-[10px] uppercase tracking-widest transition-all rounded-none cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>ניגון והורדה בחינם</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
