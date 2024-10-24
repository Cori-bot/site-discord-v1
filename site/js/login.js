document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                try {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    window.location.href = '/site/discord.html';
                } catch (storageError) {
                    if (storageError.name === 'QuotaExceededError') {
                        alert('Erreur de stockage. Veuillez libérer de l\'espace en supprimant des données inutiles.');
                    } else {
                        throw storageError;
                    }
                }
            } else {
                alert('Identifiants incorrects. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            alert('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
        }
    });
});
