document.addEventListener('DOMContentLoaded', () => {
    const channelLinks = document.querySelectorAll('.sidebar li[data-channel]');
    const channels = document.querySelectorAll('.channel');
    const messageForm = document.querySelector('.message-form');
    const chatMessages = document.querySelector('.chat-messages');
    const settingsForm = document.getElementById('settings-form');
    const userInfoElement = document.querySelector('.user-info');

    let messageCount = 0;
    const messageInterval = 5; // Envoyer un message système tous les 5 messages utilisateur
    const systemMessages = [
        "N'oubliez pas de rester courtois dans vos échanges !",
        "Vous pouvez utiliser /help pour voir la liste des commandes disponibles.",
        "Pensez à inviter vos amis sur le serveur !",
        "Si vous avez des suggestions pour améliorer le serveur, n'hésitez pas à en faire part aux modérateurs.",
        "Amusez-vous bien sur notre serveur !"
    ];

    function sendSystemMessage() {
        const randomMessage = systemMessages[Math.floor(Math.random() * systemMessages.length)];
        const newMessage = document.createElement('div');
        newMessage.classList.add('chat-bubble', 'system');
        newMessage.innerHTML = `
            <img src="/assets/img/discord-logo.png" alt="Discord Logo" class="message-avatar">
            <div class="message-content">
                <span class="message-username">Système</span>
                <span class="message-text">${randomMessage}</span>
            </div>
        `;
        chatMessages.appendChild(newMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Charger les informations de l'utilisateur
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const avatarElement = userInfoElement.querySelector('.avatar');
        avatarElement.src = currentUser.avatarPath;
        avatarElement.onerror = function() {
            this.src = '/assets/img/default-avatar.png';
        };
        userInfoElement.querySelector('.username').textContent = currentUser.username;
    }

    // Fonction pour changer de canal
    function changeChannel(targetChannel) {
        channels.forEach(channel => {
            channel.classList.remove('active');
        });
        channelLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-channel') === targetChannel) {
                link.classList.add('active');
            }
        });
        document.getElementById(targetChannel).classList.add('active');
    }

    // Gestion du changement de canal dans la barre latérale
    channelLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetChannel = link.getAttribute('data-channel');
            changeChannel(targetChannel);
        });
    });

    // Gestion du changement de canal depuis l'onglet Accueil
    const accueilChannelLinks = document.querySelectorAll('#accueil .channel-list li[data-channel]');
    accueilChannelLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetChannel = link.getAttribute('data-channel');
            changeChannel(targetChannel);
        });
    });

    // Gestion de l'envoi de messages
    if (messageForm) {
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageInput = messageForm.querySelector('input');
            const message = messageInput.value.trim();
            if (message) {
                const newMessage = document.createElement('div');
                newMessage.classList.add('chat-bubble', 'user');
                newMessage.innerHTML = `
                    <img src="${currentUser.avatarPath}" alt="Avatar" class="message-avatar" onerror="this.src='/assets/img/default-avatar.png'">
                    <div class="message-content">
                        <span class="message-username">${currentUser.username}</span>
                        <span class="message-text">${message}</span>
                    </div>
                `;
                chatMessages.appendChild(newMessage);
                messageInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Incrémenter le compteur de messages et vérifier s'il faut envoyer un message système
                messageCount++;
                if (messageCount % messageInterval === 0) {
                    setTimeout(sendSystemMessage, 1000); // Envoyer le message système après un court délai
                }
            }
        });
    }

    // Gestion des paramètres
    if (settingsForm) {
        const themeToggle = document.getElementById('theme');
        const newUsernameInput = document.getElementById('new-username');
        const newAvatarInput = document.getElementById('new-avatar');
        const avatarButton = document.getElementById('avatar-button');
        const avatarFileName = document.getElementById('avatar-file-name');
        
        // Charger le thème sauvegardé ou utiliser le thème sombre par défaut
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = savedTheme;
        themeToggle.checked = savedTheme === 'light';

        // Pré-remplir le champ du nouveau pseudo avec le pseudo actuel
        newUsernameInput.value = currentUser.username;

        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const theme = themeToggle.checked ? 'light' : 'dark';
            document.body.className = theme;
            localStorage.setItem('theme', theme);

            // Gestion du changement de pseudo
            const newUsername = newUsernameInput.value.trim();
            if (newUsername && newUsername !== currentUser.username) {
                currentUser.username = newUsername;
                userInfoElement.querySelector('.username').textContent = newUsername;
            }

            // Gestion du changement d'avatar
            const newAvatarFile = newAvatarInput.files[0];
            if (newAvatarFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    currentUser.avatarPath = e.target.result;
                    userInfoElement.querySelector('.avatar').src = e.target.result;
                };
                reader.readAsDataURL(newAvatarFile);
            }

            // Mise à jour des informations de l'utilisateur dans le stockage local
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Mise à jour de la liste des utilisateurs dans le stockage local
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                localStorage.setItem('users', JSON.stringify(users));
            }

            alert('Paramètres enregistrés !');
        });

        themeToggle.addEventListener('change', () => {
            document.body.className = themeToggle.checked ? 'light' : 'dark';
        });

        // Ajouter le bouton de déconnexion
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Déconnexion';
        logoutButton.id = 'logout';
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = '/site/login.html';
        });
        settingsForm.appendChild(logoutButton);

        // Gestion du bouton d'avatar
        avatarButton.addEventListener('click', () => {
            newAvatarInput.click();
        });

        newAvatarInput.addEventListener('change', () => {
            if (newAvatarInput.files.length > 0) {
                avatarFileName.textContent = newAvatarInput.files[0].name;
            } else {
                avatarFileName.textContent = 'Aucun fichier choisi';
            }
        });
    }

    // Vérification de l'authentification
    if (!currentUser) {
        window.location.href = '/site/login.html';
    }
});
