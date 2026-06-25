// ====== COMPTES ET INFRASTRUCTURE (LOCALSTORAGE) ======
let comptes = JSON.parse(localStorage.getItem('comptes'));
if (!comptes || comptes.length === 0) {
    comptes = [
        { username: "Boss", password: "admin123", role: "admin" },
        { username: "Employe1", password: "tropical2026", role: "employe" }
    ];
    localStorage.setItem('comptes', JSON.stringify(comptes));
}

// ====== ARTICLES PAR DÉFAUT SI LA MÉMOIRE EST VIDE ======
let articlesBoutique = JSON.parse(localStorage.getItem('articlesBoutique'));
if (!articlesBoutique || articlesBoutique.length === 0) {
    articlesBoutique = [
        { nom: "Entrée Simple", prix: 500 },
        { nom: "Entrée VIP", prix: 1500 },
        { nom: "Cocktail Tropical", prix: 200 }
    ];
    localStorage.setItem('articlesBoutique', JSON.stringify(articlesBoutique));
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

    // Charger dynamiquement les articles dans le select de l'employé
    const itemSelect = document.getElementById('itemSelect');
    if (itemSelect) {
        itemSelect.innerHTML = '';
        articlesBoutique.forEach(art => {
            const opt = document.createElement('option');
            opt.value = art.prix;
            opt.textContent = `${art.nom} (${art.prix}$)`;
            itemSelect.appendChild(opt);
        });
    }

    saleForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const quantityInput = document.getElementById('quantity');
        if (!itemSelect || !quantityInput) return;

        const itemNom = itemSelect.options[itemSelect.selectedIndex].text;
        const itemPrix = parseInt(itemSelect.value) || 0;
        const quantity = parseInt(quantityInput.value) || 1;
        
        const totalVente = itemPrix * quantity;
        const nomEmploye = employeConnecte ? employeConnecte.username : "Employe1";

        let fichesCompta = JSON.parse(localStorage.getItem('fichesCompta')) || {};
        if (!fichesCompta[nomEmploye]) {
            fichesCompta[nomEmploye] = { ventes: 0, ca: 0 };
        }
        fichesCompta[nomEmploye].ventes += quantity;
        fichesCompta[nomEmploye].ca += totalVente;
        localStorage.setItem('fichesCompta', JSON.stringify(fichesCompta));

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

        let listeComptes = JSON.parse(localStorage.getItem('comptes')) || [];
        if (listeComptes.some(c => c.username.toLowerCase() === newRegUser.toLowerCase())) {
            alert("Cet utilisateur existe déjà !");
            return;
        }

        listeComptes.push({ username: newRegUser, password: newRegPass, role: newRegRole });
        localStorage.setItem('comptes', JSON.stringify(listeComptes));
        
        alert(`Le compte de ${newRegUser} a été créé !`);
        registerForm.reset();
        afficherListeComptes();
    });
}

// ====== FONCTIONS EN PLUS POUR LES COMPTES ET ARTICLES (S'INJECTENT SANS CHANGER LE HTML) ======
function afficherListeComptes() {
    const formAdmin = document.getElementById('registerForm');
    if (!formAdmin) return;

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
        item.style = 'display: flex; justify-content: space-between; align-items: center; background: #09121a; padding: 10px; border-radius: 6px; margin-bottom: 10px; font-size: 14px; border: 1px solid #1f3141;';
        item.innerHTML = `
            <div>
                <strong style="color: #fff;">${compte.username}</strong> <span style="color: #a5b1c2; font-size: 12px;">(${compte.role})</span><br>
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

function initialiserGestionArticlesAdmin() {
    const panelAdmin = document.getElementById('panel-suivi-employes');
    if (!panelAdmin) return;

    let zoneArticles = document.getElementById('carte-gestion-articles-auto');
    if (!zoneArticles) {
        zoneArticles = document.createElement('div');
        zoneArticles.id = 'carte-gestion-articles-auto';
        zoneArticles.className = 'card';
        zoneArticles.style.background = '#121f2b';
        zoneArticles.style.border = '1px solid #1f3141';
        zoneArticles.style.borderRadius = '10px';
        zoneArticles.style.padding = '25px';
        zoneArticles.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.4)';
        zoneArticles.style.boxSizing = 'border-box';
        
        // On l'injecte juste avant le journal d'activité
        const grid = document.querySelector('.dashboard-grid');
        if (grid) {
            grid.appendChild(zoneArticles);
        }
    }

    zoneArticles.innerHTML = `
        <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 18px; color: #ffffff; border-bottom: 1px solid #1f3141; padding-bottom: 12px;">🛍️ Gestion des Articles & Prix</h3>
        <div style="margin-bottom: 15px;">
            <label style="display:block; margin-bottom:5px; color:#a5b1c2; font-size:14px;">Nom du produit :</label>
            <input type="text" id="addArtName" class="form-control" placeholder="Ex: Bière" style="margin-bottom:10px;">
            <label style="display:block; margin-bottom:5px; color:#a5b1c2; font-size:14px;">Prix ($) :</label>
            <input type="number" id="addArtPrice" class="form-control" placeholder="Ex: 150" min="0" style="margin-bottom:15px;">
            <button onclick="ajouterNouvelItem()" class="btn-submit" style="padding:10px;">Ajouter à la boutique</button>
        </div>
        <div id="liste-items-boutique" style="margin-top:15px; border-top:1px solid #1f3141; paddingTop:10px;"></div>
    `;
    afficherListeItemsAdmin();
}

window.ajouterNouvelItem = function() {
    const nameIn = document.getElementById('addArtName');
    const priceIn = document.getElementById('addArtPrice');
    if (!nameIn || !priceIn) return;

    const nom = nameIn.value.trim();
    const prix = parseInt(priceIn.value) || 0;

    if (!nom) { alert("Indique un nom !"); return; }

    let listeArts = JSON.parse(localStorage.getItem('articlesBoutique')) || [];
    listeArts.push({ nom: nom, prix: prix });
    localStorage.setItem('articlesBoutique', JSON.stringify(listeArts));
    articlesBoutique = listeArts;

    nameIn.value = '';
    priceIn.value = '';
    alert(`Article "${nom}" ajouté !`);
    afficherListeItemsAdmin();
};

function afficherListeItemsAdmin() {
    const divListe = document.getElementById('liste-items-boutique');
    if (!divListe) return;

    const listeArts = JSON.parse(localStorage.getItem('articlesBoutique')) || [];
    divListe.innerHTML = '<h5 style="color:#00ffcc; margin:10px 0;">Articles actuels :</h5>';

    listeArts.forEach((art, index) => {
        const row = document.createElement('div');
        row.style = 'display:flex; justify-content:space-between; align-items:center; background:#09121a; padding:8px; border-radius:6px; margin-bottom:5px; border:1px solid #1f3141; font-size:13px;';
        row.innerHTML = `
            <span><strong>${art.nom}</strong> - <span style="color:#00ffcc">${art.prix}$</span></span>
            <button onclick="supprimerItem(${index})" style="background:#fc5c65; color:white; border:none; padding:3px 6px; border-radius:4px; cursor:pointer;">❌</button>
        `;
        divListe.appendChild(row);
    });
}

window.modifierMdp = function(index) {
    let listeComptes = JSON.parse(localStorage.getItem('comptes')) || [];
    const nouveauMdp = prompt(`Nouveau mot de passe pour ${listeComptes[index].username} :`, listeComptes[index].password);
    if (nouveauMdp && nouveauMdp.trim() !== "") {
        listeComptes[index].password = nouveauMdp.trim();
        localStorage.setItem('comptes', JSON.stringify(listeComptes));
        afficherListeComptes();
    }
};

window.supprimerCompte = function(index) {
    let listeComptes = JSON.parse(localStorage.getItem('comptes')) || [];
    if (confirm(`Supprimer l'accès de ${listeComptes[index].username} ?`)) {
        listeComptes.splice(index, 1);
        localStorage.setItem('comptes', JSON.stringify(listeComptes));
        afficherListeComptes();
    }
};

window.supprimerItem = function(index) {
    let listeArts = JSON.parse(localStorage.getItem('articlesBoutique')) || [];
    if (confirm(`Supprimer l'article "${listeArts[index].nom}" ?`)) {
        listeArts.splice(index, 1);
        localStorage.setItem('articlesBoutique', JSON.stringify(listeArts));
        articlesBoutique = listeArts;
        afficherListeItemsAdmin();
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
                p.style.color = "#ecf0f1"; p.style.margin = "5px 0"; p.style.fontSize = "14px";
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
    afficherListeComptes();
    initialiserGestionArticlesAdmin();
}
