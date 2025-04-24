import { createContext, useContext, useState, ReactNode } from "react";
import Notification from "./Notification";

interface NotificationContextProps {
  notify: (msg: string) => void;
}

const NotificationContext = createContext<NotificationContextProps>({ notify: () => {} });

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const notify = (msg: string) => setMessage(msg);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Notification message={message || ""} show={!!message} onClose={() => setMessage(null)} />
    </NotificationContext.Provider>
  );
}
