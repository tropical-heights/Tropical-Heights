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
const registerForm = document.getElementById('registerForm') || document.querySelector('form[action*="register"]') || document.querySelector('.admin-container form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // On essaie de choper tes inputs, peu importe leur ID
        const userField = document.getElementById('newUsername') || registerForm.querySelector('input[type="text"]');
        const passField = document.getElementById('newPassword') || registerForm.querySelector('input[type="password"]');
        const roleField = document.getElementById('newRole') || registerForm.querySelector('select');

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
    });
}

// ====== AFFICHAGE DE LA COMPTA SUR TON PANEL ======
function chargerComptaAdmin() {
    const corpsTableau = document.getElementById('corps-tableau-ca') || document.querySelector('tbody');
    const zoneArchives = document.getElementById('archives-globales') || document.querySelector('.archives, .journal');
    const caTotalElement = document.getElementById('ca-total') || document.querySelector('.total, #total');

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
            zoneArchives.innerHTML = '<p style="color: #666; margin: 0;">Aucun historique enregistré.</p>';
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

// Se lance peu importe les ID trouvés dans ton HTML
chargerComptaAdmin();
