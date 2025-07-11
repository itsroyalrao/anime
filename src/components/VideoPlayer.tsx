import { useState, useRef, useEffect } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ChevronDown,
  Monitor,
  Subtitles,
} from "lucide-react";

interface Server {
  type: string;
  data_id: string;
  server_id: string;
  serverName: string;
}

interface Track {
  default?: boolean;
  file: string;
  kind: string;
  label?: string;
}

interface StreamingLink {
  id: string;
  intro: { start: number; end: number };
  outro: { start: number; end: number };
  link: { file: string; type: string };
  server: string;
  tracks: Track[];
  type: string;
}

interface VideoData {
  servers: Server[];
  streamingLink: StreamingLink;
}

interface VideoPlayerProps {
  src: string | null;
  videoData?: VideoData;
  selectedServerIndex?: number;
  setSelectedServerIndex?: (index: number) => void;
  selectedType?: "sub" | "dub";
  setSelectedType?: (type: "sub" | "dub") => void;
}

export default function VideoPlayer({
  src,
  videoData,
  selectedServerIndex: controlledSelectedServerIndex,
  setSelectedServerIndex: controlledSetSelectedServerIndex,
  selectedType: controlledSelectedType,
  setSelectedType: controlledSetSelectedType,
}: VideoPlayerProps) {
  console.log("src", src);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);

  const [internalSelectedServerIndex, setInternalSelectedServerIndex] =
    useState(0);
  const [internalSelectedType, setInternalSelectedType] = useState<
    "sub" | "dub"
  >("sub");

  const selectedServerIndex =
    controlledSelectedServerIndex ?? internalSelectedServerIndex;
  const setSelectedServerIndex =
    controlledSetSelectedServerIndex ?? setInternalSelectedServerIndex;

  const selectedType = controlledSelectedType ?? internalSelectedType;
  const setSelectedType = controlledSetSelectedType ?? setInternalSelectedType;

  // Setup video source with hls.js if needed
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) {
      console.log("returned");
      return;
    }

    // Cleanup previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (src.endsWith(".m3u8")) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS (Safari)
        video.src = src;
      } else if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        hlsRef.current = hls;
      } else {
        console.error("HLS not supported on this browser");
      }
    } else {
      // Normal video file
      video.src = src;
    }
  }, [src]);

  // Sync volume and muted state to video element
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = volume;
    videoRef.current.muted = isMuted;
  }, [volume, isMuted]);

  // Play/Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted((m) => !m);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const getFilteredServers = () =>
    videoData?.servers.filter((s) => s.type === selectedType) || [];

  const handleServerChange = (index: number) => {
    setSelectedServerIndex(index);
    setShowServerMenu(false);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const toggleSubtitles = () => {
    setShowSubtitles((show) => !show);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration);
    const onEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("ended", onEnded);
    };
  }, [src]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [selectedServerIndex, selectedType]);

  const filteredServers = getFilteredServers();
  const currentServer =
    filteredServers[selectedServerIndex] || filteredServers[0];

  return (
    <div
      className="relative w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full aspect-video bg-black"
        autoPlay={false}
        controls={false}
        muted={isMuted}
      >
        {showSubtitles &&
          videoData?.streamingLink.tracks
            .filter((t) => t.kind === "captions")
            .map((track) => (
              <track
                key={track.file}
                label={track.label || "Subtitles"}
                kind="subtitles"
                srcLang="en"
                src={`/api/subtitles?id=${encodeURIComponent(track.file)}`}
                default={track.default}
              />
            ))}
      </video>

      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-between p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex space-x-2 bg-black/60 rounded-lg overflow-hidden">
              <button
                onClick={() => setSelectedType("sub")}
                className={`px-3 py-1 text-sm font-semibold ${
                  selectedType === "sub"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                SUB
              </button>
              <button
                onClick={() => setSelectedType("dub")}
                className={`px-3 py-1 text-sm font-semibold ${
                  selectedType === "dub"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                DUB
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowServerMenu(!showServerMenu)}
                className="flex items-center space-x-1 bg-black/60 px-3 py-1 rounded-lg text-sm text-white hover:bg-black/80 transition"
              >
                <Monitor className="w-4 h-4" />
                <span>{currentServer?.serverName || "Loading..."}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showServerMenu && (
                <div className="absolute top-full left-0 mt-2 bg-black/90 rounded-lg min-w-[8rem] py-1 z-50 shadow-lg">
                  {filteredServers.map((server, i) => (
                    <button
                      key={server.data_id}
                      onClick={() => handleServerChange(i)}
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-blue-600/50 transition ${
                        selectedServerIndex === i
                          ? "text-blue-400"
                          : "text-white"
                      }`}
                    >
                      {server.serverName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleSubtitles}
              className={`p-2 rounded-lg transition-colors ${
                showSubtitles
                  ? "bg-blue-600 text-white"
                  : "bg-black/60 text-gray-400 hover:text-white"
              }`}
              title={showSubtitles ? "Hide Subtitles" : "Show Subtitles"}
            >
              <Subtitles className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center">
            <button
              onClick={togglePlay}
              className="w-14 h-14 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7" />
              ) : (
                <Play className="w-7 h-7" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mt-2 space-x-4">
            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={currentTime}
              onChange={handleProgressChange}
              className="flex-grow h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />

            <div className="flex space-x-4 items-center text-white text-xs w-32 justify-between">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <button
              onClick={toggleMute}
              className="text-white hover:text-blue-400 transition"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />

            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-blue-400 transition"
              title="Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
