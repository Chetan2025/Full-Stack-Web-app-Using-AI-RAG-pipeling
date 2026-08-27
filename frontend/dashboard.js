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
			resultBox.textContent=data?.answer || data?.response || data?.message || data?.error || JSON.stringify(data);
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
			const safeName = escapeHtml(bot.chatbot_name || `Chatbot ${formatBotId(bot)}`);
			const safeBotId = escapeHtml(formatBotId(bot));
			const safeApiKey = escapeHtml(bot.api_key || "");
			return `
			<div class="bot-card">
				<div class="bot-card-head">
					<h3>${safeName}</h3>
					<span class="pill">${safeBotId}</span>
				</div>
				<p class="bot-meta">Uploaded chunks: ${bot.chunks ?? "-"}</p>
				<div class="api-box">
					<span>API key</span>
					<strong>${safeApiKey}</strong>
				</div>
				<div class="ask-box">
					<label class="ask-label" for="question-${key}">Ask a question</label>
					<input id="question-${key}" class="ask-input" type="text" placeholder="what is blufo?">
					<button class="btn secondary ask-btn" id="ask-btn-${key}" type="button" data-api-key="${safeApiKey}" data-question-id="question-${key}" data-answer-id="answer-${key}">Ask</button>
					<div class="ask-result" id="answer-${key}" style="display:none"></div>
				</div>
			</div>
		`;}).join("");
	}

	container?.addEventListener("click", (event) => {
		const button = event.target.closest(".ask-btn");
		if (!button) {
			return;
		}

		askQuestion(
			button.dataset.apiKey || "",
			button.dataset.questionId || "",
			button.dataset.answerId || "",
			button.id
		);
	});

	function logout(){
		const currentUser = getCurrentUser();
		if (currentUser?.username) {
			clearStoredBots(currentUser.username);
		}
		clearAuthSession();
		window.location.href="login.html";
	}

	document.getElementById("createBotNav")?.addEventListener("click", () => {
		window.location.href = "upload.html";
	});

	document.getElementById("logoutBtn")?.addEventListener("click", logout);

	window.logout = logout;
	window.askQuestion = askQuestion;
	renderBots();
}