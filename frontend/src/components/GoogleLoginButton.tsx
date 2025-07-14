const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google-login";
  };

  return <button onClick={handleLogin}>Sign in with Google</button>;
};

export default GoogleLoginButton;
