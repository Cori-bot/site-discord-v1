document.querySelector("#message-input button").addEventListener("click", function() {
    const input = document.querySelector("#message-input input");
    const message = input.value;
    if (message.trim() !== "") {
        const messagesDiv = document.querySelector("#messages");
        const newMessage = document.createElement("div");
        newMessage.classList.add("message");
        newMessage.innerHTML = `<span class="username">Vous :</span> <span class="message-content">${message}</span>`;
        messagesDiv.appendChild(newMessage);
        input.value = "";
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
});