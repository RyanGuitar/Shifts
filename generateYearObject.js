import { addToId, addClick, getId, toText } from "./helper.js";
import { dropBoxControl } from "./dropBox.js";

let shiftSettings = {};

let yearObject = {};

const worker = new Worker("worker.js");

worker.addEventListener("message", (event) => {
  const { data, msg } = event.data;
  if (msg === "generate") {
    yearObject = data;
    showCalendar();
  }
  if (msg === "write") {
    console.log(msg);
  }
  if (msg === "error") {
      shiftSettings = {
        years: new Date().getFullYear() + 10,
        referenceYear: new Date().getFullYear(),
        startMonth: 11,
        startDay: 7,
        pattern: [
          "day",
          "day",
          "day",
          "night",
          "night",
          "night",
          "night",
          "off",
          "off",
          "off",
          "day",
          "day",
          "day",
          "day",
          "night",
          "night",
          "night",
          "off",
          "off",
          "off",
          "off",
        ]
      }
      worker.postMessage({ msg: "generate", data: shiftSettings });
      displayPattern()
    } 
    
    if(msg === "read"){
      shiftSettings = data
      worker.postMessage({ msg: "generate", data: shiftSettings });
      displayPattern()
    }
});

worker.postMessage({ msg: "read", data: "" });

function displayPattern(){
  let list = ``
  for(let i = 0;i < shiftSettings.pattern.length;i++){
    list += `<div>${shiftSettings.pattern[i]}</div>`
  }
  addToId("pattern", list)
}

function clearPattern() {
  shiftSettings.pattern = [];
  addToId("pattern", "");
}

function addShift(e) {
  shiftSettings.pattern.push(e.target.id);
  displayPattern()
  const container = getId("patternBox");
  container.scrollLeft = container.scrollWidth;
}

getId("patternStart").addEventListener("change", (e) => {
  const date = new Date();
  const startDate = e.target.value;
  const thisYear = date.getFullYear();
  const thisMonth = date.getMonth() + 1;
  const [yearSelected, monthSelected, daySelected] = startDate.split("-");
  if (yearSelected == thisYear && monthSelected == thisMonth) {
    shiftSettings.startMonth = thisMonth;
    shiftSettings.startDay = +daySelected;
  } else {
    return
  }
});

function setShifts() {
  worker.postMessage({ msg: "generate", data: shiftSettings });
  showCalendar();
  getId("dropBox").dataset.open = "open";
  dropBoxControl();
  worker.postMessage({ msg: "write", data: toText(shiftSettings) });
}

addClick("calculate", setShifts);
addClick("header", dropBoxControl);
addClick("pattern", clearPattern);
addClick("patternBtns", addShift);
addToId("pattern", JSON.stringify(shiftSettings.pattern));

// calendar code
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const date = new Date();

function getMonth(offset) {
  date.setMonth(date.getMonth() + offset);
  showCalendar();
}

function showCalendar() {
  let count = 0;
  let monthDays = "";
  let shifts = {};
  const year = date.getFullYear();
  const month = date.getMonth();
  const calendarMonth = `${months[month]} ${year}`;
  const startMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  if (yearObject[year]) {
    shifts = Object.entries(yearObject[year][month + 1]);
  } else {
    return;
  }

  for (let i = 0; i < startMonth; i++) {
    monthDays += `<div class="dark"></div>`;
    count++;
  }

  for (let i = 1; i <= daysInMonth; i++) {
    monthDays += `<div class=${shifts[i - 1][1]}>${i}</div>`;
    count++;
  }

  for (let i = count; i <= 42; i++) {
    monthDays += `<div class="dark"></div>`;
  }

  addToId("monthDays", monthDays);
  addToId("monthYear", calendarMonth);
}

// const calendarContainer = document.getElementById("monthDays");
// let startX;

// calendarContainer.addEventListener("touchstart", handleTouchStart, {passive: true});
// calendarContainer.addEventListener("touchmove", handleTouchMove, {passive: true});

// function handleTouchStart(event) {
//   startX = event.touches[0].clientX;
// }

// function handleTouchMove(event) {
//   if (!startX) return;

//   const currentX = event.touches[0].clientX;
//   const deltaX = currentX - startX;
//   if (deltaX > 5) {
//     // Swipe right
//     getMonth(-1);
//   } 
//   if(deltaX < -5) {
//     // Swipe left
//     getMonth(1);
//   }

//   startX = null;
// }

const calendarContainer = document.getElementById("monthDays");
let startX;

calendarContainer.addEventListener("pointerdown", handlePointerDown, { passive: true });
calendarContainer.addEventListener("pointermove", handlePointerMove, { passive: true });

function handlePointerDown(event) {
  startX = event.clientX; // Use clientX for pointer events instead of touches[0].clientX
}

function handlePointerMove(event) {
  if (!startX) return;

  const currentX = event.clientX; // Use clientX for pointer events instead of touches[0].clientX
  const deltaX = currentX - startX;
  
  if (deltaX > 0) {
    // Swipe right
    getMonth(-1);
  } 
  if (deltaX < 0) {
    // Swipe left
    getMonth(1);
  }
  startX = null;
}

