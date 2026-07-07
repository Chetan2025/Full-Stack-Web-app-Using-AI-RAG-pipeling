function setButtonBusy(button, busy, idleText, busyText) {
    if (!button) {
        return;
    }

    button.disabled = busy;
    button.textContent = busy ? busyText : idleText;
}

async function login(event){
    if (event) {
        event.preventDefault();
    }

    setStatus("Signing in...", "info");

    const form = document.getElementById("loginForm");
    const submitButton = form?.querySelector('button[type="submit"]');
    setButtonBusy(submitButton, true, "Login", "Signing in...");

    const data={
        username:document.getElementById("username").value.trim(),
        password:document.getElementById("password").value
    };

    if(!data.username || !data.password){
        setStatus("Username and password are required.", "error");
        setButtonBusy(submitButton, false, "Login", "Signing in...");
        return;
    }

    try {
        const result=await fetchJson("/user/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });

        saveAuthSession(result);
        localStorage.setItem("user", JSON.stringify({ username: data.username }));
        setStatus("Login successful. Redirecting...", "success");

        window.location.href="dashboard.html";
    } catch (error) {
        setStatus(error.message || "Login failed", "error");
        setButtonBusy(submitButton, false, "Login", "Signing in...");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    if (form) {
        form.addEventListener("submit", login);
    }
});