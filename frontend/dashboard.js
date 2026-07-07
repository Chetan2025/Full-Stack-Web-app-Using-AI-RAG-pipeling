const container=document.getElementById("bots");
const userBadge=document.getElementById("userBadge");

async function askQuestion(apiKey, questionId, resultId, buttonId){
	const questionInput=document.getElementById(questionId);
	const resultBox=document.getElementById(resultId);
	const button=document.getElementById(buttonId);
	const question=(questionInput?.value || "").trim();

	if(!question){
		if(resultBox){
			resultBox.textContent="Please type a question.";
			resultBox.style.display="block";
		}
		return;
	}

	if(button){
		button.disabled=true;
		button.textContent="Asking...";
	}

	if(resultBox){
		resultBox.textContent="Thinking...";
		resultBox.style.display="block";
	}

	try{
		const response=await fetch(`${API_BASE}/chat/ask`,{
			method:"POST",
			headers:{"Content-Type":"application/json"},
			body:JSON.stringify({api_key:apiKey, question})
		});
		let data={};
		try{
			data=await response.json();
		}catch(_error){}
		if(!response.ok){
			throw new Error(data?.detail || data?.message || "Ask failed");
		}
		if(resultBox){
			resultBox.textContent=data?.answer || data?.response || JSON.stringify(data);
		}
	}catch(error){
		if(resultBox){
			resultBox.textContent=error.message || "Ask failed";
		}
	}finally{
		if(button){
			button.disabled=false;
			button.textContent="Ask";
		}
	}
}

if (requireAuth()) {
	function renderBots(){
		const currentUser=getCurrentUser();
		const savedBots=getStoredBots();

		if(userBadge){
			userBadge.textContent=currentUser?.username ? `Signed in as ${currentUser.username}` : "Signed in";
		}

		if(!savedBots.length){
			container.innerHTML=`
				<div class="empty-state">
					<h3>No bots yet</h3>
					<p>Create your first chatbot to see the API key and manage it here.</p>
				</div>
			`;
			return;
		}

		container.innerHTML=savedBots.map((bot, index)=>{
			const key = `bot-${index}`;
			return `
			<div class="bot-card">
				<div class="bot-card-head">
					<h3>${bot.chatbot_name || `Chatbot ${formatBotId(bot)}`}</h3>
					<span class="pill">${formatBotId(bot)}</span>
				</div>
				<p class="bot-meta">Uploaded chunks: ${bot.chunks ?? "-"}</p>
				<div class="api-box">
					<span>API key</span>
					<strong>${bot.api_key}</strong>
				</div>
				<div class="ask-box">
					<label class="ask-label" for="question-${key}">Ask a question</label>
					<input id="question-${key}" class="ask-input" type="text" placeholder="what is blufo?">
					<button class="btn secondary ask-btn" id="ask-btn-${key}" type="button" onclick='askQuestion(${JSON.stringify(bot.api_key)}, ${JSON.stringify(`question-${key}`)}, ${JSON.stringify(`answer-${key}`)}, ${JSON.stringify(`ask-btn-${key}`)})'>Ask</button>
					<div class="ask-result" id="answer-${key}" style="display:none"></div>
				</div>
			</div>
		`;}).join("");
	}

	function logout(){
		const currentUser = getCurrentUser();
		if (currentUser?.username) {
			clearStoredBots(currentUser.username);
		}
		clearAuthSession();
		window.location.href="login.html";
	}

	window.logout = logout;
	window.askQuestion = askQuestion;
	renderBots();
}