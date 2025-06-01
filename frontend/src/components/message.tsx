import type { Message as MessageType } from "../types/message";
import styles from "./message.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

const Message = ({ content, isUser }: MessageType) => {
  return (
    <div
      className={`${styles.message} ${
        isUser ? styles.userMessage : styles.llmMessage
      }`}
    >
      {isUser ? (
        <p>{content}</p>
      ) : (
        <ReactMarkdown
          children={content}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        />
      )}
    </div>
  );
};

export { Message as MessageComponent };
