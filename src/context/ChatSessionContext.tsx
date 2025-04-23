import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
};

type ChatSessionContextType = {
  sessions: ChatSession[];
  currentSessionId: string | null;
  setCurrentSessionId: (id: string) => void;
  addSession: (id: string) => void;
  addMessage: (sessionId: string, message: Message) => void;
  getMessages: (sessionId: string) => Message[];
  deleteSession: (id: string) => void;
  renameSession: (id: string, newTitle: string) => void;
};

const ChatSessionContext = createContext<ChatSessionContextType>({
  sessions: [],
  currentSessionId: null,
  setCurrentSessionId: () => {},
  addSession: () => {},
  addMessage: () => {},
  getMessages: () => [],
  deleteSession: () => {},
  renameSession: () => {},
});

export const ChatSessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const addSession = (id: string) => {
    const exists = sessions.find((s) => s.id === id);
    if (!exists) {
      const newSession: ChatSession = {
        id,
        title: `Chat ${sessions.length + 1}`,
        messages: [],
      };
      setSessions((prev) => [...prev, newSession]);
    }
  };

  const addMessage = (sessionId: string, message: Message) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: [...session.messages, message],
            }
          : session
      )
    );
  };

  const getMessages = (sessionId: string): Message[] => {
    const session = sessions.find((s) => s.id === sessionId);
    return session ? session.messages : [];
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(null);
    }
  };

  const renameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? {
              ...session,
              title: newTitle,
            }
          : session
      )
    );
  };

  return (
    <ChatSessionContext.Provider
      value={{
        sessions,
        currentSessionId,
        setCurrentSessionId,
        addSession,
        addMessage,
        getMessages,
        deleteSession,
        renameSession,
      }}
    >
      {children}
    </ChatSessionContext.Provider>
  );
};

export const useChatSessions = () => useContext(ChatSessionContext);
