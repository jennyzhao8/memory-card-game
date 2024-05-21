// constant variable gridContainer = html element with class grid-container (the container where cards will be displayed)
const gridContainer = document.querySelector(".grid-container");
let cards = [];
// declare variables
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let gameInProgress = false;
let timerId
let timerSeconds = 0


// updates score element in HTML
document.querySelector(".score").textContent = score;

// array containing urls of card images
const cardBacks = [
    '../emojis/A1.png',
    '../emojis/A2.png',
    '../emojis/A3.png',
    '../emojis/A4.png',
    '../emojis/A5.png',
    '../emojis/A6.png',
    '../emojis/A7.png',
    '../emojis/A8.png',
  ];

let deck = []

// neutral state
function resetBoard() {
    // no cards currently selected
    firstCard = null;
    secondCard = null;
    lockBoard = false;  
}

// creates pairs of cards and shuffles them
function shuffleCards() {
    // for loop runs from 0 to cardBacks.length-1
    // // https://stackoverflow.com/questions/56258178/why-use-iarray-length-in-for-loop
    for (let i = 0; i < cardBacks.length; i++) { 
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
        cards.push(cardBacks[i] ); 
        // for each index i, image URL at cardBacks[i] is pushed 2x into cards array (creates pairs)
        cards.push(cardBacks[i] ); 
    }
    while (cards.length > 0) { // while there are still cards in the cards array
        // selects random index from "cards" array, removes 1 card, assigns removed card to "pickedCard"
        const pickedCard = cards.splice(Math.floor(Math.random() * cards.length), 1)[0] 
        deck.push(pickedCard) // puts card into deck
    }   
}

 // creates and displays cards
function generateCards() {
    // iterates over each "card" in "deck"
    deck.forEach(card => { 
       // calls createCardElement for each card in deck
        const cardElement = createCardElement(card);
        // https://www.w3schools.com/jsref/met_node_appendchild.asp
        gridContainer.appendChild(cardElement);
    });
}

// create DOM element for 1 card
function createCardElement(card) {
    const cardElement = document.createElement("div");
    // add CSS styling for cards
    cardElement.classList.add("card");
    // data attribute to cardElement with card.name value (store data abt card)
    cardElement.setAttribute("data", card); 
    cardElement.innerHTML = `
        <div class="front">
            <img class="front-image" src="${card}" />
        </div>
        <div class="back"></div>
    `;
    // add event listener for click to call flipCard when clicked
    cardElement.addEventListener("click", flipCard);
    return cardElement;
}

// flip card when clicked
function flipCard() {
    // if a pair has already been chosen or if card is already flipped, returns early
    if (lockBoard || this.classList.contains("flipped")) {
        return;
    }
    this.classList.add("flipped");
    // assigns first card to firstCard
    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        lockBoard = true;
        checkForMatch();
    }
}

function checkForMatch() {
    // compare value of "data" attributes of 2 flipped cards, check for match
    let isMatch = firstCard.getAttribute("data") === secondCard.getAttribute("data");
 
    // names match = disableCards, don't match = unflipCards
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
    isMatch ? disableCards() : unflipCards();
 }
 
 // no more clicks on matched cards
function disableCards() {
    score++;
    document.querySelector(".score").textContent = score;
    if (score === 8) { // if score is 8 (all pairs matched)
        clearInterval(timerId) // cancel timer if there is one running
        if (timerSeconds < 30) {
            alert("Wow, less than 30 seconds! You're pretty fast!");
        } else {
            alert("Congrats!! You just beat the game.");
        }
    }
    // remove event listener for 2 matched cards
   firstCard.removeEventListener("click", flipCard);
   secondCard.removeEventListener("click", flipCard);
    resetBoard();
}

// unflip cards if they don't match
function unflipCards() {
    function unflip() {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }
    // delay flipping by 1sec
    setTimeout(unflip, 1000);
}

function restart() {
    deck = [];
    // clear old board
    gridContainer.innerHTML = "";
    resetBoard();
    shuffleCards();
    generateCards();
    score = 0; 
    document.querySelector(".score").textContent = score;
    clearInterval(timerId);
    timerSeconds = 0;
    document.querySelector(".time").textContent = timerSeconds;
    startTime();
    gameInProgress = false;
}

// timer feature
function startTime() {
    if (!gameInProgress) {
    clearInterval(timerId) // cancel timer if there is one running
    timerSeconds = 0
    // updates time element in HTML
    document.querySelector(".time").textContent = timerSeconds;
    timerId = setInterval(() => {
        timerSeconds++;
        document.querySelector(".time").textContent = timerSeconds;
        if (timerSeconds === 60) { // if time is 1 min
            alert("Wow it's been a whole minute, you're kind of slow...");
        }
    }, 1000); // every second timerSeconds inc. by 1
    gameInProgress = true; // Set game to in progress
    }
}