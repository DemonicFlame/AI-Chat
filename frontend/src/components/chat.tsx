import { useEffect, useRef, useState } from "react";
import type { Message as MessageType } from "../types/message";
import styles from "./chat.module.css";
import { MessageComponent } from "./message.tsx";
import { useAuth } from "../context/AuthContext.tsx";

const API_URL = "http://localhost:8000/ask";

const Chat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, logout } = useAuth();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (token) fetchHistory();
  }, [token]);

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:8000/history", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      const mapped: MessageType[] = data
        .flatMap((msg: any) => [
          { content: msg.question, isUser: true },
          { content: msg.answer, isUser: false },
        ])
        .reverse();
      setMessages(mapped);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    const userMessage: MessageType = { content: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: input }),
      });

      if (!response.body) throw new Error("No response");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let completeMessage = "";

      // setMessages((prev) => [...prev, { content: "", isUser: false }]);

      // while (true) {
      //   const { done, value } = await reader.read();
      //   if (done) break;

      //   const chunk = decoder.decode(value, { stream: true });
      //   completeMessage += chunk;

      //   setMessages((prev) => {
      //     const last = prev[prev.length - 1];
      //     if (!last || last.isUser) {
      //       return [...prev, { content: chunk, isUser: false }];
      //     } else {
      //       const updated = [...prev];
      //       updated[updated.length - 1].content += chunk;
      //       return updated;
      //     }
      //   });
      //   scrollToBottom();
      // }
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        completeMessage += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (!last || last.isUser) {
            return [...prev, { content: chunk, isUser: false }];
          } else {
            const updated = [...prev];
            updated[updated.length - 1].content = completeMessage;
            return updated;
          }
        });
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHistory = async () => {
    try {
      await fetch("http://localhost:8000/history", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages([]);
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.container}>
        <div>
          <button
            onClick={deleteHistory}
            disabled={loading}
            className={styles.button}
          >
            New Chat
          </button>
          <button
            onClick={logout}
            style={{ float: "right" }}
            className={styles.button}
          >
            Logout
          </button>
        </div>

        <div className={styles.messages}>
          {messages.map((message, index) => (
            <MessageComponent
              key={index}
              content={message.content}
              isUser={message.isUser}
            />
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className={styles.input}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Asking..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
