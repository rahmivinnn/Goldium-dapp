import { AnimatePresence, motion } from "framer-motion";

interface NotificationProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const Notification = ({ message, show, onClose }: NotificationProps) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 bg-yellow-400 dark:bg-gray-800 text-white px-6 py-3 rounded shadow-lg z-50"
        onClick={onClose}
      >
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

export default Notification;
