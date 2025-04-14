// Simulate stored chat history in localStorage
// You can change this to use a backend later
const chatKey = 'chatMessages';

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById('chat-history');
  const saveBtn = document.getElementById('save-chat');
  const deleteBtn = document.getElementById('delete-chat');

  // Load chat history
  const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
  chatBox.textContent = messages.join('\n');

  // Save chat as .txt file
  saveBtn.addEventListener('click', () => {
    const blob = new Blob([chatBox.textContent], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'chat_history.txt';
    a.click();
  });

  // Delete chat history
  deleteBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all chat history?')) {
      localStorage.removeItem(chatKey);
      chatBox.textContent = '';
    }
  });
});
