import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState, useEffect } from "react";
import { SignOut } from "./SignInAndOut";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ChatRoom(props: any) {
  const firestore = getFirestore(props.app);
  const messageRef = collection(firestore, "messages");
  const messageQuery = query(messageRef, orderBy("created_at"), limit(25));
  const [messages] = useCollectionData(messageQuery);

  const auth = getAuth(props.app);
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const [newMessage, setNewMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (sent) {
      setNewMessage("");
      setSent(false);
    }
  }, [sent]);

  async function sendMessage(e:any) {

    e.preventDefault();
    setSent(true);
  
    try {
      await addDoc(messageRef, {
        text: newMessage,
        created_at: serverTimestamp(),
        uid: auth.currentUser?.uid,
        photoUrl: auth.currentUser?.photoURL,
      });
    } catch (error) {
      console.error('Error adding message to Firestore:', error);
    }
  }

  //Random cute seal image from Unsplash
  const defaultIcon = "https://images.unsplash.com/photo-1618075254460-429d47b887c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80";

  return (
    <div className="chat-room wrapper">
      <div className="header container">
        <h1>Welcome{user ? `, ${user.displayName}` : null}!</h1>
        <SignOut props={{ app: props.app }} />
      </div>
      <div className="messages container">
        {messages ? (
          messages.map((msg, i) => (
            <div key={msg.id ?? i} className={msg.user === user?.uid ? "sent" : "received"}>
              <div className="user-image">
                {msg.userPhotoUrl ? <img src={msg.userPhotoUrl} alt="" /> : <img src={defaultIcon} alt="default user icon of a seal" />}
              </div>
              <div className="message">
                {msg.text}
              </div>
            </div>
          ))
        ) : (
          <div className="loading">"Loading messages, please wait ..."</div>
        )}
      </div>
      <div className="send-messages container">
        <form
          id="message-form"
          className="message-form"
          onSubmit={(e) => sendMessage(e)}
        >
          <input
            id="input-message"
            className="input-message"
            name="input-message"
            type="search"
            inputMode="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button id="send-button" className="send-button" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
