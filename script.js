const OPENROUTER_API_KEY = "tu-api-key";

// VARIABLES DE ESTADO
let conversations = []; 
let currentChatId = null; 
let campusData = null;

const messagesWrapper = document.getElementById('messages-wrapper');
const chatHistoryList = document.getElementById('chat-history-list');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatContainer = document.getElementById('chat-container');

// 1. Cargar conocimiento
async function loadKnowledge() {
    try {
        const res = await fetch('data.json');
        campusData = await res.json();
        createNewChat(); // Inicia la primera conversación
    } catch (e) {
        console.error("Error al cargar data.json", e);
    }
}
loadKnowledge();

// 2. Crear nueva instancia de conversación
function createNewChat() {
    const newChat = {
        id: Date.now(),
        title: `Conversación ${conversations.length + 1}`,
        messages: [],
        warningTimer: null,
        terminationTimer: null,
        isExpired: false // Nueva bandera para bloquear chats viejos
    };
    conversations.push(newChat);
    renderHistorySidebar();
    switchChat(newChat.id);
    resetChatTimer(newChat.id); // Iniciar cuenta regresiva
}

// 3. Cambiar entre conversaciones
function switchChat(id) {
    currentChatId = id;
    const chat = conversations.find(c => c.id === id);
    
    messagesWrapper.innerHTML = '';
    
    // Bloquear/Desbloquear input según el estado del chat
    if (chat.isExpired) {
        userInput.disabled = true;
        userInput.placeholder = "Conversación finalizada...";
    } else {
        userInput.disabled = false;
        userInput.placeholder = "Escribe tu mensaje aquí...";
    }

    if (chat.messages.length === 0) {
        renderBotWelcome();
    }
    chat.messages.forEach(msg => renderMessageUI(msg.role, msg.content));
    renderHistorySidebar();
}

// 4. Actualizar Sidebar
function renderHistorySidebar() {
    chatHistoryList.innerHTML = '';
    conversations.forEach(chat => {
        const btn = document.createElement('a');
        const isActive = chat.id === currentChatId;
        btn.className = `${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'} group flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors`;
        btn.innerHTML = `
            <svg class="mr-3 h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            ${chat.title}
        `;
        btn.onclick = () => switchChat(chat.id);
        chatHistoryList.appendChild(btn);
    });
}

// 5. Renderizar Mensajes en pantalla
function renderMessageUI(role, text) {
    const isUser = role === 'user';
    const msg = document.createElement('div');
    msg.className = `flex items-start space-x-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`;
    
    // Si el bot usa Markdown, lo convertimos. El usuario se queda como texto plano.
    const formattedText = isUser ? text : marked.parse(text);
    
    // Logo para el bot, iniciales para el usuario
    const avatar = isUser 
        ? 'JD' 
        : `<img src="./assets/logo.png" class="h-7 w-7 brightness-0 invert">`;

    msg.innerHTML = `
        <div class="flex-shrink-0 h-10 w-10 rounded-full ${isUser ? 'bg-indigo-600' : 'bg-slate-900'} flex items-center justify-center text-white text-xs font-bold border-2 border-slate-200 overflow-hidden">
            ${avatar}
        </div>
        <div class="${isUser ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'} rounded-2xl p-4 shadow-sm max-w-[80%] prose prose-slate">
            ${formattedText}
        </div>
    `;
    messagesWrapper.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function renderBotWelcome() {
    const welcomeMessage = `
Hola 👋 Soy el asistente de Campuslands.

Puedes preguntarme sobre:\n\n
• Programas\n
• Inscripciones\n
• Horarios\n
• Campus
`;
    renderMessageUI('assistant', welcomeMessage);
}

// 6. Indicadores de carga
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = "flex items-start space-x-4 animate-pulse";
    typingDiv.innerHTML = `
        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center border-2 border-slate-200 overflow-hidden">
            <img src="./assets/logo.png" class="h-7 w-7 brightness-0 invert">
        </div>
        <div class="bg-slate-100 rounded-2xl p-5 shadow-sm border border-slate-200/50">
            <div class="typing-dots"><span></span><span></span><span></span></div>
        </div>
    `;
    messagesWrapper.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function resetChatTimer(chatId) {
    const chat = conversations.find(c => c.id === chatId);
    if (!chat || chat.isExpired) return;

    // Limpiar temporizadores previos si existen
    clearTimeout(chat.warningTimer);
    clearTimeout(chat.terminationTimer);

    // 1. Temporizador de Advertencia (2 minutos = 120,000 ms)
    chat.warningTimer = setTimeout(() => {
        const msg = "⚠️ Tu sesión expirará en 3 minutos por inactividad.";
        chat.messages.push({ role: 'assistant', content: msg });
        if (currentChatId === chatId) {
            renderMessageUI('bot', msg);
        }
    }, 120000); 

    // 2. Temporizador de Cierre (5 minutos = 300,000 ms)
    chat.terminationTimer = setTimeout(() => {
        chat.isExpired = true;
        const msg = "🔴 Esta conversación ha finalizado por inactividad. Por favor, inicia una nueva.";
        chat.messages.push({ role: 'assistant', content: msg });
        
        if (currentChatId === chatId) {
            renderMessageUI('bot', msg);
            // Bloquear el input si el chat actual expira
            userInput.disabled = true;
            userInput.placeholder = "Conversación finalizada...";
        }
        renderHistorySidebar(); // Para actualizar visualmente si está bloqueado
    }, 300000);
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (!query || !campusData) return;

    // CAPTURAMOS EL ID EN EL MOMENTO DEL ENVÍO
    const chatIdAtSending = currentChatId;
    const currentChat = conversations.find(c => c.id === chatIdAtSending);
    
    renderMessageUI('user', query);
    currentChat.messages.push({ role: 'user', content: query });
    userInput.value = '';
    
    showTypingIndicator();

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "openrouter/hunter-alpha",
                "messages": [
                    { "role": "system", "content": `Eres el asistente de Campuslands. Datos: ${JSON.stringify(campusData)}` },
                    ...currentChat.messages 
                ]
            })
        });

        const data = await response.json();
        
        // 1. Guardamos la respuesta siempre en el objeto lógico
        const botText = data.choices[0].message.content;
        currentChat.messages.push({ role: 'assistant', content: botText });

        resetChatTimer(chatIdAtSending); 

        // 2. VALIDACIÓN CRÍTICA: ¿El chat de donde vino la respuesta sigue siendo el activo?
        if (currentChatId === chatIdAtSending) {
            removeTypingIndicator();
            renderMessageUI('bot', botText);
        } else {
            // Si el usuario se cambió de chat, no quitamos el indicador del chat actual
            // (porque el indicador de este chat se maneja en su propia petición)
            console.log("Respuesta recibida para un chat en segundo plano. Guardada pero no mostrada.");
        }

    } catch (error) {
        if (currentChatId === chatIdAtSending) removeTypingIndicator();
        renderMessageUI('bot', "Error de conexión.");
    }
});

// Asignar evento al botón de Nueva Conversación
document.getElementById('new-chat-btn').addEventListener('click', (e) => {
    e.preventDefault();
    createNewChat();
});

// Manejar el envío con la tecla Enter
userInput.addEventListener('keydown', (e) => {
    // Si presiona Enter pero NO presiona Shift
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Evita que se cree una nueva línea
        chatForm.dispatchEvent(new Event('submit')); // Dispara el evento de envío del formulario
    }
});