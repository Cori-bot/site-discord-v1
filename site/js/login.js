document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Vérification basique des identifiants (à remplacer par une vérification côté serveur dans un environnement de production)
        if (email === 'm@m' && password === '123') {
            // Stockage d'un token factice (à remplacer par un vrai token d'authentification)
            localStorage.setItem('authToken', 'fakeToken123');
            window.location.href = '/site/main.html';
        } else {
            alert('Identifiants incorrects. Veuillez réessayer.');
        }
    });
});
