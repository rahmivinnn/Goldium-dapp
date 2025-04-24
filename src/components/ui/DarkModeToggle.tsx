import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DarkModeToggle = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className="rounded-full bg-yellow-400 dark:bg-gray-700 p-2 shadow hover:scale-105 transition-all"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle dark mode"
    >
      {dark ? "🌙" : "☀️"}
    </motion.button>
  );
};

export default DarkModeToggle;
