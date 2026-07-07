const API_BASE = window.API_BASE || "http://localhost:8000";

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
        const detail = payload?.detail || payload?.message || payload || "Request failed";
        throw new Error(detail);
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
