import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Register = () => {
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "https://ai-chat-3fjt.onrender.com/register",
        {
          email,
          password,
        }
      );
      setToken(res.data.access_token);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="email"
        name="email"
        autoComplete="off"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        autoComplete="off"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <input
        type="password"
        name="confirmPassword"
        autoComplete="off"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
      />
      <button onClick={register} disabled={loading}>
        Register
      </button>
    </div>
  );
};

export default Register;
