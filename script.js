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
let chatColor = localStorage.getItem("chat-color") || "#ffffff"; // Default to white if no color is set

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
const darkToggle = document.getElementById("dark-toggle");
const settingsToggle = document.getElementById("settings-toggle");
const settingsModal = document.getElementById("settings-modal");
const usernameChangeInput = document.getElementById("username-change");
const saveUsernameChangeBtn = document.getElementById("save-username-change");
const chatColorInput = document.getElementById("chat-color");
const saveChatColorBtn = document.getElementById("save-chat-color");
const closeSettingsBtn = document.getElementById("close-settings");






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

// Settings modal behavior
settingsToggle.addEventListener("click", () => {
  settingsModal.style.display = "block";
});

closeSettingsBtn.addEventListener("click", () => {
  settingsModal.style.display = "none";
});

// Change username
saveUsernameChangeBtn.addEventListener("click", () => {
  const newUsername = usernameChangeInput.value.trim();
  if (newUsername !== "") {
    username = newUsername;
    localStorage.setItem("chat-username", username);
    settingsModal.style.display = "none";
  }
});

// Change chat color
saveChatColorBtn.addEventListener("click", () => {
  const newColor = chatColorInput.value;
  chatColor = newColor;
  localStorage.setItem("chat-color", chatColor);
  document.body.style.backgroundColor = chatColor; // Apply color to the chat background
  settingsModal.style.display = "none";
});

// UI elements
const clearChatBtn = document.getElementById("clear-chat");

// Clear chat messages
clearChatBtn.addEventListener("click", () => {
  chatBox.innerHTML = ""; // Clear the chat messages container
});

