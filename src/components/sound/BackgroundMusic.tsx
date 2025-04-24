import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { motion } from "framer-motion";

const musicUrl = "/music/cute-egg-theme.mp3"; // Place in public/music/

const BackgroundMusic = () => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const musicRef = useRef<Howl | null>(null);

  useEffect(() => {
    musicRef.current = new Howl({
      src: [musicUrl],
      loop: true,
      volume: 0.25,
      html5: true,
    });
    return () => {
      musicRef.current?.unload();
    };
  }, []);

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.mute(muted);
      if (playing && !musicRef.current.playing()) {
        musicRef.current.play();
      } else if (!playing && musicRef.current.playing()) {
        musicRef.current.pause();
      }
    }
  }, [playing, muted]);

  return (
    <div className="flex gap-2 items-center">
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="bg-yellow-300 dark:bg-gray-800 p-2 rounded shadow"
        onClick={() => setPlaying((p) => !p)}
        aria-label="Toggle music"
      >
        {playing ? "🎵" : "🔇"}
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="bg-yellow-200 dark:bg-gray-700 p-2 rounded shadow"
        onClick={() => setMuted((m) => !m)}
        aria-label="Mute music"
      >
        {muted ? "🚫" : "🔊"}
      </motion.button>
    </div>
  );
};

export default BackgroundMusic;
