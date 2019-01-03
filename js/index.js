// Summary

// document.querySelector(".classname");
// document.querySelectorAll(".classname");
// button.addEventListener("click",function(event){});
// event.target
// node.classList
// node.classList.target
// node.value

"use strict";
console.log("Test");

// Calculator Object
let calculator = {
  currentValue: null,
  prevValue: null,
  currentOperator: null,
  isWaitNextOperand: false,
  displayValue: "0",
  timeEvents: []
};

// Main function
function bindKeyFunction() {
  let keys = document.querySelector(".calculator__keys");

  console.log(document.querySelectorAll(".calculator__number"));
  keys.addEventListener("click", function(event) {
    let target = event.target; // get target

    if (target.classList.contains("calculator__clock")) {
      handleClock();
      return;
    }

    // remove time events
    removeTime();

    if (target.classList.contains("calculator__clear")) {
      handleClear();
      return;
    }

    if (target.classList.contains("calculator__decimal")) {
      handleDecimal();
      return;
    }

    if (target.classList.contains("calculator__number")) {
      handleNumber(target.value);
      return;
    }

    if (target.classList.contains("calculator__operator")) {
      handleOperator(target.value);
      return;
    }

    if (target.classList.contains("calculator__equal")) {
      handleEqual();
    }

    if (target.classList.contains("calculator__operator")) {
      console.log(target.value);
    }
  });
}

function handleNumber(value) {
  // prase value to number
  testValue("number");

  if (calculator.isWaitNextOperand) {
    calculator.displayValue = value;
    calculator.isWaitNextOperand = false;
  } else {
    let displayValue = calculator.displayValue;
    calculator.displayValue =
      displayValue === "0" ? value : displayValue + value;
    calculator.isWaitNextOperand = false;
  }

  render(calculator.displayValue);
}

function handleOperator(operator) {
  if (calculator.isWaitNextOperand && calculator.currentOperator) {
    calculator.currentOperator = operator;
    return;
  }
  if (calculator.currentOperator && !calculator.isWaitNextOperand)
    handleEqual();

  calculator.prevValue = calculator.displayValue;
  calculator.displayValue = "0";
  calculator.currentOperator = operator;
  calculator.isWaitNextOperand = true;
}

function handleEqual() {
  if (!calculator.currentOperator) {
    console.warn("warnning", calculator);
    return;
  }

  // If prev is null, then means only one operator, use current one.
  let result = handleResult(calculator.currentOperator);

  calculator.displayValue = result;
  calculator.prevValue = calculator.displayValue;
  calculator.currentOperator = null;
  calculator.currentValue = null;
  render(calculator.displayValue); // render result
  calculator.isWaitNextOperand = true;
  testValue("equal");
}

// When press equal, handle result
function handleResult(operator) {
  calculator.currentValue = parseFloat(calculator.displayValue);
  calculator.prevValue = parseFloat(calculator.prevValue);

  let result = null;
  switch (operator) {
    case "plus":
      result = calculator.prevValue + calculator.currentValue;
      break;
    case "minus":
      result = calculator.prevValue - calculator.currentValue;
      break;
    case "time":
      result = calculator.prevValue * calculator.currentValue;
      break;
    case "divide":
      result = calculator.prevValue / calculator.currentValue;
      break;

    default:
      console.log("Error, this value is invaild!");
  }

  return result;
}

function handleClear() {
  calculator.currentValue = null;
  calculator.prevValue = null;
  calculator.displayValue = "0";
  calculator.currentOperator = null;

  testValue("Clear");
  render(0);
}

function handleClock() {
  console.log("clock");
  if (calculator.timeEvents.length > 0) {
    console.log("events", calculator);
    return;
  } // no repeat time events

  let screen = document.querySelector(".calculator__screen");
  let originValue = screen.value;

  screen.value = new Date().toLocaleString();
  let interval = setInterval(() => {
    screen.value = new Date().toLocaleString();
  }, 1000);

  let timeOut = setTimeout(() => {
    screen.value = originValue;
    removeTime();
  }, 5000);

  //   calculator.timeEvents.push({ type: "timeout", event: timeOut });

  calculator.timeEvents.push({ type: "interval", event: interval });
  calculator.timeEvents.push({ type: "timeout", event: timeOut });
}

function removeTime() {
  while (calculator.timeEvents.length > 0) {
    let event = calculator.timeEvents.pop();
    if (event === "interval") clearInterval(event.event);
    else clearTimeout(event.event);
  }
}

function handleDecimal() {
  let value = calculator.displayValue;
  //   If value has decimal then return
  if (value && value.toString().includes(".")) return;
  calculator.displayValue += ".";
  render(calculator.displayValue);
  calculator.isWaitNextOperand = false;
}

// update calculator screen
function render(output) {
  let screen = document.querySelector(".calculator__screen");
  screen.value = output;
}

function testValue(value) {
  console.log(value, calculator);
}

// Register functions on keys
bindKeyFunction();
render(0);
