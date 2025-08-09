//import "./App.css";
import Chat from "./components/chat";
import GoogleLoginButton from "./components/GoogleLoginButton";
import Login from "./components/Login";
import Register from "./components/Register";
import { useAuth } from "./context/AuthContext";
import styles from "./authpage.module.css";

function App() {
  const { token } = useAuth();

  if (!token) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authComponent}>
          <Login />
        </div>
        <div className={styles.authComponent}>
          <Register />
        </div>
        <div className={styles.authComponent}>
          <h2>Quick Sign-in</h2>
          <GoogleLoginButton />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Chat />
    </div>
  );
}
export default App;
