var calculator = {
  displayValue: "0",
  currentOperator: null,
  leftOperand: null,
  waitingSecondOperand: false,
  time: null,
  timeEvents: []
};

bindKeyPress();

function bindKeyPress() {
  var keys = document.querySelector(".calculator-keys");
  keys.addEventListener("click", function(event) {
    var target = event.target;
    //   https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
    if (!target.matches("button")) {
      return;
    }

    if (calculator.time) {
      removeTime();
    }

    if (target.classList.contains("operator")) {
      handleOperator(target.value);
      return;
    }

    if (target.classList.contains("decimal")) {
      handleDecimal();
      return;
    }

    if (target.classList.contains("equal")) {
      handleEqual();
      return;
    }

    if (target.classList.contains("clear")) {
      handleClear();
      return;
    }

    if (target.classList.contains("clock")) {
      handleClock();
      return;
    }
    handleDigit(target.value);
  });
}

// show current time for 3 secs, then come back
function handleClock() {
  calculator.time = new Date().toLocaleString();
  var display = document.querySelector(".calculator-screen");
  display.classList.add("time-screen");
  updateDisplay();
  var interval = setInterval(function() {
    calculator.time = new Date().toLocaleString();
    updateDisplay();
  }, 1000);
  var timeout = setTimeout(function() {
    removeTime();
  }, 5000);
  calculator.timeEvents.push({ type: "timeout", event: timeout });
  calculator.timeEvents.push({ type: "interval", event: interval });
}

function removeTime() {
  while (calculator.timeEvents.length > 0) {
    var event = calculator.timeEvents.pop();
    if (event.type === "interval") {
      clearInterval(event.event);
    } else {
      clearTimeout(event.event);
    }
  }
  calculator.time = null;
  var display = document.querySelector(".calculator-screen");
  display.classList.remove("time-screen");
  updateDisplay();
}

function handleClear() {
  calculator.displayValue = "0";
  calculator.currentOperator = null;
  calculator.leftOperand = null;
  updateDisplay();
}

function handleEqual() {
  if (!calculator.currentOperator || calculator.waitingSecondOperand) {
    return;
  }
  var leftOperand = parseFloat(calculator.leftOperand);
  var rightOperand = parseFloat(calculator.displayValue);
  var answer;
  switch (calculator.currentOperator) {
    case "+":
      answer = leftOperand + rightOperand;
      break;
    case "-":
      answer = leftOperand - rightOperand;
      break;
    case "*":
      answer = leftOperand * rightOperand;
      break;
    case "/":
      answer = leftOperand / rightOperand;
      break;
    default:
      return;
  }
  calculator.displayValue = "" + answer;
  calculator.currentOperator = null;
  calculator.waitingSecondOperand = false;
  updateDisplay();
}

function handleOperator(operator) {
  if (calculator.currentOperator) {
    console.log("123", calculator);
    if (calculator.waitingSecondOperand) {
      calculator.currentOperator = operator;
      return;
    }
    // solve the existing expression
    handleEqual();
  }
  calculator.currentOperator = operator;
  calculator.waitingSecondOperand = true;
  calculator.leftOperand = calculator.displayValue;
  calculator.displayValue = "0";
}

function handleDecimal() {
  if (calculator.displayValue.includes(".")) {
    return;
  }
  calculator.displayValue += ".";
  calculator.waitingSecondOperand = false;
  updateDisplay();
}

function handleDigit(value) {
  var displayValue = calculator.displayValue;
  if (calculator.waitingSecondOperand) {
    calculator.displayValue = value;
    calculator.waitingSecondOperand = false;
  } else {
    calculator.displayValue =
      displayValue === "0" ? value : displayValue + value;
  }
  updateDisplay();
}

function updateDisplay() {
  var display = document.querySelector(".calculator-screen");
  if (calculator.time) {
    display.value = calculator.time;
  } else {
    display.value = calculator.displayValue;
  }
}
