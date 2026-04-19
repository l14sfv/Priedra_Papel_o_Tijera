const choices = {
    paper: { icon: '✋', className: 'pick--paper' },
    scissors: { icon: '✌', className: 'pick--scissors' },
    rock: { icon: '✊', className: 'pick--rock' }
};

const beats = {
    paper: 'rock',
    rock: 'scissors',
    scissors: 'paper'
};

const scoreEl = document.getElementById('score');
const pickView = document.getElementById('pickView');
const resultView = document.getElementById('resultView');
const playerPick = document.getElementById('playerPick');
const housePick = document.getElementById('housePick');
const resultText = document.getElementById('resultText');
const playAgainBtn = document.getElementById('playAgain');
const rulesModal = document.getElementById('rulesModal');

const toastModal = document.getElementById('toastModal');
const toastBox = document.getElementById('toastBox');
const toastTitle = document.getElementById('toastTitle');
const toastMessage = document.getElementById('toastMessage');
const toastClose = document.getElementById('toastClose');

let score = 0;

function createPick(choice, extraClass = '') {
    const data = choices[choice];
    const element = document.createElement('div');
    element.className = `pick ${data.className} ${extraClass}`.trim();
    element.innerHTML = `<span class="pick__inner">${data.icon}</span>`;
    return element;
}

function getHouseChoice() {
    const keys = Object.keys(choices);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
}

function getResult(player, house) {
    if (player === house) return 'EMPATE';
    return beats[player] === house ? 'GANASTE' : 'PERDISTE';
}

function updateScore(result) {
    if (result === 'GANASTE') score += 1;
    if (result === 'PERDISTE' && score > 0) score -= 1;
    scoreEl.textContent = score;
}

function clearWinnerEffects() {
    const previousRings = document.querySelectorAll('.winner-ring');
    previousRings.forEach(el => el.classList.remove('winner-ring'));
}

function showNotification(result) {
    toastBox.classList.remove('toast-win', 'toast-lose', 'toast-draw');

    if (result === 'GANASTE') {
        toastTitle.textContent = '🎉 Ganaste';
        toastMessage.textContent = '¡Muy bien! Le ganaste a la CPU.';
        toastBox.classList.add('toast-win');
    } else if (result === 'PERDISTE') {
        toastTitle.textContent = '😢 Perdiste';
        toastMessage.textContent = 'La CPU ganó esta ronda. Inténtalo otra vez.';
        toastBox.classList.add('toast-lose');
    } else {
        toastTitle.textContent = '🤝 Empate';
        toastMessage.textContent = 'Ambos eligieron la misma opción.';
        toastBox.classList.add('toast-draw');
    }

    toastModal.hidden = false;
}

function closeNotification() {
    toastModal.hidden = true;
}

function showHousePick(houseChoice) {
    housePick.className = '';
    housePick.innerHTML = '';
    housePick.appendChild(createPick(houseChoice));
}

function applyWinnerEffect(result) {
    if (result === 'GANASTE' && playerPick.firstChild) {
        playerPick.firstChild.classList.add('winner-ring');
    }

    if (result === 'PERDISTE' && housePick.firstChild) {
        housePick.firstChild.classList.add('winner-ring');
    }
}

function playRound(playerChoice) {
    const houseChoice = getHouseChoice();
    const result = getResult(playerChoice, houseChoice);

    clearWinnerEffects();

    pickView.classList.remove('active');
    resultView.hidden = false;

    playerPick.innerHTML = '';
    housePick.className = 'house-placeholder';
    housePick.innerHTML = '';
    resultText.textContent = '';

const playerNode = createPick(playerChoice);
    playerPick.appendChild(playerNode);

setTimeout(() => {
    showHousePick(houseChoice);

    setTimeout(() => {
        resultText.textContent = result;
        applyWinnerEffect(result);
        updateScore(result);
        showNotification(result);
    }, 250);
    }, 700);
}

document.querySelectorAll('[data-choice]').forEach(button => {
    button.addEventListener('click', () => {
        playRound(button.dataset.choice);
    });
});

playAgainBtn.addEventListener('click', () => {
    resultView.hidden = true;
    pickView.classList.add('active');
    playerPick.innerHTML = '';
    housePick.innerHTML = '';
    housePick.className = 'house-placeholder';
    resultText.textContent = '';
    clearWinnerEffects();
});

document.getElementById('openRules').addEventListener('click', () => {
    rulesModal.hidden = false;
});

document.getElementById('closeRules').addEventListener('click', () => {
    rulesModal.hidden = true;
});

rulesModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal__overlay')) {
        rulesModal.hidden = true;
    }
});

toastClose.addEventListener('click', closeNotification);

toastModal.addEventListener('click', (e) => {
    if (e.target === toastModal) {
        closeNotification();
    }
});
