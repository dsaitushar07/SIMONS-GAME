let gameSeq = [];
let userSeq = [];

let btns = ["yellow", "red", "purple", "green"];
let start = document.querySelector("#start");
let started = false;
let level = 0;
let hscore = 0;

let h2 = document.querySelector("h2");
let play = document.querySelector("#play");
let home = document.querySelector("#home-page");
let main = document.querySelector("#main-game");

play.addEventListener("click", () => {
  home.style.display = "none";
  main.style.left = 0;
  main.style.backgroundColor = "black";
});

start.addEventListener("click", function (e) {
  if (started == false) {
    console.log("Game is started");
    started = true;
    levelUp();
  }
});

function gameFlash(btn) {
  btn.classList.add("flash");
  setTimeout(function () {
    btn.classList.remove("flash");
  }, 200);
}

function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(function () {
    btn.classList.remove("userflash");
  }, 150);
}

function levelUp() {
  userSeq = [];
  level++;
  hscore++;
  h2.innerText = `Level ${level}`;

  let randIdx = Math.floor(Math.random() * 3);
  let randColor = btns[randIdx];
  let randBtn = document.querySelector(`.${randColor}`);
  gameSeq.push(randColor);
  console.log(gameSeq);
  gameFlash(randBtn);
}

let score = document.querySelector("#score");

function checkAns(idx) {
  //   let idx = level - 1;
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length == gameSeq.length) {
      setTimeout(levelUp, 800);
    }
  } else {
    h2.innerHTML = `Game Over! Your Score is <b>${level}<b>`;
    score.innerHTML = `Your Highest score in this session is: <b>${hscore}<b>`;
    start.innerText = "RESTART";
    reset();
  }
}

function btnPress() {
  if (gameSeq.length > 0) {
    let btn = this;
    userFlash(btn);
    userColor = btn.getAttribute("id");
    userSeq.push(userColor);
    checkAns(userSeq.length - 1);
  }
}

let allBtns = document.querySelectorAll(".btn");
for (btn of allBtns) {
  btn.addEventListener("click", btnPress);
}

function reset() {
  start.addEventListener("click", () => {
    start.innerText = "START";
  });
  main.style.backgroundColor = "red";
  main.style.color = "black";
  setTimeout(function () {
    main.style.color = "rgb(218, 210, 210)";
    main.style.backgroundColor = "black";
  }, 500);
  started = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
  hscore = 0;
}

window.addEventListener("load", function () {
  score.innerHTML = `Your Highest score in this session is: 0`;
});
