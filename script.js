// Firebase v9+ Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8C371TkySL1fi54nnFMztUhcqqpzhpok",
  authDomain: "diddle-58e73.firebaseapp.com",
  databaseURL: "https://diddle-58e73-default-rtdb.firebaseio.com",
  projectId: "diddle-58e73",
  storageBucket: "diddle-58e73.firebasestorage.app",
  messagingSenderId: "3280706078",
  appId: "1:3280706078:web:9df2da3fd8f9b47b2e2c0f",
  measurementId: "G-FFZKW7X7KR"
};

// Init
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const msgRef = ref(db, "messages");

// UI references
const chatBox = document.getElementById("chat-messages");
const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("send");

// Listen for new messages
onChildAdded(msgRef, (data) => {
  const msg = data.val();
  const p = document.createElement("p");
  p.textContent = `${msg.username || "Guest"}: ${msg.text}`;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Send message
sendBtn.addEventListener("click", () => {
  const text = msgInput.value.trim();
  if (text !== "") {
    push(msgRef, {
      username: "Guest",
      text: text,
      timestamp: Date.now()
    });
    msgInput.value = "";
  }
});
