var formData;

let logicArr = [];
let result = JSON.parse(sessionStorage.getItem("data"));
// var logicArr = [];
let testObj = "abc";

$("#myForm").on("submit", (e) => {
  // e.preventDefault();

  formData = $("form").serializeArray();

  console.log("formData is below");
  // console.log(formData);
  logicArr = createLogic(formData);
  // console.log(logicArr);
  sessionStorage.setItem("data", JSON.stringify(logicArr));
});
// |-index.js
//   |--public
//      |--data.js
//      |--test.js
//   |--views
//      |--home.ejs
//      |--timers.ejs

function createLogic(data) {
  let logic = [];
  let setsNum = parseFloat(
    data.filter((item) => {
      return item.name === "sets-i";
    })[0].value
  );

  //see if warmup, cooldown, highInt, lowInt have
  let warmupRequired = data.filter((item) => {
    return item.name === "warmup-r";
  });

  let cooldownRequired = data.filter((item) => {
    return item.name === "cooldown-r";
  });

  let highintRequired = data.filter((item) => {
    return item.name === "highint-r";
  });

  let lowintRequired = data.filter((item) => {
    return item.name === "lowint-r";
  });

  //Get the name and time
  let warmupName = data.filter((item) => {
    return item.name === "warmup-i";
  })[0].value;

  let warmupTime = data.filter((item) => {
    return item.name === "warmup-t";
  })[0].value;
  // console.log(warmupTime);

  let cooldownName = data.filter((item) => {
    return item.name === "cooldown-i";
  })[0].value;
  // console.log(cooldownName);

  let cooldownTime = data.filter((item) => {
    return item.name === "cooldown-t";
  })[0].value;

  let highintName = data.filter((item) => {
    return item.name === "highint-i";
  })[0].value;

  let highintTime = data.filter((item) => {
    return item.name === "highint-t";
  })[0].value;

  let lowintName = data.filter((item) => {
    return item.name === "lowint-i";
  })[0].value;

  let lowintTime = data.filter((item) => {
    return item.name === "lowint-t";
  })[0].value;

  let warmupTimeFormat = new Date(warmupTime * 1000)
    .toISOString()
    .substr(14, 5);
  let cooldownTimeFormat = new Date(cooldownTime * 1000)
    .toISOString()
    .substr(14, 5);
  let highintTimeFormat = new Date(highintTime * 1000)
    .toISOString()
    .substr(14, 5);
  let lowintTimeFormat = new Date(lowintTime * 1000)
    .toISOString()
    .substr(14, 5);

  //if no required, but fill the name and time, will not work
  if (warmupRequired.length !== 0) {
    //if required, but no fill name and time
    if (warmupTime !== "" && warmupName !== "") {
      logic.push({
        name: warmupName,
        timeFormat: warmupTimeFormat,
        time: warmupTime,
      });
    }
  }
  if (highintRequired.length !== 0 || lowintRequired.length !== 0) {
    console.log(setsNum);
    for (let i = 0; i < setsNum; i++) {
      if (
        (highintName === "" || highintTime === "") &&
        lowintName !== "" &&
        lowintTime !== ""
      ) {
        console.log("highint is empty, lowint is not");
        logic.push({
          name: lowintName,
          timeFormat: lowintTimeFormat,
          time: lowintTime,
        });
      } else if (
        (lowintName === "" || lowintTime === "") &&
        highintName !== "" &&
        highintTime !== ""
      ) {
        console.log("lowint is empty, highint is not");
        logic.push({
          name: highintName,
          timeFormat: highintTimeFormat,
          time: highintTime,
        });
      } else if (
        lowintName !== "" &&
        lowintTime !== "" &&
        highintName !== "" &&
        highintTime !== ""
      ) {
        logic.push({
          name: highintName,
          timeFormat: highintTimeFormat,
          time: highintTime,
        });
        logic.push({
          name: lowintName,
          timeFormat: lowintTimeFormat,
          time: lowintTime,
        });
      }
    }
  }
  if (cooldownRequired.length !== 0) {
    //if required, but no fill name and time
    if (cooldownTime !== "" && cooldownName !== "") {
      logic.push({
        name: cooldownName,
        timeFormat: cooldownTimeFormat,
        time: cooldownTime,
      });
    }
  }
  return logic;
}
