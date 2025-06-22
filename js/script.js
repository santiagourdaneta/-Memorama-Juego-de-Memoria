// Paso 1: ¡Los dibujos que queremos en nuestras cartas!
const cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];

// Vamos a encontrar nuestra "mesa" (el tablero de juego) en el HTML
const gameBoard = document.getElementById('game-board');

// NUEVOS: Encontramos los pizarrones para los contadores
const movesCounterDisplay = document.getElementById('moves-counter');
const timerDisplay = document.getElementById('timer');

// NUEVOS: Encontramos el mensaje de victoria y el botón de reiniciar (ya no los creamos aquí)
const gameOverMessage = document.querySelector('.game-over-message'); // Lo busca por su clase
const restartButton = document.getElementById('restart-button'); // Lo busca por su ID

// Variables para guardar los números de los contadores
let moves = 0;
let seconds = 0;
let timerInterval; // Aquí guardaremos el "reloj" para poder detenerlo y reiniciarlo

// Variables para guardar las cartas que volteamos
let flippedCards = [];
let matchedCards = [];
let canFlip = true;

// Función mágica para mezclar las cartas (como barajar en la vida real)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función para crear una sola carta (esta parte no cambia)
function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const cardFront = document.createElement('div');
    cardFront.classList.add('front');
    cardFront.textContent = value;

    const cardBack = document.createElement('div');
    cardBack.classList.add('back');
    cardBack.textContent = '?';

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener('click', () => {
        if (!canFlip || flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        // ¡NUEVO: Aumentamos los movimientos cada vez que se intenta voltear una carta!
        // Solo contamos un movimiento por cada dos cartas volteadas (o intento de par)
        if (flippedCards.length === 0) { // Solo si es la primera carta de un par nuevo
             moves++;
             movesCounterDisplay.textContent = moves; // Actualizamos el pizarron de movimientos
        }

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            canFlip = false;
            const [card1, card2] = flippedCards;

            if (card1.querySelector('.front').textContent === card2.querySelector('.front').textContent) {
                // Son pareja
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedCards.push(card1, card2);

                flippedCards = [];
                canFlip = true;

                if (matchedCards.length === cardValues.length) {
                    // ¡Juego Terminado!
                    clearInterval(timerInterval); // ¡NUEVO: Detenemos el reloj!
                    gameOverMessage.style.display = 'block';
                    restartButton.style.display = 'block';
                }

            } else {
                // No son pareja
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }
    });
    return card;
}

// Función para iniciar el temporizador
function startTimer() {
    // Si ya hay un reloj andando, lo paramos primero
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    seconds = 0; // Reiniciamos los segundos a cero
    timerDisplay.textContent = seconds; // Mostramos 0 en el pizarrón

    // Hacemos que el reloj aumente cada segundo (1000 milisegundos)
    timerInterval = setInterval(() => {
        seconds++; // Aumenta los segundos
        timerDisplay.textContent = seconds; // Muestra el nuevo número en el pizarrón
    }, 1000);
}


// Función para iniciar un nuevo juego
function startGame() {
    gameBoard.innerHTML = ''; // Limpiamos el tablero
    gameOverMessage.style.display = 'none'; // Escondemos el mensaje de victoria
    restartButton.style.display = 'none'; // Escondemos el botón de reiniciar

    flippedCards = [];
    matchedCards = [];
    canFlip = true;

    // Reiniciamos los movimientos
    moves = 0;
    movesCounterDisplay.textContent = moves; // Mostramos 0 en el pizarrón de movimientos

    startTimer(); // ¡NUEVO: Empezamos el reloj!

    const shuffledCards = shuffle(cardValues);

    shuffledCards.forEach(value => {
        const cardElement = createCard(value);
        gameBoard.appendChild(cardElement);
    });
}

// Cuando el botón de reiniciar es tocado, ¡empezamos un nuevo juego!
restartButton.addEventListener('click', startGame);

// ¡Llamamos a la función para empezar el juego cuando la página se carga!
startGame();