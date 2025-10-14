import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useCallback,
  useEffect,
} from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticating: boolean;
  setToken: (token: string | null) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const verifyEndpoint = "https://ai-chat-3fjt.onrender.com/auth/verify";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );

  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);

  const logout = useCallback(() => {
    setTokenState(null);
    try {
      localStorage.removeItem("token");
      console.log("token removed from localStorage");
    } catch (error) {
      console.log("can't remove token from localStorage");
    }
  }, []);

  const validateToken = useCallback(async (t: string) => {
    try {
      const res = await fetch(verifyEndpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${t}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Token validated. Status:", res.status);
      return res.ok;
    } catch (error) {
      console.log("Token not validated");
      return false;
    }
  }, []);

  const setToken = useCallback(
    async (t: string | null) => {
      if (!t) {
        logout();
        return;
      }
      const isValid = await validateToken(t);
      if (isValid) {
        setTokenState(t);
        try {
          localStorage.setItem("token", t);
        } catch (error) {}
      } else {
        logout();
      }
    },
    [validateToken, logout]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      const raw = localStorage.getItem("token");
      if (!raw) {
        if (mounted) setIsAuthenticating(false);
        return;
      }
      const isValid = await validateToken(raw);
      if (!mounted) return;
      if (!isValid) logout();
      else setTokenState(raw);
      setIsAuthenticating(false);
    })();
    return () => {
      mounted = false;
    };
  }, [validateToken, logout]);

  return (
    <AuthContext.Provider value={{ token, isAuthenticating, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
