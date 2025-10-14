const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.location.href =
      "https://ai-chat-3fjt.onrender.com/auth/google-login";
  };

  return <button onClick={handleLogin}>Google</button>;
};

export default GoogleLoginButton;
