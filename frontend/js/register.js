const API="http://127.0.0.1:8000/";

async function register(){

    const data={
        username:document.getElementById("username").value,
        email:document.getElementById("email").value,
        password:document.getElementById("password").value
    };

    const res=await fetch(`${API}/user/register`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });

    const result=await res.json();

    alert(result.message || "Registered");

    window.location.href="login.html";
}