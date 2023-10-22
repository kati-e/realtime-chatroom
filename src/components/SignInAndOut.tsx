import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export function SignIn(props: any) {
  const auth = getAuth(props.app);

  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  return (
    <div className="wrapper">
      <div className="sign-in container">
        <h1>Welcome to Realtime Chat</h1>
        <span>To continue, please sign in with your Google account.</span>
        <button onClick={signInWithGoogle}>Sign in</button>
      </div>
    </div>
  );
}

export function SignOut(props: any) {
  const auth = getAuth(props.app);

  return <button onClick={() => signOut(auth)}>Sign out</button>;
}

export default { SignIn, SignOut };
