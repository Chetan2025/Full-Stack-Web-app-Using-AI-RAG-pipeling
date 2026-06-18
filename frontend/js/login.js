const API="http://127.0.0.1:8000/";

async function login(){

    const data={
        username:document.getElementById("username").value,
        password:document.getElementById("password").value
    };

    const res=await fetch(`${API}/user/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });

    const result=await res.json();

    localStorage.setItem("user",JSON.stringify(result));

    window.location.href="dashboard.html";
}