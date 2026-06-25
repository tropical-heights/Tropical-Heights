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

    const comptes = JSON.parse(localStorage.getItem('comptes'));
    const compteTrouve = comptes.find(c => c.username === username && c.password === password);

    if (compteTrouve) {
        // Sauvegarder l'identifiant de la session en cours
        sessionStorage.setItem('employeConnecte', compteTrouve.username);

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

// ====== GESTION DYNAMIQUE DES EMPLOYÉS & DU CA POUR LE BOSS ======

// 1. Fonction pour afficher le récapitulatif de TOUS les comptes actifs
function chargerPanelAdminCalculs() {
    let caEmployes = JSON.parse(localStorage.getItem('caEmployes')) || {};
    let historiqueGlobal = JSON.parse(localStorage.getItem('historiqueGlobal')) || [];
    
    // Récupérer le tableau HTML
    let corpsTableau = document.getElementById('corps-tableau-ca');
    if (corpsTableau) {
        corpsTableau.innerHTML = ""; // On vide le tableau avant de le remplir
        
        // Prendre tous les identifiants qui ont un CA enregistré
        let identifiants = Object.keys(caEmployes);
        
        if (identifiants.length === 0) {
            corpsTableau.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#888;">Aucun employé n'a encore enregistré de vente cette semaine.</td></tr>`;
        } else {
            identifiants.forEach(identifiant => {
                let caActuel = caEmployes[identifiant] || 0;
                
                // On compte combien de ventes cet employé a fait au total
                let nombreVentes = historiqueGlobal.filter(vente => vente.employe === identifiant).length;
                
                let ligne = `
                    <tr>
                        <td><strong style="color: #3498db;">${identifiant}</strong></td>
                        <td style="text-align: center; font-weight: bold;">${nombreVentes} vente(s)</td>
                        <td style="color: #2ecc71; font-weight: bold; text-align: right;">${caActuel.toLocaleString()} $</td>
                    </tr>
                `;
                corpsTableau.innerHTML += ligne;
            });
        }
    }
    
    // 2. Affichage du Volet Archives (Historique Global pour le Boss)
    let voletArchives = document.getElementById('archives-globales');
    if (voletArchives) {
        if (historiqueGlobal.length === 0) {
            voletArchives.innerHTML = "<p style='color: #888;'>Aucune archive disponible pour le moment.</p>";
        } else {
            voletArchives.innerHTML = "";
            // On affiche du plus récent au plus ancien
            historiqueGlobal.slice().reverse().forEach(vente => {
                let dateFormatee = new Date(vente.date).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'
                });
                let ligneArchive = `
                    <div style="border-bottom: 1px solid #333; padding: 5px 0; font-size: 0.9em; display: flex; justify-content: space-between;">
                        <span><span style="color: #9b59b6;">[${dateFormatee}]</span> <strong>${vente.employe}</strong></span>
                        <span style="color: #2ecc71; font-weight: bold;">+ ${vente.montant.toLocaleString()} $</span>
                    </div>
                `;
                voletArchives.innerHTML += ligneArchive;
            });
        }
    }
}

// 3. Fonction RESET : Remet à zéro les fiches mais GARDE l'historique global
function remiseAZeroFiches() {
    if (confirm("⚠️ Es-tu sûr de vouloir remettre à zéro la compta de TOUS les comptes ? (Le volet d'archives restera conservé pour toi)")) {
        // On vide uniquement les CA de la semaine
        localStorage.removeItem('caEmployes');
        
        // On rafraîchit l'affichage pour voir le tableau se vider
        chargerPanelAdminCalculs();
        
        alert("🔄 Les fiches hebdomadaires ont été réinitialisées !");
    }
}

// 4. Lancement automatique au chargement de la page admin
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('corps-tableau-ca')) {
        chargerPanelAdminCalculs();
    }
});
// Fonction universelle pour enregistrer une vente depuis n'importe quelle page
window.enregistrerUneVente = function(montant) {
    // 1. Récupérer automatiquement l'identifiant de l'employé connecté
    let employeActuel = sessionStorage.getItem('employeConnecte') || "Inconnu";
    let montantVente = parseFloat(montant);

    if (isNaN(montantVente) || montantVente <= 0) return;

    // 2. Ajouter au CA de la semaine de l'employé
    let caEmployes = JSON.parse(localStorage.getItem('caEmployes')) || {};
    caEmployes[employeActuel] = (caEmployes[employeActuel] || 0) + montantVente;
    localStorage.setItem('caEmployes', JSON.stringify(caEmployes));

    // 3. Ajouter dans les Archives du Boss
    let historiqueGlobal = JSON.parse(localStorage.getItem('historiqueGlobal')) || [];
    historiqueGlobal.push({
        employe: employeActuel,
        montant: montantVente,
        date: new Date().toISOString()
    });
    localStorage.setItem('historiqueGlobal', JSON.stringify(historiqueGlobal));
};