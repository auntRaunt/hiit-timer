//Get logicArr from data.js?
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
let useTimeRemainTotal = timeRemainTotal;

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
let isEnd = false;
let counter = 0;

let audio = new Audio("sorafune.mp3");
audio.volume = 0.5;

function initTimer(data) {
  currTask.textContent = data[0].name;
  currTime.textContent = data[0].timeFormat;
  nextTask.textContent = data[1].name;
  nextTime.textContent = data[1].timeFormat;
}

function remainCountDownTimer() {
  remain_timer = setInterval(() => {
    useTimeRemainTotal--;
    document.getElementById("time-remain-p").textContent = new Date(
      useTimeRemainTotal * 1000
    )
      .toISOString()
      .substr(14, 5);
    console.log("A. remain_timer runs");
    console.log(`A. useTimeRemainTotal = ${useTimeRemainTotal}`);
    if (useTimeRemainTotal === 0) {
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
  ////old code

  // const response = await fetch("/result");

  // //Now think of how to get the data same as the data from post route.
  // //new code
  // const data = await response.json();

  // //old code
  // // const data = await response.json();
  // // // console.log(data);
  // callback(data);
  let storedData = JSON.parse(localStorage.getItem('data'));
  let copy = storedData;
  // console.log(storedData);
  // console.log(result);
  callback(copy);
}

getData(function (data) {
  console.log(data);

  /**Original code, dont delete**/
  let i = 0;
  let eachTaskObjTime = parseFloat(data[i].time); //Each time of the task in each obj
  let j = 0;
  let eachCurrObjTime = parseFloat(data[j].time);
  let newTaskTime = 0; //use as the return variable for logic timer to resume after pause
  let newCurrTime = 0; //use as the return variable for currcountdown timer to resume after pause
  let currTime = 0;

  initTimer(data);

  // //new code, how to pause the logicTimer
  function logicTimer(data, eachObjTime) {
    //Get the whole task arrays as data
    newTaskTime = eachObjTime;
    // console.log(`index i in first execution of logic Timer = ${i}`);

    //new code, see if use?
    currTask.textContent = data[i].name;
    currTime.textContent = data[i].timeFormat;
    nextTask.textContent = i + 1 >= data.length ? "" : data[i + 1].name;
    nextTime.textContent = i + 1 >= data.length ? "" : data[i + 1].timeFormat;

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
        if (i !== data.length - 1) {
          i++;
          let newEachObjTime = parseFloat(data[i].time);
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
          isEnd = true;
          playIcon.style.display = "block";
          pauseIcon.style.display = "none";
          document.getElementById("curr-time").textContent = "";
          currTask.textContent = "You have finished all the tasks";
          console.log(`j = ${j}`);
        }

        if (j !== data.length - 1) {
          console.log(`Execute when the end?`);
          j++;
          let newEachObjTime = parseFloat(data[j].time);
          currCountDownTimer(data, newEachObjTime);
        }
      }
    }, 1000);
  }

  playPauseButton.addEventListener("click", () => {
    //timer will trigger by the click after page reload
    //after i === data.length-1, can not access this button
    if (i <= data.length - 1 && isEnd === false) {
      play = !play;
      if (play) {
        if (firstPlay) {
          // audio.play();
          playIcon.style.display = "none";
          pauseIcon.style.display = "block";
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
  });

  resetButton.addEventListener("click", () => {
    clear(pass_timer);
    clear(remain_timer);
    clear(logic_timer);
    clear(curr_timer);
    pass_timer = null;
    remain_timer = null;
    logic_timer = null;
    curr_timer = null;
    initTimer(data);
    i = 0;
    j = 0;
    newTaskTime = 0;
    newCurrTime = 0;
    useTimeRemainTotal = timeRemainTotal; // reset to originail total time
    document.getElementById("time-remain-p").textContent = new Date(
      useTimeRemainTotal * 1000
    )
      .toISOString()
      .substr(14, 5);
    passSecond = 0;
    document.getElementById("time-pass-p").textContent = new Date(
      passSecond * 1000
    )
      .toISOString()
      .substr(14, 5);
    intervalDisplayAdd = 1;
    document.getElementById("intervals-p").textContent =
      intervalDisplayAdd + " /" + intervalDisplaySplit[1];
    firstPlay = true;
    play = false;
    isEnd = false;
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  });
});

function clear(timer) {
  console.log(`${timer} is cleared`);
  clearInterval(timer);
}
