document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const avatarInput = document.getElementById('avatar');
    const avatarButton = document.getElementById('avatarButton');
    const avatarFileName = document.getElementById('avatarFileName');

    avatarButton.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', () => {
        if (avatarInput.files.length > 0) {
            avatarFileName.textContent = avatarInput.files[0].name;
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

        // Création d'un objet FormData pour envoyer les données, y compris le fichier
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        try {
            // Simulation de l'envoi des données à un serveur
            // Dans un environnement réel, vous enverriez ces données à votre backend
            console.log('Données d\'inscription:', Object.fromEntries(formData));

            // Simulation de la création d'un dossier utilisateur
            const userId = Date.now().toString(); // Utilisation d'un timestamp comme ID utilisateur
            const userFolder = `/users/${userId}`;
            console.log(`Dossier utilisateur créé : ${userFolder}`);

            // Stockage des informations de l'utilisateur (simulation)
            localStorage.setItem('currentUser', JSON.stringify({
                id: userId,
                username: username,
                email: email,
                avatarPath: avatarFile ? `${userFolder}/avatar.jpg` : '/assets/img/default-avatar.png'
            }));

            // Redirection vers la page principale
            alert('Inscription réussie !');
            window.location.href = '/site/main.html';
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            alert('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
        }
    });
});
