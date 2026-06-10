import { YouTubeVideo } from "../types";
import { Play, Pause, Download, BookOpen, Music, Eye, Calendar } from "lucide-react";
import { motion } from "motion/react";

interface VideoCardProps {
  key?: string;
  video: YouTubeVideo;
  isPlaying: boolean;
  onPlay: (video: YouTubeVideo) => void;
  onDownload: (video: YouTubeVideo) => void;
  onLyrics: (video: YouTubeVideo) => void;
}

export default function VideoCard({
  video,
  isPlaying,
  onPlay,
  onDownload,
  onLyrics,
}: VideoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden bg-[#0A0A0A] border border-white/5 hover:border-amber-500/30 hover:bg-[#121212] transition-all duration-300 flex flex-col sm:flex-row p-5 gap-5 text-right rounded-none"
    >
      {/* Amber ambient hover glow */}
      <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Video Thumbnail Section */}
      <div className="relative flex-shrink-0 w-full sm:w-48 aspect-video overflow-hidden bg-[#1A1A1A] rounded-none">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        {/* Duration Badge */}
        {video.duration && (
          <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#050505]/95 border border-white/10 text-[10px] font-mono text-neutral-300 tracking-wider">
            {video.duration}
          </span>
        )}
        
        {/* Play Overlay Button */}
        <button
          onClick={() => onPlay(video)}
          className="absolute inset-x-0 inset-y-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto"
        >
          <div className="p-3 bg-amber-500 text-black shadow-xl hover:scale-105 active:scale-95 transition-all rounded-none">
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </div>
        </button>
      </div>

      {/* Details Section */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <h2 className="text-base font-light text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-relaxed" dir="auto" style={{ fontFamily: 'Georgia, serif' }}>
            {video.title}
          </h2>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-neutral-400">
            <span className="font-semibold text-neutral-305 flex items-center gap-1">
              <Music className="w-3.5 h-3.5 text-amber-550/80" />
              {video.channelName}
            </span>
            {video.viewCount && (
              <span className="flex items-center gap-1 opacity-50">
                <Eye className="w-3 h-3" />
                {video.viewCount}
              </span>
            )}
            {video.publishedTime && (
              <span className="flex items-center gap-1 opacity-50">
                <Calendar className="w-3 h-3" />
                {video.publishedTime}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls Section */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
          <button
            onClick={() => onPlay(video)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-200 rounded-none cursor-pointer ${
              isPlaying
                ? "bg-amber-550/10 text-amber-400 border border-amber-550/30"
                : "bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/10"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current animate-pulse" />
                <span>השהיית שיר</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                <span>ניגון שיר/קליפ</span>
              </>
            )}
          </button>

          <button
            onClick={() => onDownload(video)}
            className="flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-widest transition-all rounded-none cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>הורדה בחינם - MP3 / MP4</span>
          </button>

          <button
            onClick={() => onLyrics(video)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-350 hover:text-white text-xs border border-white/10 transition-all rounded-none cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500/80" />
            <span>מילים ופרטי AI</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
