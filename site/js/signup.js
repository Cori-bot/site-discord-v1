document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.login-form');
    const avatarInput = document.getElementById('avatar');
    const avatarButton = document.getElementById('avatarButton');
    const avatarFileName = document.getElementById('avatarFileName');

    avatarButton.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', () => {
        if (avatarInput.files.length > 0) {
            avatarFileName.textContent = `Fichier pour l'avatar : ${avatarInput.files[0].name}`;
        } else {
            avatarFileName.textContent = 'Aucun fichier choisi';
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const avatarFile = avatarInput.files[0];

        try {
            const userId = Date.now().toString();
            const userFolder = `users/${userId}`;
            
            // Simulation de la création du dossier utilisateur
            console.log(`Dossier utilisateur créé : ${userFolder}`);

            // Gestion de l'avatar
            let avatarPath = '/assets/img/default-avatar.png';
            if (avatarFile) {
                avatarPath = URL.createObjectURL(avatarFile);
            }

            // Création des données utilisateur
            const userData = {
                id: userId,
                username,
                email,
                password, // Note: Dans un vrai système, le mot de passe devrait être haché
                avatarPath,
            };

            // Enregistrement des données utilisateur dans le stockage local
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));

            // Simulation de la sauvegarde des informations de l'utilisateur dans son dossier
            console.log(`Informations utilisateur sauvegardées dans : ${userFolder}/info.json`);

            alert('Inscription réussie ! Veuillez vous connecter.');
            window.location.href = '/site/login.html';
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            alert('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
        }
    });
});
