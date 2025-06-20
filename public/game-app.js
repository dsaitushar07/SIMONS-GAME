// let gameSeq = [];
// let userSeq = [];
// let btns = ["yellow", "red", "purple", "green"];
// let start = document.querySelector("#start");
// let started = false;
// let level = 0;
// let sessionHighScore = 0;

// let h2 = document.querySelector("h2");
// let main = document.querySelector("#main-game");
// let score = document.querySelector("#score");

// // Get userId and all-time high score from the HTML dataset
// const userId = document.body.dataset.userId || null;
// const originalHighScore = parseInt(document.body.dataset.hscore || "0");
// const saveExitBtn = document.querySelector("#saveExit");

// start.addEventListener("click", () => {
//   if (!started) {
//     started = true;
//     levelUp();
//   }
// });

// function gameFlash(btn) {
//   btn.classList.add("flash");
//   setTimeout(() => btn.classList.remove("flash"), 200);
// }

// function userFlash(btn) {
//   btn.classList.add("userflash");
//   setTimeout(() => btn.classList.remove("userflash"), 150);
// }

// function levelUp() {
//   userSeq = [];
//   level++;

//   if (level > sessionHighScore) {
//     sessionHighScore = level;
//   }

//   h2.innerText = `Level ${level}`;
//   updateScoreDisplay();

//   const randColor = btns[Math.floor(Math.random() * 4)];
//   gameSeq.push(randColor);
//   const randBtn = document.querySelector(`.${randColor}`);
//   gameFlash(randBtn);
// }

// function checkAns(idx) {
//   if (userSeq[idx] === gameSeq[idx]) {
//     if (userSeq.length === gameSeq.length) {
//       setTimeout(levelUp, 800);
//     }
//   } else {
//     h2.innerHTML = `Game Over! Your Score is <b>${sessionHighScore}</b>`;
//     updateScoreDisplay();
//     start.innerText = "RESTART";
//     reset();
//   }
// }

// function btnPress() {
//   if (gameSeq.length > 0) {
//     let btn = this;
//     userFlash(btn);
//     let userColor = btn.getAttribute("id");
//     userSeq.push(userColor);
//     checkAns(userSeq.length - 1);
//   }
// }

// document.querySelectorAll(".btn").forEach((btn) => {
//   btn.addEventListener("click", btnPress);
// });

// function reset() {
//   main.style.backgroundColor = "red";
//   main.style.color = "black";
//   setTimeout(() => {
//     main.style.backgroundColor = "black";
//     main.style.color = "rgb(218, 210, 210)";
//   }, 500);

//   started = false;
//   gameSeq = [];
//   userSeq = [];
//   level = 0;
// }
// let score2 = document.querySelector("#score2");
// function updateScoreDisplay() {
//   score.innerHTML = `
//     Highest Score This Session: &nbsp;<b>${sessionHighScore}</b><br><br>`;
//   score2.innerHTML = `All-Time Highest Score: &nbsp;<b>${Math.max(
//     originalHighScore,
//     sessionHighScore
//   )}</b>`;
// }

// window.addEventListener("load", () => {
//   updateScoreDisplay();
// });

// // ===============================
// // 🔁 Save & Exit Logic
// // ===============================
// if (userId && saveExitBtn) {
//   saveExitBtn.addEventListener("click", async () => {
//     const finalScore = Math.max(sessionHighScore, originalHighScore);
//     console.log("Final Score to Save:", finalScore);

//     try {
//       const response = await fetch(`/user/${userId}/game/submit`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ hscore: finalScore }),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log("Score submitted:", result.message);
//         window.location.href = `/user/${userId}/home`;
//       } else {
//         alert("Failed to save score.");
//       }
//     } catch (err) {
//       console.error("Error submitting score:", err);
//       alert("Error occurred while saving.");
//     }
//   });
// }

// Your existing JavaScript code remains exactly the same
let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "purple", "green"];
let start = document.querySelector("#start");
let started = false;
let level = 0;
let sessionHighScore = 0;

let h2 = document.querySelector("h2");
let main = document.querySelector("#main-game");
let score = document.querySelector("#score");

// Get userId and all-time high score from the HTML dataset
const userId = document.body.dataset.userId || null;
const originalHighScore = parseInt(document.body.dataset.hscore || "0");
const saveExitBtn = document.querySelector("#saveExitBtn");

start.addEventListener("click", () => {
  if (!started) {
    started = true;
    levelUp();
  }
});

function gameFlash(btn) {
  btn.classList.add("flash");
  setTimeout(() => btn.classList.remove("flash"), 200);
}

function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => btn.classList.remove("userflash"), 150);
}

function levelUp() {
  userSeq = [];
  level++;

  if (level > sessionHighScore) {
    sessionHighScore = level;
  }

  h2.innerText = `Level ${level}`;
  updateScoreDisplay();

  const randColor = btns[Math.floor(Math.random() * 4)];
  gameSeq.push(randColor);
  const randBtn = document.querySelector(`.${randColor}`);
  gameFlash(randBtn);
}

function checkAns(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      setTimeout(levelUp, 800);
    }
  } else {
    h2.innerHTML = `Game Over! Your Score is <b>${sessionHighScore}</b>`;
    updateScoreDisplay();
    start.innerText = "RESTART";
    reset();
  }
}

function btnPress() {
  if (gameSeq.length > 0) {
    let btn = this;
    userFlash(btn);
    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);
    checkAns(userSeq.length - 1);
  }
}

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", btnPress);
});

function reset() {
  // Enhanced game over animation
  main.classList.add("game-over");
  setTimeout(() => {
    main.classList.remove("game-over");
  }, 500);

  started = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
}

let sessionScore = document.querySelector("#sessionScore");
let allTimeScore = document.querySelector("#allTimeScore");

function updateScoreDisplay() {
  sessionScore.innerHTML = `
          <b>${sessionHighScore}</b>`;
  allTimeScore.innerHTML = `<b>${Math.max(
    originalHighScore,
    sessionHighScore
  )}</b>`;
}

window.addEventListener("load", () => {
  updateScoreDisplay();
});

// Save & Exit Logic (unchanged)
if (userId && saveExitBtn) {
  saveExitBtn.addEventListener("click", async () => {
    const finalScore = Math.max(sessionHighScore, originalHighScore);
    console.log("Final Score to Save:", finalScore);

    try {
      const response = await fetch(`/user/${userId}/game/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hscore: finalScore }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Score submitted:", result.message);
        window.location.href = `/user/${userId}/home`;
      } else {
        alert("Failed to save score.");
      }
    } catch (err) {
      console.error("Error submitting score:", err);
      alert("Error occurred while saving.");
    }
  });
}

// Add smooth page transitions
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.3s ease";
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});
