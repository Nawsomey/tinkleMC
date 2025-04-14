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

// Username logic
let username = localStorage.getItem("chat-username");

const usernameModal = document.getElementById("username-modal");
const usernameInput = document.getElementById("username-input");
const saveUsername = document.getElementById("save-username");
const chatBoxContainer = document.getElementById("chat-box");

function showChat() {
  usernameModal.style.display = "none";
  chatBoxContainer.style.display = "flex";
}

// Prompt for username
if (!username) {
  usernameModal.style.display = "flex";
  saveUsername.onclick = () => {
    const input = usernameInput.value.trim();
    if (input !== "") {
      username = input;
      localStorage.setItem("chat-username", username);
      showChat();
    }
  };
} else {
  showChat();
}

// UI elements
const chatBox = document.getElementById("chat-messages");
const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("send");

// Display incoming messages
onChildAdded(msgRef, (data) => {
  const msg = data.val();
  const msgEl = document.createElement("div");
  msgEl.className = "chat-message";

  const avatar = document.createElement("img");
  avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.username || "Guest")}&background=random&size=32`;
  avatar.alt = "avatar";
  avatar.className = "avatar";

  const textEl = document.createElement("div");
  textEl.className = "msg-content";
  textEl.innerHTML = `<strong>${msg.username || "Guest"}:</strong> ${escapeHTML(msg.text)}`;

  msgEl.appendChild(avatar);
  msgEl.appendChild(textEl);
  chatBox.appendChild(msgEl);
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Send message
sendBtn.addEventListener("click", () => {
  const text = msgInput.value.trim();
  if (text !== "") {
    push(msgRef, {
      username: username || "Guest",
      text: text,
      timestamp: Date.now()
    });
    msgInput.value = "";
  }
});

// Prevent script injection while allowing emojis
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Dark mode toggle
const darkToggle = document.getElementById("dark-toggle");
const isDark = localStorage.getItem("chat-darkmode") === "true";

if (isDark) {
  document.body.classList.add("dark");
  darkToggle.textContent = "☀️ Light Mode";
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isNowDark = document.body.classList.contains("dark");
  darkToggle.textContent = isNowDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("chat-darkmode", isNowDark);
});

const micBtn = document.getElementById("mic-btn");

let mediaRecorder;
let chunks = [];

const micBtn = document.getElementById("mic-btn");
const recordingTimer = document.getElementById("recording-timer");
const timerText = document.getElementById("timer-text");

let mediaRecorder;
let chunks = [];
let timerInterval;
let seconds = 0;

micBtn.addEventListener("click", async () => {
  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      chunks = [];
      seconds = 0;

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioURL = URL.createObjectURL(blob);

        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = audioURL;

        const msgDiv = document.createElement("div");
        msgDiv.classList.add("chat-message");

        const avatar = document.createElement("img");
        avatar.src = `https://api.dicebear.com/8.x/identicon/svg?seed=${username}`;
        avatar.className = "avatar";

        const msgContent = document.createElement("div");
        msgContent.className = "msg-content";
        msgContent.appendChild(audio);

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(msgContent);
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      };

      mediaRecorder.start();
      micBtn.classList.add("recording");
      micBtn.textContent = "⏹️";
      recordingTimer.style.display = "flex";

      timerInterval = setInterval(() => {
        seconds++;
        const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");
        timerText.textContent = `${mins}:${secs}`;
      }, 1000);

    } catch (err) {
      alert("Microphone access denied.");
    }
  } else {
    mediaRecorder.stop();
    micBtn.classList.remove("recording");
    micBtn.textContent = "🎤";
    clearInterval(timerInterval);
    recordingTimer.style.display = "none";
  }
});

