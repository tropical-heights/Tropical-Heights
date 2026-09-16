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
        { nom: "Cocktail Tropical", prix: 200, prixUsine: 100 }
    ];
    localStorage.setItem('articlesBoutique', JSON.stringify(articlesBoutique));
}

// ====== APPLICATION DU NOM, DU LOGO ET DU THÈME UNIQUE BAR PLAGE ======
function appliquerThemeEtNom() {
    const sidebarTitle = document.querySelector('.sidebar h2');
    if (sidebarTitle) sidebarTitle.textContent = "Bar Plage";

    const mainTitle = document.querySelector('h1');
    if (mainTitle && (mainTitle.textContent.includes("Tropical") || mainTitle.textContent.includes("Lucky"))) {
        mainTitle.textContent = "Bar Plage";
    }

    if (document.title.includes("Tropical Heights") || document.title.includes("Lucky Plucker")) {
        document.title = document.title
            .replace("Tropical Heights", "Bar Plage")
            .replace("Lucky Plucker", "Bar Plage");
    }

    // ====== LOGO ======
    // bar-plage.png doit être dans le même dossier que script.js
    const logoSrc = "bar-plage.png";
    const sidebar = document.querySelector('.sidebar');

    if (sidebar && !sidebar.querySelector('.bar-plage-logo')) {
        const logo = document.createElement('img');
        logo.className = 'bar-plage-logo';
        logo.src = logoSrc;
        logo.alt = 'Logo Bar Plage';

        logo.onerror = function() {
            this.style.display = 'none';
        };

        sidebar.insertBefore(logo, sidebar.firstChild);
    }

    // ====== THÈME UNIQUE BAR PLAGE ======
    let styleBarPlage = document.getElementById('theme-bar-plage-style');

    if (!styleBarPlage) {
        styleBarPlage = document.createElement('style');
        styleBarPlage.id = 'theme-bar-plage-style';

        styleBarPlage.textContent = `
            :root {
                --bp-bg: #071A24;
                --bp-bg2: #0B2633;
                --bp-card: #0F3340;
                --bp-border: #174958;
                --bp-main: #19D3C5;
                --bp-main-soft: rgba(25, 211, 197, 0.12);
                --bp-text: #FFFFFF;
                --bp-muted: #9DB4BC;
            }

            body {
                background: var(--bp-bg) !important;
                color: var(--bp-text) !important;
            }

            .sidebar,
            .login-container,
            .login-box,
            .card,
            .ca-box {
                background: var(--bp-bg2) !important;
                border-color: var(--bp-border) !important;
            }

            .sidebar h2,
            h1,
            h2,
            h3,
            h4,
            h5,
            label,
            .status-badge,
            #ca-total,
            .amount {
                color: var(--bp-main) !important;
            }

            .bar-plage-logo {
                display: block !important;
                width: 150px !important;
                height: auto !important;
                max-height: 105px !important;
                object-fit: contain !important;
                margin: 0 auto 18px !important;
            }

            .sidebar-menu li a {
                color: var(--bp-muted) !important;
                border-color: transparent !important;
            }

            .sidebar-menu li a:hover,
            .sidebar-menu li a.active {
                color: var(--bp-main) !important;
                background: var(--bp-main-soft) !important;
                border-color: var(--bp-main) !important;
            }

            input,
            select,
            textarea,
            .form-control {
                background: #091F2A !important;
                color: var(--bp-text) !important;
                border-color: var(--bp-border) !important;
            }

            input:focus,
            select:focus,
            textarea:focus {
                border-color: var(--bp-main) !important;
                outline: none !important;
                box-shadow: 0 0 0 2px rgba(25, 211, 197, 0.12) !important;
            }

            .btn-submit,
            #loginForm button,
            button[type="submit"] {
                background: var(--bp-main) !important;
                color: #071A24 !important;
                border: none !important;
            }

            .btn-submit:hover,
            #loginForm button:hover,
            button[type="submit"]:hover {
                background: #22E6D7 !important;
            }

            table th {
                background: #12313D !important;
                color: var(--bp-main) !important;
                border-color: var(--bp-border) !important;
            }

            table td {
                background: #0C2732 !important;
                color: var(--bp-text) !important;
                border-color: var(--bp-border) !important;
            }

            .status-badge {
                background: var(--bp-main-soft) !important;
                border-color: var(--bp-main) !important;
            }

            .log-flux {
                background: #06151D !important;
                border-color: var(--bp-border) !important;
            }

            .btn-danger,
            .btn-logout {
                background: #12313D !important;
                color: var(--bp-main) !important;
                border-color: var(--bp-border) !important;
            }
        `;

        document.head.appendChild(styleBarPlage);
    }
}

// ====== GESTION DE LA CONNEXION (INDEX.HTML) ======
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        const fecthComptes =
            JSON.parse(localStorage.getItem('comptes')) || comptes;

        const compteTrouve = fecthComptes.find(
            c => c.username === usernameInput && c.password === passwordInput
        );

        if (compteTrouve) {
            localStorage.setItem(
                'compteConnecte',
                JSON.stringify(compteTrouve)
            );

            if (
                compteTrouve.username === "Boss" ||
                compteTrouve.role === "admin"
            ) {
                window.location.href = 'admin.html';
            } else if (compteTrouve.role === "entreprise") {
                localStorage.setItem(
                    'entrepriseConnectee',
                    compteTrouve.username
                );
                window.location.href = 'commandes.html';
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
    const employeConnecte =
        JSON.parse(localStorage.getItem('compteConnecte'));

    const nomEmployeData =
        document.getElementById('nom-employe');

    if (nomEmployeData && employeConnecte) {
        nomEmployeData.textContent = employeConnecte.username;
    }

    const subText = document.querySelector('.sub');

    if (subText && employeConnecte) {
        subText.innerHTML =
            `Espace Employé — Enregistrement des Ventes ` +
            `(Connecté en tant que : ` +
            `<span id="nom-employe" style="color:#fff; font-weight:bold;">` +
            `${employeConnecte.username}</span>)`;
    }

    const itemSelect =
        document.getElementById('itemSelect');

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

        const quantityInput =
            document.getElementById('quantity');

        if (!itemSelect || !quantityInput) return;

        const artIndex =
            parseInt(itemSelect.value);

        const articleChoisi =
            articlesBoutique[artIndex];

        if (!articleChoisi) return;

        const itemNom = articleChoisi.nom;
        const itemPrix = articleChoisi.prix;
        const itemPrixUsine =
            articleChoisi.prixUsine || 0;

        const quantity =
            parseInt(quantityInput.value) || 1;

        const totalVente =
            itemPrix * quantity;

        const totalBenefice =
            (itemPrix - itemPrixUsine) * quantity;

        const nomEmploye =
            employeConnecte
                ? employeConnecte.username
                : "Employe1";

        let fichesCompta =
            JSON.parse(localStorage.getItem('fichesCompta')) || {};

        if (!fichesCompta[nomEmploye]) {
            fichesCompta[nomEmploye] = {
                ventes: 0,
                ca: 0,
                benefices: 0,
                detail: {}
            };
        }

        if (!fichesCompta[nomEmploye].detail) {
            fichesCompta[nomEmploye].detail = {};
        }

        if (!fichesCompta[nomEmploye].benefices) {
            fichesCompta[nomEmploye].benefices = 0;
        }

        fichesCompta[nomEmploye].ventes += quantity;
        fichesCompta[nomEmploye].ca += totalVente;
        fichesCompta[nomEmploye].benefices += totalBenefice;

        fichesCompta[nomEmploye].detail[itemNom] =
            (fichesCompta[nomEmploye].detail[itemNom] || 0) +
            quantity;

        localStorage.setItem(
            'fichesCompta',
            JSON.stringify(fichesCompta)
        );

        let archivesGlobales =
            JSON.parse(localStorage.getItem('archivesGlobales')) || [];

        const dateActuelle =
            new Date().toLocaleTimeString(
                'fr-FR',
                {
                    hour: '2-digit',
                    minute: '2-digit'
                }
            );

        archivesGlobales.unshift({
            texte:
                `[${dateActuelle}] ${nomEmploye} a vendu ` +
                `${quantity}x ${itemNom} ` +
                `(Généré: ${totalVente}$, ` +
                `Bénéfice: ${totalBenefice}$)`
        });

        localStorage.setItem(
            'archivesGlobales',
            JSON.stringify(archivesGlobales)
        );

        alert(
            `Vente validée ! Total Généré : ${totalVente} $ | ` +
            `Bénéfice net : ${totalBenefice} $`
        );

        saleForm.reset();
    });
}

// ====== GESTION DES ACCÈS / INSCRIPTION ======
const registerForm =
    document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const userField =
            document.getElementById('newUsername');

        const passField =
            document.getElementById('newPassword');

        const roleField =
            document.getElementById('newRole');

        if (!userField || !passField) return;

        const newRegUser =
            userField.value.trim();

        const newRegPass =
            passField.value.trim();

        const newRegRole =
            roleField
                ? roleField.value
                : "employe";

        let listeComptes =
            JSON.parse(localStorage.getItem('comptes')) || [];

        if (
            listeComptes.some(
                c =>
                    c.username.toLowerCase() ===
                    newRegUser.toLowerCase()
            )
        ) {
            alert("Cet utilisateur existe déjà !");
            return;
        }

        listeComptes.push({
            username: newRegUser,
            password: newRegPass,
            role: newRegRole
        });

        localStorage.setItem(
            'comptes',
            JSON.stringify(listeComptes)
        );

        alert(
            `Le compte de ${newRegUser} a été créé !`
        );

        registerForm.reset();

        afficherListeComptes();
    });
}

function afficherListeComptes() {
    const formAdmin =
        document.getElementById('registerForm');

    if (!formAdmin) return;

    let zoneListe =
        document.getElementById('liste-gestion-comptes');

    if (!zoneListe) {
        zoneListe = document.createElement('div');

        zoneListe.id =
            'liste-gestion-comptes';

        zoneListe.style.marginTop = '25px';
        zoneListe.style.borderTop =
            '1px solid #174958';

        zoneListe.style.paddingTop = '15px';

        formAdmin.parentNode.appendChild(
            zoneListe
        );
    }

    const listeComptes =
        JSON.parse(localStorage.getItem('comptes')) || [];

    zoneListe.innerHTML =
        `<h4 style="margin:0 0 15px 0; color:#19D3C5; font-size:15px; text-transform:uppercase;">
            👥 Liste des comptes actifs
        </h4>`;

    listeComptes.forEach((compte, index) => {
        const item =
            document.createElement('div');

        item.style =
            'display:flex; justify-content:space-between; ' +
            'align-items:center; background:#091F2A; ' +
            'padding:10px; border-radius:6px; ' +
            'margin-bottom:10px; font-size:14px; ' +
            'border:1px solid #174958;';

        item.innerHTML = `
            <div>
                <strong style="color:#fff;">
                    ${compte.username}
                </strong>

                <span style="color:#19D3C5; font-size:12px;">
                    (${compte.role})
                </span>

                <br>

                <span style="color:#19D3C5; font-size:12px;">
                    MDP: ${compte.password}
                </span>
            </div>

            <div style="display:flex; gap:8px;">
                <button
                    onclick="modifierMdp(${index})"
                    style="
                        background:#19D3C5;
                        color:#071A24;
                        border:none;
                        padding:5px 8px;
                        border-radius:4px;
                        cursor:pointer;
                        font-size:12px;
                    "
                >
                    ✏️
                </button>

                <button
                    onclick="supprimerCompte(${index})"
                    style="
                        background:#12313D;
                        color:#19D3C5;
                        border:1px solid #174958;
                        padding:5px 8px;
                        border-radius:4px;
                        cursor:pointer;
                        font-size:12px;
                    "
                    ${compte.username === 'Boss'
                        ? 'disabled style="opacity:0.3; cursor:default;"'
                        : ''}
                >
                    ❌
                </button>
            </div>
        `;

        zoneListe.appendChild(item);
    });
}

// ====== INTERFACE D'AJOUT DES ARTICLES ======
function initialiserGestionArticlesAdmin() {
    const panelAdmin =
        document.getElementById('panel-suivi-employes');

    if (!panelAdmin) return;

    let zoneArticles =
        document.getElementById(
            'carte-gestion-articles-auto'
        );

    if (!zoneArticles) {
        zoneArticles =
            document.createElement('div');

        zoneArticles.id =
            'carte-gestion-articles-auto';

        zoneArticles.className = 'card';

        zoneArticles.style.background =
            '#0B2633';

        zoneArticles.style.border =
            '1px solid #174958';

        zoneArticles.style.borderRadius =
            '10px';

        zoneArticles.style.padding =
            '25px';

        zoneArticles.style.boxShadow =
            '0 6px 18px rgba(0,0,0,0.4)';

        zoneArticles.style.boxSizing =
            'border-box';

        const grid =
            document.querySelector(
                '.dashboard-grid'
            );

        if (grid) {
            grid.appendChild(zoneArticles);
        }
    }

    zoneArticles.innerHTML = `
        <h3 style="
            margin-top:0;
            margin-bottom:20px;
            font-size:18px;
            color:#19D3C5;
            border-bottom:1px solid #174958;
            padding-bottom:12px;
        ">
            🛍️ Gestion des Articles & Prix
        </h3>

        <div style="margin-bottom:15px;">

            <label style="
                display:block;
                margin-bottom:5px;
                color:#9DB4BC;
                font-size:14px;
            ">
                Nom du produit :
            </label>

            <input
                type="text"
                id="addArtName"
                class="form-control"
                placeholder="Ex: Poulet Frit"
                style="margin-bottom:10px;"
            >

            <label style="
                display:block;
                margin-bottom:5px;
                color:#9DB4BC;
                font-size:14px;
            ">
                Prix de vente ($) :
            </label>

            <input
                type="number"
                id="addArtPrice"
                class="form-control"
                placeholder="Ex: 200"
                min="0"
                style="margin-bottom:10px;"
            >

            <label style="
                display:block;
                margin-bottom:5px;
                color:#9DB4BC;
                font-size:14px;
            ">
                Prix Usine / Coût de revient ($) :
            </label>

            <input
                type="number"
                id="addArtPriceUsine"
                class="form-control"
                placeholder="Ex: 100"
                min="0"
                style="margin-bottom:15px;"
            >

            <button
                onclick="ajouterNouvelItem()"
                class="btn-submit"
                style="padding:10px;"
            >
                Ajouter à la boutique
            </button>

        </div>

        <div
            id="liste-items-boutique"
            style="
                margin-top:15px;
                border-top:1px solid #174958;
                padding-top:10px;
            "
        ></div>
    `;

    afficherListeItemsAdmin();
}

window.ajouterNouvelItem = function() {
    const nameIn =
        document.getElementById('addArtName');

    const priceIn =
        document.getElementById('addArtPrice');

    const priceUsineIn =
        document.getElementById('addArtPriceUsine');

    if (!nameIn || !priceIn || !priceUsineIn) {
        return;
    }

    const nom =
        nameIn.value.trim();

    const prix =
        parseInt(priceIn.value) || 0;

    const prixUsine =
        parseInt(priceUsineIn.value) || 0;

    if (!nom) return;

    let listeArts =
        JSON.parse(
            localStorage.getItem('articlesBoutique')
        ) || [];

    listeArts.push({
        nom: nom,
        prix: prix,
        prixUsine: prixUsine
    });

    localStorage.setItem(
        'articlesBoutique',
        JSON.stringify(listeArts)
    );

    articlesBoutique = listeArts;

    nameIn.value = '';
    priceIn.value = '';
    priceUsineIn.value = '';

    alert(`Article "${nom}" ajouté !`);

    afficherListeItemsAdmin();
};

function afficherListeItemsAdmin() {
    const divListe =
        document.getElementById(
            'liste-items-boutique'
        );

    if (!divListe) return;

    const listeArts =
        JSON.parse(
            localStorage.getItem('articlesBoutique')
        ) || [];

    divListe.innerHTML =
        `<h5 style="color:#19D3C5; margin:10px 0;">
            Articles actuels :
        </h5>`;

    listeArts.forEach((art, index) => {
        const row =
            document.createElement('div');

        row.style =
            'display:flex; justify-content:space-between; ' +
            'align-items:center; background:#091F2A; ' +
            'padding:8px; border-radius:6px; ' +
            'margin-bottom:5px; border:1px solid #174958; ' +
            'font-size:13px;';

        row.innerHTML = `
            <span>
                <strong>${art.nom}</strong>
                -
                <span style="color:#fff">
                    Vente: ${art.prix}$
                </span>
                |
                <span style="color:#9DB4BC">
                    Usine: ${art.prixUsine || 0}$
                </span>
            </span>

            <button
                onclick="supprimerItem(${index})"
                style="
                    background:#12313D;
                    color:#19D3C5;
                    border:1px solid #174958;
                    padding:3px 6px;
                    border-radius:4px;
                    cursor:pointer;
                "
            >
                ❌
            </button>
        `;

        divListe.appendChild(row);
    });
}

window.modifierMdp = function(index) {
    let listeComptes =
        JSON.parse(
            localStorage.getItem('comptes')
        ) || [];

    const nouveauMdp =
        prompt(
            `Nouveau mot de passe :`,
            listeComptes[index].password
        );

    if (
        nouveauMdp &&
        nouveauMdp.trim() !== ""
    ) {
        listeComptes[index].password =
            nouveauMdp.trim();

        localStorage.setItem(
            'comptes',
            JSON.stringify(listeComptes)
        );

        afficherListeComptes();
    }
};

window.supprimerCompte = function(index) {
    let listeComptes =
        JSON.parse(
            localStorage.getItem('comptes')
        ) || [];

    if (confirm("Supprimer ce compte ?")) {
        listeComptes.splice(index, 1);

        localStorage.setItem(
            'comptes',
            JSON.stringify(listeComptes)
        );

        afficherListeComptes();
    }
};

window.supprimerItem = function(index) {
    let listeArts =
        JSON.parse(
            localStorage.getItem('articlesBoutique')
        ) || [];

    if (confirm("Supprimer cet article ?")) {
        listeArts.splice(index, 1);

        localStorage.setItem(
            'articlesBoutique',
            JSON.stringify(listeArts)
        );

        articlesBoutique = listeArts;

        afficherListeItemsAdmin();
    }
};

// ====== AFFICHAGE DE LA COMPTA ======
function chargerComptaAdmin() {
    const corpsTableau =
        document.getElementById(
            'corps-tableau-ca'
        );

    const zoneArchives =
        document.getElementById(
            'archives-globales'
        );

    const caTotalElement =
        document.getElementById('ca-total');

    const caText =
        document.querySelector('.ca-box p');

    if (caText) {
        caText.textContent =
            "Chiffre d'Affaires Global Bar Plage";
    }

    const tableHeader =
        document.querySelector(
            'table thead tr'
        );

    if (tableHeader) {
        tableHeader.innerHTML = `
            <th>Identifiant Collaborateur</th>
            <th style="text-align:center;">
                Volumes Ventes
            </th>
            <th style="text-align:right;">
                Total Généré
            </th>
            <th style="
                text-align:right;
                color:#19D3C5;
            ">
                Total Bénéfices
            </th>
        `;
    }

    let cumulCA = 0;

    if (corpsTableau) {
        const fichesCompta =
            JSON.parse(
                localStorage.getItem('fichesCompta')
            ) || {};

        corpsTableau.innerHTML = '';

        Object.keys(fichesCompta).forEach(
            (employe, idx) => {
                const data =
                    fichesCompta[employe];

                cumulCA += data.ca;

                const beneficeEmploye =
                    data.benefices || 0;

                const row =
                    document.createElement('tr');

                row.style.cursor = 'pointer';
                row.title =
                    "Cliquez pour voir/masquer le détail";

                row.onclick = () => {
                    const subRow =
                        document.getElementById(
                            `detail-${idx}`
                        );

                    if (subRow) {
                        subRow.style.display =
                            subRow.style.display ===
                            'none'
                                ? 'table-row'
                                : 'none';
                    }
                };

                row.innerHTML = `
                    <td style="
                        padding:14px;
                        border:1px solid #174958;
                    ">
                        👉
                        <strong>${employe}</strong>
                        <span style="
                            font-size:11px;
                            color:#9DB4BC;
                        ">
                            (détail)
                        </span>
                    </td>

                    <td style="
                        padding:14px;
                        border:1px solid #174958;
                        text-align:center;
                    ">
                        ${data.ventes}
                    </td>

                    <td style="
                        padding:14px;
                        border:1px solid #174958;
                        text-align:right;
                        font-weight:bold;
                        color:#ffffff;
                    ">
                        ${data.ca} $
                    </td>

                    <td style="
                        padding:14px;
                        border:1px solid #174958;
                        text-align:right;
                        font-weight:bold;
                        color:#19D3C5;
                    ">
                        ${beneficeEmploye} $
                    </td>
                `;

                corpsTableau.appendChild(row);

                const subRow =
                    document.createElement('tr');

                subRow.id =
                    `detail-${idx}`;

                subRow.style.display = 'none';

                let htmlDetail =
                    `<ul style="
                        margin:0;
                        padding-left:20px;
                        color:#9DB4BC;
                        font-size:13px;
                        line-height:1.6;
                    ">`;

                if (
                    data.detail &&
                    Object.keys(data.detail).length > 0
                ) {
                    Object.keys(data.detail).forEach(
                        prod => {
                            htmlDetail += `
                                <li>
                                    <strong style="color:#fff;">
                                        ${data.detail[prod]}x
                                    </strong>
                                    ${prod}
                                </li>
                            `;
                        }
                    );
                } else {
                    htmlDetail +=
                        `<li>Aucun détail disponible</li>`;
                }

                htmlDetail += `</ul>`;

                subRow.innerHTML = `
                    <td colspan="4" style="
                        background-color:#091F2A;
                        border:1px solid #174958;
                        padding:15px;
                    ">
                        <span style="
                            color:#19D3C5;
                            font-size:12px;
                            font-weight:bold;
                            text-transform:uppercase;
                            display:block;
                            margin-bottom:8px;
                        ">
                            📦 Articles vendus :
                        </span>

                        ${htmlDetail}
                    </td>
                `;

                corpsTableau.appendChild(
                    subRow
                );
            }
        );
    }

    // ====== COMMANDES ENTREPRISES DANS LE CA GLOBAL ======
    const commandes =
        JSON.parse(
            localStorage.getItem('commandesGlobales')
        ) || [];

    const listeArtsBoutique =
        JSON.parse(
            localStorage.getItem('articlesBoutique')
        ) || articlesBoutique;

    commandes.forEach(cmd => {
        if (
            cmd.details &&
            Array.isArray(cmd.details)
        ) {
            cmd.details.forEach(p => {
                const artBoutique =
                    listeArtsBoutique.find(
                        a => a.nom === p.article
                    );

                const prixUnitaire =
                    artBoutique
                        ? artBoutique.prix
                        : 0;

                cumulCA +=
                    prixUnitaire * p.quantite;
            });
        } else if (
            cmd.article &&
            cmd.quantite
        ) {
            const artBoutique =
                listeArtsBoutique.find(
                    a => a.nom === cmd.article
                );

            const prixUnitaire =
                artBoutique
                    ? artBoutique.prix
                    : 0;

            cumulCA +=
                prixUnitaire *
                (parseInt(cmd.quantite) || 0);
        }
    });

    if (caTotalElement) {
        caTotalElement.textContent =
            `${cumulCA} $`;
    }

    if (zoneArchives) {
        const archivesGlobales =
            JSON.parse(
                localStorage.getItem('archivesGlobales')
            ) || [];

        zoneArchives.innerHTML = '';

        if (
            archivesGlobales.length === 0
        ) {
            zoneArchives.innerHTML =
                `<p style="
                    color:#9DB4BC;
                    margin:0;
                    font-size:14px;
                    font-style:italic;
                ">
                    Aucun flux de données détecté pour le moment.
                </p>`;
        } else {
            archivesGlobales.forEach(
                archive => {
                    const p =
                        document.createElement('p');

                    p.style.color =
                        "#FFFFFF";

                    p.style.margin =
                        "5px 0";

                    p.style.fontSize =
                        "14px";

                    p.innerHTML =
                        archive.texte;

                    zoneArchives.appendChild(p);
                }
            );
        }
    }
}

window.remiseAZeroFiches = function() {
    if (
        confirm(
            "Remettre à zéro toutes les fiches ?"
        )
    ) {
        localStorage.removeItem(
            'fichesCompta'
        );

        localStorage.removeItem(
            'commandesGlobales'
        );

        chargerComptaAdmin();
    }
};

// ====== LANCEMENT GLOBAL ======
document.addEventListener(
    "DOMContentLoaded",
    function() {
        appliquerThemeEtNom();

        if (
            document.getElementById(
                'panel-suivi-employes'
            ) ||
            document.getElementById(
                'corps-tableau-ca'
            )
        ) {
            chargerComptaAdmin();
            afficherListeComptes();
            initialiserGestionArticlesAdmin();
        }
    }
);

// ====== SUIVI DES COMMANDES ENTREPRISES ======
function afficherCommandesPourAdmin() {
    const tbody =
        document.getElementById(
            'corps-tableau-commandes'
        );

    if (!tbody) return;

    const tableHeader =
        tbody
            .closest('table')
            ?.querySelector('thead tr');

    if (tableHeader) {
        tableHeader.innerHTML = `
            <th>Entreprise</th>
            <th>Article</th>
            <th style="text-align:center;">
                Quantité
            </th>
            <th style="text-align:center;">
                Montant Total
            </th>
            <th style="text-align:center;">
                Statut
            </th>
            <th style="text-align:right;">
                Actions
            </th>
        `;
    }

    const commandes =
        JSON.parse(
            localStorage.getItem('commandesGlobales')
        ) || [];

    const listeArtsBoutique =
        JSON.parse(
            localStorage.getItem('articlesBoutique')
        ) || articlesBoutique;

    tbody.innerHTML = '';

    if (commandes.length === 0) {
        tbody.innerHTML =
            `<tr>
                <td colspan="6" style="
                    text-align:center;
                    color:#9DB4BC;
                    font-style:italic;
                ">
                    Aucune commande en attente.
                </td>
            </tr>`;

        return;
    }

    commandes.forEach(
        (cmd, index) => {
            let totalCommande = 0;
            let articleAffiche =
                cmd.article || "";

            if (
                cmd.details &&
                Array.isArray(cmd.details)
            ) {
                let detailTexte = [];

                cmd.details.forEach(p => {
                    const artBoutique =
                        listeArtsBoutique.find(
                            a => a.nom === p.article
                        );

                    const prixUnitaire =
                        artBoutique
                            ? artBoutique.prix
                            : 0;

                    totalCommande +=
                        prixUnitaire *
                        p.quantite;

                    detailTexte.push(
                        `${p.quantite}x ${p.article}`
                    );
                });

                articleAffiche =
                    detailTexte.join(', ');
            } else if (
                cmd.article &&
                cmd.quantite
            ) {
                const artBoutique =
                    listeArtsBoutique.find(
                        a => a.nom === cmd.article
                    );

                const prixUnitaire =
                    artBoutique
                        ? artBoutique.prix
                        : 0;

                totalCommande =
                    prixUnitaire *
                    parseInt(cmd.quantite);

                articleAffiche =
                    cmd.article;
            }

            const statutEnAttente =
                cmd.statut === 'En attente' ||
                cmd.statut === 'Attente Paiement';

            const tr =
                document.createElement('tr');

            tr.innerHTML = `
                <td>
                    <strong>
                        ${cmd.entreprise}
                    </strong>
                </td>

                <td>
                    ${articleAffiche}
                </td>

                <td style="text-align:center;">
                    ${cmd.quantite || 'Groupé'}
                </td>

                <td style="
                    text-align:center;
                    font-weight:bold;
                    color:#19D3C5;
                ">
                    ${totalCommande} $
                </td>

                <td style="
                    text-align:center;
                ">
                    <span style="
                        color:#19D3C5;
                        font-weight:bold;
                    ">
                        ${cmd.statut}
                    </span>
                </td>

                <td style="text-align:right;">
                    <div style="
                        display:flex;
                        gap:8px;
                        justify-content:flex-end;
                        align-items:center;
                    ">

                        ${
                            statutEnAttente
                                ? `
                                    <button
                                        onclick="validerCommande(${index})"
                                        style="
                                            background:#19D3C5;
                                            color:#071A24;
                                            border:none;
                                            padding:6px 12px;
                                            border-radius:4px;
                                            cursor:pointer;
                                            font-weight:bold;
                                        "
                                    >
                                        Livrer 👍
                                    </button>
                                `
                                : `
                                    <span style="
                                        color:#9DB4BC;
                                        font-size:12px;
                                    ">
                                        Terminé
                                    </span>
                                `
                        }

                        <button
                            onclick="supprimerCommandeTroll(${index})"
                            style="
                                background:#12313D;
                                color:#19D3C5;
                                border:1px solid #174958;
                                padding:6px 10px;
                                border-radius:4px;
                                cursor:pointer;
                                font-weight:bold;
                            "
                        >
                            ❌
                        </button>

                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        }
    );
}

window.validerCommande = function(index) {
    let commandes =
        JSON.parse(
            localStorage.getItem('commandesGlobales')
        ) || [];

    if (!commandes[index]) return;

    commandes[index].statut =
        "Livrée";

    localStorage.setItem(
        'commandesGlobales',
        JSON.stringify(commandes)
    );

    let archivesGlobales =
        JSON.parse(
            localStorage.getItem('archivesGlobales')
        ) || [];

    const dateActuelle =
        new Date().toLocaleTimeString(
            'fr-FR',
            {
                hour: '2-digit',
                minute: '2-digit'
            }
        );

    archivesGlobales.unshift({
        texte:
            `[${dateActuelle}] DIRECTION : ` +
            `Commande de l'entreprise ` +
            `"${commandes[index].entreprise}" ` +
            `validée et livrée.`
    });

    localStorage.setItem(
        'archivesGlobales',
        JSON.stringify(archivesGlobales)
    );

    afficherCommandesPourAdmin();

    if (
        typeof chargerComptaAdmin ===
        'function'
    ) {
        chargerComptaAdmin();
    }
};

window.supprimerCommandeTroll =
    function(index) {
        if (
            confirm(
                "Supprimer cette commande ?"
            )
        ) {
            let commandes =
                JSON.parse(
                    localStorage.getItem(
                        'commandesGlobales'
                    )
                ) || [];

            commandes.splice(index, 1);

            localStorage.setItem(
                'commandesGlobales',
                JSON.stringify(commandes)
            );

            afficherCommandesPourAdmin();

            if (
                typeof chargerComptaAdmin ===
                'function'
            ) {
                chargerComptaAdmin();
            }
        }
    };

// ====== ACTUALISATION AUTOMATIQUE ADMIN ======
if (
    document.getElementById(
        'panel-suivi-employes'
    )
) {
    setTimeout(
        afficherCommandesPourAdmin,
        100
    );

    window.addEventListener(
        'click',
        () => {
            setTimeout(
                afficherCommandesPourAdmin,
                200
            );
        }
    );
}

// ====== AUTOMATISATION COMMANDES ENTREPRISES ======
if (
    window.location.pathname.includes(
        'commandes.html'
    )
) {
    const entrepriseNom =
        localStorage.getItem(
            'entrepriseConnectee'
        ) ||
        "Entreprise Partenaire";

    document
        .getElementById('orderForm')
        ?.addEventListener(
            'submit',
            function() {
                window.entrepriseNomAutomatique =
                    entrepriseNom;
            },
            true
        );
}
