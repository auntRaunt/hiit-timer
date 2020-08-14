let currTask = document.getElementById("curr-task");
let currTime = document.getElementById("curr-time");
let nextTask = document.getElementById("next-task");
let nextTime = document.getElementById("next-time");

//Select intervals DOM
let intervalDisplay = document.getElementById("intervals-p").textContent;
let intervalDisplaySplit = intervalDisplay.split("/");
let intervalDisplayFixed = intervalDisplaySplit[2];
let intervalDisplayAdd = parseFloat(intervalDisplaySplit[0]);

//Select time pass DOM
let timePassDisplay = document.getElementById("time-pass-p").textContent;

//get "XX:XX" format
let timeRemainFormat = document.getElementById("time-remain-p").textContent;
//get ["XX", "XX"]
let timeRemainSplit = timeRemainFormat.split(":");
let timeRemainMinute = parseFloat(timeRemainSplit[0]) * 60;
let timeRemainSecond = parseFloat(timeRemainSplit[1]);
//get total seconds
let timeRemainTotal = timeRemainMinute + timeRemainSecond;

let totalTimeForPass = timeRemainTotal;

function initTimer(data) {
  currTask.textContent = data[0].name;
  currTime.textContent = data[0].timeFormat;
  nextTask.textContent = data[1].name;
  nextTime.textContent = data[1].timeFormat;
}

function renderTimer(data) {
  let timing = 0;

  for (let i = 0; i < data.length; i++) {
    const currDisplayName =
      i + 1 === data.length
        ? "You have finished all the tasks!"
        : data[i + 1].name;
    const currDisplayTime = i + 1 === data.length ? "" : data[i + 1].timeFormat;
    const nextDisplayName = i + 2 >= data.length ? "" : data[i + 2].name;
    const nextDisplayTime = i + 2 >= data.length ? "" : data[i + 2].timeFormat;
    const eachTime = data[i].time;
    // let currMoveTime = data[i].time;
    //Make the display second of curr timer count down
    timing += eachTime;

    setTimeout(() => {
      console.log(currDisplayName);
      addInterval();

      currTask.textContent = currDisplayName;
      currTime.textContent = currDisplayTime;
      nextTask.textContent = nextDisplayName;
      nextTime.textContent = nextDisplayTime;
      // renderCurrTimer(timing);
    }, timing * 1000);
  }
}

function remainTimer() {
  let remain_timer = null;

  remain_timer = setInterval(() => {
    timeRemainTotal--;
    document.getElementById("time-remain-p").textContent = new Date(
      timeRemainTotal * 1000
    )
      .toISOString()
      .substr(14, 5);
    console.log(timeRemainTotal);
    if (timeRemainTotal === 0) {
      clearInterval(remain_timer);
    }
  }, 1000);
}

function addInterval() {
  if (intervalDisplayAdd < intervalDisplaySplit[1]) intervalDisplayAdd++;
  document.getElementById("intervals-p").textContent =
    intervalDisplayAdd + " /" + intervalDisplaySplit[1];
  // console.log(intervalDisplayAdd);
}

function addPassTimer() {
  let timePassSecond = 0;
  let pass_timer = null;
  pass_timer = setInterval(() => {
    timePassSecond++;
    document.getElementById("time-pass-p").textContent = new Date(
      timePassSecond * 1000
    )
      .toISOString()
      .substr(14, 5);
    // console.log(timePassSecond);
    if (timePassSecond === totalTimeForPass) {
      clearInterval(pass_timer);
    }
  }, 1000);
}

function renderCurrTimer(time) {
  setInterval(() => {
    time--;
    console.log(time);

    document.getElementById("curr-time").textContent = time;
  }, 1000);
}

//Execute

async function getData() {
  const response = await fetch("/result");
  const data = await response.json();
  console.log(data);

  initTimer(data);
  renderTimer(data);
  remainTimer();
  addPassTimer();

  let i = 0;
  let eachObjTime = data[i].time;
  let newTimer = null;

  //Think of using recursion inside the curr-time to count down
  function timer(eachObjTime, i) {
    newTimer = setInterval(() => {
      eachObjTime--;

      //if count down time become 0, clear timer, increase i, count down time becomes data[i].time
      if (eachObjTime === 0) {
        clearInterval(newTimer);

        console.log("eachObjTime = 0");
        console.log(`i = ${i}`);
        if (i !== data.length) {
          console.log("i = end");
        }
        i++;
        //Save the time value of new object into a new variable
        let newEachObjTime = data[i].time;
        //精華所在
        timer(newEachObjTime, i);
      }

      console.log(`inside the setInterval`);
      console.log(`${eachObjTime}`);

      //Do not display 0 in text content of curr-time
      if (eachObjTime !== 0) {
        document.getElementById("curr-time").textContent = new Date(
          eachObjTime * 1000
        )
          .toISOString()
          .substr(14, 5);
      }
    }, 1000);
  }

  timer(eachObjTime, 0);
}

getData();
