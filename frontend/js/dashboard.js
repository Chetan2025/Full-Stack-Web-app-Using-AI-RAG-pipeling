const bots=JSON.parse(
localStorage.getItem("bots") || "[]"
);

const container=document.getElementById("bots");

bots.forEach(bot=>{

container.innerHTML+=`

<div class="bot-card">

<h3>Chatbot #${bot.chatbot_id}</h3>

<div class="api-box">
${bot.api_key}
</div>

</div>

`;

});