function setUploadBusy(button, busy) {
    if (!button) {
        return;
    }

    button.disabled = busy;
    button.textContent = busy ? "Creating..." : "Create Bot";
}

async function uploadFiles(event){
    if (event) {
        event.preventDefault();
    }

    if(!requireAuth()){
        return;
    }

    const chatbotNameInput=document.getElementById("chatbotName");
    const fileInput=document.getElementById("files");
    const button=document.getElementById("createBotButton");
    const files=fileInput?.files || [];
    const chatbotName=(chatbotNameInput?.value || "").trim();

    if(!chatbotName){
        setStatus("Chatbot name is required.", "error");
        chatbotNameInput?.focus();
        chatbotNameInput?.reportValidity?.();
        return;
    }

    if(!files.length){
        setStatus("Please select at least one file.", "error");
        fileInput?.focus();
        fileInput?.reportValidity?.();
        return;
    }

    if(files.length > 3){
        setStatus("Maximum 3 files allowed per chatbot.", "error");
        fileInput?.focus();
        return;
    }

    const formData=new FormData();
    formData.append("chatbot_name", chatbotName);

    for(let file of files){
        formData.append("files",file);
    }

    try {
        setUploadBusy(button, true);
        setStatus("Creating bot...", "info");

        const result=await fetchJson("/create/bot",{
            method:"POST",
            body:formData
        });

        saveStoredBot(result);

        setStatus("Bot created successfully", "success");
        window.location.href="dashboard.html";
    } catch (error) {
        setStatus(error.message || "Bot creation failed", "error");
        setUploadBusy(button, false);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("createBotForm");
    if (form) {
        form.addEventListener("submit", uploadFiles);
    }
});