let currTask = document.getElementById("curr-task");
let currTime = document.getElementById("curr-time");
let nextTask = document.getElementById("next-task");
let nextTime = document.getElementById("next-time");

//Select intervals DOM
let intervalDisplay = document.getElementById("intervals-p").textContent; //get "1/12";
let intervalDisplaySplit = intervalDisplay.split("/"); //get ["1","/","12"];
let intervalDisplayFixed = intervalDisplaySplit[2]; //get 12
let intervalDisplayAdd = parseFloat(intervalDisplaySplit[0]); //get1

//Select time pass DOM
let timePassDisplay = document.getElementById("time-pass-p").textContent;

//get "XX:XX" format, get totalTime "01:40" send from server(index.js)
let timeRemainFormat = document.getElementById("time-remain-p").textContent;

//get ["XX", "XX"]
let timeRemainSplit = timeRemainFormat.split(":"); //get ["01", ":", "40"]
let timeRemainMinute = parseFloat(timeRemainSplit[0]) * 60; //get 60 second
let timeRemainSecond = parseFloat(timeRemainSplit[1]); //get 40 second
//get total seconds
let timeRemainTotal = timeRemainMinute + timeRemainSecond; //get 100 second

let totalTimeForPass = timeRemainTotal;

//Select reset button DOM, select playpause button DOM
let resetButton = document.getElementById("reset-btn");
let playPauseButton = document.getElementById("play-start-btn");

//Initiaiztion all timer variable, should be in global scope, for clear function
let logic_timer = null;
let remain_timer = null;
let pass_timer = null;
let curr_timer = null;

let passSecond = 0;

let pause = false;

function initTimer(data) {
  currTask.textContent = data[0].name;
  currTime.textContent = data[0].timeFormat;
  nextTask.textContent = data[1].name;
  nextTime.textContent = data[1].timeFormat;
}

//old code of logicTimer(data)
// function logicTimer(data, pause) {
//   //Get the whole task arrays as data
//   let timing = 0;
//   // let logicTimer = timer;

//   for (let i = 0; i < data.length; i++) {
//     const currDisplayName =
//       i + 1 === data.length
//         ? "You have finished all the tasks!"
//         : data[i + 1].name;
//     const currDisplayTime = i + 1 === data.length ? "" : data[i + 1].timeFormat;
//     const nextDisplayName = i + 2 >= data.length ? "" : data[i + 2].name;
//     const nextDisplayTime = i + 2 >= data.length ? "" : data[i + 2].timeFormat;
//     const eachTime = data[i].time;
//     // let currMoveTime = data[i].time;
//     //Make the display second of curr timer count down
//     timing += eachTime;

//     logic_timer = setTimeout(() => {
//       console.log("logic_timer runs");
//       console.log(currDisplayName);
//       addInterval();

//       currTask.textContent = currDisplayName;
//       currTime.textContent = currDisplayTime;
//       nextTask.textContent = nextDisplayName;
//       nextTime.textContent = nextDisplayTime;
//       // currCountDownTimer(timing);
//     }, timing * 1000);
//   }
//   //as logic_timer is still inside for loop, how to pause the timer inside the for loop
//   if (pause) {
//     console.log("pause the logic timer?");
//     clearTimeout(logic_timer);
//   }
// }

function remainCountDownTimer() {
  remain_timer = setInterval(() => {
    timeRemainTotal--;
    document.getElementById("time-remain-p").textContent = new Date(
      timeRemainTotal * 1000
    )
      .toISOString()
      .substr(14, 5);
    console.log(timeRemainTotal);
    console.log("remain_timer runs");
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

function passAddTimer() {
  pass_timer = setInterval(() => {
    passSecond++;
    document.getElementById("time-pass-p").textContent = new Date(
      passSecond * 1000
    )
      .toISOString()
      .substr(14, 5);
    console.log("pass_timer runs");
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

//Execute
async function getData(callback) {
  //Get response from GET route on server
  const response = await fetch("/result");
  const data = await response.json();
  // console.log(data);

  callback(data);
}

getData(function (data) {
  console.log(data);

  // let i = 0;
  // let eachObjTime = data[i].time; //Each time of the task in each obj

  // //new code, how to pause the logicTimer
  function logicTimer(data, eachObjTime, i) {
    //Get the whole task arrays as data

    let currTime = 0;
    currTask.textContent =
      i === data.length ? "You have finished all tasks" : data[i].name;
    currTime.textContent = i === data.length ? "" : data[i].timeFormat;
    nextTask.textContent = i + 1 === data.length ? "" : data[i + 1].name;
    nextTime.textContent = i + 1 === data.length ? "" : data[i + 1].timeFormat;
    logic_timer = setInterval(() => {
      //if the time reaches the total time of each obj, then execute other obj
      currTime++;
      console.log(`currTime = ${currTime}`);
      if (currTime === eachObjTime) {
        clearInterval(logic_timer);
        addInterval();
        let index = i + 1;
        let newEachObjTime = data[index].time;
        logicTimer(data, newEachObjTime, index);
      }
    }, 1000);
  }

  //Think of using recursion inside the curr-time to count down
  //currCountDownTimer can be put in global scope?
  function currCountDownTimer(data, eachObjTime, i) {
    let eachTime = eachObjTime;
    curr_timer = setInterval(() => {
      eachTime--;
      //if count down time become 0, clear curr_timer, increase i, count down time becomes data[i].time
      if (eachTime === 0) {
        clearInterval(curr_timer);

        console.log("eachTime = 0");
        console.log(`i= ${i}`);

        let index = i + 1;

        if (index === data.length) {
          return;
        }
        //Save the time value of new object into a new variable
        let newEachObjTime = data[index].time;
        //精華所在
        currCountDownTimer(data, newEachObjTime, index);
      }

      console.log(`inside the setInterval`);
      console.log(`${eachTime}`);

      //Do not display 0 in text content of curr-time
      if (eachTime !== 0) {
        document.getElementById("curr-time").textContent = new Date(
          eachTime * 1000
        )
          .toISOString()
          .substr(14, 5);
      }
    }, 1000);
  }

  initTimer(data);
  logicTimer(data, data[0].time, 0);
  remainCountDownTimer();
  passAddTimer();
  currCountDownTimer(data, data[0].time, 0);

  playPauseButton.addEventListener("click", () => {
    // need to toggle click;
    console.log("Pause/Play are clicked?");
    pause = !pause;
    if (pause) {
      console.log("__________");
      console.log("PAUSE ALL TIMER!!!!");
      clear(pass_timer);
      clear(remain_timer);
      // clear(logic_timer); //still can not clear? can not clear the logic timer inside the for loop
      logicTimer(data, true);
      clear(curr_timer);
    } else {
      console.log("___________");
      console.log("RESUME ALL TIMER^_^");
      passAddTimer(); //pass_timer will start at 0 when resume (solved) ->need to put the pass second in global scope
      remainCountDownTimer();
      logicTimer(data, false);
      currCountDownTimer(data, eachObjTime);
    }
  });

  resetButton.addEventListener("click", () => {
    playAll();
  });
});

function clear(timer) {
  console.log(`${timer} is cleared`);
  clearInterval(timer);
  clearTimeout(timer);
}
