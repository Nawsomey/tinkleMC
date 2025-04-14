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
const messagesRef = ref(db, "messages");

// DOM
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const messagesDiv = document.getElementById("messages");
const usernameInput = document.getElementById("username");
const chatBgColorInput = document.getElementById("chat-bg-color");
const darkModeToggle = document.getElementById("dark-mode-toggle");

let username = localStorage.getItem("chat-username") || "Guest";
usernameInput.value = username;

usernameInput.addEventListener("input", () => {
  username = usernameInput.value;
  localStorage.setItem("chat-username", username);
});

chatBgColorInput.addEventListener("input", () => {
  messagesDiv.style.backgroundColor = chatBgColorInput.value;
  localStorage.setItem("chat-bg", chatBgColorInput.value);
});

darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", darkModeToggle.checked);
  localStorage.setItem("dark-mode", darkModeToggle.checked);
});

// Load preferences
const savedBg = localStorage.getItem("chat-bg");
if (savedBg) {
  chatBgColorInput.value = savedBg;
  messagesDiv.style.backgroundColor = savedBg;
}

const savedDark = localStorage.getItem("dark-mode");
if (savedDark === "true") {
  darkModeToggle.checked = true;
  document.body.classList.add("dark-mode");
}

// Send message
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (text) {
    push(messagesRef, {
      user: username || "Guest",
      text,
      time: Date.now()
    });
    messageInput.value = "";
  }
});

// Display messages
onChildAdded(messagesRef, (snapshot) => {
  const msg = snapshot.val();
  const p = document.createElement("p");
  p.textContent = `[${msg.user}] ${msg.text}`;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Admin modal logic
const encryptedPassword = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd8d25e1b53e0d3ec41"; // hash for "password"
const adminAccessBtn = document.getElementById("admin-access");
const adminModal = document.getElementById("admin-modal");
const verifyAdminBtn = document.getElementById("verify-admin");
const closeAdminBtn = document.getElementById("close-admin");
const adminPasswordInput = document.getElementById("admin-password");

adminAccessBtn.addEventListener("click", () => {
  adminModal.style.display = "block";
});

closeAdminBtn.addEventListener("click", () => {
  adminModal.style.display = "none";
});

// Hash password
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

verifyAdminBtn.addEventListener("click", async () => {
  const input = adminPasswordInput.value;
  const hashed = await hashPassword(input);

  if (hashed === encryptedPassword) {
    const choice = confirm("Access granted. Do you want to delete the chat history?");
    if (choice) {
      await remove(ref(db, "messages"));
      alert("Chat history deleted.");
    } else {
      alert("Save feature not implemented yet.");
    }
  } else {
    alert("Incorrect password.");
  }

  adminModal.style.display = "none";
  adminPasswordInput.value = "";
});
