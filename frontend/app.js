function resolveApiBase() {
    const saved = localStorage.getItem("API_BASE");
    if (saved) {
        return saved;
    }

    if (window.API_BASE) {
        return window.API_BASE;
    }

    if (window.location.protocol === "file:") {
        return "http://localhost:8000";
    }

    return `${window.location.protocol}//${window.location.hostname}:8000`;
}

const API_BASE = resolveApiBase();

function getStoredBotsKey() {
    const currentUser = getCurrentUser();
    const username = currentUser?.username || "guest";
    return `bots:${username}`;
}

function getAuthToken() {
    return localStorage.getItem("access_token") || "";
}

function getCurrentUser() {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
        return null;
    }

    try {
        return JSON.parse(rawUser);
    } catch (error) {
        return null;
    }
}

function saveAuthSession(result) {
    if (result?.access_token) {
        localStorage.setItem("access_token", result.access_token);
    }

    if (result?.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
    }
}

function clearAuthSession() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
}

function clearStoredBots(username) {
    const key = username ? `bots:${username}` : getStoredBotsKey();
    localStorage.removeItem(key);
}

function authHeaders(extraHeaders = {}) {
    const token = getAuthToken();
    return {
        ...extraHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}

function extractErrorMessage(payload, fallback = "Request failed") {
    if (!payload) {
        return fallback;
    }

    if (typeof payload === "string") {
        return payload;
    }

    return payload.detail || payload.message || payload.error || fallback;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

async function fetchJson(path, options = {}) {
    let response;

    try {
        response = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: {
                ...(options.headers || {}),
                ...authHeaders(options.headers || {})
            }
        });
    } catch (error) {
        throw new Error(`Network error while calling ${API_BASE}${path}. Check that the backend is running and CORS allows the frontend origin.`);
    }

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        throw new Error(extractErrorMessage(payload));
    }

    return payload;
}

function getStoredBots() {
    try {
        return JSON.parse(localStorage.getItem(getStoredBotsKey()) || "[]");
    } catch (error) {
        return [];
    }
}

function saveStoredBot(bot) {
    const bots = getStoredBots();
    bots.unshift(bot);
    localStorage.setItem(getStoredBotsKey(), JSON.stringify(bots));
}

function setStatus(message, type = "info") {
    const statusBox = document.getElementById("statusMessage");
    if (!statusBox) {
        return;
    }

    statusBox.textContent = message;
    statusBox.dataset.type = type;
    statusBox.style.display = message ? "block" : "none";
}

function formatBotId(bot) {
    return bot?.chatbot_id ? `#${bot.chatbot_id}` : "New bot";
}

function requireAuth() {
    if (!getAuthToken()) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}
