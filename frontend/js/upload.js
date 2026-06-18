const API="http://127.0.0.1:8000/";

async function uploadFiles(){

    const files=document.getElementById("files").files;

    const formData=new FormData();

    for(let file of files){
        formData.append("files",file);
    }

    const res=await fetch(
        `${API}/create/bot`,
        {
            method:"POST",
            body:formData
        }
    );

    const result=await res.json();

    const bots=
    JSON.parse(localStorage.getItem("bots")||"[]");

    bots.push(result);

    localStorage.setItem(
        "bots",
        JSON.stringify(bots)
    );

    alert(
        "Bot Created\n\nAPI KEY:\n"+
        result.api_key
    );

    window.location.href="dashboard.html";
}