const socket = io();

const clientTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const messageTon = new Audio('/message-tone.M4R')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

socket.on('client-total', (data) => {
    clientTotal.innerText = `${data}: They are Active`;
});

function sendMessage() {
    if (messageInput.value == '') return
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date().toISOString(), // Use ISOString format for date
    };
    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';
}

socket.on('chat-message', (data) => {
    messageTon.play()
    addMessageToUI(false, data);
});

function addMessageToUI(isOwnerMessage, data) {
    clearFeedback()
    const element = `
    <li class="${isOwnerMessage ? 'message-right' : 'message-left'}">
        <p class="message">
            ${data.message}
            <span>${data.name} .${moment(data.dateTime).fromNow()}</span>
        </p>
    </li>
    `;
    messageContainer.innerHTML += element;
    scrollTobottom()
}

function scrollTobottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) =>{
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a messae`,
    })
})
messageInput.addEventListener('keypress', (e) =>{
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a messae`,
    })
})
messageInput.addEventListener('blur', (e) =>{
    socket.emit('feedback', {
        feedback: "",
    })
})

socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
    <li class="message-feedback">
    <p class="feedback" id="feedback">
        ${data.feedback}
    </p>
    </li>
    `
    messageContainer.innerHTML += element
})

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}