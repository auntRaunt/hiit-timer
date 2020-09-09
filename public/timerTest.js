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

const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");

//Initiaiztion all timer variable, should be in global scope, for clear function
let logic_timer = null;
let remain_timer = null;
let pass_timer = null;
let curr_timer = null;

let passSecond = 0;

let play = false;

let firstPlay = true;
let counter = 0;

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
    console.log("A. remain_timer runs");
    console.log(`A. timeRemainTotal = ${timeRemainTotal}`);
    if (timeRemainTotal === 0) {
      clearInterval(remain_timer);
    }
  }, 1000);
}

function addInterval() {
  if (intervalDisplayAdd < intervalDisplaySplit[1]) intervalDisplayAdd++;
  document.getElementById("intervals-p").textContent =
    intervalDisplayAdd + " /" + intervalDisplaySplit[1];
  console.log(
    "ADD INTERVAL ADD INTERVAL ADD INTERVAL ADD INTERVAL ADD INTERVAL ADD INTERVAL ADD INTERVAL ADD INTERVAL"
  );
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
    console.log("B. pass_timer runs");

    console.log(`B. passSecond = ${passSecond}`);
    if (passSecond === totalTimeForPass) {
      clearInterval(pass_timer);
    }
  }, 1000);
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

  let i = 0;
  let eachTaskObjTime = data[i].time; //Each time of the task in each obj
  let j = 0;
  let eachCurrObjTime = data[j].time;
  let newTaskTime = 0;
  let newCurrTime = 0;

  let currTime = 0;

  // //new code, how to pause the logicTimer
  function logicTimer(data, eachObjTime) {
    //Get the whole task arrays as data
    newTaskTime = eachObjTime;
    // console.log(`index i in first execution of logic Timer = ${i}`);
    //seems useless below?
    currTask.textContent = i === data.length ? "" : data[i].name;
    currTime.textContent = i === data.length ? "" : data[i].timeFormat;
    nextTask.textContent = i + 1 === data.length ? "" : data[i + 1].name;
    nextTime.textContent = i + 1 === data.length ? "" : data[i + 1].timeFormat;
    logic_timer = setInterval(() => {
      //if the time reaches the total time of each obj, then execute other obj
      currTime++;
      console.log(`C. logic_timer runs`);
      console.log(`C1. currTime = ${currTime}`);
      console.log(`C2. newTaskTime = ${newTaskTime}`);
      if (currTime === newTaskTime) {
        clearInterval(logic_timer);
        addInterval();
        //very important for pausing
        currTime = 0;
        if (i !== data.length) {
          i++;
          let newEachObjTime = data[i].time;
          logicTimer(data, newEachObjTime);
        }
      }
    }, 1000);
  }

  //Think of using recursion inside the curr-time to count down
  //currCountDownTimer can be put in global scope?
  function currCountDownTimer(data, eachObjTime) {
    // console.log(`index j in first execution of CURRCOUNTDOWN Timer = ${j}`);
    newCurrTime = eachObjTime;
    document.getElementById("curr-time").textContent = new Date(
      newCurrTime * 1000
    )
      .toISOString()
      .substr(14, 5);
    curr_timer = setInterval(() => {
      newCurrTime--;
      console.log(`D. currCountDownTimer runs`);
      console.log(`D. newCurrTime = ${newCurrTime}`);
      console.log(`_____________________________`);

      //Do not display 0 in text content of curr-time
      if (newCurrTime !== 0) {
        document.getElementById("curr-time").textContent = new Date(
          newCurrTime * 1000
        )
          .toISOString()
          .substr(14, 5);
      }

      //if count down time become 0, clear curr_t imer, increase i, count down time becomes data[i].time
      if (newCurrTime === 0) {
        clearInterval(curr_timer);
        if (j === data.length - 1) {
          playIcon.style.display = "block";
          pauseIcon.style.display = "none";
          currTime.textContent = "";
          currTask.textContent = "You have finished all the tasks";
          console.log("Execute this?");
        }

        if (j !== data.length) {
          j++;
          let newEachObjTime = data[j].time;
          currCountDownTimer(data, newEachObjTime);
        }
      }
    }, 1000);
  }

  // initTimer(data);
  // logicTimer(data, eachTaskObjTime);
  // currCountDownTimer(data, eachCurrObjTime);
  // remainCountDownTimer();
  // passAddTimer();

  playPauseButton.addEventListener("click", () => {
    // need to toggle click;

    if (i !== data.length) {
      play = !play;
      if (play) {
        if (firstPlay) {
          initTimer(data);
          logicTimer(data, eachTaskObjTime);
          currCountDownTimer(data, eachCurrObjTime);
          remainCountDownTimer();
          passAddTimer();
        } else {
          playIcon.style.display = "none";
          pauseIcon.style.display = "block";
          console.log("___________");
          console.log("RESUME ALL TIMER^_^");
          passAddTimer(); //pass_timer will start at 0 when resume (solved) ->need to put the pass second in global scope
          remainCountDownTimer();
          logicTimer(data, newTaskTime);
          currCountDownTimer(data, newCurrTime);
          console.log(`A. timeRemainTotal = ${timeRemainTotal}`);
          console.log(`B. passSecond = ${passSecond}`);
          console.log(`C. newTaskTime = ${newTaskTime}`);
          console.log(`D. newCurrTime = ${newCurrTime}`);
          console.log(`E. currTime = ${currTime}`);
        }
      } else {
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
        console.log("__________");
        console.log("PAUSE ALL TIMER!!!!");
        clear(pass_timer);
        clear(remain_timer);
        clear(logic_timer); //still can not clear? can not clear the logic timer inside the for loop
        clear(curr_timer);
        console.log(`A. timeRemainTotal = ${timeRemainTotal}`);
        console.log(`B. passSecond = ${passSecond}`);
        console.log(`C. newTaskTime = ${newTaskTime}`);
        console.log(`D. newCurrTime = ${newCurrTime}`);
        console.log(`E. currTime = ${currTime}`);
        firstPlay = false;
      }
    }

    ////old code
    // if (i !== data.length) {
    //   pause = !pause;
    //   if (pause) {
    //     playIcon.style.display = "block";
    //     pauseIcon.style.display = "none";
    //     console.log("__________");
    //     console.log("PAUSE ALL TIMER!!!!");
    //     clear(pass_timer);
    //     clear(remain_timer);
    //     clear(logic_timer); //still can not clear? can not clear the logic timer inside the for loop
    //     clear(curr_timer);
    //     console.log(`A. timeRemainTotal = ${timeRemainTotal}`);
    //     console.log(`B. passSecond = ${passSecond}`);
    //     console.log(`C. newTaskTime = ${newTaskTime}`);
    //     console.log(`D. newCurrTime = ${newCurrTime}`);
    //     console.log(`E. currTime = ${currTime}`);
    //   } else {
    //     playIcon.style.display = "none";
    //     pauseIcon.style.display = "block";
    //     console.log("___________");
    //     console.log("RESUME ALL TIMER^_^");
    //     passAddTimer(); //pass_timer will start at 0 when resume (solved) ->need to put the pass second in global scope
    //     remainCountDownTimer();
    //     logicTimer(data, newTaskTime);
    //     currCountDownTimer(data, newCurrTime);
    //     console.log(`A. timeRemainTotal = ${timeRemainTotal}`);
    //     console.log(`B. passSecond = ${passSecond}`);
    //     console.log(`C. newTaskTime = ${newTaskTime}`);
    //     console.log(`D. newCurrTime = ${newCurrTime}`);
    //     console.log(`E. currTime = ${currTime}`);
    //   }
    // }
  });

  resetButton.addEventListener("click", () => {
    // clear(pass_timer);
    // clear(remain_timer);
    // clear(logic_timer);
    // clear(curr_timer);
    // pass_timer = null;
    // remain_timer = null;
    // logic_timer = null;
    // curr_timer = null;
    // i = 0;
    // j = 0;
  });
});

function clear(timer) {
  console.log(`${timer} is cleared`);
  clearInterval(timer);
}
