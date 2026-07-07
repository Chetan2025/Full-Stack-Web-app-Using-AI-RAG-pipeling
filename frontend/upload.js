async function uploadFiles(){

    if(!requireAuth()){
        return;
    }

    const files=document.getElementById("files").files;

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
    }
}