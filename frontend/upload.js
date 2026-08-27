function setUploadBusy(button, busy) {
    if (!button) {
        return;
    }

    button.disabled = busy;
    button.textContent = busy ? "Creating..." : "Create Bot";
}

async function uploadFiles(){

    if(!requireAuth()){
        return;
    }

    const fileInput=document.getElementById("files");
    const button=document.getElementById("createBotButton");
    const files=fileInput?.files || [];

    if(!files.length){
        setStatus("Please select at least one file.", "error");
        return;
    }

    if(files.length > 3){
        setStatus("Maximum 3 files allowed per chatbot.", "error");
        return;
    }

    const formData=new FormData();

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
    const button = document.getElementById("createBotButton");
    if (button) {
        button.addEventListener("click", uploadFiles);
    }
});