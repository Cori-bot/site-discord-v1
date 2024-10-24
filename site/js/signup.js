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

    function generateUniqueFriendCode(existingCodes) {
        let friendCode;
        do {
            friendCode = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        } while (existingCodes.includes(friendCode));
        return friendCode;
    }

    async function compressImage(file, maxWidth = 200, maxHeight = 200) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const avatarFile = avatarInput.files[0];

        try {
            const userId = Date.now().toString();
            const userFolder = `users/${userId}`;
            
            // Récupérer les codes ami existants
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            const existingCodes = users.map(user => user.friendCode);

            // Génération d'un code ami unique
            const friendCode = generateUniqueFriendCode(existingCodes);

            // Gestion de l'avatar
            let avatarPath = '/assets/img/default-avatar.png';
            if (avatarFile) {
                avatarPath = await compressImage(avatarFile);
            }

            // Création des données utilisateur
            const userData = {
                id: userId,
                username,
                email,
                password, // Note: Dans un vrai système, le mot de passe devrait être haché
                avatarPath,
                friendCode
            };

            // Enregistrement des données utilisateur dans le stockage local
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
