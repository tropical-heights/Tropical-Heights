// ====== COMPTES ET INFRASTRUCTURE (LOCALSTORAGE) ======
let comptes = JSON.parse(localStorage.getItem('comptes'));
if (!comptes || comptes.length === 0) {
    comptes = [
        { username: "Boss", password: "admin123", role: "admin" },
        { username: "Employe1", password: "tropical2026", role: "employe" }
    ];
    localStorage.setItem('comptes', JSON.stringify(comptes));
}

// ====== ARTICLES PAR DÉFAUT AVEC PRIX USINE ======
let articlesBoutique = JSON.parse(localStorage.getItem('articlesBoutique'));
if (!articlesBoutique || articlesBoutique.length === 0) {
    articlesBoutique = [
        { nom: "Entrée Simple", prix: 500, prixUsine: 0 },
        { nom: "Entrée VIP", prix: 1500, prixUsine: 0 },
        { nom: "Cocktail Lucky", prix: 200, prixUsine: 100 }
    ];
    localStorage.setItem('articlesBoutique', JSON.stringify(articlesBoutique));
}

// ====== APPLICATION DYNAMIQUE DU THÈME ORANGE ET DU NOM ======
function appliquerThemeEtNom() {
    // 1. Changement des noms de l'enseigne
    const sidebarTitle = document.querySelector('.sidebar h2');
    if (sidebarTitle) sidebarTitle.textContent = "Lucky Plucker";

    const mainTitle = document.querySelector('h1');
    if (mainTitle && (mainTitle.textContent.includes("Tropical") || mainTitle.textContent.includes("Lucky"))) {
        mainTitle.textContent = "Lucky Plucker";
    }

    if (document.title.includes("Tropical Heights")) {
        document.title = document.title.replace("Tropical Heights", "Lucky Plucker");
    }

    // 2. Injection du style Orange / Ambre sans toucher au HTML
    let styleOrange = document.getElementById('theme-orange-style');
    if (!styleOrange) {
        styleOrange = document.createElement('style');
        styleOrange.id = 'theme-orange-style';
        styleOrange.innerHTML = `
            /* Remplacement des touches de couleur par des tons Orange / Ambre */
            .sidebar h2, label, .status-badge, #ca-total, .amount { color: #ff9f43 !important; }
            
            .status-badge { 
                background: rgba(255, 159, 67, 0.1) !important; 
                border-color: rgba(255, 159, 67, 0.3) !important; 
            }
            
            .sidebar-menu li a:hover, .sidebar-menu li a.active { 
                border-color: #ff9f43 !important;
                background: linear-gradient(90deg, #2c1a10 0%, #1a110b 100%) !important;
            }
            
            .btn-submit { 
                background: linear-gradient(90deg, #ff9f43 0%, #ff7675 100%) !important; 
                color: #0b131a !important; 
            }
            
            .btn-submit:hover {
                background: linear-gradient(90deg, #ffb167 0%, #ff8a88 100%) !important;
            }
            
            /* Ajustement pour les boutons du tableau */
            input:focus, select:focus { border-color: #ff9f43 !important; }
        `;
        document.head.appendChild(styleOrange);
    }
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

    const subText = document.querySelector('.sub');
    if (subText && employeConnecte) {
        subText.innerHTML = `Espace Employé — Enregistrement des Ventes (Connecté en tant que : <span id="nom-employe" style="color:#fff; font-weight:bold;">${employeConnecte.username}</span>)`;
    }

    const itemSelect = document.getElementById('itemSelect');
    if (itemSelect) {
        itemSelect.innerHTML = '';
        articlesBoutique.forEach((art, index) => {
            const opt = document.createElement('option');
            opt.value = index; 
            opt.textContent = `${art.nom} (${art.prix}$)`;
            itemSelect.appendChild(opt);
        });
    }

    saleForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const quantityInput = document.getElementById('quantity');
        if (!itemSelect || !quantityInput) return;

        const artIndex = parseInt(itemSelect.value);
        const articleChoisi = articlesBoutique[artIndex];

        if (!articleChoisi) return;

        const itemNom = articleChoisi.nom;
        const itemPrix = articleChoisi.prix;
        const itemPrixUsine = articleChoisi.prixUsine || 0;
        const quantity = parseInt(quantityInput.value) || 1;
        
        const totalVente = itemPrix * quantity;
        const totalBenefice = (itemPrix - itemPrixUsine) * quantity; 

        const nomEmploye = employeConnecte ? employeConnecte.username : "Employe1";

        let fichesCompta = JSON.parse(localStorage.getItem('fichesCompta')) || {};
        if (!fichesCompta[nomEmploye]) {
            fichesCompta[nomEmploye] = { ventes: 0, ca: 0, benefices: 0, detail: {} };
        }
        
        if (!fichesCompta[nomEmploye].detail) fichesCompta[nomEmploye].detail = {};
        if (!fichesCompta[nomEmploye].benefices) fichesCompta[nomEmploye].benefices = 0;

        fichesCompta[nomEmploye].ventes += quantity;
        fichesCompta[nomEmploye].ca += totalVente;
        fichesCompta[nomEmploye].benefices += totalBenefice;
        fichesCompta[nomEmploye].detail[itemNom] = (fichesCompta[nomEmploye].detail[itemNom] || 0) + quantity;
        
        localStorage.setItem('fichesCompta', JSON.stringify(fichesCompta));

        let archivesGlobales = JSON.parse(localStorage.getItem('archivesGlobales')) || [];
        const dateActuelle = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        archivesGlobales.unshift({
            texte: `[${dateActuelle}] ${nomEmploye} a vendu ${quantity}x ${itemNom} (Généré: ${totalVente}$, Bénéfice: ${totalBenefice}$)`
        });
        localStorage.setItem('archivesGlobales', JSON.stringify(archivesGlobales));

        alert(`Vente validée ! Total Généré : ${totalVente} $ | Bénéfice net : ${totalBenefice} $`);
        saleForm.reset();
    });
}

// ====== GESTION DES ACCÈS / INSCRIPTION ======
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
    zoneListe.innerHTML = `<h4 style="margin: 0 0 15px 0; color: #ff9f43; font-size: 15px; text-transform: uppercase;">👥 Liste des comptes actifs</h4>`;

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

// ====== INTERFACE D'AJOUT DES ARTICLES ======
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
        
        const grid = document.querySelector('.dashboard-grid');
        if (grid) grid.appendChild(zoneArticles);
    }

    zoneArticles.innerHTML = `
        <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 18px; color: #ffffff; border-bottom: 1px solid #1f3141; padding-bottom: 12px;">🛍️ Gestion des Articles & Prix</h3>
        <div style="margin-bottom: 15px;">
            <label style="display:block; margin-bottom:5px; color:#a5b1c2; font-size:14px;">Nom du produit :</label>
            <input type="text" id="addArtName" class="form-control" placeholder="Ex: Poulet Frit" style="margin-bottom:10px;">
            
            <label style="display:block; margin-bottom:5px; color:#a5b1c2; font-size:14px;">Prix de vente ($) :</label>
            <input type="number" id="addArtPrice" class="form-control" placeholder="Ex: 200" min="0" style="margin-bottom:10px;">
            
            <label style="display:block; margin-bottom:5px; color:#a5b1c2; font-size:14px;">Prix Usine / Coût de revient ($) :</label>
            <input type="number" id="addArtPriceUsine" class="form-control" placeholder="Ex: 100" min="0" style="margin-bottom:15px;">
            
            <button onclick="ajouterNouvelItem()" class="btn-submit" style="padding:10px;">Ajouter à la boutique</button>
        </div>
        <div id="liste-items-boutique" style="margin-top:15px; border-top:1px solid #1f3141; paddingTop:10px;"></div>
    `;
    afficherListeItemsAdmin();
}

window.ajouterNouvelItem = function() {
    const nameIn = document.getElementById('addArtName');
    const priceIn = document.getElementById('addArtPrice');
    const priceUsineIn = document.getElementById('addArtPriceUsine');
    if (!nameIn || !priceIn || !priceUsineIn) return;

    const nom = nameIn.value.trim();
    const prix = parseInt(priceIn.value) || 0;
    const prixUsine = parseInt(priceUsineIn.value) || 0;

    if (!nom) return;

    let listeArts = JSON.parse(localStorage.getItem('articlesBoutique')) || [];
    listeArts.push({ nom: nom, prix: prix, prixUsine: prixUsine });
    localStorage.setItem('articlesBoutique', JSON.stringify(listeArts));
    articlesBoutique = listeArts;

    nameIn.value = ''; priceIn.value = ''; priceUsineIn.value = '';
    alert(`Article "${nom}" ajouté !`);
    afficherListeItemsAdmin();
};

function afficherListeItemsAdmin() {
    const divListe = document.getElementById('liste-items-boutique');
    if (!divListe) return;

    const listeArts = JSON.parse(localStorage.getItem('articlesBoutique')) || [];
    divListe.innerHTML = '<h5 style="color:#ff9f43; margin:10px 0;">Articles actuels :</h5>';

    listeArts.forEach((art, index) => {
        const row = document.createElement('div');
        row.style = 'display:flex; justify-content:space-between; align-items:center; background:#09121a; padding:8px; border-radius:6px; margin-bottom:5px; border:1px solid #1f3141; font-size:13px;';
        row.innerHTML = `
            <span><strong>${art.nom}</strong> - <span style="color:#fff">Vente: ${art.prix}$</span> | <span style="color:#a5b1c2">Usine: ${art.prixUsine || 0}$</span></span>
            <button onclick="supprimerItem(${index})" style="background:#fc5c65; color:white; border:none; padding:3px 6px; border-radius:4px; cursor:pointer;">❌</button>
        `;
        divListe.appendChild(row);
    });
}

window.modifierMdp = function(index) {
    let listeComptes = JSON.parse(localStorage.getItem('comptes')) || [];
    const nouveauMdp = prompt(`Nouveau mot de passe :`, listeComptes[index].password);
    if (nouveauMdp && nouveauMdp.trim() !== "") {
        listeComptes[index].password = nouveauMdp.trim();
        localStorage.setItem('comptes', JSON.stringify(listeComptes));
        afficherListeComptes();
    }
};

window.supprimerCompte = function(index) {
    let listeComptes = JSON.parse(localStorage.getItem('comptes')) || [];
    if (confirm("Supprimer ce compte ?")) {
        listeComptes.splice(index, 1);
        localStorage.setItem('comptes', JSON.stringify(listeComptes));
        afficherListeComptes();
    }
};

window.supprimerItem = function(index) {
    let listeArts = JSON.parse(localStorage.getItem('articlesBoutique')) || [];
    if (confirm("Supprimer cet article ?")) {
        listeArts.splice(index, 1);
        localStorage.setItem('articlesBoutique', JSON.stringify(listeArts));
        articlesBoutique = listeArts;
        afficherListeItemsAdmin();
    }
};

// ====== AFFICHAGE DE LA COMPTA ======
function chargerComptaAdmin() {
    const corpsTableau = document.getElementById('corps-tableau-ca');
    const zoneArchives = document.getElementById('archives-globales');
    const caTotalElement = document.getElementById('ca-total');

    const caText = document.querySelector('.ca-box p');
    if (caText) caText.textContent = "Chiffre d'Affaires Global Lucky Plucker";

    const tableHeader = document.querySelector('table thead tr');
    if (tableHeader) {
        tableHeader.innerHTML = `
            <th>Identifiant Collaborateur</th>
            <th style="text-align: center;">Volumes Ventes</th>
            <th style="text-align: right;">Total Généré</th>
            <th style="text-align: right; color:#ff9f43;">Total Bénéfices</th>
        `;
    }

    if (corpsTableau) {
        const fichesCompta = JSON.parse(localStorage.getItem('fichesCompta')) || {};
        corpsTableau.innerHTML = '';
        let cumulCA = 0;

        Object.keys(fichesCompta).forEach((employe, idx) => {
            const data = fichesCompta[employe];
            cumulCA += data.ca;
            const beneficeEmploye = data.benefices || 0;

            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            row.title = "Cliquez pour voir/masquer le détail";
            row.onclick = () => {
                const subRow = document.getElementById(`detail-${idx}`);
                if(subRow) subRow.style.display = (subRow.style.display === 'none') ? 'table-row' : 'none';
            };

            row.innerHTML = `
                <td style="padding: 14px; border: 1px solid #1f3141;">👉 <strong>${employe}</strong> <span style="font-size:11px; color:#a5b1c2;">(détail)</span></td>
                <td style="padding: 14px; border: 1px solid #1f3141; text-align: center;">${data.ventes}</td>
                <td style="padding: 14px; border: 1px solid #1f3141; text-align: right; font-weight: bold; color: #ffffff;">${data.ca} $</td>
                <td style="padding: 14px; border: 1px solid #1f3141; text-align: right; font-weight: bold; color: #ff9f43;">${beneficeEmploye} $</td>
            `;
            corpsTableau.appendChild(row);

            const subRow = document.createElement('tr');
            subRow.id = `detail-${idx}`;
            subRow.style.display = 'none';
            
            let htmlDetail = `<ul style="margin:0; padding-left:20px; color:#a5b1c2; font-size:13px; line-height:1.6;">`;
            if (data.detail && Object.keys(data.detail).length > 0) {
                Object.keys(data.detail).forEach(prod => {
                    htmlDetail += `<li><strong style="color:#fff;">${data.detail[prod]}x</strong> ${prod}</li>`;
                });
            } else {
                htmlDetail += `<li>Aucun détail disponible</li>`;
            }
            htmlDetail += `</ul>`;

            subRow.innerHTML = `
                <td colspan="4" style="background-color: #09121a; border: 1px solid #1f3141; padding: 15px;">
                    <span style="color:#ff9f43; font-size:12px; font-weight:bold; text-transform:uppercase; display:block; margin-bottom:8px;">📦 Articles vendus :</span>
                    ${htmlDetail}
                </td>
            `;
            corpsTableau.appendChild(subRow);
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

// Lancement global au chargement du DOM
document.addEventListener("DOMContentLoaded", function() {
    appliquerThemeEtNom();
    if (document.getElementById('panel-suivi-employes') || document.getElementById('corps-tableau-ca')) {
        chargerComptaAdmin();
        afficherListeComptes();
        initialiserGestionArticlesAdmin();
    }
});
