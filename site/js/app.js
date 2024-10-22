document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('main section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            document.getElementById(targetId).classList.add('active');
            
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            link.classList.add('active');
        });
    });

    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Ici, vous pouvez ajouter la logique de déconnexion
            // Par exemple, supprimer les tokens d'authentification du localStorage
            localStorage.removeItem('authToken');
            // Rediriger vers la page de connexion
            window.location.href = '/site/login.html';
        });
    }
});
