// Add this standalone confetti function to the very top of the file
// Standalone confetti function as a fallback
if (typeof confetti === 'undefined') {
    // Simple confetti implementation as fallback
    window.confetti = function(options = {}) {
        console.log("Using fallback confetti with options:", options);

        const defaults = {
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6, x: 0.5 },
            colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
        };

        // Merge options with defaults
        const config = {...defaults, ...options };

        // Create a simple visual effect if confetti doesn't load
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '9999';
        document.body.appendChild(container);

        // Create particles
        for (let i = 0; i < config.particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.width = '10px';
                particle.style.height = '10px';
                particle.style.borderRadius = '50%';
                particle.style.backgroundColor = config.colors[Math.floor(Math.random() * config.colors.length)];

                // Set starting position
                const startX = (config.origin.x * window.innerWidth);
                const startY = (config.origin.y * window.innerHeight);
                particle.style.left = startX + 'px';
                particle.style.top = startY + 'px';

                // Add to container
                container.appendChild(particle);

                // Animate
                const angle = Math.random() * Math.PI * 2;
                const velocity = 1 + Math.random() * 3;
                const spread = (Math.random() - 0.5) * config.spread;

                let posX = startX;
                let posY = startY;

                const intervalId = setInterval(() => {
                    posX += Math.cos(angle) * velocity + spread;
                    posY += Math.sin(angle) * velocity + 2; // Add gravity

                    particle.style.left = posX + 'px';
                    particle.style.top = posY + 'px';

                    // Remove when out of screen
                    if (posY > window.innerHeight) {
                        clearInterval(intervalId);
                        particle.remove();
                    }
                }, 20);

                // Remove particles after animation
                setTimeout(() => {
                    clearInterval(intervalId);
                    particle.remove();
                }, 3000);
            }, Math.random() * 500);
        }

        // Remove container after animation
        setTimeout(() => {
            container.remove();
        }, 4000);

        // Return an empty object to maintain API compatibility
        return {};
    };
}


import validateFEN from './fen-validator/index.js';


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

// Custom puzzles from simple to complex
const customPuzzles = [
    // Puzzle 1: Mate in 2 - White to play (Queen sacrifice followed by Rook mate)
    { puzzle_id: 'custom1', fen: 'r2qb1rk/ppb2p1p/2n1pPp1/B3N3/2B1P2Q/2P2R2/1P4PP/7K w - - 0 1', moves: ['h4h7', 'h8h7', 'f3h3'], rating: 500 },

    // Puzzle 2: Knight fork leading to bishop checkmate - White to play
    { puzzle_id: 'custom2', fen: '8/8/6p1/7k/3r2NP/B5PK/2br1R2/8 w - - 0 1', moves: ['g4f6', 'h5h6', 'a3f8'], rating: 600 },

    // Puzzle 3: Queen sacrifice leading to bishop checkmate - White to play
    { puzzle_id: 'custom3', fen: 'q1nrrk2/6pp/5pbb/8/8/1B6/3B1Q2/4RK2 w - - 0 1', moves: ['f2f6', 'g7f6', 'b3h6'], rating: 800 },

    // Puzzle 4: Rook Sacrifice Mate in Two - White to play
    { puzzle_id: 'custom4', fen: 'kbK5/pp6/1P6/8/8/8/8/R7 w - - 0 1', moves: ['a1a6', 'b7a6', 'b6b7'], rating: 1500 },

    // Puzzle 5: Brilliant Checkmate in Two - White to play
    { puzzle_id: 'custom5', fen: '8/8/8/2P3R1/5B2/2rP1p2/p1P1PP2/RnQ1K2k w Q - 5 3', moves: ['c1b2', 'b1a3', 'c1d1'], rating: 1200 },

    // Puzzle 6: Mate in 2 - White to play with multiple variations
    {
        puzzle_id: 'custom6',
        fen: '2b3N1/8/1r2pN1b/1p2kp2/1P1R4/8/4K3/6Q1 w - - 0 1',
        moves: [
            'd4f4', // 1.Rf4!
            'h6f4', // 1...Bxf4 (main line)
            'g1c5' // 2.Qc5#
        ],
        rating: 1800
    },

    // Puzzle 7: Queen Sacrifice to Knight Promotion Mate - White to play
    {
        puzzle_id: 'custom7',
        fen: '1B2q1B1/2n1kPR1/R1b2n1Q/2p1r3/8/3Q2B1/4p3/4K3 w - - 0 1',
        moves: [
            'd3d6', // 1.Qd6+
            'e7d6', // 1...Kxd6
            'f7e8n' // 2.fxe8=N#
        ],
        rating: 1800
    },

    // Puzzle 8: Mate in 2 with Multiple Variations - White to play
    {
        puzzle_id: 'custom8',
        fen: '3N4/KPP1p3/3k4/4R3/3P4/6R1/7B/8 w - - 1 1',
        moves: [
            'g3g7', // 1.Rg7
            'd6c7', // 1...Kxc7 (main line)
            'd5d5' // 2.Rd5#
        ],
        rating: 1800
    },

    // Puzzle 9: Mate in Two with Multiple Variations - White to play
    {
        puzzle_id: 'custom9',
        fen: '8/p4p2/Q7/3P4/1p1kB3/1K4N1/5R2/8 w - - 0 1',
        moves: [
            'f2f6', // 1.Rf6
            'd4e5', // 1...Ke5 (main line)
            'a6a1' // 2.Qa1#
        ],
        rating: 2200
    },

    // Puzzle 10: Mate in Two with Multiple Variations - Black to play
    {
        puzzle_id: 'custom10',
        fen: '5B2/8/K7/8/kpp5/7R/8/1B6 w - - 0 1',
        moves: [
            'h3c3', // 1.Rc3
            'b4c3', // 1...bxc3 (main line)
            'b1c2' // 2.Bc2#
        ],
        rating: 2200
    }
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
let timerInterval = null;
let timeRemaining = 0;
let puzzleIndex = 0;

window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");

    // Display a random chess fact
    displayRandomChessFact();

    // Hide the no-js message since JavaScript is clearly working
    if (document.getElementById('no-js')) {
        document.getElementById('no-js').style.display = 'none';
    }

    // Clear all pieces from the board to start with a clean state
    clearAllPieces();

    // Set up the board with proper event listeners
    setUpBoard();
    setUpButtons();

    // Check if confetti is available and provide fallback if needed
    if (typeof confetti === 'undefined') {
        console.warn("Confetti library not loaded. Using fallback.");
        window.confetti = function(options) {
            console.log("Fallback confetti called");
            return {};
        };
    }

    // Add board-wide event delegation for handling clicks
    const board = document.getElementById('board');
    board.addEventListener('click', function(event) {
        let targetSquare = event.target;

        // If we clicked on a span, get its parent div (the square)
        if (targetSquare.tagName.toLowerCase() === 'span') {
            targetSquare = targetSquare.parentElement;
        }

        // Only handle clicks on board squares (divs)
        if (targetSquare.tagName.toLowerCase() === 'div' && targetSquare.id) {
            console.log(`Board click detected on square ${targetSquare.id}`);
            squareClicked(targetSquare);
        }
    });

    // Get URL parameters
    params = getURLSearchParams();

    // force set player rating if in params and is a number
    if (params.get('rating') != null && !isNaN(params.get('rating'))) {
        playerRating = params.get('rating');
        storeLocalPlayerRating(playerRating);
    } else {
        playerRating = getLocalPlayerRating();
    }

    // Add timer display to the UI
    const gameInfoElement = document.getElementById('game-info');

    // Create a timer container that will hold both timer text and progress bar
    const timerContainer = document.createElement('div');
    timerContainer.id = 'timer-container';
    timerContainer.style.position = 'fixed';
    timerContainer.style.left = '20px';
    timerContainer.style.top = '50%';
    timerContainer.style.transform = 'translateY(-50%)';
    timerContainer.style.display = 'flex';
    timerContainer.style.flexDirection = 'column';
    timerContainer.style.alignItems = 'center';
    timerContainer.style.padding = '20px';
    timerContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    timerContainer.style.borderRadius = '10px';
    timerContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    timerContainer.style.zIndex = '100';

    // Create timer element
    const timerElement = document.createElement('div');
    timerElement.id = 'timer';
    timerElement.className = 'timer';
    timerElement.innerHTML = '10:00';
    timerElement.style.fontSize = '36px';
    timerElement.style.fontWeight = 'bold';
    timerElement.style.marginBottom = '10px';
    timerElement.style.fontFamily = 'monospace';

    // Create progress bar container
    const progressBarContainer = document.createElement('div');
    progressBarContainer.style.width = '100px';
    progressBarContainer.style.height = '10px';
    progressBarContainer.style.backgroundColor = '#e0e0e0';
    progressBarContainer.style.borderRadius = '5px';
    progressBarContainer.style.overflow = 'hidden';

    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.id = 'timer-progress';
    progressBar.style.width = '100%';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = '#4CAF50';
    progressBar.style.transition = 'width 1s linear, background-color 0.3s ease';

    // Add elements to their containers
    progressBarContainer.appendChild(progressBar);
    timerContainer.appendChild(timerElement);
    timerContainer.appendChild(progressBarContainer);

    // Add the container to the page
    document.body.appendChild(timerContainer);

    // Create a container for buttons with improved styles
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'button-container';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.gap = '15px';
    buttonContainer.style.margin = '20px auto';
    buttonContainer.style.maxWidth = '400px';
    buttonContainer.style.padding = '0 20px';

    // Add custom puzzles button with improved visibility
    const customPuzzlesButton = document.createElement('button');
    customPuzzlesButton.id = 'custom-puzzles-button';
    customPuzzlesButton.innerHTML = 'Start 10-Puzzle Challenge (10 mins per puzzle)';
    customPuzzlesButton.style.backgroundColor = '#4CAF50';
    customPuzzlesButton.style.color = 'white';
    customPuzzlesButton.style.border = 'none';
    customPuzzlesButton.style.borderRadius = '8px';
    customPuzzlesButton.style.padding = '15px 25px';
    customPuzzlesButton.style.fontSize = '18px';
    customPuzzlesButton.style.fontWeight = 'bold';
    customPuzzlesButton.style.cursor = 'pointer';
    customPuzzlesButton.style.marginBottom = '10px';
    customPuzzlesButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    customPuzzlesButton.addEventListener('click', startCustomPuzzleChallenge);
    buttonContainer.appendChild(customPuzzlesButton);

    // Add force start button with improved visibility
    const forceStartButton = document.createElement('button');
    forceStartButton.id = 'force-start-button';
    forceStartButton.innerHTML = 'Start Chess Puzzles (1-10)';
    forceStartButton.style.backgroundColor = '#FF9D23';
    forceStartButton.style.color = 'white';
    forceStartButton.style.border = 'none';
    forceStartButton.style.borderRadius = '8px';
    forceStartButton.style.padding = '15px 25px';
    forceStartButton.style.fontSize = '18px';
    forceStartButton.style.fontWeight = 'bold';
    forceStartButton.style.cursor = 'pointer';
    forceStartButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    forceStartButton.addEventListener('click', forceCustomPuzzleStart);
    buttonContainer.appendChild(forceStartButton);

    // Create puzzle selection menu with improved visibility
    const puzzleSelectContainer = document.createElement('div');
    puzzleSelectContainer.id = 'puzzle-selector';
    puzzleSelectContainer.style.display = 'flex';
    puzzleSelectContainer.style.flexWrap = 'wrap';
    puzzleSelectContainer.style.justifyContent = 'center';
    puzzleSelectContainer.style.gap = '12px';
    puzzleSelectContainer.style.margin = '20px auto';
    puzzleSelectContainer.style.maxWidth = '600px';
    puzzleSelectContainer.style.padding = '15px';
    puzzleSelectContainer.style.backgroundColor = '#f5f5f5';
    puzzleSelectContainer.style.borderRadius = '10px';
    puzzleSelectContainer.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';

    // Add title for the puzzle selection with improved visibility
    const puzzleSelectTitle = document.createElement('div');
    puzzleSelectTitle.textContent = 'Select a Specific Puzzle:';
    puzzleSelectTitle.style.width = '100%';
    puzzleSelectTitle.style.textAlign = 'center';
    puzzleSelectTitle.style.marginBottom = '15px';
    puzzleSelectTitle.style.fontSize = '18px';
    puzzleSelectTitle.style.fontWeight = 'bold';
    puzzleSelectTitle.style.color = '#333';
    puzzleSelectContainer.appendChild(puzzleSelectTitle);

    // Create buttons for each puzzle with improved visibility
    const puzzleTitles = [
        "Puzzle 1: Queen Sacrifice Mate",
        "Puzzle 2: Knight Fork to Bishop Mate",
        "Puzzle 3: Queen Sacrifice to Bishop Mate",
        "Puzzle 4: Rook Sacrifice Mate in Two",
        "Puzzle 5: Multi-Variation Mate in Two",
        "Puzzle 6: Mate in Two (Black)",
        "Puzzle 7: Knight Dance to Checkmate",
        "Puzzle 8: Mate in Two with Multiple Lines",
        "Puzzle 9: Brilliant Checkmate Sequence",
        "Puzzle 10: Force Checkmate (Black)"
    ];

    for (let i = 0; i < customPuzzles.length; i++) {
        const puzzleButton = document.createElement('button');
        puzzleButton.textContent = `${i + 1}`;
        puzzleButton.title = puzzleTitles[i];
        puzzleButton.style.width = '45px';
        puzzleButton.style.height = '45px';
        puzzleButton.style.borderRadius = '50%';
        puzzleButton.style.border = 'none';
        puzzleButton.style.backgroundColor = '#ddd';
        puzzleButton.style.cursor = 'pointer';
        puzzleButton.style.fontSize = '18px';
        puzzleButton.style.fontWeight = 'bold';
        puzzleButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        // Different colors based on difficulty
        if (i < 2) {
            puzzleButton.style.backgroundColor = '#90EE90'; // Light green for easy
        } else if (i < 6) {
            puzzleButton.style.backgroundColor = '#FFFF99'; // Light yellow for medium
        } else {
            puzzleButton.style.backgroundColor = '#FFA07A'; // Light salmon for hard
        }

        puzzleButton.addEventListener('click', () => {
            loadSpecificPuzzle(i);
        });

        // Add hover effect
        puzzleButton.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            this.style.transition = 'all 0.2s ease';
        });
        puzzleButton.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        });

        puzzleSelectContainer.appendChild(puzzleButton);
    }

    // Create a puzzle tracking panel to show progress
    const puzzleTrackingPanel = document.createElement('div');
    puzzleTrackingPanel.id = 'puzzle-tracking-panel';
    puzzleTrackingPanel.style.display = 'flex';
    puzzleTrackingPanel.style.flexDirection = 'column';
    puzzleTrackingPanel.style.alignItems = 'center';
    puzzleTrackingPanel.style.margin = '15px auto';
    puzzleTrackingPanel.style.padding = '15px';
    puzzleTrackingPanel.style.backgroundColor = '#f5f5f5';
    puzzleTrackingPanel.style.borderRadius = '10px';
    puzzleTrackingPanel.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
    puzzleTrackingPanel.style.maxWidth = '600px';

    // Add a title for the tracking panel
    const trackingTitle = document.createElement('div');
    trackingTitle.textContent = 'Puzzle Progress:';
    trackingTitle.style.fontSize = '18px';
    trackingTitle.style.fontWeight = 'bold';
    trackingTitle.style.marginBottom = '10px';
    puzzleTrackingPanel.appendChild(trackingTitle);

    // Create a container for the indicators
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.style.display = 'flex';
    indicatorsContainer.style.flexWrap = 'wrap';
    indicatorsContainer.style.justifyContent = 'center';
    indicatorsContainer.style.gap = '10px';
    indicatorsContainer.style.marginBottom = '10px';

    // Create an indicator for each puzzle
    for (let i = 0; i < customPuzzles.length; i++) {
        const indicator = document.createElement('div');
        indicator.id = `puzzle-indicator-${i}`;
        indicator.textContent = i + 1;
        indicator.style.width = '30px';
        indicator.style.height = '30px';
        indicator.style.borderRadius = '50%';
        indicator.style.backgroundColor = '#ddd'; // Default color (unsolved)
        indicator.style.display = 'flex';
        indicator.style.justifyContent = 'center';
        indicator.style.alignItems = 'center';
        indicator.style.fontWeight = 'bold';
        indicator.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        indicatorsContainer.appendChild(indicator);
    }

    puzzleTrackingPanel.appendChild(indicatorsContainer);

    // Add an overall progress indicator
    const overallProgress = document.createElement('div');
    overallProgress.id = 'overall-progress';
    overallProgress.textContent = 'Solved: 0/10';
    overallProgress.style.fontSize = '16px';
    overallProgress.style.fontWeight = 'bold';
    puzzleTrackingPanel.appendChild(overallProgress);

    // Get the board element to insert containers
    const boardElement = document.getElementById('board');

    // Make sure we insert the elements in the correct order
    // First, add puzzleSelectContainer before buttonContainer
    document.body.insertBefore(puzzleSelectContainer, boardElement.nextSibling);

    // Then, add the tracking panel after puzzleSelectContainer
    document.body.insertBefore(puzzleTrackingPanel, puzzleSelectContainer.nextSibling);

    // Then, add buttonContainer after puzzleTrackingPanel
    document.body.insertBefore(buttonContainer, puzzleTrackingPanel.nextSibling);

    // Initialize game with empty board
    game = new Game();
    currentStatus = game.exportJson();
    currentFEN = '';

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button');
    Array.from(buttons).forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
            this.style.transition = 'all 0.3s ease';
        });
        button.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        });
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
            this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        });
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
        });
    });

    // Ensure the board is clear of all classes
    console.log("Initial board setup complete");

    // Create and add the hints panel
    createHintsPanel();
    updateHints(0); // Show hints for the first puzzle initially
});

function setUpBoard() {
    console.log("Setting up board");

    if (document.getElementById("no-js")) {
        document.getElementById("no-js").remove();
    }

    // First, clear all pieces from the board
    clearAllPieces();

    const board = document.getElementById('board');
    const squares = board.querySelectorAll('div');

    console.log("Setting up board with", squares.length, "squares");

    // Remove any existing event listeners
    squares.forEach(square => {
        const newSquare = square.cloneNode(true);
        square.parentNode.replaceChild(newSquare, square);
    });

    // Get the updated squares after cloning
    const updatedSquares = board.querySelectorAll('div');

    // Ensure all squares have a span element and no piece classes
    updatedSquares.forEach(square => {
        // Remove all piece classes
        pieces.forEach(piece => {
            square.classList.remove(piece);
        });

        if (square.querySelector('span') === null) {
            const span = document.createElement('span');
            square.appendChild(span);
        }

        // Add event listeners directly
        square.addEventListener('pointerdown', function(event) {
            console.log(`Square ${square.id} was clicked!`);
            squareClicked(square);
        });
    });

    console.log("Board setup complete with all pieces cleared");
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
    console.log("Clearing board");
    const board = document.getElementById('board');
    const squares = board.querySelectorAll('div');
    squares.forEach(square => {
        // Preserve the span element
        const span = square.querySelector('span');
        square.className = '';

        // Re-add the span if it was removed
        if (!square.contains(span) && span) {
            square.appendChild(span);
        } else if (!square.querySelector('span')) {
            const newSpan = document.createElement('span');
            square.appendChild(newSpan);
        }
    });
}

function loadBoard(fen) {
    console.log("Loading board with FEN:", fen);
    const fenArr = fen.split(' ');
    const piecePlacement = fenArr[0];

    // Clear the board first by removing all piece classes
    clearAllPieces();

    // Process the FEN string: replace numbers with spaces and remove forward slashes
    let newPiecePlacement = piecePlacement
        .replace(/[0-8]/g, match => " ".repeat(parseInt(match)))
        .replace(/\//g, '');

    console.log("Processed piece placement:", newPiecePlacement);

    // Add only the pieces specified in the FEN
    for (let i = 0; i < newPiecePlacement.length; i++) {
        const square = document.getElementById(fenPositions[i]);
        if (!square) {
            console.error(`Square with ID ${fenPositions[i]} not found!`);
            continue;
        }

        if (newPiecePlacement[i] !== ' ') {
            console.log(`Adding ${newPiecePlacement[i]} to ${fenPositions[i]}`);
            square.classList.add(newPiecePlacement[i]);

            // Ensure the square has a span element
            if (!square.querySelector('span')) {
                const span = document.createElement('span');
                square.appendChild(span);
            }
        }
    }

    // Re-apply event listeners
    const board = document.getElementById('board');
    const squares = board.querySelectorAll('div');
    squares.forEach(square => {
        square.addEventListener('pointerdown', function(event) {
            console.log(`Square ${square.id} was clicked!`);
            squareClicked(square);
        });
    });
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
    console.log("Selecting piece:", element.id, element.className);

    const selectedPiece = currentStatus.pieces[element.id.toUpperCase()];
    console.log("Selected piece from game state:", selectedPiece);

    let canSelectPiece = false;
    if (currentStatus.turn === 'white' && selectedPiece === selectedPiece.toUpperCase()) {
        // white turn and white piece selected
        canSelectPiece = true;
    } else if (currentStatus.turn === 'black' && selectedPiece === selectedPiece.toLowerCase()) {
        // black turn and black piece selected
        canSelectPiece = true;
    }

    console.log("Can select piece:", canSelectPiece, "Current turn:", currentStatus.turn);

    const selectedPieceValidMoves = currentStatus.moves[element.id.toUpperCase()];
    console.log("Valid moves:", selectedPieceValidMoves);

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
    console.log(`Computer moving from ${from} to ${to}`);
    console.log(`Current puzzle index: ${puzzleIndex}, lastPuzzleMoveIndex: ${lastPuzzleMoveIndex}`);
    console.log(`Current FEN: ${currentFEN}`);

    // Check if the source and target squares exist
    const fromSquare = document.getElementById(from);
    const toSquare = document.getElementById(to);

    if (!fromSquare || !toSquare) {
        console.error(`Invalid move: ${from} to ${to} - squares not found`);
        return;
    }

    // Special debugging for puzzle 7
    if (puzzleIndex === 6) {
        console.log(`Puzzle 7 computer move from ${from} to ${to} at index ${lastPuzzleMoveIndex}`);
        console.log(`Expected next player move: ${currentPuzzle.moves[lastPuzzleMoveIndex+1]}`);
    }

    // wait the specified delay then move piece
    setTimeout(() => {
        try {
            console.log(`Executing computer move from ${from} to ${to}`);
            console.log(`Before move - lastPuzzleMoveIndex: ${lastPuzzleMoveIndex}`);

            // Use a try-catch for movePiece to prevent screen blanking
            try {
                movePiece(from, to);
            } catch (error) {
                console.error("Error in movePiece:", error);
                // Load the FEN directly if movePiece fails
                loadFen(currentPuzzle.fen);
                return;
            }

            // For puzzle 7, we need to increment the move index after the computer's move
            if (puzzleIndex === 6) {
                lastPuzzleMoveIndex++;
                console.log(`After computer move - lastPuzzleMoveIndex: ${lastPuzzleMoveIndex}`);
                console.log(`Next expected player move: ${currentPuzzle.moves[lastPuzzleMoveIndex]}`);
            } else {
                lastPuzzleMoveIndex++;
            }

            console.log(`After move - lastPuzzleMoveIndex: ${lastPuzzleMoveIndex}`);
            console.log(`Next expected player move (if any): ${currentPuzzle.moves[lastPuzzleMoveIndex]}`);

        } catch (error) {
            console.error("Error in computerMove:", error);
            // If there's an error in the move, try to recover
            loadFen(currentPuzzle.fen);
        }
    }, speed);
}

function playerMove(from, to) {
    console.log(`Attempting to move from ${from} to ${to}`);
    console.log(`Player move: ${from}${to}`);

    // Make the move first to check for checkmate
    game.move(from, to);
    const newStatus = game.exportJson();
    const isCheckmate = newStatus.isFinished && newStatus.checkMate;

    // Undo the move to continue with normal flow
    game = new Game(currentFEN);
    currentStatus = game.exportJson();

    // Special handling for puzzle 1 (Queen sacrifice mate)
    if (puzzleIndex === 0) {
        // First player move in puzzle 1 - Queen sacrifice
        if (lastPuzzleMoveIndex === 0 && from === "h4" && to === "h7") {
            console.log("Correct! Queen sacrifice move detected");
            puzzleMoveGood(from, to);
            return;
        }
        // Third player move in puzzle 1 - Rook mate
        else if (lastPuzzleMoveIndex === 2 && from === "f3" && to === "h3") {
            console.log("Correct! Checkmate move detected");
            puzzleMoveGood(from, to);
            return;
        } else {
            // Any other move in puzzle 1 is wrong
            console.log(`Incorrect move for puzzle 1. lastPuzzleMoveIndex: ${lastPuzzleMoveIndex}, move: ${from}${to}`);
            console.log(`Expected moves for puzzle 1: 0:h4h7, 2:f3h3`);
            puzzleMoveBad(from, to);
            return;
        }
    }

    // Special handling for puzzle 3 (Queen sacrifice to Bishop mate)
    if (puzzleIndex === 2) {
        // First move in puzzle 3 - Queen sacrifice
        if (lastPuzzleMoveIndex === 0 && from === "f2" && to === "f6") {
            console.log("Correct! Queen sacrifice move detected in puzzle 3");
            puzzleMoveGood(from, to);
            return;
        }
        // Final move in puzzle 3 - Bishop checkmate
        else if (lastPuzzleMoveIndex === 2 && from === "b3" && to === "h6") {
            console.log("Correct! Bishop checkmate move detected in puzzle 3");
            puzzleMoveGood(from, to);
            return;
        } else {
            console.log(`Incorrect move for puzzle 3. lastPuzzleMoveIndex: ${lastPuzzleMoveIndex}, move: ${from}${to}`);
            puzzleMoveBad(from, to);
            return;
        }
    }

    // Special handling for puzzle 4 (Rook sacrifice to pawn mate)
    if (puzzleIndex === 3) {
        console.log(`Puzzle 4 move validation - lastPuzzleMoveIndex: ${lastPuzzleMoveIndex}, move: ${from}${to}`);
        console.log(`Current expected move: ${currentPuzzle.moves[lastPuzzleMoveIndex]}`);
        console.log(`All expected moves: ${JSON.stringify(currentPuzzle.moves)}`);

        // First move in puzzle 4 - Rook sacrifice
        if (lastPuzzleMoveIndex === 0 && from === "a1" && to === "a6") {
            console.log("Correct! Rook sacrifice move detected in puzzle 4");
            puzzleMoveGood(from, to);
            return;
        } else {
            console.log(`Incorrect move for puzzle 4. lastPuzzleMoveIndex: ${lastPuzzleMoveIndex}, move: ${from}${to}`);
            console.log(`Expected move at index ${lastPuzzleMoveIndex}: ${currentPuzzle.moves[lastPuzzleMoveIndex]}`);
            puzzleMoveBad(from, to);
            return;
        }
    }

    // Special handling for puzzle 7 (Knight dance to checkmate)
    if (puzzleIndex === 6) {
        console.log(`Puzzle 7 player move attempt: ${from}${to}`);
        console.log(`Current lastPuzzleMoveIndex: ${lastPuzzleMoveIndex}`);

        // Use the hardcoded validation function for more reliable validation
        if (validatePuzzle7Move(from, to, lastPuzzleMoveIndex)) {
            console.log(`CORRECT! Player made the expected move ${from}${to}`);

            // Make the move on the board immediately
            movePiece(from, to);

            // Increment the move index for the computer's response
            lastPuzzleMoveIndex++;

            // Check if we've reached the end of the puzzle
            if (lastPuzzleMoveIndex >= currentPuzzle.moves.length) {
                console.log("Puzzle 7 completed!");
                updateMessage(`<p>Checkmate!</p><p>Brilliant knight maneuver!</p>`, 'good');
                puzzle_solved = true;
                showCongratulations(true);

                // Update the puzzle indicator to green for solved
                const indicator = document.getElementById(`puzzle-indicator-${puzzleIndex}`);
                if (indicator) {
                    indicator.style.backgroundColor = '#90EE90'; // Green for solved
                }

                // Update the puzzle button to show completion
                const puzzleButtons = document.querySelectorAll('#puzzle-selector button');
                if (puzzleButtons[puzzleIndex]) {
                    puzzleButtons[puzzleIndex].style.backgroundColor = '#90EE90';
                    puzzleButtons[puzzleIndex].style.color = '#006400';
                    puzzleButtons[puzzleIndex].style.border = '2px solid #006400';
                }

                // Load next puzzle after delay
                setTimeout(() => {
                    puzzleIndex++;
                    if (puzzleIndex < customPuzzles.length) {
                        loadCustomPuzzle(puzzleIndex);
                    } else {
                        updateMessage('<p>Congratulations!</p><p>You\'ve completed all puzzles!</p>', 'good');
                    }
                }, 4000);
                return;
            }

            // Make the computer's move after a delay
            try {
                const nextComputerMove = currentPuzzle.moves[lastPuzzleMoveIndex];
                if (!nextComputerMove) {
                    console.error(`No computer move found at index ${lastPuzzleMoveIndex}`);
                    // Recover by staying on this puzzle
                    updateMessage('<p>Error in puzzle sequence. Try again.</p>', 'bad');
                    return;
                }

                const computerFrom = nextComputerMove.substring(0, 2);
                const computerTo = nextComputerMove.substring(2, 4);

                console.log(`Computer will move from ${computerFrom} to ${computerTo}`);

                setTimeout(() => {
                    try {
                        computerMove(computerFrom, computerTo);
                        updateMessage('<p>Good move, keep going!</p>');
                    } catch (error) {
                        console.error("Error making computer's move:", error);
                        // Try to recover
                        loadFen(currentPuzzle.fen);
                        updateMessage('<p>Error in move sequence. Try again.</p>', 'bad');
                    }
                }, speed);
            } catch (error) {
                console.error("Error processing computer's response:", error);
                // Try to recover
                loadFen(currentPuzzle.fen);
                lastPuzzleMoveIndex = 0;
                updateMessage('<p>Error in puzzle. Restarting...</p>', 'bad');
            }

            return;
        } else {
            console.log(`INCORRECT move for puzzle 7. Got: ${from}${to}`);
            updateMessage('Incorrect move. Try again.', 'bad');
            return;
        }
    }

    // For other puzzles, proceed with normal move validation
    try {
        const expectedMove = currentPuzzle.moves[lastPuzzleMoveIndex];
        console.log("Expected move:", expectedMove);
        console.log("Player's move:", `${from}${to}`);

        // Check if the move results in checkmate or is the expected move
        if (isCheckmate || expectedMove === `${from}${to}`) {
            console.log("Correct move detected!");
            puzzleMoveGood(from, to);
        } else {
            console.log(`Incorrect move: Expected '${expectedMove}', got '${from}${to}'`);
            puzzleMoveBad(from, to);
        }
    } catch (error) {
        console.error("Error in playerMove:", error);
        updateMessage('<p>Error processing move. Please try again.</p>', 'bad');
    }
}

function puzzleMoveGood(from, to, promote = null) {
    console.log(`puzzleMoveGood called - from: ${from}, to: ${to}, lastPuzzleMoveIndex before: ${lastPuzzleMoveIndex}`);

    movePiece(from, to, promote);
    lastPuzzleMoveIndex++;

    console.log(`lastPuzzleMoveIndex after increment: ${lastPuzzleMoveIndex}`);
    console.log(`Next expected move (if any): ${currentPuzzle.moves[lastPuzzleMoveIndex]}`);

    // Check if we've reached the end of the puzzle moves or if checkmate has been achieved
    const isCheckmate = currentStatus.isFinished && currentStatus.checkMate;
    const isLastMove = lastPuzzleMoveIndex >= currentPuzzle.moves.length;

    if (isCheckmate || isLastMove) {
        // Special message for checkmate
        let successMessage = `<p>Puzzle ${puzzleIndex + 1} complete!</p><p>Great job!</p>`;
        if (isCheckmate || (puzzleIndex === 0 && from === 'f3' && to === 'h3')) {
            successMessage = `<p>Checkmate!</p><p>Brilliant move!</p>`;
        }

        updateMessage(successMessage, 'good');
        puzzle_solved = true;
        stopTimer();

        // Show extra impressive congratulations for checkmate
        showCongratulations(isCheckmate);

        // Update the puzzle indicator to green for solved
        const indicator = document.getElementById(`puzzle-indicator-${puzzleIndex}`);
        if (indicator) {
            indicator.style.backgroundColor = '#90EE90'; // Green for solved
        }

        // Update overall progress
        if (typeof updateOverallProgress === 'function') {
            updateOverallProgress();
        }

        // Update the puzzle button to show completion
        const puzzleButtons = document.querySelectorAll('#puzzle-selector button');
        if (puzzleButtons[puzzleIndex]) {
            puzzleButtons[puzzleIndex].style.backgroundColor = '#90EE90'; // Green to indicate completion
            puzzleButtons[puzzleIndex].style.color = '#006400'; // Dark green text
            puzzleButtons[puzzleIndex].style.border = '2px solid #006400';
        }

        // Load next puzzle after delay - longer delay for checkmate
        setTimeout(() => {
            puzzleIndex++;
            if (puzzleIndex < customPuzzles.length) {
                // Load the next puzzle
                loadCustomPuzzle(puzzleIndex);
            } else {
                // All puzzles completed
                updateMessage('<p>Congratulations!</p><p>You\'ve completed all 10 puzzles!</p>', 'good');
                document.getElementById('custom-puzzles-button').disabled = false;
            }
        }, isCheckmate ? 4000 : 3000); // Longer delay for checkmate
    } else {
        // For multi-move puzzles, show encouragement and make the computer's move
        updateMessage('<p>Good move, keep going!</p>');

        // Add a small delay before the computer makes its move
        setTimeout(() => {
            try {
                const nextMove = currentPuzzle.moves[lastPuzzleMoveIndex];
                const fromSquare = nextMove.substring(0, 2);
                const toSquare = nextMove.substring(2, 4);

                console.log(`Computer will move from ${fromSquare} to ${toSquare}, lastPuzzleMoveIndex: ${lastPuzzleMoveIndex}`);
                computerMove(fromSquare, toSquare);
            } catch (error) {
                console.error("Error making computer move:", error);
            }
        }, speed);
    }
}

function puzzleMoveBad(from, to) {
    // Don't show wrong move if the puzzle is already solved
    if (puzzle_solved) {
        console.log("Puzzle already solved, ignoring bad move");
        return;
    }

    // Check if the move resulted in checkmate - if so, treat as correct
    game.move(from, to);
    const newStatus = game.exportJson();
    const isCheckmate = newStatus.isFinished && newStatus.checkMate;

    // If move resulted in checkmate, handle as a good move instead
    if (isCheckmate) {
        console.log("Move resulted in checkmate, treating as correct!");
        game = new Game(currentFEN); // Reset to before the move
        currentStatus = game.exportJson();
        puzzleMoveGood(from, to); // Process as a good move
        return;
    }

    // Reset the game state before continuing with bad move handling
    game = new Game(currentFEN);
    currentStatus = game.exportJson();

    console.log("Wrong move detected");
    const backupStatus = currentFEN;
    const backupPrevious = document.querySelectorAll('.previous');
    movePiece(from, to);
    updateMessage('Incorrect move. Moving to next puzzle...', 'bad');
    puzzle_solved_clean = false;

    // Update the puzzle indicator to red for failed if the function exists
    const indicator = document.getElementById(`puzzle-indicator-${puzzleIndex}`);
    if (indicator) {
        indicator.style.backgroundColor = '#FF6347'; // Red for failed
    }

    // Update overall progress if the function exists
    if (typeof updateOverallProgress === 'function') {
        updateOverallProgress();
    }

    // Show wrong move animation with big red X
    showWrongMoveAnimation();

    // Calculate rating change for incorrect move
    calculateRatingChange(currentPuzzle.rating, false);

    // Move to the next puzzle after a delay
    setTimeout(() => {
        // Load backup state for a moment so the user can see what happened
        loadFen(backupStatus);
        backupPrevious.forEach(element => {
            element.classList.add('previous');
        });

        // Move to the next puzzle after showing the error
        setTimeout(() => {
            puzzleIndex++;
            if (puzzleIndex < customPuzzles.length) {
                // Load the next puzzle
                loadCustomPuzzle(puzzleIndex);
            } else {
                // All puzzles completed
                updateMessage('<p>All puzzles attempted!</p><p>Try again to improve your score.</p>', 'good');
                document.getElementById('custom-puzzles-button').disabled = false;
            }
        }, 2000);
    }, 500);
}

// Function to show wrong move animation with a big red X
function showWrongMoveAnimation() {
    // Don't show wrong move animation if puzzle is solved (checkmate achieved)
    if (puzzle_solved) {
        console.log("Puzzle already solved, not showing wrong move animation");
        return;
    }

    // Create overlay for the wrong move animation
    const overlay = document.createElement('div');
    overlay.id = 'wrong-move-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease-in-out';

    // Create the X symbol
    const xSymbol = document.createElement('div');
    xSymbol.style.fontSize = '150px';
    xSymbol.style.fontWeight = 'bold';
    xSymbol.style.color = 'red';
    xSymbol.style.textShadow = '0 0 20px rgba(0, 0, 0, 0.7)';
    xSymbol.innerHTML = '&#10006;'; // X symbol
    xSymbol.style.transform = 'scale(0.5)';
    xSymbol.style.transition = 'transform 0.5s ease-in-out';

    overlay.appendChild(xSymbol);
    document.body.appendChild(overlay);

    // Animate the overlay and X
    setTimeout(() => {
        overlay.style.opacity = '1';
        xSymbol.style.transform = 'scale(1.5)';

        // Fade out after showing
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }, 1500);
    }, 10);
}

function movePiece(from, to, promote = null) {
    console.log(`movePiece called: from=${from}, to=${to}, promote=${promote}`);

    try {
        // Clear the board first
        clearAllPieces();

        // Special handling for puzzle 7 to ensure we don't lose the board state
        if (puzzleIndex === 6) {
            console.log("Special handling for puzzle 7 in movePiece");

            // Store the current FEN before making the move
            const backupFEN = currentFEN;

            try {
                // Make the move in the game engine
                game.move(from, to);

                // Handle promotion if specified
                if (promote) {
                    if (currentStatus.turn === "white") {
                        game.setPiece(to, promote.toUpperCase());
                    } else {
                        game.setPiece(to, promote.toLowerCase());
                    }
                }

                // Update game state
                currentStatus = game.exportJson();
                currentFEN = game.exportFEN();

                // Load only the pieces from the current FEN
                loadBoard(currentFEN);

                // Mark the squares involved in the move
                document.getElementById(from).classList.add('previous');
                document.getElementById(to).classList.add('previous');
            } catch (error) {
                console.error("Error in puzzle 7 movePiece:", error);

                // Restore from backup
                console.log("Restoring board from backup FEN");
                loadFen(backupFEN);

                // Update message to indicate error
                updateMessage('<p>Error in move. Try again.</p>', 'bad');
            }

            return;
        }

        // Standard move handling for other puzzles
        // Make the move in the game engine
        game.move(from, to);

        // Handle promotion if specified
        if (promote) {
            if (currentStatus.turn === "white") {
                game.setPiece(to, promote.toUpperCase());
            } else {
                game.setPiece(to, promote.toLowerCase());
            }
        }

        // Update game state
        currentStatus = game.exportJson();
        currentFEN = game.exportFEN();

        // Load only the pieces from the current FEN
        loadBoard(currentFEN);

        // Mark the squares involved in the move
        document.getElementById(from).classList.add('previous');
        document.getElementById(to).classList.add('previous');
    } catch (error) {
        console.error("Error in movePiece:", error);

        // Try to recover by reloading the current FEN if available
        if (currentFEN) {
            console.log("Attempting to recover by reloading current FEN");
            loadFen(currentFEN);
        } else if (currentPuzzle && currentPuzzle.fen) {
            console.log("Attempting to recover by reloading puzzle FEN");
            loadFen(currentPuzzle.fen);
        }

        // Show error message
        updateMessage('<p>Error making move. Please try again.</p>', 'bad');
    }
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
    console.log("Loading FEN:", fen);
    try {
        if (validateFEN(fen)) {
            // First, completely clear the board
            clearAllPieces();

            // Create a completely new game instance
            game = new Game();

            // Load the FEN into the game engine
            game.loadFEN(fen);

            // Update our state variables
            currentFEN = fen;
            currentStatus = game.exportJson();
            console.log("Game status after loading FEN:", currentStatus);

            // Now load only the pieces specified in the FEN
            loadBoard(currentFEN);

            console.log("Board loaded with specified pieces only");
        } else {
            console.error('Invalid FEN:', fen);
            throw new Error('Invalid FEN');
        }
    } catch (error) {
        console.error("Error in loadFen:", error);
        // Fall back to starting position if there's an error
        const startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        currentFEN = startingFen;
        game = new Game(startingFen);
        currentStatus = game.exportJson();
        loadBoard(currentFEN);
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
function showCongratulations(isCheckmate = false) {
    // Create a container for the congratulations message
    const congratsContainer = document.createElement('div');
    congratsContainer.className = 'congrats-container';
    congratsContainer.style.position = 'fixed';
    congratsContainer.style.top = '50%';
    congratsContainer.style.left = '50%';
    congratsContainer.style.transform = 'translate(-50%, -50%)';
    congratsContainer.style.zIndex = '1000';
    congratsContainer.style.backgroundColor = isCheckmate ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    congratsContainer.style.padding = '30px 50px';
    congratsContainer.style.borderRadius = '15px';
    congratsContainer.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.5)';
    congratsContainer.style.textAlign = 'center';
    congratsContainer.style.animation = 'pulse 1s infinite';

    // Add pulsing animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.05); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes trophy-spin {
            0% { transform: rotate(-15deg); }
            50% { transform: rotate(15deg); }
            100% { transform: rotate(-15deg); }
        }
    `;
    document.head.appendChild(style);

    // Create congratulations message
    const message = document.createElement('h2');
    message.textContent = isCheckmate ? 'CHECKMATE! BRILLIANT!' : 'Puzzle Solved!';
    message.style.color = isCheckmate ? '#8B0000' : '#006400';
    message.style.fontSize = isCheckmate ? '36px' : '32px';
    message.style.fontWeight = 'bold';
    message.style.margin = '0 0 20px 0';
    congratsContainer.appendChild(message);

    // Add a trophy or crown icon for checkmate
    if (isCheckmate) {
        const trophy = document.createElement('div');
        trophy.innerHTML = '👑';
        trophy.style.fontSize = '60px';
        trophy.style.margin = '10px auto';
        trophy.style.animation = 'trophy-spin 1.5s infinite';
        trophy.style.display = 'inline-block';
        congratsContainer.appendChild(trophy);
    }

    // Add the container to the page
    document.body.appendChild(congratsContainer);

    // Configure confetti for celebration
    const duration = isCheckmate ? 3 : 2; // seconds (reduced from 6/4)
    const particleCount = isCheckmate ? 150 : 100; // reduced particle count

    confetti({
        particleCount: particleCount,
        spread: 70,
        origin: { y: 0.6 },
        colors: isCheckmate ? ['#FFD700', '#FFA500', '#FF4500', '#8B0000'] : ['#00FF00', '#32CD32', '#00FA9A', '#90EE90']
    });

    // For checkmate, add an extra confetti burst after a delay
    if (isCheckmate) {
        setTimeout(() => {
            confetti({
                particleCount: 150,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FFD700', '#FFA500', '#FF4500']
            });
        }, 300);

        setTimeout(() => {
            confetti({
                particleCount: 150,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FFD700', '#FFA500', '#FF4500']
            });
        }, 600);
    }

    // Remove the message after the celebration and advance to next puzzle
    setTimeout(() => {
        congratsContainer.style.opacity = '0';
        congratsContainer.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.body.removeChild(congratsContainer);

            // Automatically advance to the next puzzle
            puzzleIndex++;
            if (puzzleIndex < customPuzzles.length) {
                loadCustomPuzzle(puzzleIndex);
            } else {
                // All puzzles completed
                updateMessage('<p>Congratulations!</p><p>You\'ve completed all 10 puzzles!</p>', 'good');
                document.getElementById('custom-puzzles-button').disabled = false;
            }
        }, 500);
    }, duration * 1000);
}

// Start the custom puzzle challenge with 10 puzzles and a timer
function startCustomPuzzleChallenge() {
    console.log("Starting custom puzzle challenge");
    puzzleIndex = 0; // Reset to first puzzle

    try {
        // Initialize game with the first puzzle
        currentPuzzle = customPuzzles[puzzleIndex];
        game = new Game(currentPuzzle.fen);
        currentStatus = game.exportJson();
        currentFEN = currentPuzzle.fen;

        // Load the board with the first puzzle
        loadBoard(currentFEN);

        // Update puzzle message
        const puzzleTitles = [
            "Puzzle 1: Queen Sacrifice Mate",
            "Puzzle 2: Knight Fork",
            "Puzzle 3: Queen Sacrifice",
            "Puzzle 4: Rook Sacrifice Mate in Two",
            "Puzzle 5: Mate in Two (White)",
            "Puzzle 6: Mate in Two (Black)",
            "Puzzle 7: Knight Dance to Checkmate",
            "Puzzle 8: Rook Sacrifice to Knight Promotion Mate",
            "Puzzle 9: Brilliant Checkmate Sequence",
            "Puzzle 10: Mate in Two with Multiple Variations"
        ];

        const puzzleDescriptions = [
            "White to play: Find the checkmate in 2 moves", // Updated description for Puzzle 1
            "White to play: Find the knight fork followed by a bishop checkmate",
            "White to play: Find the queen sacrifice followed by a bishop checkmate",
            "White to play: Find the forced checkmate in two moves with a rook sacrifice",
            "White to play: Find the brilliant Qb2! leading to forced mate (multiple variations)",
            "White to play: Find the brilliant Rf4! leading to forced mate in 2 moves (multiple variations)",
            "White to play: Start with Qd6+ and find the forced mate in 2 moves with a knight promotion",
            "White to play: Find the brilliant rook sacrifice leading to a knight promotion checkmate",
            "White to play: Find the brilliant sequence of moves leading to checkmate",
            "White to play: Find the forced mate in three moves"
        ];

        updateMessage(`<p>${puzzleTitles[puzzleIndex]}</p><p>Your Move: ${puzzleDescriptions[puzzleIndex]}</p>`, '');

        // Flip board based on whose turn it is
        if (currentStatus.turn === 'white') {
            flipBoard(false);
        } else {
            flipBoard(true);
        }

        // Reset puzzle state
        puzzle_solved = false;
        lastPuzzleMoveIndex = 0;

        // Start the timer
        startTimer(10 * 60);

        // Disable the start button
        document.getElementById('custom-puzzles-button').disabled = true;

        // Update game info and debug
        updateGameInfo();
        updateDebug();

        // Highlight the current puzzle button
        highlightCurrentPuzzleButton(puzzleIndex);

    } catch (error) {
        console.error("Error starting puzzle challenge:", error);
        updateMessage('<p>Error starting puzzles.</p><p>Please try refreshing the page.</p>', 'bad');
    }
}

// Function to completely clear all pieces from the board
function clearAllPieces() {
    console.log("Clearing all pieces from the board");

    try {
        const board = document.getElementById('board');
        if (!board) {
            console.error("Board element not found!");
            return;
        }

        const squares = board.querySelectorAll('div');
        if (squares.length === 0) {
            console.error("No squares found on the board!");
            return;
        }

        console.log(`Clearing ${squares.length} squares`);

        // Remove all piece classes from each square
        squares.forEach(square => {
            // Clear all classes first
            const squareId = square.id;
            const squareClasses = [...square.classList];

            // Remove each piece class individually
            pieces.forEach(piece => {
                if (square.classList.contains(piece)) {
                    console.log(`Removing ${piece} from ${squareId}`);
                    square.classList.remove(piece);
                }
            });

            // As a fallback, reset all classes completely
            if (squareClasses.some(cls => pieces.includes(cls))) {
                const originalClasses = square.className;
                square.className = ''; // Clear all classes
                console.log(`Reset all classes on ${squareId} from "${originalClasses}" to ""`);
            }

            // Ensure each square has a span element
            if (!square.querySelector('span')) {
                const span = document.createElement('span');
                square.appendChild(span);
                console.log(`Added missing span to ${squareId}`);
            }
        });

        console.log("Board completely cleared of all pieces");
    } catch (error) {
        console.error("Error in clearAllPieces:", error);
    }
}

// Load a custom puzzle by index
function loadCustomPuzzle(index) {
    console.log("Loading custom puzzle", index);
    if (index >= customPuzzles.length) {
        updateMessage('<p>Challenge completed!</p><p>All 10 puzzles finished!</p>', 'good');
        stopTimer();
        document.getElementById('custom-puzzles-button').disabled = false;
        return;
    }

    // Special case for puzzle 7
    if (index === 6) {
        setupPuzzle7();
        return;
    }

    // Special case for puzzle 8
    if (index === 7) {
        setupPuzzle8();
        return;
    }

    // Reset puzzle state
    puzzle_solved = false;
    lastPuzzleMoveIndex = 0; // Reset move index to start

    currentPuzzle = customPuzzles[index];

    // Debug the puzzle being loaded
    console.log("Current puzzle:", currentPuzzle);
    console.log("Puzzle FEN:", currentPuzzle.fen);
    console.log("Puzzle moves:", JSON.stringify(currentPuzzle.moves));
    console.log(`Initial lastPuzzleMoveIndex value: ${lastPuzzleMoveIndex}`);

    try {
        // First clear all pieces from the board
        clearAllPieces();

        // Initialize game with empty board
        game = new Game();

        // Load only the specified FEN
        game.loadFEN(currentPuzzle.fen);
        currentStatus = game.exportJson();
        currentFEN = currentPuzzle.fen;

        // Log move index and state for debugging
        console.log(`After loading puzzle ${index}, lastPuzzleMoveIndex: ${lastPuzzleMoveIndex}`);

        // Load only the pieces specified in the FEN
        loadBoard(currentFEN);

        // Get puzzle descriptions based on the index
        const puzzleDescriptions = [
            "White to play: Find the checkmate in 2 moves starting with a queen sacrifice",
            "White to play: Find the knight fork followed by a bishop checkmate",
            "White to play: Find the queen sacrifice followed by a bishop checkmate",
            "White to play: Find the forced checkmate in two moves with a rook sacrifice",
            "White to play: Find the brilliant Qb2! leading to forced mate (multiple variations)",
            "White to play: Find the brilliant Rf4! leading to forced mate in 2 moves (multiple variations)",
            "White to play: Start with Qd6+ and find the forced mate in 2 moves with a knight promotion",
            "White to play: Find the brilliant rook sacrifice leading to a knight promotion checkmate",
            "White to play: Find the brilliant sequence of moves leading to checkmate",
            "White to play: Find the forced mate in three moves"
        ];

        const puzzleTitles = [
            "Puzzle 1: Queen Sacrifice Mate",
            "Puzzle 2: Knight Fork to Bishop Mate",
            "Puzzle 3: Queen Sacrifice to Bishop Mate",
            "Puzzle 4: Rook Sacrifice Mate in Two",
            "Puzzle 5: Multi-Variation Mate in Two",
            "Puzzle 6: Mate in Two (Black)",
            "Puzzle 7: Knight Dance to Checkmate",
            "Puzzle 8: Mate in Two with Multiple Lines",
            "Puzzle 9: Brilliant Checkmate Sequence",
            "Puzzle 10: Force Checkmate (Black)"
        ];

        // Update puzzle message
        updateMessage(`<p>${puzzleTitles[index]}</p><p>Your Move: ${puzzleDescriptions[index]}</p>`, '');

        // Flip the board based on whose turn it is
        if (currentStatus.turn === 'white') {
            flipBoard(false);
        } else {
            flipBoard(true);
        }

        // Highlight the current puzzle button
        highlightCurrentPuzzleButton(index);

        // Start a 10-minute timer for this puzzle
        startTimer(10 * 60);

        // Update game info and debug
        updateGameInfo();
        updateDebug();

    } catch (error) {
        console.error("Error loading puzzle:", error);
        // Try to load the next puzzle
        puzzleIndex++;
        loadCustomPuzzle(puzzleIndex);
    }
}

// Start a timer with given seconds
function startTimer(seconds) {
    // Clear any existing timer
    stopTimer();

    timeRemaining = seconds;

    // Reset timer appearance
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.classList.remove('timer-warning', 'timer-critical');
    }

    // Reset progress bar
    const progressBar = document.getElementById('timer-progress');
    if (progressBar) {
        progressBar.style.width = '100%';
        progressBar.style.backgroundColor = '#4CAF50'; // Reset to green
    }

    // Update display first
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            handleTimeUp();
        }
    }, 1000);
}

// Stop the timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Update the timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const timerElement = document.getElementById('timer');

    if (timerElement) {
        timerElement.innerHTML = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Update timer color based on time remaining
        if (timeRemaining <= 60) { // Last minute
            timerElement.classList.add('timer-warning');
        }
        if (timeRemaining <= 10) { // Last 10 seconds
            timerElement.classList.add('timer-critical');
        }
    }

    // Update progress bar if it exists
    const progressBar = document.getElementById('timer-progress');
    if (progressBar) {
        // Calculate percentage of time remaining (10 minutes = 600 seconds)
        const totalTime = 10 * 60;
        const percentRemaining = (timeRemaining / totalTime) * 100;
        progressBar.style.width = `${percentRemaining}%`;

        // Change color based on time remaining
        if (timeRemaining <= 60) {
            progressBar.style.backgroundColor = '#FFA500'; // Orange for last minute
        }
        if (timeRemaining <= 10) {
            progressBar.style.backgroundColor = '#FF0000'; // Red for last 10 seconds
        }
    }
}

// Handle when time is up
function handleTimeUp() {
    // Show big X animation
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease-in-out';

    const xSymbol = document.createElement('div');
    xSymbol.textContent = '✕';
    xSymbol.style.fontSize = '200px';
    xSymbol.style.color = 'red';
    xSymbol.style.fontWeight = 'bold';
    xSymbol.style.transform = 'scale(0)';
    xSymbol.style.transition = 'transform 0.5s ease-in-out';

    overlay.appendChild(xSymbol);
    document.body.appendChild(overlay);

    // Animate the X
    setTimeout(() => {
        overlay.style.opacity = '1';
        xSymbol.style.transform = 'scale(1)';
    }, 10);

    // Update the puzzle indicator to red for timed out
    const indicator = document.getElementById(`puzzle-indicator-${puzzleIndex}`);
    if (indicator) {
        indicator.style.backgroundColor = '#FF0000'; // Red for timed out
    }

    // Update message
    updateMessage('<p>Time\'s up!</p><p>Moving to the next puzzle.</p>', 'bad');

    // Update overall progress
    if (typeof updateOverallProgress === 'function') {
        updateOverallProgress();
    }

    // Remove the X and move to next puzzle after delay
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            // Move to next puzzle
            puzzleIndex++;
            if (puzzleIndex < customPuzzles.length) {
                loadCustomPuzzle(puzzleIndex);
            } else {
                // All puzzles completed
                updateMessage('<p>All puzzles attempted!</p><p>Try again to improve your score.</p>', 'good');
                document.getElementById('custom-puzzles-button').disabled = false;
            }
        }, 300);
    }, 2000);
}

// Function to fetch puzzles with a fallback to custom puzzles
function fetchPuzzlesWithFallback() {
    // Clear all pieces from the board first
    clearAllPieces();

    fetch('./puzzles/offline/puzzles.csv')
        .then(response => {
            console.log("Fetch response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvString => {
            console.log("Puzzles loaded successfully");
            puzzles = initPuzzles(csvString);

            // Clear board before loading puzzles
            clearAllPieces();

            if (puzzles['param'] == null) {
                loadRandomPuzzle();
            } else {
                loadPuzzle(puzzles['param']);
            }
        })
        .catch(error => {
            console.error('Error fetching puzzles:', error);
            // Fall back to using custom puzzles
            console.log("Falling back to custom puzzles");

            // Clear board before loading custom puzzles
            clearAllPieces();

            puzzleIndex = 0;
            loadCustomPuzzle(puzzleIndex);

            const noJsElement = document.getElementById('no-js');
            if (noJsElement) {
                noJsElement.style.display = 'block';
                noJsElement.innerHTML = `<strong>Using custom puzzles due to error:</strong> ${error.message}`;
                // Hide the error message after 3 seconds
                setTimeout(() => {
                    noJsElement.style.display = 'none';
                }, 3000);
            }
        });
}

const squareClicked = (square) => {
    console.log(`${square.id} was clicked!`);

    if (puzzle_solved) {
        console.log("Puzzle already solved, ignoring click");
        return;
    }

    // You may be tempted to refactor, but why?
    // unselectAll is catching **edge case** for multiple selected squares
    // you still need to unselect the selected square, if user wants to undo selection
    if (square.classList.contains('selected')) {
        console.log("Unselecting selected square");
        unselectAll();
    } else if (square.classList.contains('circle')) {
        console.log("Moving to highlighted square");
        const selected = document.querySelector('.selected');
        if (selected) {
            console.log("Found selected piece:", selected.id);
            unselectAll();
            playerMove(selected.id, square.id);
        } else {
            console.error("No selected piece found!");
        }
    } else {
        console.log("Checking if square contains a piece");
        unselectAll();

        let containsPiece = false;
        for (let i = 0; i < pieces.length; i++) {
            if (square.classList.contains(pieces[i])) {
                containsPiece = true;
                console.log(`Square contains piece: ${pieces[i]}`);
                break;
            }
        }

        // only add selected if piece exists
        if (containsPiece) {
            console.log("Selecting piece");
            selectPiece(square);
        } else {
            console.log("No piece to select");
        }
    }
};

// This function helps ensure we're ready to play
function forceCustomPuzzleStart() {
    console.log("Forcing custom puzzle start");

    try {
        // Clear the UI and reset state
        console.log("Clearing board for fresh start");
        clearAllPieces();
        puzzleIndex = 0;
        puzzle_solved = false;
        lastPuzzleMoveIndex = 0;

        // Create a new game instance
        game = new Game();

        // Load the first puzzle
        console.log("Loading first puzzle");
        currentPuzzle = customPuzzles[puzzleIndex];

        // Initialize with the puzzle's FEN
        game = new Game(currentPuzzle.fen);
        currentStatus = game.exportJson();
        currentFEN = currentPuzzle.fen;

        console.log("Puzzle FEN:", currentFEN);
        console.log("Current turn:", currentStatus.turn);

        // Load the board with just the pieces in the FEN
        loadBoard(currentFEN);

        // Update message with puzzle info
        const puzzleTitles = [
            "Puzzle 1: Queen Sacrifice Mate",
            "Puzzle 2: Knight Fork",
            "Puzzle 3: Queen Sacrifice",
            "Puzzle 4: Rook Sacrifice Mate in Two",
            "Puzzle 5: Mate in Two (White)",
            "Puzzle 6: Mate in Two (Black)",
            "Puzzle 7: Knight Dance to Checkmate",
            "Puzzle 8: Rook Sacrifice to Knight Promotion Mate",
            "Puzzle 9: Brilliant Checkmate Sequence",
            "Puzzle 10: Mate in Two with Multiple Variations"
        ];

        const puzzleDescriptions = [
            "White to play: Find the checkmate in 2 moves starting with a queen sacrifice",
            "White to play: Find the knight fork followed by a bishop checkmate",
            "White to play: Find the queen sacrifice followed by a bishop checkmate",
            "White to play: Find the forced checkmate in two moves with a rook sacrifice",
            "White to play: Find the brilliant Qb2! leading to forced mate (multiple variations)",
            "White to play: Find the brilliant Rf4! leading to forced mate in 2 moves (multiple variations)",
            "White to play: Start with Qd6+ and find the forced mate in 2 moves with a knight promotion",
            "White to play: Find the brilliant rook sacrifice leading to a knight promotion checkmate",
            "White to play: Find the brilliant sequence of moves leading to checkmate",
            "White to play: Find the forced mate in three moves"
        ];

        updateMessage(`<p>${puzzleTitles[puzzleIndex]}</p><p>Your Move: ${puzzleDescriptions[puzzleIndex]}</p>`, '');

        // Flip the board based on whose turn it is
        if (currentStatus.turn === 'white') {
            flipBoard(false);
        } else {
            flipBoard(true);
        }

        // Start a 10-minute timer for this puzzle
        startTimer(10 * 60);

        // Update game info and debug
        updateGameInfo();
        updateDebug();

        // Highlight the current puzzle button
        highlightCurrentPuzzleButton(puzzleIndex);

        console.log("First puzzle loaded successfully");
    } catch (error) {
        console.error("Error forcing custom puzzle start:", error);
        // Display error to user
        updateMessage('<p>Error loading puzzles.</p><p>Please try refreshing the page.</p>', 'bad');
    }
}

// Function to load a specific puzzle
function loadSpecificPuzzle(index) {
    console.log("Loading specific puzzle:", index);
    puzzleIndex = index;

    // Clear any existing timer
    stopTimer();

    // Special handling for puzzle 7
    if (index === 6) {
        setupPuzzle7();
        return;
    }

    // Standard handling for other puzzles
    // Clear all pieces first
    clearAllPieces();

    // Reset puzzle state
    puzzle_solved = false;
    lastPuzzleMoveIndex = 0;

    currentPuzzle = customPuzzles[index];
    game = new Game(currentPuzzle.fen);
    currentStatus = game.exportJson();
    currentFEN = currentPuzzle.fen;

    loadBoard(currentFEN);

    // Update hints panel
    updateHints(index);

    // Flip board based on whose turn it is
    if (currentStatus.turn === 'white') {
        flipBoard(false);
    } else {
        flipBoard(true);
    }

    // Start new timer immediately
    startTimer(10 * 60);

    // Update game info and debug
    updateGameInfo();
    updateDebug();

    // Highlight the currently selected puzzle button
    highlightCurrentPuzzleButton(index);
}

// Function to highlight the current puzzle button
function highlightCurrentPuzzleButton(index) {
    // Remove highlight from all buttons
    const puzzleButtons = document.querySelectorAll('#puzzle-selector button');
    puzzleButtons.forEach((button, i) => {
        // Preserve the color indicating completion status but reset border
        button.style.outline = 'none';

        // Only remove the blue highlight border
        if (button.style.border && button.style.border.includes('blue')) {
            button.style.border = 'none';
        }
    });

    // Add highlight to the current puzzle button
    if (puzzleButtons[index]) {
        // Add blue border to indicate current puzzle
        puzzleButtons[index].style.border = '3px solid #007bff';
        puzzleButtons[index].style.outline = 'none';
    }
}

// Add this function to update overall progress if tracking panel exists
function updateOverallProgress() {
    // Check if tracking panel exists
    if (!document.getElementById('puzzle-tracking-panel')) {
        console.log("Puzzle tracking panel not found, skipping progress update");
        return;
    }

    const indicators = document.querySelectorAll('[id^="puzzle-indicator-"]');
    if (indicators.length === 0) {
        console.log("No puzzle indicators found, skipping progress update");
        return;
    }

    let solvedCount = 0;

    indicators.forEach(indicator => {
        // Check the background color to determine if solved
        const bgColor = window.getComputedStyle(indicator).backgroundColor;
        if (bgColor === 'rgb(144, 238, 144)') { // #90EE90 Green
            solvedCount++;
        }
    });

    const overallProgress = document.getElementById('overall-progress');
    if (overallProgress) {
        overallProgress.textContent = `Solved: ${solvedCount}/${customPuzzles.length}`;
    }
}

// Function to show timeout animation with a clock icon
function showTimeoutAnimation() {
    // Create overlay for the timeout animation
    const overlay = document.createElement('div');
    overlay.id = 'timeout-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(255, 165, 0, 0.3)'; // Orange background
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease-in-out';

    // Create the clock symbol
    const clockSymbol = document.createElement('div');
    clockSymbol.style.fontSize = '150px';
    clockSymbol.style.fontWeight = 'bold';
    clockSymbol.style.color = 'orange';
    clockSymbol.style.textShadow = '0 0 20px rgba(0, 0, 0, 0.7)';
    clockSymbol.innerHTML = '⏰'; // Clock emoji
    clockSymbol.style.transform = 'scale(0.5)';
    clockSymbol.style.transition = 'transform 0.5s ease-in-out';

    overlay.appendChild(clockSymbol);
    document.body.appendChild(overlay);

    // Animate the overlay and clock
    setTimeout(() => {
        overlay.style.opacity = '1';
        clockSymbol.style.transform = 'scale(1.5)';

        // Fade out after showing
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }, 2000);
    }, 10);
}

// Add these styles to the document head for timer warning states
const timerStyles = document.createElement('style');
timerStyles.id = 'timer-styles';
timerStyles.innerHTML = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .timer {
        transition: color 0.3s ease;
    }
    
    .timer.warning {
        color: #FFA500;
    }
    
    .timer.critical {
        color: #FF0000;
    }
`;
document.head.appendChild(timerStyles);

// Function to manually validate moves for puzzle 7
function validatePuzzle7Move(from, to, moveIndex) {
    console.log(`Validating puzzle 7 move - from: ${from}, to: ${to}, moveIndex: ${moveIndex}`);

    // First move should be Qd5+
    if (moveIndex === 0) {
        return from === 'b7' && to === 'd5';
    }

    // Second move should be Qd6+
    if (moveIndex === 1) {
        return from === 'd5' && to === 'd6';
    }

    // Third move should be Qb8# (with knight promotion)
    if (moveIndex === 2) {
        if (from === 'd6' && to === 'b8') {
            // Set puzzle as solved
            puzzle_solved = true;
            stopTimer();

            // Show congratulations with checkmate animation
            showCongratulations(true);

            // Update the puzzle indicator to green for solved
            const indicator = document.getElementById(`puzzle-indicator-${puzzleIndex}`);
            if (indicator) {
                indicator.style.backgroundColor = '#90EE90'; // Green for solved
            }

            // Update the puzzle button to show completion
            const puzzleButtons = document.querySelectorAll('#puzzle-selector button');
            if (puzzleButtons[puzzleIndex]) {
                puzzleButtons[puzzleIndex].style.backgroundColor = '#90EE90';
                puzzleButtons[puzzleIndex].style.color = '#006400';
                puzzleButtons[puzzleIndex].style.border = '2px solid #006400';
            }

            // Update overall progress
            if (typeof updateOverallProgress === 'function') {
                updateOverallProgress();
            }

            return true;
        }
        return false;
    }

    return false;
}

function validatePuzzle8Move(from, to, moveIndex) {
    console.log(`Validating puzzle 8 move - from: ${from}, to: ${to}, moveIndex: ${moveIndex}`);

    // First move should be O-O-O (e1c1)
    if (moveIndex === 0) {
        return from === 'e1' && to === 'c1';
    }

    // Second move should be Kb1
    if (moveIndex === 1) {
        return from === 'c1' && to === 'b1';
    }

    // Third move should be Ka1
    if (moveIndex === 2) {
        if (from === 'b1' && to === 'a1') {
            // Set puzzle as solved
            puzzle_solved = true;
            stopTimer();

            // Show congratulations with checkmate animation
            showCongratulations(true);

            // Update the puzzle indicator to green for solved
            const indicator = document.getElementById(`puzzle-indicator-${puzzleIndex}`);
            if (indicator) {
                indicator.style.backgroundColor = '#90EE90'; // Green for solved
            }

            // Update the puzzle button to show completion
            const puzzleButtons = document.querySelectorAll('#puzzle-selector button');
            if (puzzleButtons[puzzleIndex]) {
                puzzleButtons[puzzleIndex].style.backgroundColor = '#90EE90';
                puzzleButtons[puzzleIndex].style.color = '#006400';
                puzzleButtons[puzzleIndex].style.border = '2px solid #006400';
            }

            // Update overall progress
            if (typeof updateOverallProgress === 'function') {
                updateOverallProgress();
            }

            return true;
        }
        return false;
    }

    return false;
}

// Add a dedicated function to set up puzzle 7 properly
function setupPuzzle7() {
    console.log("Setting up puzzle 7");
    puzzleIndex = 6; // Make sure the index is correct

    // Reset puzzle state
    puzzle_solved = false;
    lastPuzzleMoveIndex = 0;

    try {
        // First clear all pieces from the board
        clearAllPieces();

        // Create a new game with the special puzzle 7 position
        const puzzle7Fen = '8/1Q6/8/8/2k5/2P5/1KP5/8 w - - 0 1';
        game = new Game(puzzle7Fen);
        currentStatus = game.exportJson();
        currentFEN = puzzle7Fen;

        // Special puzzle with custom validation
        currentPuzzle = {
            puzzle_id: 'custom7',
            fen: puzzle7Fen,
            moves: ['b7d5', 'd5d6', 'd6b8'], // These are just placeholders for move counting
            rating: 2000
        };

        // Load the board
        loadBoard(currentFEN);

        // Update message with puzzle info
        updateMessage('<p>Puzzle 7: Knight Dance to Checkmate</p><p>White to play: Find the checkmate with a knight promotion</p>', '');

        // Make sure board is oriented with white at the bottom
        flipBoard(false);

        // Highlight the current puzzle button
        highlightCurrentPuzzleButton(6);

        // Start a 10-minute timer for this puzzle
        startTimer(10 * 60);

        // Update game info and debug
        updateGameInfo();
        updateDebug();

    } catch (error) {
        console.error("Error setting up puzzle 7:", error);

        // Move to the next puzzle if there's an error
        puzzleIndex++;
        if (puzzleIndex < customPuzzles.length) {
            loadCustomPuzzle(puzzleIndex);
        } else {
            updateMessage('<p>Error loading puzzle.</p><p>Challenge completed!</p>', 'bad');
        }
    }
}

function setupPuzzle8() {
    console.log("Setting up puzzle 8");
    puzzleIndex = 7; // Make sure the index is correct

    // Reset puzzle state
    puzzle_solved = false;
    lastPuzzleMoveIndex = 0;

    try {
        // First clear all pieces from the board
        clearAllPieces();

        // Create a new game with the special puzzle 8 position
        const puzzle8Fen = 'r3k2r/p4ppp/1qnbpn2/8/8/1QNB1N2/P4PPP/R3K2R w KQkq - 0 1';
        game = new Game(puzzle8Fen);
        currentStatus = game.exportJson();
        currentFEN = puzzle8Fen;

        // Special puzzle with custom validation
        currentPuzzle = {
            puzzle_id: 'custom8',
            fen: puzzle8Fen,
            moves: ['e1c1', 'c1b1', 'b1a1'], // These are just placeholders for move counting
            rating: 2100
        };

        // Load the board
        loadBoard(currentFEN);

        // Update message with puzzle info
        updateMessage('<p>Puzzle 8: Rook Sacrifice to Knight Promotion Mate</p><p>White to play: Find the mate in 2 with a rook sacrifice</p>', '');

        // Make sure board is oriented with white at the bottom
        flipBoard(false);

        // Highlight the current puzzle button
        highlightCurrentPuzzleButton(7);

        // Start a 10-minute timer for this puzzle
        startTimer(10 * 60);

        // Update game info and debug
        updateGameInfo();
        updateDebug();

    } catch (error) {
        console.error("Error setting up puzzle 8:", error);

        // Move to the next puzzle if there's an error
        puzzleIndex++;
        if (puzzleIndex < customPuzzles.length) {
            loadCustomPuzzle(puzzleIndex);
        } else {
            updateMessage('<p>Error loading puzzle.</p><p>Challenge completed!</p>', 'bad');
        }
    }
}

// Add popup form when page loads/refreshes
document.addEventListener('DOMContentLoaded', function() {
    showStartChallengePopup();
});

function showStartChallengePopup() {
    // Create overlay and popup container
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    const popup = document.createElement('div');
    popup.className = 'popup-container';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '30px';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    popup.style.width = '400px';
    popup.style.maxWidth = '90%';
    popup.style.textAlign = 'center';

    // Create title
    const title = document.createElement('h2');
    title.textContent = '10-Puzzle Challenge';
    title.style.marginBottom = '20px';
    title.style.color = '#333';

    // Create description
    const description = document.createElement('p');
    description.textContent = '10 minutes per puzzle. Complete all puzzles to win!';
    description.style.marginBottom = '25px';
    description.style.color = '#666';

    // Create form
    const form = document.createElement('form');
    form.id = 'challenge-form';
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '15px';

    // Create name input
    const nameGroup = document.createElement('div');
    nameGroup.style.textAlign = 'left';

    const nameLabel = document.createElement('label');
    nameLabel.htmlFor = 'player-name';
    nameLabel.textContent = 'Your Name:';
    nameLabel.style.display = 'block';
    nameLabel.style.marginBottom = '5px';
    nameLabel.style.fontWeight = 'bold';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'player-name';
    nameInput.name = 'player-name';
    nameInput.required = true;
    nameInput.style.width = '100%';
    nameInput.style.padding = '10px';
    nameInput.style.boxSizing = 'border-box';
    nameInput.style.borderRadius = '5px';
    nameInput.style.border = '1px solid #ccc';

    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);

    // Create phone input
    const phoneGroup = document.createElement('div');
    phoneGroup.style.textAlign = 'left';

    const phoneLabel = document.createElement('label');
    phoneLabel.htmlFor = 'player-phone';
    phoneLabel.textContent = 'Phone Number:';
    phoneLabel.style.display = 'block';
    phoneLabel.style.marginBottom = '5px';
    phoneLabel.style.fontWeight = 'bold';

    const phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.id = 'player-phone';
    phoneInput.name = 'player-phone';
    phoneInput.required = true;
    phoneInput.pattern = '[0-9]{10}';
    phoneInput.placeholder = '10-digit number';
    phoneInput.style.width = '100%';
    phoneInput.style.padding = '10px';
    phoneInput.style.boxSizing = 'border-box';
    phoneInput.style.borderRadius = '5px';
    phoneInput.style.border = '1px solid #ccc';

    phoneGroup.appendChild(phoneLabel);
    phoneGroup.appendChild(phoneInput);

    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Start 10-Puzzle Challenge';
    submitButton.style.marginTop = '10px';
    submitButton.style.padding = '12px';
    submitButton.style.backgroundColor = '#4CAF50';
    submitButton.style.color = 'white';
    submitButton.style.border = 'none';
    submitButton.style.borderRadius = '5px';
    submitButton.style.cursor = 'pointer';
    submitButton.style.fontWeight = 'bold';
    submitButton.style.fontSize = '16px';

    // Add hover effect
    submitButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#45a049';
    });
    submitButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#4CAF50';
    });

    // Append all elements
    form.appendChild(nameGroup);
    form.appendChild(phoneGroup);
    form.appendChild(submitButton);

    popup.appendChild(title);
    popup.appendChild(description);
    popup.appendChild(form);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const playerName = nameInput.value.trim();
        const playerPhone = phoneInput.value.trim();

        // Validate phone number
        if (!/^\d{10}$/.test(playerPhone)) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }

        // Store player information
        localStorage.setItem('playerName', playerName);
        localStorage.setItem('playerPhone', playerPhone);

        // Remove the popup
        document.body.removeChild(overlay);

        // Start the challenge
        startCustomPuzzleChallenge();
    });
}

// Create a hints panel on the right side
function createHintsPanel() {
    const hintsPanel = document.createElement('div');
    hintsPanel.id = 'hints-panel';
    hintsPanel.style.position = 'fixed';
    hintsPanel.style.right = '20px';
    hintsPanel.style.top = '50%';
    hintsPanel.style.transform = 'translateY(-50%)';
    hintsPanel.style.width = '300px';
    hintsPanel.style.padding = '20px';
    hintsPanel.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    hintsPanel.style.borderRadius = '10px';
    hintsPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    hintsPanel.style.zIndex = '100';

    // Create title for the hints panel
    const hintsTitle = document.createElement('h3');
    hintsTitle.textContent = 'Puzzle Hints';
    hintsTitle.style.marginTop = '0';
    hintsTitle.style.marginBottom = '15px';
    hintsTitle.style.color = '#333';
    hintsTitle.style.borderBottom = '2px solid #4CAF50';
    hintsTitle.style.paddingBottom = '10px';

    // Create content container for the hints
    const hintsContent = document.createElement('div');
    hintsContent.id = 'hints-content';
    hintsContent.style.fontSize = '16px';
    hintsContent.style.lineHeight = '1.5';
    hintsContent.style.color = '#444';

    // Add elements to the panel
    hintsPanel.appendChild(hintsTitle);
    hintsPanel.appendChild(hintsContent);

    // Add the panel to the page
    document.body.appendChild(hintsPanel);
}

// Function to update hints based on current puzzle
function updateHints(index) {
    const hintsContent = document.getElementById('hints-content');
    if (!hintsContent) return;

    const puzzleDescriptions = [
        "White to play: Find the checkmate in 2 moves",
        "White to play: Find the knight fork followed by a bishop checkmate",
        "White to play: Find the queen sacrifice followed by a bishop checkmate",
        "White to play: Find the forced checkmate in two moves with a rook sacrifice",
        "White to play: Find the brilliant Qb2! leading to forced mate (multiple variations)",
        "White to play: Find the brilliant Rf4! leading to forced mate in 2 moves (multiple variations)",
        "White to play: Start with Qd6+ and find the forced mate in 2 moves with a knight promotion",
        "White to play: Find the brilliant rook sacrifice leading to a knight promotion checkmate",
        "White to play: Find the brilliant sequence of moves leading to checkmate",
        "White to play: Find the forced mate in three moves"
    ];

    hintsContent.innerHTML = `
        <div>
            <p style="margin: 0; font-size: 18px; color: #333;">${puzzleDescriptions[index]}</p>
        </div>
    `;
}