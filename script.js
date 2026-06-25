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
        
        if (!itemSelect || !quantityInput) {
            alert("Erreur : Vérifie que ton formulaire HTML a bien id='itemSelect' et id='quantity'");
            return;
        }

        const itemNom = itemSelect.options[itemSelect.selectedIndex].text;
        const itemPrix = parseInt(itemSelect.value) || 0;
        const quantity = parseInt(quantityInput.value) || 1;
        
        const totalVente = itemPrix * quantity;
        const nomEmploye = employeConnecte ? employeConnecte.username : "Employe1";

        // Sauvegarde de la compta
        let fichesCompta = JSON.parse(localStorage.getItem('fichesCompta')) || {};
        if (!fichesCompta[nomEmploye]) {
            fichesCompta[nomEmploye] = { ventes: 0, ca: 0 };
        }
        fichesCompta[nomEmploye].ventes += quantity;
        fichesCompta[nomEmploye].ca += totalVente;
        localStorage.setItem('fichesCompta', JSON.stringify(fichesCompta));

        // Sauvegarde de l'historique global
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

// ====== AJOUTER / GÉRER LES ACCÈS (ADMIN.HTML) ======
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userField = document.getElementById('newUsername');
        const passField = document.getElementById('newPassword');
        const roleField = document.getElementById('newRole');

        if (!userField || !passField) return;

        const newRegUser = userField.value.trim();
        const newRegPass = passField.value.trim();
        const newRegRole = roleField ? roleField.value : "employe";

        if(!newRegUser || !newRegPass) {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        let listeComptes = JSON.parse(localStorage.getItem('comptes')) || [];
        if (listeComptes.some(c => c.username.toLowerCase() === newRegUser.toLowerCase())) {
            alert("Cet utilisateur existe déjà !");
            return;
        }

        listeComptes.push({ username: newRegUser, password: newRegPass, role: newRegRole });
        localStorage.setItem('comptes', JSON.stringify(listeComptes));
        
        alert(`Le compte de ${newRegUser} (${newRegRole}) a été créé !`);
        registerForm.reset();
        
        // Rafraîchit la liste des comptes affichée
        afficherListeComptes();
    });
}

// ====== FONCTION DE GESTION DES COMPTES (REVISU / MODIF / SUPPR) ======
function afficherListeComptes() {
    const formAdmin = document.getElementById('registerForm');
    if (!formAdmin) return;

    // On cherche si la zone de liste existe déjà, sinon on la crée sous le formulaire
    let zoneListe = document.getElementById('liste-gestion-comptes');
    if (!zoneListe) {
        zoneListe = document.createElement('div');
        zoneListe.id = 'liste-gestion-comptes';
        zoneListe.style.marginTop = '25px';
        zoneListe.style.borderTop = '1px solid #1f3141';
        zoneListe.style.paddingTop = '15px';
        formAdmin.parentNode.appendChild(zoneListe);
    }

    const listeComptes = JSON.parse(localStorage.getItem('comptes')) || [];
    
    zoneListe.innerHTML = `<h4 style="margin: 0 0 15px 0; color: #00ffcc; font-size: 15px; text-transform: uppercase;">👥 Liste des comptes actifs</h4>`;

    listeComptes.forEach((compte, index) => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justify = 'space-between';
        item.style.alignItems = 'center';
        item.style.background = '#09121a';
        item.style.padding = '10px';
        item.style.borderRadius = '6px';
        item.style.marginBottom = '10px';
        item.style.fontSize = '14px';
        item.style.border = '1px solid #1f3141';

        item.innerHTML = `
            <div>
                <strong style="color: #fff;">${compte.username}</strong> 
                <span style="color: #a5b1c2; font-size: 12px;">(${compte.role})</span><br>
                <span style="color: #4b6584; font-size: 12px;">MDP: ${compte.password}</span>
            </div>
            <div style="display: flex; gap: 8px;">
                <button onclick="modifierMdp(${index})" style="background: #4b6584; color: #fff; border: none; padding: 5px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">✏️</button>
                <button onclick="supprimerCompte(${index})" style="background: #fc5c65; color: #fff; border: none; padding: 5px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;" ${compte.username === 'Boss' ? 'disabled style="opacity:0.3; cursor:default;"' : ''}>❌</button>
            </div>
        `;
        zoneListe.appendChild(item);
    });
}

// Action de modification du mot de passe
window.modifierMdp = function(index) {
    let listeComptes = JSON.parse(localStorage.getItem('comptes')) || [];
    const nouveauMdp = prompt(`Entrez le nouveau mot de passe pour ${listeComptes[index].username} :`, listeComptes[index].password);
    
    if (nouveauMdp && nouveauMdp.trim() !== "") {
        listeComptes[index].password = nouveauMdp.trim();
        localStorage.setItem('comptes', JSON.stringify(listeComptes));
        alert("Mot de passe modifié avec succès !");
        afficherListeComptes();
    }
};

// Action de suppression d'un compte
window.supprimerCompte = function(index) {
    let listeComptes = JSON.parse(localStorage.getItem('comptes')) || [];
    if (confirm(`Supprimer définitivement l'accès de ${listeComptes[index].username} ?`)) {
        listeComptes.splice(index, 1);
        localStorage.setItem('comptes', JSON.stringify(listeComptes));
        alert("Compte supprimé !");
        afficherListeComptes();
    }
};

// ====== AFFICHAGE DE LA COMPTA SUR TON PANEL ======
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
                <td style="padding: 12px; border: 1px solid #1f3141;"><strong>${employe}</strong></td>
                <td style="padding: 12px; border: 1px solid #1f3141; text-align: center;">${data.ventes}</td>
                <td style="padding: 12px; border: 1px solid #1f3141; text-align: right; color: #00ffcc; font-weight: bold;">${data.ca} $</td>
            `;
            corpsTableau.appendChild(row);
        });

        if (caTotalElement) caTotalElement.textContent = `${cumulCA} $`;
    }

    if (zoneArchives) {
        const archivesGlobales = JSON.parse(localStorage.getItem('archivesGlobales')) || [];
        zoneArchives.innerHTML = '';
        if (archivesGlobales.length === 0) {
            zoneArchives.innerHTML = '<p style="color: #4b6584; margin: 0; font-size: 14px; font-style: italic;">Aucun flux de données détecté pour le moment.</p>';
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
    if (confirm("Remettre à zéro toutes les fiches ?")) {
        localStorage.removeItem('fichesCompta');
        chargerComptaAdmin();
    }
};

// Lancement automatique au chargement de la page admin
if (document.getElementById('panel-suivi-employes') || document.getElementById('corps-tableau-ca')) {
    chargerComptaAdmin();
    afficherListeComptes(); // On lance l'affichage de la gestion des comptes ici !
}
