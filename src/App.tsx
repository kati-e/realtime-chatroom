import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import "./global.css";
import { SignIn } from "./components/SignInAndOut";
import ChatRoom from "./components/ChatRoom";

function App() {
  const app = initializeApp({
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJ_ID,
    storageBucket: import.meta.env.VITE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGE_SENDER,
    appId: import.meta.env.VITE_APP_ID,
  });

  const auth = getAuth(app);
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <main className="app">
      {user ? (
        <ChatRoom props={{ app: app, user: user }} />
      ) : (
        <SignIn props={{ app: app }} />
      )}
    </main>
  );
}

export default App;
