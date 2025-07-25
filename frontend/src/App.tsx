//import "./App.css";
import Chat from "./components/chat";
import GoogleLoginButton from "./components/GoogleLoginButton";
import Login from "./components/Login";
import Register from "./components/Register";
import { useAuth } from "./context/AuthContext";

function App() {
  const { token, logout } = useAuth();

  if (!token) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Welcome to AI Chat</h1>
        <p>Please log in or register to continue.</p>
        <Register />
        <Login />
        <h2>OR</h2>
        <GoogleLoginButton />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <button onClick={logout} style={{ float: "right" }}>
        Logout
      </button>
      <Chat />
    </div>
  );
}
export default App;
