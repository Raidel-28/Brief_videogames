const contnerGame = document.getElementById("gamecenter");
const indexlvl = document.getElementById("indexlvl");
const level1 = document.getElementById("lvl1");
const level2 = document.getElementById("lvl2");
const level3 = document.getElementById("lvl3");
const playAgain = document.getElementById("playAgain");
const menu = document.getElementById("menu");
const timerDisplay = document.getElementById("timer");
const coupsDisplay = document.getElementById("coups");

// Variables de jeu
let chrono;
let carteUp = [];
let pairefound = 0;
let totalPaire = 0;
let gameMode = null;
let coups = 0;

const maxCoups = 15;
const baseTime = 30;

const imgcard = [
    "kero.png", "tamama.png", "giroro.PNG",
    "kururu.PNG", "dororo.PNG", "bad giroro.PNG"
];

// Init UI
playAgain.style.visibility = "hidden";
menu.style.visibility = "hidden";

function mélangeur(lignes, colonnes) {
    const totalCard = lignes * colonnes;
    totalPaire = totalCard / 2;
    if (totalCard % 2 !== 0) throw new Error("Nombre de cartes impair.");

    const cartes = [...imgcard, ...imgcard].slice(0, totalCard);
    for (let i = cartes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartes[i], cartes[j]] = [cartes[j], cartes[i]];
    }

    const tablegame = [];
    for (let i = 0, index = 0; i < lignes; i++) {
        tablegame[i] = [];
        for (let j = 0; j < colonnes; j++) {
            tablegame[i][j] = cartes[index++];
        }
    }
    return tablegame;
}

function afficheTableau(tablegame) {
    contnerGame.innerHTML = "";
    contnerGame.style.display = "grid";
    contnerGame.style.gridTemplateColumns = `repeat(${tablegame[0].length}, 5em)`;
    contnerGame.style.justifyContent = "center";
    contnerGame.style.gap = "10px";

    for (let i = 0; i < tablegame.length; i++) {
        for (let j = 0; j < tablegame[i].length; j++) {
            const btn = document.createElement("button");
            btn.style.width = '5em';
            btn.style.height = '5em';
            btn.style.padding = "0";

            const img = document.createElement('img');
            img.src = 'assets/logo.png';
            img.style.width = '100%';
            img.style.height = '100%';
            btn.appendChild(img);

            btn.addEventListener("click", () => {
                if (carteUp.length < 2 && img.src.includes("logo.png")) {
                    img.src = `assets/${tablegame[i][j]}`;
                    carteUp.push({ i, j, img, btn });

                    if (carteUp.length === 2) {
                        if (gameMode === "level3") incrementerCoups();

                        setTimeout(() => {
                            const [c1, c2] = carteUp;
                            const name1 = tablegame[c1.i][c1.j];
                            const name2 = tablegame[c2.i][c2.j];

                            if (name1 === name2) {
                                c1.btn.style.visibility = "hidden";
                                c2.btn.style.visibility = "hidden";
                                pairefound++;

                                if (pairefound === totalPaire) {
                                    if (gameMode === "level2") clearInterval(chrono);
                                    setTimeout(() => {
                                        alert("🎉 Kero ! Tu as trouvé toutes les paires !");
                                        showEndButtons();
                                    }, 200);
                                }
                            } else {
                                c1.img.src = 'assets/logo.png';
                                c2.img.src = 'assets/logo.png';
                            }

                            carteUp = [];
                        }, 800);
                    }
                }
            });

            contnerGame.appendChild(btn);
        }
    }
}

function démarrerTimer() {
    clearInterval(chrono);
    let tempsRestant = baseTime;
    timerDisplay.textContent = `⏱ Temps : ${tempsRestant}`;

    chrono = setInterval(() => {
        tempsRestant--;
        timerDisplay.textContent = `⏱ Temps : ${tempsRestant}`;
        if (tempsRestant <= 0) {
            clearInterval(chrono);
            alert("⏰ Temps écoulé !");
            showEndButtons();
        }
    }, 1000);
}

function incrementerCoups() {
    coups++;
    coupsDisplay.textContent = `👣 Coups : ${coups}`;
    if (coups >= maxCoups) {
        alert("😵 T'as épuisé tous tes coups !");
        showEndButtons();
    }
}

function resetGame() {
    carteUp = [];
    pairefound = 0;
    coups = 0;
    coupsDisplay.textContent = gameMode === "level3" ? "👣 Coups : 0" : "";
    timerDisplay.textContent = gameMode === "level2" ? `⏱ Temps : ${baseTime}` : "";
    clearInterval(chrono);
    playAgain.style.visibility = "hidden";
    menu.style.visibility = "hidden";
}

function showEndButtons() {
    clearInterval(chrono);
    playAgain.style.visibility = "visible";
    menu.style.visibility = "visible";
}

// --- Gestion des niveaux ---
level1.addEventListener("click", () => {
    indexlvl.style.visibility = "hidden";
    timerDisplay.style.display = "none";
    coupsDisplay.style.display = "none";
    gameMode = "level1";
    resetGame();
    afficheTableau(mélangeur(4, 3));
});

level2.addEventListener("click", () => {
    indexlvl.style.visibility = "hidden";
    coupsDisplay.style.display = "none";
    gameMode = "level2";
    resetGame();
    afficheTableau(mélangeur(4, 3));
    démarrerTimer(); // Timer activé uniquement ici
});

level3.addEventListener("click", () => {
    indexlvl.style.visibility = "hidden";
    timerDisplay.style.display = "none";
    gameMode = "level3";
    resetGame();
    afficheTableau(mélangeur(4, 3));
    // Pas de timer ici
});

// --- Boutons menu et rejouer ---
menu.addEventListener("click", () => {
    contnerGame.innerHTML = "";
    indexlvl.style.visibility = "visible";
    resetGame();
});

playAgain.addEventListener("click", () => {
    resetGame();
    const newGame = mélangeur(4, 3);
    afficheTableau(newGame);
    if (gameMode === "level2") démarrerTimer();
});