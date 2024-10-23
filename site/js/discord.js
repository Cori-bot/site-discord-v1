document.addEventListener('DOMContentLoaded', () => {
    const channelLinks = document.querySelectorAll('.sidebar li[data-channel]');
    const channels = document.querySelectorAll('.channel');
    const messageForm = document.querySelector('.message-form');
    const chatMessages = document.querySelector('.chat-messages');
    const settingsForm = document.getElementById('settings-form');
    const userInfoElement = document.querySelector('.user-info');

    let messageCount = 0;
    const messageInterval = 5;
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

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loggedInSettings = document.getElementById('logged-in-settings');
    const loggedOutSettings = document.getElementById('logged-out-settings');
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');

    function updateSettingsView() {
        if (currentUser) {
            loggedInSettings.style.display = 'block';
            loggedOutSettings.style.display = 'none';
            userInfoElement.querySelector('.avatar').src = currentUser.avatarPath || '/assets/img/default-avatar.png';
            userInfoElement.querySelector('.username').textContent = currentUser.username;
            document.getElementById('new-username').value = currentUser.username;
            document.getElementById('friend-code').textContent = currentUser.friendCode;
        } else {
            loggedInSettings.style.display = 'none';
            loggedOutSettings.style.display = 'block';
            userInfoElement.querySelector('.avatar').src = '/assets/img/default-avatar.png';
            userInfoElement.querySelector('.username').textContent = 'Utilisateur';
        }
    }

    updateSettingsView();

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            window.location.href = '/site/login.html';
        });
    }

    if (signupButton) {
        signupButton.addEventListener('click', () => {
            window.location.href = '/site/sign-up.html';
        });
    }

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

    channelLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetChannel = link.getAttribute('data-channel');
            changeChannel(targetChannel);
        });
    });

    const accueilChannelLinks = document.querySelectorAll('#accueil .channel-list li[data-channel]');
    accueilChannelLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetChannel = link.getAttribute('data-channel');
            changeChannel(targetChannel);
        });
    });

    if (messageForm) {
        const messageFormContainer = messageForm.parentElement;
        
        if (!currentUser) {
            const overlay = document.createElement('div');
            overlay.className = 'message-form-overlay';
            overlay.innerHTML = `
                <p>Veuillez vous connecter pour envoyer des messages.</p>
                <button id="go-to-settings" class="settings-button">Aller aux paramètres</button>
            `;
            messageFormContainer.appendChild(overlay);

            const goToSettingsButton = overlay.querySelector('#go-to-settings');
            goToSettingsButton.addEventListener('click', () => {
                changeChannel('parametres');
            });
        }

        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!currentUser) {
                alert('Veuillez vous connecter pour envoyer des messages.');
                return;
            }
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

                // Ajouter l'événement de clic sur le nom d'utilisateur
                newMessage.querySelector('.message-username').addEventListener('click', (event) => {
                    event.preventDefault();
                    showUserInfo(currentUser.username);
                });

                messageCount++;
                if (messageCount % messageInterval === 0) {
                    setTimeout(sendSystemMessage, 1000);
                }
            }
        });
    }

    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            body.classList.remove('light');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const newTheme = body.classList.contains('light') ? 'dark' : 'light';
        applyTheme(newTheme);
    }

    // Charger le thème sauvegardé ou utiliser le thème clair par défaut
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Ajouter l'écouteur d'événements pour le changement de thème
    themeToggleBtn.addEventListener('click', toggleTheme);

    if (settingsForm) {
        const newUsernameInput = document.getElementById('new-username');
        const newAvatarInput = document.getElementById('new-avatar');
        const avatarButton = document.getElementById('avatar-button');
        const avatarFileName = document.getElementById('avatar-file-name');
        const friendCodeElement = document.getElementById('friend-code');
        
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const theme = themeToggle.checked ? 'light' : 'dark';
            applyTheme(theme);

            if (currentUser) {
                const newUsername = newUsernameInput.value.trim();
                if (newUsername && newUsername !== currentUser.username) {
                    currentUser.username = newUsername;
                    userInfoElement.querySelector('.username').textContent = newUsername;
                }

                const newAvatarFile = newAvatarInput.files[0];
                if (newAvatarFile) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        currentUser.avatarPath = e.target.result;
                        userInfoElement.querySelector('.avatar').src = e.target.result;
                        
                        // Mettre à jour l'avatar dans tous les messages de l'utilisateur
                        document.querySelectorAll('.chat-bubble.user .message-avatar').forEach(avatar => {
                            avatar.src = e.target.result;
                        });

                        saveUserChanges();
                    };
                    reader.readAsDataURL(newAvatarFile);
                } else {
                    saveUserChanges();
                }
            }
        });

        function saveUserChanges() {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            let users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                localStorage.setItem('users', JSON.stringify(users));
            }

            updateMessagesWithUserInfo();
            alert('Paramètres enregistrés !');
        }

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

        friendCodeElement.addEventListener('click', () => {
            navigator.clipboard.writeText(currentUser.friendCode).then(() => {
                const copyConfirmation = document.getElementById('copy-confirmation');
                copyConfirmation.textContent = 'Code ami copié !';
                copyConfirmation.style.opacity = '1';
                setTimeout(() => {
                    copyConfirmation.style.opacity = '0';
                }, 2000);
            });
        });
    }

    const addFriendBtn = document.getElementById('add-friend-btn');
    const addFriendModal = document.getElementById('add-friend-modal');
    const addFriendConfirm = document.getElementById('add-friend-confirm');
    const addFriendCancel = document.getElementById('add-friend-cancel');
    const friendCodeInput = document.getElementById('friend-code-input');

    addFriendBtn.addEventListener('click', () => {
        addFriendModal.style.display = 'block';
    });

    addFriendCancel.addEventListener('click', () => {
        addFriendModal.style.display = 'none';
        friendCodeInput.value = '';
    });

    addFriendConfirm.addEventListener('click', () => {
        const friendCode = friendCodeInput.value.trim();
        if (friendCode) {
            console.log(`Demande d'ami envoyée avec le code : ${friendCode}`);
            addFriendModal.style.display = 'none';
            friendCodeInput.value = '';
        } else {
            alert('Veuillez entrer un code ami valide.');
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target === addFriendModal) {
            addFriendModal.style.display = 'none';
            friendCodeInput.value = '';
        }
    });

    const userInfoModal = document.getElementById('user-info-modal');
    const modalAvatar = document.getElementById('modal-avatar');
    const modalUsername = document.getElementById('modal-username');
    const modalFriendCode = document.getElementById('modal-friend-code');
    const closeUserInfoModal = userInfoModal.querySelector('.close');
    const copyFriendCodeBtn = document.getElementById('copy-friend-code');

    function showUserInfo(username) {
        if (username === 'Système') return;
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username);
        if (user) {
            // Si l'utilisateur affiché est l'utilisateur actuel, utilisez les informations les plus récentes
            if (currentUser && user.id === currentUser.id) {
                modalAvatar.src = currentUser.avatarPath || '/assets/img/default-avatar.png';
                modalUsername.textContent = currentUser.username;
                modalFriendCode.textContent = currentUser.friendCode;
            } else {
                modalAvatar.src = user.avatarPath || '/assets/img/default-avatar.png';
                modalUsername.textContent = user.username;
                modalFriendCode.textContent = user.friendCode;
            }
            userInfoModal.style.display = 'block';
        }
    }

    closeUserInfoModal.addEventListener('click', () => {
        userInfoModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === userInfoModal) {
            userInfoModal.style.display = 'none';
        }
    });

    copyFriendCodeBtn.addEventListener('click', () => {
        const friendCode = modalFriendCode.textContent;
        navigator.clipboard.writeText(friendCode).then(() => {
            copyFriendCodeBtn.textContent = 'Copié !';
            setTimeout(() => {
                copyFriendCodeBtn.textContent = 'Copier';
            }, 2000);
        });
    });

    document.querySelectorAll('.chat-bubble .message-username').forEach(usernameElement => {
        usernameElement.addEventListener('click', () => {
            showUserInfo(usernameElement.textContent);
        });
    });

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            currentUser = null;
            updateSettingsView();
            changeChannel('accueil');
        });
    }

    const userAvatar = userInfoElement.querySelector('.avatar');
    const avatarModal = document.getElementById('avatar-modal');
    const enlargedAvatar = document.getElementById('enlarged-avatar');
    const closeAvatarModal = avatarModal.querySelector('.close');

    userAvatar.addEventListener('click', () => {
        if (currentUser) {
            enlargedAvatar.src = currentUser.avatarPath || '/assets/img/default-avatar.png';
            avatarModal.style.display = 'block';
        }
    });

    closeAvatarModal.addEventListener('click', () => {
        avatarModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === avatarModal) {
            avatarModal.style.display = 'none';
        }
    });

    // Ajoutez cette fonction pour mettre à jour les messages après le chargement de la page
    function updateMessagesWithUserInfo() {
        if (currentUser) {
            document.querySelectorAll('.chat-bubble.user').forEach(bubble => {
                const avatar = bubble.querySelector('.message-avatar');
                const username = bubble.querySelector('.message-username');
                avatar.src = currentUser.avatarPath || '/assets/img/default-avatar.png';
                username.textContent = currentUser.username;

                // Mettre à jour l'événement de clic pour utiliser les informations les plus récentes
                username.onclick = (event) => {
                    event.preventDefault();
                    showUserInfo(currentUser.username);
                };
            });
        }
    }

    // Appelez cette fonction après chaque mise à jour de l'avatar ou du nom d'utilisateur
    function saveUserChanges() {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        let users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }

        updateMessagesWithUserInfo();
        alert('Paramètres enregistrés !');
    }

    // Appelez cette fonction après le chargement de la page
    updateMessagesWithUserInfo();

    // Fonction pour ajouter les écouteurs d'événements aux noms d'utilisateur
    function addUsernameClickListeners() {
        document.querySelectorAll('.chat-bubble .message-username').forEach(usernameElement => {
            usernameElement.addEventListener('click', (event) => {
                event.preventDefault();
                showUserInfo(usernameElement.textContent);
            });
        });
    }

    // Appeler cette fonction après le chargement de la page et après l'ajout de nouveaux messages
    addUsernameClickListeners();
});
