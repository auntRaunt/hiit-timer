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

//Select reset button DOM, select playpause button DOM
let resetButton = document.getElementById("reset-btn");
let playPauseButton = document.getElementById("play-start-btn");

//Initiaiztion all timer variable
let logic_timer = null;
let remain_timer = null;
let pass_timer = null;
let curr_timer = null;

function initTimer(data) {
  currTask.textContent = data[0].name;
  currTime.textContent = data[0].timeFormat;
  nextTask.textContent = data[1].name;
  nextTime.textContent = data[1].timeFormat;
}

function logicTimer(data) {
  let timing = 0;
  // let logicTimer = timer;

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

    logic_timer = setTimeout(() => {
      console.log(currDisplayName);
      addInterval();

      currTask.textContent = currDisplayName;
      currTime.textContent = currDisplayTime;
      nextTask.textContent = nextDisplayName;
      nextTime.textContent = nextDisplayTime;
      // currCountDownTimer(timing);
    }, timing * 1000);
  }
}

function remainCountDownTimer() {
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

function passAddTimer(second) {
  let passSecond = second;
  pass_timer = setInterval(() => {
    passSecond++;
    document.getElementById("time-pass-p").textContent = new Date(
      passSecond * 1000
    )
      .toISOString()
      .substr(14, 5);
    // console.log(timePassSecond);
    if (passSecond === totalTimeForPass) {
      clearInterval(pass_timer);
    }
  }, 1000);
}

function playAllTimer() {
  initTimer(data);
  logicTimer(data);
  remainCountDownTimer();
  passAddTimer(timePassSecond);
  currCountDownTimer(curr_timer, eachObjTime, 0);
}

//Use the response data from server

function clear_interval(timer) {
  console.log(timer);
  clearInterval(timer);
  timer = null;
  return timer;
}

function clear_timeout(timer) {
  console.log(timer);
  clearTimeout(timer);
  timer = null;
  return timer;
}

//Execute
async function getData() {
  //Get response from GET route on server
  const response = await fetch("/result");
  const data = await response.json();
  console.log(data);

  //Initiate variables
  let timePassSecond = 0;
  let i = 0;
  let eachObjTime = data[i].time;

  //Think of using recursion inside the curr-time to count down
  function currCountDownTimer(timer, eachObjTime, i) {
    curr_timer = setInterval(() => {
      eachObjTime--;

      //if count down time become 0, clear curr_timer, increase i, count down time becomes data[i].time
      if (eachObjTime === 0) {
        clearInterval(curr_timer);

        console.log("eachObjTime = 0");
        console.log(`i = ${i}`);

        if (i !== data.length) {
          console.log("i = end");
          i++;
        }

        //Save the time value of new object into a new variable
        let newEachObjTime = data[i].time;

        //精華所在
        currCountDownTimer(curr_timer, newEachObjTime, i);
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

  initTimer(data);
  logicTimer(data);
  remainCountDownTimer();
  passAddTimer(timePassSecond);
  currCountDownTimer(curr_timer, eachObjTime, 0);

  playPauseButton.addEventListener("click", () => {
    // need to toggle click;
    console.log("Pause/Play are clicked?");

    if (remain_timer !== null && logic_timer !== null && pass_timer !== null && curr_timer !== null) {
      clear_timeout(remain_timer);
      clear_interval(logic_timer);
      clear_interval(pass_timer);
      clear_interval(curr_timer);
    } else {
      initTimer(data);
      logicTimer(data);
      remainCountDownTimer();
      passAddTimer(timePassSecond);
      currCountDownTimer(curr_timer, eachObjTime, 0);
    }
  });

  // resetButton.addEventListener("click", () => {
  //   all_timers = [logic_timer, remain_timer, pass_timer, curr_timer];
  //   resetAll(data, all_timers);
  //   console.log(all_timers[1]);
  // });
}

getData();
