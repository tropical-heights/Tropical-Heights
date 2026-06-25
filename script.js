// ====== INFRASTRUCTURE DE BASE (LOCALSTORAGE) ======
// Initialisation des comptes par défaut si la mémoire est vide
let comptes = JSON.parse(localStorage.getItem('comptes'));
if (!comptes || comptes.length === 0) {
    comptes = [
        { username: "Boss", password: "admin123", role: "admin" },
        { username: "Employe1", password: "tropical2026", role: "employe" }
    ];
    localStorage.setItem('comptes', JSON.stringify(comptes));
}

// ====== GESTION DE LA CONNEXION (INDEX.HTML) ======
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        // Re-charger les comptes mis à jour
        const fecthComptes = JSON.parse(localStorage.getItem('comptes')) || comptes;
        const compteTrouve = fecthComptes.find(c => c.username === usernameInput && c.password === passwordInput);

        if (compteTrouve) {
            // Sauvegarde de la session active
            localStorage.setItem('compteConnecte', JSON.stringify(compteTrouve));
            
            // Redirection selon le rôle
            if (compteTrouve.username === "Boss" || compteTrouve.role === "admin") {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'employe.html';
            }
        } else {
            alert("Identifiant ou mot de passe incorrect !");
        }
    });
}

// ====== GESTION DES VENTES (EMPLOYE.HTML) ======
const saleForm = document.getElementById('saleForm');
if (saleForm) {
    // Afficher l'identifiant de l'employé connecté sur sa page
    const employeConnecte = JSON.parse(localStorage.getItem('compteConnecte'));
    const nomEmployeData = document.getElementById('nom-employe');
    if (nomEmployeData && employeConnecte) {
        nomEmployeData.textContent = employeConnecte.username;
    }

    saleForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const itemSelect = document.getElementById('itemSelect');
        const itemNom = itemSelect.options[itemSelect.selectedIndex].text;
        const itemPrix = parseInt(itemSelect.value);
        const quantity = parseInt(document.getElementById('quantity').value);
        
        const totalVente = itemPrix * quantity;
        const nomEmploye = employeConnecte ? employeConnecte.username : "Inconnu";

        // 1. Sauvegarde dans les fiches de compta des employés
        let fichesCompta = JSON.parse(localStorage.getItem('fichesCompta')) || {};
        if (!fichesCompta[nomEmploye]) {
            fichesCompta[nomEmploye] = { ventes: 0, ca: 0 };
        }
        fichesCompta[nomEmploye].ventes += quantity;
        fichesCompta[nomEmploye].ca += totalVente;
        localStorage.setItem('fichesCompta', JSON.stringify(fichesCompta));

        // 2. Ajout dans l'historique/archives globales du Boss
        let archivesGlobales = JSON.parse(localStorage.getItem('archivesGlobales')) || [];
        const dateActuelle = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        archivesGlobales.unshift({
            texte: `[${dateActuelle}] ${nomEmploye} a vendu ${quantity}x ${itemNom} pour un total de ${totalVente} $`
        });
        localStorage.setItem('archivesGlobales', JSON.stringify(archivesGlobales));

        alert(`Vente validée avec succès ! Total : ${totalVente} $`);
        saleForm.reset();
    });
}

// ====== AFFICHAGE COMPTABILITÉ (ADMIN.HTML) ======
function chargerComptaAdmin() {
    const corpsTableau = document.getElementById('corps-tableau-ca');
    const zoneArchives = document.getElementById('archives-globales');
    const caTotalElement = document.getElementById('ca-total');

    if (corpsTableau) {
        const fichesCompta = JSON.parse(localStorage.getItem('fichesCompta')) || {};
        corpsTableau.innerHTML = '';
        
        let cumulCA = 0;

        Object.keys(fichesCompta).forEach(employe => {
            const data = fichesCompta[employe];
            cumulCA += data.ca;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="padding: 12px; border: 1px solid #34495e;"><strong>${employe}</strong></td>
                <td style="padding: 12px; border: 1px solid #34495e; text-align: center;">${data.ventes}</td>
                <td style="padding: 12px; border: 1px solid #34495e; text-align: right; color: #00ffcc; font-weight: bold;">${data.ca} $</td>
            `;
            corpsTableau.appendChild(row);
        });

        // Mettre à jour le badge du Chiffre d'Affaires global en haut du panel
        if (caTotalElement) {
            caTotalElement.textContent = `${cumulCA} $`;
        }
    }

    if (zoneArchives) {
        const archivesGlobales = JSON.parse(localStorage.getItem('archivesGlobales')) || [];
        zoneArchives.innerHTML = '';
        if (archivesGlobales.length === 0) {
            zoneArchives.innerHTML = '<p style="color: #666; margin: 0;">Aucun historique enregistré pour le moment.</p>';
        } else {
            archivesGlobales.forEach(archive => {
                const p = document.createElement('p');
                p style.color = "#ecf0f1";
                p.style.margin = "5px 0";
                p.style.fontSize = "14px";
                p.innerHTML = archive.texte;
                zoneArchives.appendChild(p);
            });
        }
    }
}

// Fonction de remise à zéro de la compta des employés
window.remiseAZeroFiches = function() {
    if (confirm("Voulez-vous vraiment remettre à zéro toutes les fiches des employés pour la nouvelle semaine ? (L'historique restera détaillé)")) {
        localStorage.removeItem('fichesCompta');
        chargerComptaAdmin();
    }
};

// Lancement automatique de l'affichage si on est sur la page Admin
if (document.getElementById('panel-suivi-employes')) {
    chargerComptaAdmin();
}
