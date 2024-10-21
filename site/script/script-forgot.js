document.getElementById("request-code-form").addEventListener("submit", function (e) {
    e.preventDefault();
    // Logique pour envoyer le code par e-mail ici (via un appel Ajax par exemple)

    // Afficher le formulaire de vérification du code
    document.getElementById("request-code-form").style.display = "none";
    document.getElementById("verify-code-form").style.display = "flex";
});

document.getElementById("verify-code-form").addEventListener("submit", function (e) {
    e.preventDefault();
    // Logique pour vérifier le code ici

    // Afficher le formulaire de changement de mot de passe si le code est valide
    document.getElementById("verify-code-form").style.display = "none";
    document.getElementById("reset-password-form").style.display = "flex";
});

document.getElementById("reset-password-form").addEventListener("submit", function (e) {
    e.preventDefault();
    // Logique pour changer le mot de passe ici
});
