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

function renderBots(botList = []) {
	const currentUser=getCurrentUser();
	const list = Array.isArray(botList) ? botList : [];

	if(userBadge){
		userBadge.textContent=currentUser?.username ? `Signed in as ${currentUser.username}` : "Signed in";
	}

	if(!list.length){
		container.innerHTML=`
			<div class="empty-state">
				<h3>No chatbots found</h3>
				<p>No bots are available for this account right now.</p>
			</div>
		`;
		return;
	}

	container.innerHTML=list.map((bot, index)=>{
		const safeName = escapeHtml(bot.chatbot_name || `Chatbot ${index + 1}`);
		const safeBotId = escapeHtml(bot.chatbot_name || `#${index + 1}`);
		const safeApiKey = escapeHtml(bot.api_key || "");
		const usageCount = Number(bot.usage_count ?? 0);
		const userId = bot.user_id ?? "-";
		const botId = bot.id ?? bot.chatbot_id ?? bot.bot_id ?? index + 1;

		return `
			<div class="bot-card">
				<div class="bot-card-head">
					<h3>${safeName}</h3>
					<span class="pill">${safeBotId}</span>
				</div>
				<div class="bot-stats">
					<div class="mini-stat">
						<span>Usage</span>
						<strong>${usageCount}</strong>
					</div>
					<div class="mini-stat">
						<span>User</span>
						<strong>#${escapeHtml(String(userId))}</strong>
					</div>
				</div>
				<div class="api-box">
					<span>API key</span>
					<strong>${safeApiKey}</strong>
				</div>
				<div class="bot-actions">
					<button class="btn secondary action-btn chat-btn" type="button" data-api-key="${safeApiKey}">Chat</button>
					<button class="btn danger action-btn delete-btn" type="button" data-bot-id="${botId}">Delete</button>
				</div>
			</div>
		`;
	}).join("");
}

function chatWithBot(apiKey) {
	if (!apiKey) {
		window.alert("API key is missing for this bot.");
		return;
	}

	const url = new URL("chat.html", window.location.href);
	url.searchParams.set("api_key", apiKey);
	window.location.href = url.toString();
}

async function deleteBot(botId) {
	if (!botId) {
		window.alert("Bot id is missing for this bot.");
		return;
	}

	const confirmDelete = window.confirm("Are you sure you want to delete this bot?");
	if (!confirmDelete) {
		return;
	}

	try {
		const response = await fetch(`${API_BASE}/home/deletebot/${botId}`, {
			method: "DELETE",
			headers: authHeaders({ "Content-Type": "application/json" })
		});

		let data = {};
		try {
			data = await response.json();
		} catch (_error) {}

		if (!response.ok) {
			throw new Error(data?.detail || data?.message || "Delete failed");
		}

		window.alert(data?.message || `Chatbot ${botId} deleted successfully.`);
		await loadDashboardBots();
	} catch (error) {
		window.alert(error.message || "Unable to delete this bot.");
	}
}

async function loadDashboardBots() {
	if (!container) {
		return;
	}

	container.innerHTML=`
		<div class="empty-state loading-state">
			<h3>Loading chatbots...</h3>
			<p>Fetching your available bots from the server.</p>
		</div>
	`;

	try {
		const response = await fetchJson("/home/get_chatbot");
		renderBots(Array.isArray(response) ? response : []);
	} catch (error) {
		container.innerHTML=`
			<div class="empty-state error-state">
				<h3>Unable to load chatbots</h3>
				<p>${escapeHtml(error.message || "Something went wrong while fetching bots.")}</p>
			</div>
		`;
	}
}

if (requireAuth()) {
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
	container?.addEventListener("click", async (event) => {
		const chatButton = event.target.closest(".chat-btn");
		if (chatButton) {
			await chatWithBot(chatButton.dataset.apiKey || "");
			return;
		}

		const deleteButton = event.target.closest(".delete-btn");
		if (deleteButton) {
			await deleteBot(deleteButton.dataset.botId || "");
			return;
		}

		const askButton = event.target.closest(".ask-btn");
		if (!askButton) {
			return;
		}

		askQuestion(
			askButton.dataset.apiKey || "",
			askButton.dataset.questionId || "",
			askButton.dataset.answerId || "",
			askButton.id
		);
	});

	window.logout = logout;
	window.askQuestion = askQuestion;
	loadDashboardBots();
}