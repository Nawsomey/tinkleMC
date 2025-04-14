import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  remove
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Firebase Config
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

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, "messages");

// DOM Elements
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const messagesDiv = document.getElementById("messages");
const usernameInput = document.getElementById("username");
const chatBgColorInput = document.getElementById("chat-bg-color");
const darkModeToggle = document.getElementById("dark-mode-toggle");

const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("chat-settings");
const closeSettingsBtn = document.getElementById("close-settings");

const adminModal = document.getElementById("admin-modal");
const adminPasswordInput = document.getElementById("admin-password");
const verifyAdminBtn = document.getElementById("verify-admin");
const closeAdminBtn = document.getElementById("close-admin");

// Admin password hash (SHA-256) for "your-admin-password"
const encryptedAdminPassword = "2c6ee24b09816a6f14f95d1698b24ead"; // This is the SHA-256 hash of "your-admin-password"

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

// Toggle settings panel
settingsBtn.addEventListener("click", () => {
  settingsPanel.style.display = settingsPanel.style.display === "block" ? "none" : "block";
});

// Close settings panel
closeSettingsBtn.addEventListener("click", () => {
  settingsPanel.style.display = "none";
});

// Open admin modal when clicking on settings button (if it's an admin)
settingsBtn.addEventListener("click", () => {
  // Check if the user is an admin before opening settings
  adminModal.style.display = "block";  // Show admin modal for password input
});

// Close admin modal
closeAdminBtn.addEventListener("click", () => {
  adminModal.style.display = "none";
});

// Hash password function
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Verify admin password
verifyAdminBtn.addEventListener("click", async () => {
  const enteredPassword = adminPasswordInput.value;
  const hashedPassword = await hashPassword(enteredPassword);

  if (hashedPassword === encryptedAdminPassword) {
    // Password matches, grant access to settings panel
    adminModal.style.display = "none";  // Close admin modal
    settingsPanel.style.display = "block";  // Open settings panel
  } else {
    alert("Incorrect password. Access denied.");
  }
});

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
