// Configuration initiale des articles (si vide)
if (!localStorage.getItem('articles')) {
    const articlesDeBase = [
        { nom: "Entrée Simple", prix: 500 },
        { nom: "Entrée VIP", prix: 1500 },
        { nom: "Cocktail Tropical", prix: 200 }
    ];
    localStorage.setItem('articles', JSON.stringify(articlesDeBase));
}

// Configuration initiale des comptes (si vide, on crée le Boss)
if (!localStorage.getItem('comptes')) {
    const comptesDeBase = [
        { username: "Boss", password: "admin123", role: "admin" },
        { username: "Employe1", password: "tropical2026", role: "employe" }
    ];
    localStorage.setItem('comptes', JSON.stringify(comptesDeBase));
}

// Gestion de la connexion
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Récupérer tous les comptes enregistrés
    const comptes = JSON.parse(localStorage.getItem('comptes'));

    // Chercher si un compte correspond à l'ID et au MDP tapés
    const compteTrouve = comptes.find(c => c.username === username && c.password === password);

    if (compteTrouve) {
        if (compteTrouve.role === "admin") {
            window.location.href = "admin.html";
        } else if (compteTrouve.role === "employe") {
            window.location.href = "employe.html";
        } else if (compteTrouve.role === "client") {
            window.location.href = "commandes.html";
        }
    } else {
        errorMessage.textContent = "Identifiant ou mot de passe incorrect, ou accès non autorisé.";
    }
});