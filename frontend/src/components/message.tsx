import type { Message as MessageType } from "../types/message";
import styles from "./message.module.css";

const Message = ({ content, isUser }: MessageType) => {
  return (
    <div
      className={`${styles.message} ${
        isUser ? styles.userMessage : styles.llmMessage
      }`}
    >
      {content}
    </div>
  );
};

export { Message as MessageComponent };
