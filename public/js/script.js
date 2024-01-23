/**********************************************************************
 **************TAPE-TAUPE --- TP DU 23 JANVIER 2024 ******************
 **********************************************************************/

document.addEventListener('DOMContentLoaded', () => {

    // recup principaux id

    const grid = document.querySelector('#grid');
    const scoreBoard = document.querySelector('#score');
    const startButton = document.querySelector('#startButton');
    const timerDisplay = document.querySelector('#timeLeft');

    //variables globales

    let level = document.querySelector('#level');
    let score = 0;
    let currentTime = 30;
    let timerId = null;
    let moleTimerId = null;
    let lastMoleTimerId = null;


// remplissage du grid
    function createGrid() {
        let maxSize = 16
        for (let i = 0; i < 16; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            grid.appendChild(square);
        }
    }

// purge + placement random de la classe 'mole' à chaque tour

    function randomSquare() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => square.classList.remove('mole'));
        let randomPosition = squares[Math.floor(Math.random() * 16)];
        randomPosition.classList.add('mole');
    }


//  - calcul du level

    function levelCalc(t) {

        if (t <= 1250 && t > 1000) level.textContent = 'LEVEL 2';
        if (t <= 1000 && t > 750) level.textContent = 'LEVEL 3';
        if (t <= 750 && t > 500) level.textContent = 'LEVEL 4';
        if (t <= 500) level.textContent = 'LEVEL 5';
        if (t < 500) t = 500;

    }

    // déplacement périodique de la classe mole avec durée t variable

    function moveMole() {
        let t = (2000 - (25 * score));
        levelCalc(t);

        moleTimerId = setInterval(randomSquare, t);
    }

    function lastMoveMole() {

        lastMoleTimerId = setInterval(randomSquare, 50);
    }


    //liostener sur le grid avec calcul score ( en + si classe mole touchée, en - si click ailleurs)

    grid.addEventListener('click', e => {

        if (e.target.classList.contains('mole')) {

            ++score;
            scoreBoard.textContent = score;
            console.log(score);
            currentTime++;
            timerDisplay.textContent = currentTime;
            clearInterval(moleTimerId);

            randomSquare();
            grid.removeEventListener("click", this)
            moveMole()
        } else if (!e.target.classList.contains('mole') && e.target.classList.contains('square')) {

            --score;
            scoreBoard.textContent = score;
            winLose();
        }
    });


    //gagné, perdu etc etc

    function winLose() {
        currentTime--;
        timerDisplay.textContent = currentTime;


        if (currentTime === 0) {
            clearInterval(moleTimerId)
            Promise.resolve(lastMoveMole()).then(
                setTimeout(() => {
                    alert("Plus de temps ! Perdu !");
                    clearInterval(lastMoleTimerId)
                }, 1000));
            clearInterval(timerId);
        }

        if (score >= 60) {
            clearInterval(moleTimerId)
            Promise.resolve(lastMoveMole()).then(
                setTimeout(() => {
                    alert("Gagné !!");
                    clearInterval(lastMoleTimerId)
                }, 1000));
            clearInterval(timerId);

        }

        if (score === -1) {
            clearInterval(moleTimerId)
            Promise.resolve(lastMoveMole()).then(
                setTimeout(() => {
                    alert("Vous avez perdu et votre score est NEGATIF ==> vous me devez de l'argent");
                    clearInterval(lastMoleTimerId)
                }, 1000));
            score = 0;
            clearInterval(timerId);
        }
    }


    // déclencheur du jeu

    startButton.addEventListener('click', () => {
        score = 0;
        scoreBoard.textContent = score;
        currentTime = 30;
        timerDisplay.textContent = currentTime;
        moveMole();
        timerId = setInterval(winLose, 1000);
    });

    createGrid();
});
