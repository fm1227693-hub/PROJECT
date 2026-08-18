import React, { useState, useRef } from "react";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

function AudioPlayer({ src, title = "Practice Test Audio" }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration || 1;
    setCurrentTime(current);
    setProgress((current / total) * 100);
  };

  const handleProgressChange = (e) => {
    if (!audioRef.current || !duration) return;
    const val = parseFloat(e.target.value);
    const newTime = (val / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(val);
    setCurrentTime(newTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const changeSpeed = (rate) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === null) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="sticky top-[80px] z-40 max-w-[1000px] mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-red-500/20 dark:border-red-500/30 shadow-xl shadow-red-950/5 mb-8 py-3.5 px-4 sm:px-6 rounded-2xl transition-all duration-300">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Title */}
        <div className="flex items-center gap-2 font-bold text-red-600 dark:text-red-400 text-sm sm:text-base hidden md:flex w-48 shrink-0 tracking-wide">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <span className="truncate">{title}</span>
        </div>

        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Controls Container */}
        <div className="flex-1 w-full flex items-center gap-3 sm:gap-4">
          
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-11 h-11 shrink-0 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-md shadow-red-600/30 border border-white/20"
          >
            {isPlaying ? (
              <FaPause className="w-4 h-4" />
            ) : (
              <FaPlay className="w-4 h-4 ml-0.5" />
            )}
          </button>

          {/* Current Time */}
          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 shrink-0 w-10 text-right">
            {formatTime(currentTime)}
          </span>

          {/* Red Progress Slider */}
          <div className="relative flex-1 flex items-center group">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress || 0}
              onChange={handleProgressChange}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none z-10"
              style={{
                background: `linear-gradient(to right, #dc2626 0%, #ef4444 ${progress}%, ${
                  document.documentElement.classList.contains("dark")
                    ? "#1e293b"
                    : "#e2e8f0"
                } ${progress}%, ${
                  document.documentElement.classList.contains("dark")
                    ? "#1e293b"
                    : "#e2e8f0"
                } 100%)`
              }}
            />
          </div>

          {/* Duration Time */}
          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 shrink-0 w-10">
            {formatTime(duration)}
          </span>

          {/* Mute/Volume Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors hidden sm:block"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <FaVolumeMute className="w-4 h-4" /> : <FaVolumeUp className="w-4 h-4" />}
          </button>

          {/* Speed Selector Pill */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-extrabold transition-colors border border-red-500/20 flex items-center gap-1 shadow-sm"
            >
              <span>{playbackRate}x</span>
            </button>

            {showSpeedMenu && (
              <div className="absolute right-0 top-full mt-2.5 w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 py-1">
                {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => changeSpeed(rate)}
                    className={`block w-full text-center px-3 py-1.5 text-xs font-bold transition-colors ${
                      playbackRate === rate
                        ? "bg-red-600 text-white"
                        : "text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {rate}x speed
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default React.memo(AudioPlayer);
