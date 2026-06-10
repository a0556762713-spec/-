import React, { useState, useEffect } from "react";
import { YouTubeVideo, SongRecommendation } from "./types";
import VideoCard from "./components/VideoCard";
import DownloadStudio from "./components/DownloadStudio";
import LyricsStudio from "./components/LyricsStudio";
import MusicPlayerPanel from "./components/MusicPlayerPanel";
import RecommendationsList from "./components/RecommendationsList";
import { 
  Search, 
  Music, 
  Download, 
  Sparkles, 
  RotateCcw, 
  TrendingUp, 
  Disc, 
  Compass, 
  HelpCircle,
  Youtube
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Standard popular Israeli & International recommendation tracks
const RECOMMENDATIONS = [
  { title: "יסמין מועלם - יהיה טוב", q: "יסמין מועלם יהיה טוב" },
  { title: "עומר אדם - רק שלך", q: "עומר אדם רק שלך" },
  { title: "נועה קירל - פנתרה", q: "נועה קירל פנתרה" },
  { title: "עדן חסון - שרק יקרא לי", q: "עדן חסון שרק יקרא לי" },
  { title: "The Weeknd - Blinding Lights", q: "The Weeknd Blinding Lights" },
  { title: "Billie Eilish - Birds of a Feather", q: "Billie Eilish Birds of a Feather" }
];

const POPULAR_TAGS = [
  "להיטים ישראלים 2026",
  "מוזיקה מזרחית שקטה",
  "היפ הופ ישראלי חדש",
  "מוזיקה מרגיעה לריכוז",
  "נוסטלגיה ישראלית",
  "Global Viral Hits"
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<SongRecommendation[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [lastSearchedTerm, setLastSearchedTerm] = useState("");

  // Audio preview / stream states
  const [currentTrack, setCurrentTrack] = useState<YouTubeVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Modals / detailed views
  const [trackForDownload, setTrackForDownload] = useState<YouTubeVideo | null>(null);
  const [trackForLyrics, setTrackForLyrics] = useState<YouTubeVideo | null>(null);

  // Search history
  const [history, setHistory] = useState<string[]>([]);

  // Load search history from localStorage on load
  useEffect(() => {
    try {
      const stored = localStorage.getItem("yt_search_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveToHistory = (query: string) => {
    if (!query.trim() || history.includes(query.trim())) return;
    const updated = [query.trim(), ...history.slice(0, 7)];
    setHistory(updated);
    try {
      localStorage.setItem("yt_search_history", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("yt_search_history");
    } catch (e) {
      console.error(e);
    }
  };

  // Perform similar recommendations fetching via Gemini API
  const fetchRecommendations = async (queryTerm: string) => {
    setRecsLoading(true);
    setLastSearchedTerm(queryTerm);
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: queryTerm }),
      });
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } else {
        setRecommendations([]);
      }
    } catch (e) {
      console.error("Failed to fetch recommendations:", e);
      setRecommendations([]);
    } finally {
      setRecsLoading(false);
    }
  };

  // Perform Server Search
  const handleSearch = async (queryToSearch: string) => {
    const queryTerm = queryToSearch.trim();
    if (!queryTerm) return;

    setSearchQuery(queryTerm);
    setLoading(true);
    setError(null);
    setRecommendations([]); // reset prior recommendations
    
    // Concurrently trigger Gemini AI recommendation search
    fetchRecommendations(queryTerm);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(queryTerm)}`);
      if (!res.ok) {
        throw new Error("נכשלה הבאת תוצאות החיפוש מיוטיוב");
      }
      const data = await res.json();
      setResults(data.results || []);
      saveToHistory(queryTerm);
    } catch (err: any) {
      console.error(err);
      setError("שגיאה בחיבור לשרת יוטיוב. אנא נסה שנית בעוד מספר רגעים.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  // Music Player Triggers
  const handlePlayToggle = (video: YouTubeVideo) => {
    if (currentTrack?.videoId === video.videoId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(video);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#E0E0E0] flex flex-col selection:bg-amber-600/30 selection:text-white" dir="rtl">
      
      {/* Dynamic Background visual glows */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[280px] h-[280px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Sophisticated Dark Header */}
      <header className="h-20 flex items-center justify-between px-6 md:px-12 border-b border-white/10 shrink-0 bg-[#050505] sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-amber-500 rounded-sm flex items-center justify-center">
            <div className="w-4 h-4 bg-[#050505] rotate-45"></div>
          </div>
          <span className="text-2xl tracking-[0.2em] font-light text-white uppercase pr-2" style={{ fontFamily: "Georgia, serif" }}>Lyra</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-xs uppercase tracking-widest font-semibold opacity-70">
          <a href="#" className="hover:text-amber-500 transition-colors">Discover</a>
          <a href="#" className="hover:text-amber-500 transition-colors">Library</a>
          <a href="#" className="text-amber-500">Downloader</a>
        </nav>
        <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-mono text-[10px] text-amber-500 font-bold select-none">
          PRO
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-6 pt-12 pb-32">
        
        {/* Hub Header */}
        <header className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-amber-505 font-bold mb-5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>הורדה ישירה ומהירה בחינם ללא הגבלה</span>
          </motion.div>

          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-light text-white mb-4 leading-tight"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
          >
            חיפוש והורדת שירים מיוטיוב.
          </motion.h1>
          <motion.p
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs uppercase tracking-wider text-neutral-400 mt-2 max-w-xl mx-auto leading-relaxed"
          >
            המרה ישירה של סרטוני יוטיוב לקובצי מוזיקה (MP3) וקובצי וידאו (MP4) באיכות מעולה, כולל מילים ועובדות מעניינות לשיר המופקות על ידי בינה מלאכותית.
          </motion.p>
        </header>

        {/* Master Search Input Form */}
        <section className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center bg-[#121212] border border-white/15 focus-within:border-amber-500/50 transition-all duration-350 rounded-none shadow-2xl">
              <input
                type="text"
                placeholder="הקלד שם שיר, שם זמר או הדבק קישור מיוטיוב..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-6 py-5 text-base text-neutral-100 placeholder-neutral-600 outline-none text-right placeholder:text-right font-light tracking-wide focus:ring-0"
              />
              <button
                type="submit"
                className="ml-2 flex items-center justify-center py-3.5 py-4 px-6 bg-amber-600 hover:bg-amber-500 text-black rounded-none shadow-lg active:scale-98 transition-all mr-2 cursor-pointer font-bold text-xs uppercase tracking-widest shrink-0"
              >
                <Search className="w-4 h-4 ml-1" />
                <span>חפש שיר</span>
              </button>
            </div>
          </form>

          {/* Popular Tag suggestions */}
          <div className="flex flex-wrap gap-2 mt-5 justify-center">
            {POPULAR_TAGS.map((tag, index) => (
              <button
                key={index}
                onClick={() => handleSearch(tag)}
                className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-[10px] uppercase font-bold tracking-widest rounded-none border border-white/5 hover:border-white/15 transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* History Section */}
        {history.length > 0 && (
          <section className="max-w-2xl mx-auto mb-12 p-4 rounded-none bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 select-none">חיפושים אחרונים:</span>
              <div className="flex flex-wrap gap-2">
                {history.map((hQuery, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(hQuery)}
                    className="inline-flex items-center gap-1 text-xs text-neutral-350 hover:text-amber-500 font-medium transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 text-[#555]" />
                    <span>{hQuery}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={clearHistory}
              className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80 hover:text-amber-400 cursor-pointer"
            >
              נקה היסטוריה
            </button>
          </section>
        )}

        {/* Grid of Contents */}
        <section className="space-y-6">
          
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="relative">
                <div className="w-14 h-14 border-4 border-amber-500/10 border-t-amber-550 rounded-full animate-spin" />
                <Disc className="w-7 h-7 text-amber-500 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white tracking-widest uppercase" style={{ fontFamily: 'Georgia, serif' }}>סורק ומחלץ תוצאות מיוטיוב...</h3>
                <p className="text-[11px] text-neutral-500 mt-1 uppercase tracking-wider">אנו מושכים בבטחה את הכותרות והפרטים הטובים ביותר</p>
              </div>
            </div>
          )}

          {error && (
            <div className="max-w-md mx-auto p-6 rounded-none bg-red-650/10 border border-red-500/20 text-center">
              <p className="text-sm font-semibold text-red-400">{error}</p>
              <button
                onClick={() => handleSearch(searchQuery || "מוזיקה")}
                className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 rounded-none transition-all font-medium text-xs cursor-pointer"
              >
                נסה שוב לחבר
              </button>
            </div>
          )}

          {/* Results Video Cards List */}
          {!loading && !error && results.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest font-mono">
                  נמצאו {results.length} תוצאות
                </span>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  לחץ על כפתור הורדה למטה כדי להתחיל
                </span>
              </div>

              {results.map((video) => (
                <VideoCard
                  key={video.videoId}
                  video={video}
                  isPlaying={currentTrack?.videoId === video.videoId && isPlaying}
                  onPlay={handlePlayToggle}
                  onDownload={(v) => setTrackForDownload(v)}
                  onLyrics={(v) => setTrackForLyrics(v)}
                />
              ))}

              {/* Dynamic Similar Song Recommendations via Gemini */}
              {(recsLoading || recommendations.length > 0) && (
                <div className="mt-8 border-t border-white/5 pt-8 animate-fade-in">
                  <RecommendationsList
                    recommendations={recommendations}
                    onSelectSong={handleSearch}
                    isLoading={recsLoading}
                    searchedTerm={lastSearchedTerm}
                  />
                </div>
              )}
            </div>
          )}

          {/* Recommend Panel shown on initial load / empty states */}
          {!loading && !error && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto text-right"
            >
              {/* Promo recommendation card config */}
              <div className="rounded-none bg-[#0A0A0A] border border-white/5 p-8 flex flex-col md:flex-row items-center gap-6 mb-8 text-right hover:border-white/10 transition-all">
                <div className="w-16 h-16 bg-white/5 border border-white/15 rounded-sm flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Youtube className="w-8 h-8 text-amber-500 animate-pulse" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-base font-light text-white" style={{ fontFamily: 'Georgia, serif' }}>איך להוריד מוזיקה מיוטיוב ללא עלות?</h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    זה פשוט! חפש כל שיר שאתה רוצה על ידי הקלדת שמו או זמר בשורת החיפוש למעלה. לאחר בחירת השיר המבוקש מהרשימה, לחץ על <b className="text-amber-400">הורדה בחינם</b>. אנו נפתח עבורך את סטודיו ההורדות המהירות שבו תוכל לבחור את סוג הקובץ המועדף עליך (קובץ MP3 לשירי שמע כרצונך או קובץ MP4 לסרטוני וידאו) ולקבלו ישירות למחשב או לנייד.
                  </p>
                </div>
              </div>

              {/* Instant Clicking Recommendation Board */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-5 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  המלצות חמות לחיפוש מהיר:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {RECOMMENDATIONS.map((rec, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(rec.q)}
                      className="flex items-center justify-between p-4 bg-[#0A0A0A] hover:bg-[#121212] hover:border-amber-500/20 rounded-none border border-white/5 transition-all text-right group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-none bg-[#050505] border border-white/10 flex items-center justify-center text-neutral-450 group-hover:text-amber-500 transition-colors">
                          <Music className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs text-neutral-300 group-hover:text-white transition-colors font-medium">
                          {rec.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#666] group-hover:text-amber-500 transition-colors">
                        חיפוש מהיר ←
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

        </section>

      </main>

      {/* Persistent floating Spotify-like Audio Playback panel */}
      <AnimatePresence>
        {currentTrack && (
          <MusicPlayerPanel
            video={currentTrack}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onClose={() => {
              setCurrentTrack(null);
              setIsPlaying(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Interactive Download Studio modal frame */}
      <AnimatePresence>
        {trackForDownload && (
          <DownloadStudio
            video={trackForDownload}
            onClose={() => setTrackForDownload(null)}
          />
        )}
      </AnimatePresence>

      {/* Visual Lyrics Analyzer sheet */}
      <AnimatePresence>
        {trackForLyrics && (
          <LyricsStudio
            video={trackForLyrics}
            onClose={() => setTrackForLyrics(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
