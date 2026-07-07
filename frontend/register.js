async function register(event){
    if (event) {
        event.preventDefault();
    }

    setStatus("Creating account...", "info");

    const form = document.getElementById("registerForm");
    const submitButton = form?.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Creating...";
    }

    const data={
        username:document.getElementById("username").value.trim(),
        email:document.getElementById("email").value.trim(),
        password:document.getElementById("password").value
    };

    if(!data.username || !data.email || !data.password){
        setStatus("All fields are required.", "error");
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Register";
        }
        return;
    }

    try {
        const result=await fetchJson("/user/register",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });

        setStatus(result.message || "Account created successfully", "success");
        window.location.href="login.html";
    } catch (error) {
        setStatus(error.message || "Registration failed", "error");
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Register";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    if (form) {
        form.addEventListener("submit", register);
    }
});