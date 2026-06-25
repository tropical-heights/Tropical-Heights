// Exemple de fonction de connexion propre à adapter autour de ta ligne 60-70
const loginForm = document.getElementById('loginForm'); // ou le nom de ton formulaire
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        const comptes = JSON.parse(localStorage.getItem('comptes')) || [];
        const compteTrouve = comptes.find(c => c.username === usernameInput && c.password === passwordInput);

        if (compteTrouve) {
            localStorage.setItem('compteConnecte', JSON.stringify(compteTrouve));
            if (compteTrouve.role === 'admin' || compteTrouve.username === 'Boss') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'employe.html';
            }
        } else {
            // Sécurité : On utilise une alerte simple si l'élément HTML bugge
            alert("Identifiant ou mot de passe incorrect !");
        }
    });
}
