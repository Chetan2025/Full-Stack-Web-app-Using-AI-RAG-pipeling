const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendChatBtn = document.getElementById("sendChatBtn");
const chatTitle = document.getElementById("chatTitle");
const themeToggle = document.getElementById("themeToggle");

const params = new URLSearchParams(window.location.search);
const apiKey = params.get("api_key") || "";

const conversation = [];

function applyTheme(theme) {
    const root = document.body;
    const isDark = theme === "dark";
    root.classList.toggle("chat-dark", isDark);
    root.classList.toggle("chat-light", !isDark);

    if (themeToggle) {
        themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
        themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem("chat_theme") || "light";
    applyTheme(savedTheme);
}

function renderConversation() {
    if (!chatMessages) {
        return;
    }

    if (!conversation.length) {
        chatMessages.innerHTML = '<div class="empty-chat">Ask your first question.</div>';
        return;
    }

    chatMessages.innerHTML = conversation.map((msg) => {
        const role = msg.role === "user" ? "user" : "bot";
        return `
            <div class="chat-message ${role}">
                <div class="chat-bubble">${escapeHtml(msg.text)}</div>
            </div>
        `;
    }).join("");

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const question = (chatInput?.value || "").trim();
    if (!question) {
        chatInput?.focus();
        return;
    }

    if (!apiKey) {
        alert("Missing API key for this chatbot.");
        return;
    }

    conversation.push({ role: "user", text: question });
    renderConversation();
    chatInput.value = "";

    if (sendChatBtn) {
        sendChatBtn.disabled = true;
        sendChatBtn.textContent = "Sending...";
    }

    try {
        const response = await fetch(`${API_BASE}/chat/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders()
            },
            body: JSON.stringify({ api_key: apiKey, question })
        });

        let data = {};
        try {
            data = await response.json();
        } catch (_error) {}

        if (!response.ok) {
            throw new Error(data?.detail || data?.message || data?.error || "Chat request failed");
        }

        const answer = data?.answer || data?.response || data?.message || data?.error || "No answer returned.";
        conversation.push({ role: "bot", text: answer });
        renderConversation();
    } catch (error) {
        conversation.push({ role: "bot", text: error.message || "Something went wrong." });
        renderConversation();
    } finally {
        if (sendChatBtn) {
            sendChatBtn.disabled = false;
            sendChatBtn.textContent = "Send";
        }
        chatInput?.focus();
    }
}

if (chatTitle) {
    chatTitle.textContent = apiKey ? "Chatbot" : "Chatbot (No API key)";
}

initTheme();

themeToggle?.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("chat-dark") ? "light" : "dark";
    localStorage.setItem("chat_theme", nextTheme);
    applyTheme(nextTheme);
});

sendChatBtn?.addEventListener("click", sendMessage);
chatInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

renderConversation();
