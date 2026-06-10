import { YouTubeVideo } from "../types";
import { X, Play, Pause, Disc, Volume2, Maximize2, Minimize2, Tv } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface MusicPlayerPanelProps {
  video: YouTubeVideo | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
}

export default function MusicPlayerPanel({
  video,
  isPlaying,
  onTogglePlay,
  onClose,
}: MusicPlayerPanelProps) {
  if (!video) return null;

  const [expanded, setExpanded] = useState(false);

  // Generate YouTube Embed URL with autoplay enabled
  const embedUrl = `https://www.youtube.com/embed/${video.videoId}?autoplay=1&enablejsapi=1&origin=${window.location.origin}`;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
      className="fixed bottom-0 inset-x-0 z-40 bg-[#080808]/95 border-t border-white/10 shadow-2xl backdrop-blur-xl"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Track Title and Channel */}
        <div className="flex items-center gap-3 w-full md:w-1/3">
          {/* Rotating mini disc thumbnail */}
          <div className="relative flex-shrink-0">
            <img
              src={video.thumbnail}
              alt={video.title}
              className={`w-12 h-12 object-cover border border-white/10 rounded-none ${
                isPlaying ? "animate-[spin_10s_linear_infinite]" : ""
              }`}
            />
            {/* Center disc point */}
            <div className="absolute inset-0 m-auto w-3 h-3 bg-[#050505] rounded-full border border-white/20" />
          </div>

          <div className="text-right overflow-hidden flex-grow">
            <h4 className="text-sm font-light text-white line-clamp-1 leading-normal" dir="auto" style={{ fontFamily: 'Georgia, serif' }}>
              {video.title}
            </h4>
            <p className="text-[11px] uppercase tracking-wider text-neutral-400 truncate mt-0.5">
              {video.channelName}
            </p>
          </div>
        </div>

        {/* Playback Controls & Equalizer Waves */}
        <div className="flex items-center justify-center gap-6 w-full md:w-1/3">
          {/* Animated Equalizer Visualizer Waves */}
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-amber-600 to-amber-300 rounded-none animate-[bounce_1.2s_infinite_ease-in-out]"
                  style={{
                    height: `${Math.random() * 20 + 6}px`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}

          <button
            onClick={onTogglePlay}
            className="p-3 bg-amber-600 hover:bg-amber-500 rounded-none text-black shadow-lg active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <span className="text-[10px] text-amber-550 uppercase font-bold tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-none">
            מצב נגן פעיל
          </span>
        </div>

        {/* Expand Video Panel, Volume Icon and Controls */}
        <div className="flex items-center justify-end gap-3 w-full md:w-1/3">
          {/* Quick toggle watch screen */}
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-[10px] uppercase tracking-wider font-bold cursor-pointer transition-all ${
              expanded
                ? "bg-amber-600 text-black border border-amber-600"
                : "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10"
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>הצג מסך וידאו</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-none transition-colors cursor-pointer border border-transparent hover:border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Expanded Iframe Player Wrapper */}
      {expanded && isPlaying && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          className="bg-[#050505] border-t border-white/10 overflow-hidden flex justify-center py-6"
        >
          <div className="w-full max-w-xl aspect-video px-4">
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full rounded-none border border-white/15"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      )}

      {/* Always render hidden iframe if not expanded so music STILL plays seamlessly! */}
      {!expanded && isPlaying && (
        <div className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none">
          <iframe
            src={embedUrl}
            title={video.title}
            allow="autoplay; encrypted-media"
          />
        </div>
      )}

    </motion.div>
  );
}
