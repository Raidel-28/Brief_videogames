const contnerGame = document.getElementById("gamecenter");
const indexlvl = document.getElementById("indexlvl");
const level1 = document.getElementById("lvl1");
const level2 = document.getElementById("lvl2");
const level3 = document.getElementById("lvl3");
const playAgain = document.getElementById("playAgain");
const menu = document.getElementById("menu");
let chrono;
let tempsRestant = 60;
let coups = 0;
const maxCoups = 20;
playAgain.style.visibility = "hidden";
menu.style.visibility = "hidden";

let carteUp = [];
let pairefound = 0;
let totalPaire = 0;
const imgcard = [
    "kero.png",
    "tamama.png",
    "giroro.PNG",
    "kururu.PNG",
    "dororo.PNG",
    "bad giroro.PNG"
];

function mélangeur(lignes, colonnes) {
    const totalCard = lignes * colonnes;
    totalPaire = totalCard / 2;
    if (totalCard % 2 !== 0) {
        throw new Error("Le nombre total de cartes doit être pair.");
    }

    const cartes = [...imgcard, ...imgcard].slice(0, totalCard);

    for (let i = cartes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartes[i], cartes[j]] = [cartes[j], cartes[i]];
    }

    const tablegame = [];
    let index = 0;
    for (let i = 0; i < lignes; i++) {
        const ligne = [];
        for (let j = 0; j < colonnes; j++) {
            ligne.push(cartes[index++]);
        }
        tablegame.push(ligne);
    }

    return tablegame;
}

function afficheTableau(tablegame) {
    contnerGame.innerHTML = "";
    contnerGame.style.display = "grid";
    contnerGame.style.justifyContent = "center";
    contnerGame.style.gap = "10px";
    contnerGame.style.gridTemplateColumns = `repeat(${tablegame[0].length}, 5em)`;

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
                        setTimeout(() => {
                            const [c1, c2] = carteUp;
                            const name1 = tablegame[c1.i][c1.j];
                            const name2 = tablegame[c2.i][c2.j];

                            if (name1 === name2) {
                                c1.btn.style.visibility = "hidden";
                                c2.btn.style.visibility = "hidden";
                                pairefound++;
                                console.log(pairefound)

                                if (totalPaire === pairefound) {
                                    setTimeout(() => {
                                        alert("🎉 Kero ! Tu as trouvé toutes les paires !")
                                    }, 200);

                                    setTimeout(() => {
                                        playAgain.style.visibility = "visible";
                                        menu.style.visibility = "visible";
                                    }, 200);
                                    menu.addEventListener("click", () => {
                                        contnerGame.innerHTML = "";
                                        carteUp = [];
                                        pairefound = 0;
                                        indexlvl.style.visibility = "visible";
                                        menu.style.visibility = "hidder";
                                    })
                                    playAgain.addEventListener("click", () => {
                                        playAgain.style.display = "none";
                                        const newGame = mélangeur(4, 3);
                                        afficheTableau(newGame);


                                    })

                                        ;



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
    tempsRestant = 60;
    document.getElementById("timer").textContent = `⏱ Temps : ${tempsRestant}`;

    chrono = setInterval(() => {
        tempsRestant--;
        document.getElementById("timer").textContent = `⏱ Temps : ${tempsRestant}`;
        if (tempsRestant === 0) {
            clearInterval(chrono);
            alert("⏰ Temps écoulé !");
            playAgain.style.display = "block";
        }
    }, 1000);
}

function incrementerCoups() {
    coups++;
    document.getElementById("coups").textContent = `👣 Coups : ${coups}`;
    if (coups >= maxCoups) {
        clearInterval(chrono);
        alert("😵 T'as épuisé tous tes coups !");
        playAgain.style.display = "block";
    }
}

level1.addEventListener("click", () => {
    indexlvl.style.visibility = "hidden";
    const affichelvl1 = mélangeur(4, 3);
    afficheTableau(affichelvl1);

});

level2.addEventListener("click", () => {
    indexlvl.style.visibility = "hidden";
    const affichelvl2 = mélangeur(4, 3);
    afficheTableau(affichelvl2);
    démarrerTimer(level2);

});

level3.addEventListener("click", () => {
    indexlvl.style.visibility = "hidden";
    const affichelvl3 = mélangeur(4, 3);
    afficheTableau(affichelvl3);

});



