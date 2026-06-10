import { YouTubeVideo } from "../types";
import { X, Download, ShieldCheck, Music, Video, ExternalLink, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface DownloadStudioProps {
  video: YouTubeVideo | null;
  onClose: () => void;
}

export default function DownloadStudio({ video, onClose }: DownloadStudioProps) {
  if (!video) return null;

  const [activeTab, setActiveTab] = useState<"audio" | "video">("audio");

  // We offer multiple legendary free widget providers for 100% download reliability
  const convert2mp3Url = `https://convert2mp3s.com/api/button/mp3/${video.videoId}`;
  const loaderToMp3Url = `https://loader.to/api/card/?id=${video.videoId}&color=e5a100`;
  const ytmigUrl = `https://api.vevioz.com/@api/button/mp3/${video.videoId}`;
  const loaderToMp4Url = `https://loader.to/api/card/?id=${video.videoId}&f=mp4&color=e5a100`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main Studio Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 180 }}
        className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-right rounded-none"
        dir="rtl"
      >
        {/* Banner with video thumbnail and custom glow */}
        <div className="relative h-44 flex-shrink-0 bg-[#050505]">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover opacity-30 blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
          
          {/* Header Controls */}
          <div className="absolute top-4 left-4">
            <button
              onClick={onClose}
              className="p-2 bg-[#050505]/80 hover:bg-white/10 border border-white/10 rounded-none text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Header Details */}
          <div className="absolute bottom-4 right-6 left-6 text-right">
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] uppercase tracking-widest font-bold">
              סטודיו המרה סטודיו פרימיום
            </span>
            <h3 className="text-lg font-light text-white mt-2 line-clamp-1" style={{ fontFamily: 'Georgia, serif' }}>
              {video.title}
            </h3>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
              ערוץ: {video.channelName} • אורך: {video.duration}
            </p>
          </div>
        </div>

        {/* Studio Workspace Content */}
        <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-6">
          
          {/* Converter Choice Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-[#050505] p-1.5 border border-white/5 rounded-none">
            <button
              onClick={() => setActiveTab("audio")}
              className={`flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest font-bold transition-all rounded-none cursor-pointer ${
                activeTab === "audio"
                  ? "bg-amber-600 text-black shadow-lg"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Music className="w-4 h-4" />
              <span>שיר סאונד (MP3)</span>
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest font-bold transition-all rounded-none cursor-pointer ${
                activeTab === "video"
                  ? "bg-amber-600 text-black shadow-lg"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Video className="w-4 h-4" />
              <span>סרטון וידאו (MP4)</span>
            </button>
          </div>

          {/* Guidelines / Benefits Panel */}
          <div className="bg-[#050505] p-4 border border-white/5 flex items-start gap-4 rounded-none">
            <ShieldCheck className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-right">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
                פעולה בטוחה, מהירה וחינמית
              </h4>
              <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                טכנולוגיית ההמרה מתבצעת ישירות בשרתי ענן חיצוניים מאובטחים. בחר את אחד מכלי ההמרה המותקנים מטה, המתן 5-10 שניות להכנת הקובץ, ולחץ על כפתור ההורדה הסופי.
              </p>
            </div>
          </div>

          {/* Workspaces - Iframes */}
          {activeTab === "audio" ? (
            <div className="flex flex-col gap-5">
              <div className="bg-[#050505] p-4 border border-white/5 rounded-none">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                  שרת הורדה 1 (ממיר מהיר Convert2MP3s):
                </span>
                <iframe
                  src={convert2mp3Url}
                  className="w-full h-32 border border-white/10 bg-black/40 rounded-none animate-fade-in"
                  allowFullScreen
                />
              </div>

              <div className="bg-[#050505] p-4 border border-white/5 rounded-none">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                  שרת הורדה 2 (מרכז המרות LoaderTo - תפריט איכות מלאה):
                </span>
                <iframe
                  src={loaderToMp3Url}
                  className="w-full h-[260px] border border-white/10 bg-black/40 rounded-none"
                  allowFullScreen
                />
              </div>

              <div className="bg-[#050505] p-4 border border-white/5 rounded-none">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                  שרת הורדה 3 (Vevioz Button Widget):
                </span>
                <iframe
                  src={ytmigUrl}
                  className="w-full h-32 border border-white/10 bg-black/40 rounded-none"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="bg-[#050505] p-4 border border-white/5 rounded-none">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                  שרת המרת וידאו (Loader.to MP4 720p/1080p):
                </span>
                <iframe
                  src={loaderToMp4Url}
                  className="w-full h-[280px] border border-white/10 bg-black/40 rounded-none"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Alternative direct link for desktop/failover */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-white/5 pt-5 mt-2">
            <span className="text-xs text-neutral-400 flex items-center gap-1.5 font-medium">
              <HelpCircle className="w-4 h-4 text-amber-550 mr-1" />
              האם ההורדה לא מתחילה או חסומה? נסה להוריד ישירות להלן:
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <a
                href={`https://convert2mp3s.com/api/button/mp3/${video.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="flex-grow sm:flex-none flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 bg-[#050505] hover:bg-white/5 text-neutral-300 hover:text-white border border-white/10 transition-colors rounded-none"
              >
                <span>פתח ממיר MP3 ישיר</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://loader.to/api/card/?id=${video.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="flex-grow sm:flex-none flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 bg-[#050505] hover:bg-white/5 text-neutral-300 hover:text-white border border-white/10 transition-colors rounded-none"
              >
                <span>פתח ממיר Loader.to</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer info banner */}
        <div className="bg-[#050505] py-4 px-6 text-center border-t border-white/5 text-[10px] text-neutral-550 font-mono tracking-wider">
          כל שירותי ההמרה הם צד שלישי המנוהלים עצמאית. אנא השתמש בהורדות אלו למטרות שימוש עצמי חוקי בלבד.
        </div>
      </motion.div>
    </div>
  );
}
