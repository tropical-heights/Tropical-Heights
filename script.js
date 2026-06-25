// ====== COMPTES ET INFRASTRUCTURE (LOCALSTORAGE) ======
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

        const fecthComptes = JSON.parse(localStorage.getItem('comptes')) || comptes;
        const compteTrouve = fecthComptes.find(c => c.username === usernameInput && c.password === passwordInput);

        if (compteTrouve) {
            localStorage.setItem('compteConnecte', JSON.stringify(compteTrouve));
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
    const employeConnecte = JSON.parse(localStorage.getItem('compteConnecte'));
    const nomEmployeData = document.getElementById('nom-employe');
    if (nomEmployeData && employeConnecte) {
        nomEmployeData.textContent = employeConnecte.username;
    }

    saleForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const itemSelect = document.getElementById('itemSelect');
        const quantityInput = document.getElementById('quantity');
        
        // Sécurité si les éléments n'existent pas dans ton HTML actuel
        if (!itemSelect || !quantityInput) {
            alert("Erreur : Formulaire employé mal configuré (Vérifie les ID itemSelect ou quantity)");
            return;
        }

        const itemNom = itemSelect.options[itemSelect.selectedIndex].text;
        const itemPrix = parseInt(itemSelect.value) || 0;
        const quantity = parseInt(quantityInput.value) || 1;
        
        const totalVente = itemPrix * quantity;
        const nomEmploye = employeConnecte ? employeConnecte.username : "Employe1";

        // Sauvegarde compta
        let fichesCompta = JSON.parse(localStorage.getItem('fichesCompta')) || {};
        if (!fichesCompta[nomEmploye]) {
            fichesCompta[nomEmploye] = { ventes: 0, ca: 0 };
        }
        fichesCompta[nomEmploye].ventes += quantity;
        fichesCompta[nomEmploye].ca += totalVente;
        localStorage.setItem('fichesCompta', JSON.stringify(fichesCompta));

        // Sauvegarde historique
        let archivesGlobales = JSON.parse(localStorage.getItem('archivesGlobales')) || [];
        const dateActuelle = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        archivesGlobales.unshift({
            texte: `[${dateActuelle}] ${nomEmploye} a vendu ${quantity}x ${itemNom} (${totalVente} $)`
        });
        localStorage.setItem('archivesGlobales', JSON.stringify(archivesGlobales));

        alert(`Vente validée avec succès ! Total : ${totalVente} $`);
        saleForm.reset();
    });
}

// ====== ESPACE BOSS : CRÉATION DE COMPTE / ACCÈS (ADMIN.HTML) ======
const registerForm = document.getElementById('registerForm'); // Pense à vérifier si tu as cet ID dans ton admin.html
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newRegUser = document.getElementById('newUsername').value.trim();
        const newRegPass = document.getElementById('newPassword').value.trim();
        const newRegRole = document.getElementById('newRole').value;

        if(!newRegUser || !newRegPass) {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        let listeComptes = JSON.parse(localStorage.getItem('comptes')) || [];
        
        // Évite les doublons de comptes
        if (listeComptes.some(c => c.username.toLowerCase() === newRegUser.toLowerCase())) {
            alert("Cet utilisateur existe déjà !");
            return;
        }

        listeComptes.push({ username: newRegUser, password: newRegPass, role: newRegRole });
        localStorage.setItem('comptes', JSON.stringify(listeComptes));
        
        alert(`Le compte de ${newRegUser} (${newRegRole}) a été créé avec succès !`);
        registerForm.reset();
        if (typeof afficherListeComptesAdmin === "function") afficherListeComptesAdmin();
    });
}

// ====== AFFICHAGE COMPTABILITÉ ET ACCÈS (ADMIN.HTML) ======
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

        if (caTotalElement) caTotalElement.textContent = `${cumulCA} $`;
    }

    if (zoneArchives) {
        const archivesGlobales = JSON.parse(localStorage.getItem('archivesGlobales')) || [];
        zoneArchives.innerHTML = '';
        if (archivesGlobales.length === 0) {
            zoneArchives.innerHTML = '<p style="color: #666; margin: 0;">Aucun historique.</p>';
        } else {
            archivesGlobales.forEach(archive => {
                const p = document.createElement('p');
                p.style.color = "#ecf0f1";
                p.style.margin = "5px 0";
                p.style.fontSize = "14px";
                p.innerHTML = archive.texte;
                zoneArchives.appendChild(p);
            });
        }
    }
}

window.remiseAZeroFiches = function() {
    if (confirm("Remettre à zéro les fiches des employés ?")) {
        localStorage.removeItem('fichesCompta');
        chargerComptaAdmin();
    }
};

if (document.getElementById('panel-suivi-employes') || document.getElementById('corps-tableau-ca')) {
    chargerComptaAdmin();
}
