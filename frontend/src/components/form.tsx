import { useState } from "react";
import axios from "axios";
import type { Question } from "../types/api";
import type { Answer } from "../types/api";

const API_URL = "http://localhost:8000/ask3/";

const Form = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnswer("");

    try {
      const payload: Question = { question };
      const response = await axios.post<Answer>(API_URL, payload);
      setAnswer(response.data.answer);
    } catch (error) {
      setAnswer("Error fetching answer");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask Something"
          required
        />
        <button type="submit" disabled={loading}>
          ask
        </button>
      </form>

      {answer && (
        <div>
          <span>Answer: {answer}</span>
        </div>
      )}
    </div>
  );
};
export default Form;
