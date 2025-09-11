import Chat from "./components/chat";
import GoogleLoginButton from "./components/GoogleLoginButton";
import Login from "./components/Login";
import Register from "./components/Register";
import styles from "./authpage.module.css";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

function App() {
  const { token, setToken, isAuthenticating } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam =
      params.get("token") || localStorage.getItem("token") || null;
    if (!tokenParam) return;
    (async () => {
      await setToken(tokenParam);
      window.history.replaceState({}, document.title, "/");
    })();
  }, [setToken]);

  if (isAuthenticating) {
    return <div>Loading...</div>;
  }

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
