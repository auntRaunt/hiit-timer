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

function initTimer(data) {
  currTask.textContent = data[0].name;
  currTime.textContent = data[0].timeFormat;
  nextTask.textContent = data[1].name;
  nextTime.textContent = data[1].timeFormat;
}

function logicTimer(data, timer) {
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

    timer = setTimeout(() => {
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

function remainCountDownTimer(timer) {
  timer = setInterval(() => {
    timeRemainTotal--;
    document.getElementById("time-remain-p").textContent = new Date(
      timeRemainTotal * 1000
    )
      .toISOString()
      .substr(14, 5);
    console.log(timeRemainTotal);
    if (timeRemainTotal === 0) {
      clearInterval(timer);
    }
  }, 1000);

  ////Originial Code
  // timer = setInterval(() => {
  //   timeRemainTotal--;
  //   document.getElementById("time-remain-p").textContent = new Date(
  //     timeRemainTotal * 1000
  //   )
  //     .toISOString()
  //     .substr(14, 5);
  //   console.log(timeRemainTotal);
  //   if (timeRemainTotal === 0) {
  //     clearInterval(timer);
  //   }
  // }, 1000);
}

function addInterval() {
  if (intervalDisplayAdd < intervalDisplaySplit[1]) intervalDisplayAdd++;
  document.getElementById("intervals-p").textContent =
    intervalDisplayAdd + " /" + intervalDisplaySplit[1];
  // console.log(intervalDisplayAdd);
}

function passAddTimer(timer, second) {
  let passSecond = second;
  timer = setInterval(() => {
    passSecond++;
    document.getElementById("time-pass-p").textContent = new Date(
      passSecond * 1000
    )
      .toISOString()
      .substr(14, 5);
    // console.log(timePassSecond);
    if (passSecond === totalTimeForPass) {
      clearInterval(timer);
    }
  }, 1000);

  return passSecond;
}

//Use the response data from server
function resetAll(data, allTimers) {
  //Set all the timer to null
  for (timer of allTimers) {
    clearInterval(timer);
    timer = null;
  }
  initTimer(data);
}

function play(data, allTimers) {
  let i = 0;
  let eachObjTime = data[i].time;

  logicTimer(data, allTimers[0]);
  remainCountDownTimer(allTimers[1], isPaused);
  passAddTimer(allTimers[2], 0);
  currCountDownTimer(allTimers[3], eachObjTime, 0);
}

//Execute
async function getData() {
  //Get response from GET route on server
  const response = await fetch("/result");
  const data = await response.json();
  console.log(data);

  //Initiate variables
  let timePassSecond = 0;
  let isPaused = false;
  let i = 0;
  let eachObjTime = data[i].time;

  //Initiaiztion all timer variable
  let logic_timer = -1;
  let remain_timer = -1;
  let pass_timer = -1;
  let curr_timer = -1;

  let all_timers = [logic_timer, remain_timer, pass_timer, curr_timer];

  //Think of using recursion inside the curr-time to count down
  function currCountDownTimer(timer, eachObjTime, i) {
    timer = setInterval(() => {
      eachObjTime--;

      //if count down time become 0, clear timer, increase i, count down time becomes data[i].time
      if (eachObjTime === 0) {
        clearInterval(timer);

        console.log("eachObjTime = 0");
        console.log(`i = ${i}`);

        if (i !== data.length) {
          console.log("i = end");
          i++;
        }

        //Save the time value of new object into a new variable
        let newEachObjTime = data[i].time;

        //精華所在
        currCountDownTimer(timer, newEachObjTime, i);
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
  logicTimer(data, logic_timer);
  remainCountDownTimer(remain_timer, isPaused);
  passAddTimer(pass_timer, timePassSecond);
  currCountDownTimer(curr_timer, eachObjTime, 0);

  playPauseButton.addEventListener("click", () => {
    console.log("Pause/Play are clicked?");

    
  });

  // resetButton.addEventListener("click", () => {
  //   all_timers = [logic_timer, remain_timer, pass_timer, curr_timer];
  //   resetAll(data, all_timers);
  //   console.log(all_timers[1]);
  // });
}

getData();
