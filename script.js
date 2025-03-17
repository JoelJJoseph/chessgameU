// https://github.com/jayasurian123/fen-validator
// js-chess-engine currently lacks a validator so use this
import validateFEN from './fen-validator/index.js';

// https://github.com/josefjadrny/js-chess-engine
// Option 1 - With in-memory (should allow us to deal with promotion)
import { Game } from './js-chess-engine/lib/js-chess-engine.mjs';
let game = new Game();

const fenPositions = ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8', 'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7', 'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6', 'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5', 'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4', 'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3', 'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2', 'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'];
const pieces = ['r', 'n', 'b', 'q', 'k', 'p', 'R', 'N', 'B', 'Q', 'K', 'P'];
const speed = 300;
const game_version = '0.0.2';
const chessFacts = [
    "The longest official chess game ever was 269 moves long and ended in a draw.",
    "The number of possible unique chess games is greater than the number of atoms in the universe.",
    "The word 'Checkmate' comes from the Persian phrase 'Shah Mat,' which means 'the king is dead.'",
    "The folding chess board was invented by a priest who was forbidden to play chess.",
    "The first chess computer program was developed in 1951 by Alan Turing.",
    "The shortest possible chess game ending in checkmate is just two moves.",
    "The longest chess game theoretically possible is 5,949 moves.",
    "The first chess tournament was held in London in 1851.",
    "The chess piece originally known as the 'vizier' later became the queen we know today.",
    "Chess is included in the curriculum in over 30 countries.",
    "The oldest recorded chess game in history dates back to the 10th century.",
    "In medieval times, chess was used to teach war strategy.",
    "The knight is the only chess piece that can jump over other pieces.",
    "The modern chess board design with alternating light and dark squares appeared in Europe in 1090.",
    "Bobby Fischer became a chess grandmaster at the age of 15, the youngest ever at that time.",
    "The first AI to defeat a world chess champion was IBM's Deep Blue in 1997.",
    "The longest time for a player to make a move in a chess tournament was 2 hours and 20 minutes.",
    "The most expensive chess set ever made is the Jewel Royale Chess Set, valued at $9.8 million.",
    "In 1997, Garry Kasparov played against the entire world via the Internet and won.",
    "The term 'Stalemate' comes from the Old French 'estale' meaning 'at a standstill.'",
    "The queen is the most powerful piece on the chessboard, but was originally one of the weakest.",
    "The International Chess Federation (FIDE) was founded in Paris in 1924.",
    "Chess is one of the oldest games still played today, with origins dating back to 6th century India.",
    "The longest chess marathon lasted 50 hours and 30 minutes.",
    "The first chess book was written by Luis Ramirez de Lucena in 1497."
];

let puzzle_solved = false;
let puzzle_solved_clean = true;
let currentPuzzle = '';
let currentFEN = '';
let currentStatus = '';
let lastPuzzleMoveIndex = 0;
let puzzles = {};
let params = '';
let playerRating = 400;

window.addEventListener("DOMContentLoaded", (event) => {
    // Display a random chess fact
    displayRandomChessFact();

    // Hide the no-js message since JavaScript is clearly working
    if (document.getElementById('no-js')) {
        document.getElementById('no-js').style.display = 'none';
    }

    setUpBoard();
    setUpButtons();
    params = getURLSearchParams();

    // force set player rating if in params and is a number
    if (params.get('rating') != null && !isNaN(params.get('rating'))) {
        playerRating = params.get('rating');
        storeLocalPlayerRating(playerRating);
    } else {
        playerRating = getLocalPlayerRating();
    }

    fetch('./puzzles/offline/puzzles.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvString => {
            console.log("Puzzles loaded successfully");
            puzzles = initPuzzles(csvString);
            if (puzzles['param'] == null) {
                loadRandomPuzzle();
            } else {
                loadPuzzle(puzzles['param']);
            }
        })
        .catch(error => {
            console.error('Error fetching puzzles:', error);
            const noJsElement = document.getElementById('no-js');
            noJsElement.style.display = 'block';
            noJsElement.innerHTML = `<strong>Error loading puzzles:</strong> ${error.message}`;
        });
});

function setUpBoard() {
    document.getElementById("no-js").remove();

    const board = document.getElementById('board');
    const squares = board.querySelectorAll('div');
    squares.forEach(square => {
        square.addEventListener('pointerdown', function() {
            squareClicked(square)
        });
    });

    const squareClicked = (square) => {
        console.log(`${square} was clicked!`);
        if (puzzle_solved) {
            return;
        }
        // You may be temped to refactor, but why?
        // unselectAll is catching **edge case** for multiple selected squares
        // you still need to unselect the selected square, if user wants to undo selection
        if (square.classList.contains('selected')) {
            unselectAll();
        } else if (square.classList.contains('circle')) {
            const selected = document.querySelector('.selected');
            unselectAll();
            playerMove(selected.id, square.id);
        } else {
            unselectAll();

            let containsPiece = false;
            for (let i = 0; i < pieces.length; i++) {
                if (square.classList.contains(pieces[i])) {
                    containsPiece = true;
                    break
                }
            }

            // only add selected if piece exists
            if (containsPiece) {
                selectPiece(square);
            }
        }
    }
}

function setUpButtons() {
    const title = document.getElementById('title');
    const menuButton = document.getElementById('menu-button');
    const closeButtons = document.querySelectorAll('.close-button');

    title.addEventListener('dblclick', function() {
        let element = document.getElementById('debug');
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    });

    menuButton.addEventListener('pointerdown', function() {
        document.getElementById('info-modal').style.display = 'flex';
    });

    menuButton.addEventListener('pointerdown', function() {
        document.getElementById('info-modal').style.display = 'flex';
    });

    closeButtons.forEach(closeButton => {
        closeButton.addEventListener('pointerdown', function() {
            this.parentNode.parentNode.style.display = 'none';
        });
    });
}

function unselectAll() {
    const board = document.getElementById('board');
    const squares = board.querySelectorAll('div');
    squares.forEach(square => {
        square.classList.remove('selected');
        square.classList.remove('circle');
    });
}

function clearBoard() {
    const board = document.getElementById('board');
    const squares = board.querySelectorAll('div');
    squares.forEach(square => {
        square.classList = '';
    });
}

function loadBoard(fen) {
    const fenArr = fen.split(' ');
    const piecePlacement = fenArr[0];

    clearBoard();

    // replace numbers with spaces and remove forward slashes
    let newPiecePlacement = piecePlacement.replace(/[0-8/]/g, (match) => {
        if (match === '/') {
            return ''; // remove forward slash
        } else {
            return " ".repeat(parseInt(match)); // repeat " " for the number of times matched
        }
    });

    // add pieces to board
    for (let i = 0; i < newPiecePlacement.length; i++) {
        const square = document.getElementById(fenPositions[i]);
        if (newPiecePlacement[i] !== ' ') {
            square.classList.add(newPiecePlacement[i]);
        }
    }
}

function flipBoard(shouldFlip) {
    const board = document.getElementById('board');
    if (shouldFlip) {
        board.classList.add('flip');
    } else {
        board.classList.remove('flip');
    }
}

function selectPiece(element) {

    const selectedPiece = currentStatus.pieces[element.id.toUpperCase()];

    let canSelectPiece = false;
    if (currentStatus.turn === 'white' && selectedPiece === selectedPiece.toUpperCase()) {
        // white turn and white piece selected
        canSelectPiece = true;
    } else if (currentStatus.turn === 'black' && selectedPiece === selectedPiece.toLowerCase()) {
        // black turn and black piece selected
        canSelectPiece = true;
    }

    const selectedPieceValidMoves = currentStatus.moves[element.id.toUpperCase()];

    if (canSelectPiece) {
        element.classList.add('selected');

        if (selectedPieceValidMoves && selectedPieceValidMoves.length) {
            for (let i = 0; i < selectedPieceValidMoves.length; i++) {
                const square = document.getElementById(selectedPieceValidMoves[i].toLowerCase());
                square.classList.add('circle');
            }
        }
    }
}

function computerMove(from, to) {
    // wait 1 second then move piece
    setTimeout(() => {
        movePiece(from, to);
    }, speed);
}

function playerMove(from, to) {
    let best_move = currentPuzzle.moves[lastPuzzleMoveIndex + 1];
    // check if move is solution - slice to avoid possible promotion char
    if (best_move.slice(0, 4) === `${from}${to}`) {
        lastPuzzleMoveIndex++;
        // if best_move is length 5, it has promotion
        if (best_move.length === 5) {
            // grab char for promotion
            puzzleMoveGood(from, to, best_move.slice(4));
        } else {
            puzzleMoveGood(from, to);
        }
    } else {
        puzzleMoveBad(from, to);
    }
}

function puzzleMoveGood(from, to, promote = null) {
    movePiece(from, to, promote);
    lastPuzzleMoveIndex++;
    if (currentStatus.isFinished || lastPuzzleMoveIndex >= currentPuzzle.moves.length) {
        updateMessage('<p>Puzzle complete!</p><p class="show">Click for next puzzle.</p>', 'good');
        puzzle_solved = true;
        if (puzzle_solved_clean) {
            calculateRatingChange(currentPuzzle.rating, true);
            showCongratulations();
        }
        enableNextPuzzle();
    } else {
        updateMessage('<p>Good move, keep going.</p>');
        setTimeout(() => {

            computerMove(currentPuzzle.moves[lastPuzzleMoveIndex].substring(0, 2), currentPuzzle.moves[lastPuzzleMoveIndex].substring(2, 4));
        }, speed);
    }
}

function puzzleMoveBad(from, to) {
    const backupStatus = currentFEN;
    const backupPrevious = document.querySelectorAll('.previous');
    movePiece(from, to);
    updateMessage('There is a better move, try again.', 'bad');
    puzzle_solved_clean = false;
    calculateRatingChange(currentPuzzle.rating, false);
    setTimeout(() => {
        loadFen(backupStatus);
        backupPrevious.forEach(element => {
            element.classList.add('previous');
        });
    }, speed);
}

function movePiece(from, to, promote = null) {
    game.move(from, to);
    if (promote) {
        if (currentStatus.turn === "white") {
            game.setPiece(to, promote.toUpperCase());
        } else {
            game.setPiece(to, promote.toLowerCase());
        }
    }
    currentStatus = game.exportJson();
    currentFEN = game.exportFEN(currentStatus);
    loadBoard(currentFEN);
    document.getElementById(from).classList.add('previous');
    document.getElementById(to).classList.add('previous');
}

const loadRandomPuzzle = () => {
    const minRating = Math.max(0, getLocalPlayerRating() - 100);
    const maxRating = getLocalPlayerRating() + 100;

    const eligibleRatings = Object.keys(puzzles).filter(rating => rating >= minRating && rating <= maxRating);

    if (eligibleRatings.length === 0) {
        console.error('No puzzles found within the specified rating range.');
        return;
    }

    const randomRating = eligibleRatings[Math.floor(Math.random() * eligibleRatings.length)];
    const randomPuzzle = puzzles[randomRating][Math.floor(Math.random() * puzzles[randomRating].length)];

    loadPuzzle(randomPuzzle);
    puzzle_solved_clean = true;

    disableNextPuzzle();
}

function updateMessage(text, type = '') {
    const message = document.getElementById('message');
    message.innerHTML = text;
    message.classList = type;
}

function loadFen(fen) {
    if (validateFEN(fen)) {
        currentFEN = fen;
        game = new Game(currentFEN);
        currentStatus = game.exportJson();
        loadBoard(currentFEN);
    } else {
        console.log('invalid FEN');
    }
}

function loadPuzzle(puzzle) {
    puzzle_solved = false;
    currentPuzzle = puzzle;
    loadFen(currentPuzzle.fen);
    if (currentStatus.turn === 'white') {
        updateMessage('<p>Find the best move for <u>black</u>.</p>');
        flipBoard(true);
    } else {
        updateMessage('<p>Find the best move for <u>white</u>.</p>');
        flipBoard(false);
    }
    computerMove(currentPuzzle.moves[0].substring(0, 2), currentPuzzle.moves[0].substring(2, 4));
    lastPuzzleMoveIndex = 0;

    updateGameInfo();
    updateDebug();
}

function enableNextPuzzle() {
    document.getElementById('message').addEventListener('click', loadRandomPuzzle);
    document.getElementById('message').classList.add('clickable');
}

function disableNextPuzzle() {
    document.getElementById('message').removeEventListener('click', loadRandomPuzzle);
}

function updateDebug() {
    document.getElementById('debug').innerHTML = `
    <strong>DEBUG INFO</strong>: 
    Puzzle ID: <a href="https://lichess.org/training/${currentPuzzle.puzzle_id}">${currentPuzzle.puzzle_id}</a> - 
    Puzzle Rating: ${currentPuzzle.rating} - 
    Player Rating: ${getLocalPlayerRating()} 
    `;
}

function updateGameInfo() {
    document.getElementById('game-info').innerHTML = `
    <em>Build v${game_version}</em><br>
    Current Rating: <strong>${getLocalPlayerRating()}</strong><br>
    `;
}

function initPuzzles(csvString) {
    const lines = csvString.split('\n');
    const puzzles = {};

    lines.forEach(line => {
        if (line.trim() !== '') {
            const [puzzle_id, fen, moves, rating] = line.split(',');
            const puzzle = { puzzle_id, fen, moves: moves.split(' '), rating };

            if (!puzzles[rating]) {
                puzzles[rating] = [];
            }

            puzzles[rating].push(puzzle);

            // if a puzzle id was specified via URL
            if (params.get('puzzle') === puzzle_id) {
                puzzles['param'] = puzzle;
            }
        }
    });

    return puzzles;
}

function calculateRatingChange(puzzleRating, solved) {
    const kFactor = 32; // K-factor determines the maximum rating change per game
    const playerWinProbability = 1 / (1 + Math.pow(10, (puzzleRating - getLocalPlayerRating()) / 400));

    const ratingChange = Math.round(kFactor * (solved ? 1 - playerWinProbability : 0 - playerWinProbability));

    storeLocalPlayerRating(getLocalPlayerRating() + ratingChange);
}

// Store the player's rating in localStorage, if available
function storeLocalPlayerRating(rating) {
    try {
        localStorage.setItem("quickChess4YouPlayerRating", rating);
    } catch (error) {
        console.error("Error storing player rating:", error);
    }
    playerRating = rating;
}

// Retrieve the player's rating from localStorage, if available
function getLocalPlayerRating() {
    try {
        const rating = localStorage.getItem("quickChess4YouPlayerRating");
        return rating ? parseInt(rating, 10) : 400;
    } catch (error) {
        console.error("Error retrieving player rating:", error);
        return playerRating;
    }
}

function getURLSearchParams() {
    // Get the full URL (Example: https://puzzlechess.ca/?puzzle=123456)
    const url = new URL(window.location.href);

    // Access the URLSearchParams object
    return new URLSearchParams(url.search);
}

function displayRandomChessFact() {
    const factElement = document.querySelector('.chess-fact');
    if (factElement) {
        const randomIndex = Math.floor(Math.random() * chessFacts.length);
        factElement.textContent = chessFacts[randomIndex];
    }
}

// Function to show congratulations with confetti
function showCongratulations() {
    // Display confetti
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Show another burst after a short delay
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
    }, 500);

    // And another from the right side
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
    }, 1000);

    // Show congratulations message
    const congratsMessage = document.getElementById('congrats-message');
    congratsMessage.style.display = 'block';

    // Hide the message after animation completes
    setTimeout(() => {
        congratsMessage.style.display = 'none';
    }, 3000);
}