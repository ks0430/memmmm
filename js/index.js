// for test

"use strict";

// Time event manager, when create a new object, clear old objects event
let timeEventTrash = [];

let clearTimeEventTrash = () => {
  while (timeEventTrash.length > 0) {
    let event = timeEventTrash.pop();
    if (event.type === "interval") clearInterval(event.event);
    if (event.type === "timeout") clearTimeout(event.event);
  }
};

// Get type list
let getTypeList = (types, arrLength) => {
  let currentTypes = [...types];
  let typeList = [];
  for (let i = 0; i < arrLength; i++) {
    if (currentTypes.length === 0) {
      console.error("List to end");
      currentTypes = types; // reset types
    }
    let random = Math.floor(Math.random() * currentTypes.length);
    typeList.push(currentTypes[random]);
    currentTypes.splice(random, 1);
  }

  return typeList;
};

// Random Int
let getRandonInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// shuffle
let shuffle = array => {
  let result = [...array];
  for (let i = 0; i < result.length; i++) {
    let r = Math.floor(Math.random() * i);
    var temp = result[r];
    result[r] = result[array.length - 1];
    result[array.length - 1] = temp;
  }
  return result;
};

// Exchange
let exchange = _array => {
  let array = [..._array];
  let resultArr = [];
  let length = array.length;
  for (let i = 0; i < length; i++) {
    let random = Math.floor(Math.random() * array.length);
    resultArr.push(array[random]); // add to another one
    array.splice(random, 1); // delete origin one
  }
  return resultArr;
};

let toggleCard = card => {
  if (!card.node.classList.contains("card--flipped")) {
    card.node.classList.add("card--flipped");
    card.node.children[0].classList.remove("card__face--front");
    card.node.children[0].classList.add("card__face--back");
  } else {
    card.node.classList.remove("card--flipped");
    card.node.children[0].classList.add("card__face--front");
    card.node.children[0].classList.remove("card__face--back");
  }
};

let initialGameStatus = () => {
  // Initial game value
  let currentGame = null;
  let newGameBtn = document.querySelector(".game-stats__button");
  newGameBtn.addEventListener("click", function() {
    currentGame = null;
    currentGame = new Game();
  });
};

class Game {
  constructor(level = 1, score = 0) {
    // Can be set outside Game
    this.score = score;
    this.scoreIncrement = 20;
    this.timer = 30;
    this.types = [
      "aws",
      "css3",
      "github",
      "heroku",
      "html5",
      "js",
      "linkedin",
      "nodejs",
      "react",
      "sass"
    ];

    // Current Game Object required arguments
    this.currentCardPair = [];
    this.currentLevel = level;
    this.cardList = [];
    this.currentTimeEvents = null;
    this.currentTimerInterval = null;
    this.onClick = this.onClick.bind(this);

    // Initial Game
    this.initialGame(); // Constructor function
    this.gameTimer();
  }

  initialGame() {
    //   Remove game over page
    let gameOver = document.querySelector(".game-over");
    gameOver.classList.remove("game-over--visible");
    // Hide Game Instruction Page
    let gameInstruction = document.querySelector(".game-instruction");
    gameInstruction.style.display = "none";
    //   Update current level
    let currentLevelNode = document.querySelector(".game-stats__level--value");
    currentLevelNode.innerHTML = this.currentLevel;
    // Update score
    this.updateScore();

    // Remove old game
    let gameboard = document.querySelector(".game-main");
    if (gameboard) {
      gameboard.remove();
    }
    // Important: remove old registered events
    // Todo: move to event class manager
    clearTimeEventTrash();

    // Create main game parent node
    gameboard = document.createElement("div");
    gameboard.className = "game-main";
    let mainBoard = document.querySelector(".game-board");
    mainBoard.appendChild(gameboard);

    // Set card size
    let cardSize = 2 * this.currentLevel; // 2*3 = 6 , square which length is 6

    // Set css grid size
    let root = document.documentElement;
    root.style.setProperty("--card-size", cardSize);

    // Set Ramdon cards
    let cardListLength = cardSize ** 2;
    let typeList = getTypeList(this.types, cardListLength / 2); // 1.get type list as card list length
    console.log("Get type list:", typeList);
    typeList = [...typeList, ...typeList]; // 2.Get double type list
    typeList = exchange(typeList); // 3. Random type list
    console.log(typeList);
    //   Create random card
    for (let i = 0; i < cardListLength; i++) {
      let type = typeList.pop();
      this.cardList.push(new Card(gameboard, type, this.onClick));
    }
  }

  updateScore() {
    let score = document.querySelector(".game-stats__score--value");
    score.innerHTML = this.score;
  }

  gameTimer() {
    if (this.currentTimerInterval) clearInterval(this.currentTimerInterval);
    let time = document.querySelector(".game-timer__bar");
    let timeSize = this.timer;
    time.innerHTML = this.timer + "s";
    let color = `#8cdcda`;
    time.style.background = color;

    let timerInterval = setInterval(() => {
      this.timer--;

      // Set time
      time.innerHTML = this.timer + "s";
      //   Set progress bar
      let currentCentage = (this.timer / timeSize) * 100;
      //   console.log(currentCentage);
      color = `linear-gradient(
        to right,
        #8cdcda 0%,
        #8cdcda ${currentCentage}%,
        transparent ${currentCentage}%,
        transparent 100%
      )`;
      time.style.background = color;

      if (this.timer === 0) {
        clearInterval(timerInterval);
        this.endGame();
        return;
      }
    }, 1000);
    timeEventTrash.push({ type: "interval", event: timerInterval });
  }

  endGame() {
    console.log("endGame");
    let game = document.querySelector(".game-main");
    game.style.filter = "blur(8px)";
    let gameOver = document.querySelector(".game-over");
    gameOver.classList.add("game-over--visible");
    let gameoverScore = document.querySelector(".game-over__score");
    gameoverScore.innerHTML = "Your score is: " + this.score;
  }

  increaseScore() {
    this.score += this.scoreIncrement;
    this.updateScore();
  }

  // onClick Event, bind to each card
  // Should bind to game object, before card call onClick fucntion;
  onClick(card) {
    // If cardList's length is 0, means game finish

    // 1.When select more than two cards, return
    if (this.currentCardPair.length > 1) {
      return; //have to card selection
    }

    //   2.When select same card, return
    if (this.currentCardPair[0] && card === this.currentCardPair[0]) {
      console.log("Equal");
      return;
    }

    //   3. Select first card, return
    if (!this.currentCardPair[0]) {
      this.currentCardPair.push(card); //ref change
      this.currentTimeEvents = setTimeout(() => {
        // if current pair get points, it comes null, can't toggle it.
        this.currentCardPair.map(card => toggleCard(card));
        this.currentCardPair = [];
      }, 2000);
      toggleCard(card);
      return;
    }

    //   4. Select second card
    if (this.currentCardPair[0]) {
      // get points
      this.currentCardPair.push(card);

      if (
        this.currentCardPair[0].cardType === this.currentCardPair[1].cardType
      ) {
        this.increaseScore();
        this.currentCardPair.map(card => {
          card.disable = true;
          this.cardList = this.cardList.filter(item => item !== card); // filter current card
        });
        //   Remove two cards from card list
        this.currentCardPair = [];
        clearTimeout(this.currentTimeEvents);
      }
      toggleCard(card);
    }

    //   If this is the last one, show win score
    if (this.cardList.length === 0) {
      console.log("Win your score is", this.score);
      // Wait 3 seconds before start new game
      let waitForNewGame = setTimeout(() => {
        //   Start a new Game
        new Game(this.currentLevel + 1, this.score);
      }, 3000);
      clearTimeEventTrash();
      timeEventTrash.push(waitForNewGame);
    }
  }
}

class Card {
  constructor(parentNode, cardType, onClick) {
    this.cardType = cardType;
    this.onClick = onClick;
    this.parentNode = parentNode;
    this.node = this.createNode();
    this.disable = false;
  }

  createNode() {
    let card = document.createElement("div");
    card.className = `card ${this.cardType} `;
    let cardContent = document.createElement("div");
    cardContent.className = "card__face card__face--front";
    card.appendChild(cardContent);

    card.addEventListener("click", () => {
      if (this.disable) {
        console.log("This card is disable");
        return;
      }
      this.onClick(this); // point to this card, not current node
    });

    // Add current card node to gameBoard
    this.parentNode.appendChild(card);

    return card;
  }
}

// let memmmm = new Game();

initialGameStatus();
