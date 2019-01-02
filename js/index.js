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
  isWaitNextOpeartor: false,
  timeEvents: [],
  result: 0
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
  if (!calculator.currentValue) calculator.currentValue = "0"; // Prevent NaN
  let currentValue = calculator.currentValue + value;
  //   Set current value
  calculator.currentValue = parseFloat(currentValue);
  testValue("number");
  // render pressed number on screen
  render(calculator.currentValue);
}

function handleOperator(operator) {
  calculator.isWaitNextOpeartor = false;
  if (calculator.currentOperator) calculator.isWaitNextOpeartor = true;
  if (
    calculator.isWaitNextOpeartor &&
    calculator.prevValue &&
    calculator.currentValue
  ) {
    // If
    handleEqual();
    calculator.currentValue = null;
    calculator.currentOperator = operator;
  } else if (calculator.currentValue) {
    calculator.prevValue = calculator.currentValue;
    calculator.currentValue = null;
    calculator.currentOperator = operator;
  } else {
    calculator.currentOperator = operator;
  }

  testValue("operator");
}

function handleEqual() {
  // If prev is null, then means only one operator, use current one.
  let result = handleResult(calculator.currentOperator);

  calculator.result = result;
  calculator.currentValue = null;
  calculator.prevValue = calculator.result;
  render(calculator.result); // render result
  calculator.currentOperator = null;
  testValue("equal");
}

// When press equal, handle result
function handleResult(operator) {
  let result = calculator.result;

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

  if (!result) {
    console.log("result is null");
    return calculator.currentValue || calculator.prevValue;
  }

  return result;
}

function handleClear() {
  calculator.currentValue = null;
  calculator.prevValue = null;
  calculator.result = null;
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
  let value = calculator.currentValue;
  //   If value has decimal then return
  if (value && value.toString().includes(".")) return;

  if (!calculator.currentValue) calculator.currentValue = "0";

  calculator.currentValue += ".";
  render(calculator.currentValue);
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
