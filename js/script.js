/*Game Customization*/
var gameBlock = ".game",
    gameFiledBlock = ".game__field",
    gameMenuBlock = ".game__menu",
    descriptionBlock = ".description__content",
    buttonDescription = ".description__title",
    buttonPlayGame = ".play-button",
    buttonPasueGame = ".pause-button",
    buttonRestarGame = ".restar-button",
    buttonResetResults = ".reset-results-button",
    userNameInput = ".game__user-name",
    userColorInput = ".game__user-color",
    currentResult = {},
    bestResults = [],
    isGameStop = false,
    isGameOver = false;

var canvas = document.querySelector(gameFiledBlock),
  ctx = canvas.getContext("2d");
var canvasMenu = document.querySelector(gameMenuBlock),
  ctxMenu = canvasMenu.getContext("2d");

/*Default values*/
var PAD_SPEED = 12,
    PAD_WIDTH = 75,
    BALL_SPPED_X = 4,
    BALL_SPPED_Y = -4;




/*Ball customization*/
var ballRadius = 10,
  ballColor = "#13ff00",
  x = canvas.width/2,
  y = canvas.height - 30,
  dx = BALL_SPPED_X,
  dy = BALL_SPPED_Y;
/*Pad customization*/
var padHeight = 10,
    padWidth = PAD_WIDTH,
    padX = (canvas.width - padWidth)/2,
    padSpeed = PAD_SPEED,
    padColor = "#13ff00",
    rightPressed = false,
    leftPressed = false;

/*Bricks customization*/
var brickRowCount = 5,
    brickColumnCount = 5,
    brickHeight = 20,
    brickMarginTop = 20,
    brickMarginBot = 10,
    brickMarginSides = 20,
    brickColor = "#13ff00",
    bricks = [],
    brickWidth = Math.floor((canvas.width - brickMarginSides*2 - (brickColumnCount-1)*10)/brickColumnCount);

/*User customization*/
var user = {
  name: "",
  lives: 3,
  score: 0,
  level: 1,
  color: "",
  bricks: 0,
  isDrunk: false
};


/*Image ceating*/

var imgPointsUP = new Image(),
    imgPointsDown = new Image(),
    imgBallSpeedUp = new Image(),
    imgBallSpeedUpNO = new Image(),
    imgBallSpeedDown = new Image(),
    imgBallSpeedDownNO = new Image(),
    imgPadSpeedUp = new Image(),
    imgPadSpeedUpNO = new Image(),
    imgPadSpeedDown = new Image(),
    imgPadSpeedDownNO = new Image(),
    imgPadWidthUp = new Image(),
    imgPadWidthUpNO = new Image(),
    imgPadWidthDown = new Image(),
    imgPadWidthDownNO = new Image(),
    imgLiveUp = new Image(),
    imgLiveDown = new Image(),
    imgLiveDownNO = new Image(),
    imgLevelUp = new Image(),
    imgGold = new Image(),
    imgBeer = new Image(),
    imgBeerMissed = new Image(),
    imgNo = new Image();

    imgPointsUP.src = 'img/pointsUp.png';
    imgPointsDown.src = 'img/pointsDown.png';
    imgBallSpeedUp.src = 'img/ballSpeedUp.png';
    imgBallSpeedUpNO.src = 'img/ballSpeedUp-NO.png';
    imgBallSpeedDown.src = 'img/ballSpeedDown.png';
    imgBallSpeedDownNO.src = 'img/ballSpeedDown-NO.png';
    imgPadSpeedUp.src = 'img/padSpeedUp.png';
    imgPadSpeedUpNO.src = 'img/padSpeedUp-NO.png';
    imgPadSpeedDown.src = 'img/padSpeedDown.png';
    imgPadSpeedDownNO.src = 'img/padSpeedDown-NO.png'
    imgPadWidthUp.src = 'img/padWidthUp.png';
    imgPadWidthUpNO.src = 'img/padWidthUp-NO.png';
    imgPadWidthDown.src = 'img/padWidthDown.png';
    imgPadWidthDownNO.src = 'img/padWidthDown-NO.png'
    imgLiveUp.src = 'img/liveUp.png';
    imgLiveDown.src = 'img/liveDown.png';
    imgLiveDownNO.src = 'img/liveDown-NO.png';
    imgLevelUp.src = 'img/levelUp.png';
    imgGold.src = 'img/gold.png';
    imgBeer.src = 'img/beer.png';
    imgBeerMissed.src = 'img/beerMissed.png';
    imgNo.src = 'img/no.png';

/*bonuses*/
var effectsList = [];
var bonusList = [],
    bonusWidth = 20,
    bonusHeight = 20,
    bonusSpeed = 3.5,
    bonusColor = "#13ff00",
    bonusColorGold = "gold",
    bonusColorDebuff = "red";

var effectsDescHTML = [
  {
    imgSrc : "img/pointsUp.png",
    imgAlt : "Points Up",
    effectTitle : "+ Points",
    effectDesc : "The buff increases your score by 200 points. Buff can be found in green bonus block. You will lose 100 points if you miss the bonus block."
  },
  {
    imgSrc : "img/pointsDown.png",
    imgAlt : "Points Down",
    effectTitle : "- Points",
    effectDesc : "The debuff decreases your score by 100 points. Debuff can be found in red bonus block. Also, you will get the debuff if you miss green bonus block with \"+ Points\" bonus."
  },
  {
    imgSrc : "img/ballSpeedDown.png",
    imgAlt : "Ball Speed Down",
    effectTitle : "Ball speed down",
    effectDesc : "The buff decreases the ball's speed. The speed can't be decreased if the current ball's speed less than 0.71 of the default one. Buff can be found in green bonus block. The ball's speed will be increased if you miss the bonus."
  },
  {
    imgSrc : "img/ballSpeedUp.png",
    imgAlt : "Ball Speed Up",
    effectTitle : "Ball speed up",
    effectDesc : "The debuff increases the ball's speed. The speed can't be increased if the current ball's speed more than 1.65 of the default one. Debuff can be found in red bonus block. Also, you will get the debuff if you miss green bonus block with \"Ball speed down\" bonus."
  },
  {
    imgSrc : "img/liveUp.png",
    imgAlt : "Live adding",
    effectTitle : "Live adding",
    effectDesc : "The buff adds you a live. Buff can be found in green bonus block. You will lose one if you miss the bonus block."
  },
  {
    imgSrc : "img/liveDown.png",
    imgAlt : "Live deducting",
    effectTitle : "Live deducting",
    effectDesc : "The debuff deducts your live. Debuff can be found in red bonus block. Also, you will get the debuff if you miss green bonus block with \"Live adding\" effect. Note: you can lose the last live."
  },
  {
    imgSrc : "img/padSpeedUp.png",
    imgAlt : "Pad Speed Up",
    effectTitle : "Pad speed up",
    effectDesc : "The buff increases the pad's speed. The speed can't be increased if the current pad's speed more than 1.6 of the default one. Buff can be found in green bonus block. The pad's speed will be decreased if you miss the bonus."
  },
  {
    imgSrc : "img/padSpeedDown.png",
    imgAlt : "Pad Speed Down",
    effectTitle : "Pad speed down",
    effectDesc : "The debuff decreases the pad's speed. The speed can't be decreased if the current pad's speed less than 0.5 of the default one. Debuff can be found in red bonus block. Also, you will get the debuff if you miss green bonus block with \"Pad speed up\" bonus."
  },
  {
    imgSrc : "img/padWidthUp.png",
    imgAlt : "Pad width increasing",
    effectTitle : "Pad width increasing",
    effectDesc : "The buff increases the pad's width. The width can't be increased if the current pad's width more than 1.33 of the default one. Buff can be found in green bonus block. The pad's width will be decreased if you miss the bonus."
  },
  {
    imgSrc : "img/padWidthDown.png",
    imgAlt : "Pad width decreasing",
    effectTitle : "Pad width decreasing",
    effectDesc : "The debuff decreases the pad's width. The width can't be decreased if the current pad's width less than 0.7 of the default one. Debuff can be found in red bonus block. Also, you will get the debuff if you miss green bonus block with \"Pad width increasing\" bonus."
  },
  {
    imgSrc : "img/levelUp.png",
    imgAlt : "Level UP",
    effectTitle : "Level UP",
    effectDesc : "Congrats! You reached new level and got 750 points."
  },
  {
    imgSrc : "img/gold.png",
    imgAlt : "Gold bar",
    effectTitle : "Gold bar",
    effectDesc : "Gold bar gives you 750 points. You definitely should catch gold bonus block."
  },
  {
    imgSrc : "img/beer.png",
    imgAlt : "Beer",
    effectTitle : "Are you drunk?",
    effectDesc : "Are you drunk? The debuff (or buff?) switches your controls. You can find it in green as well in red bonus blocks."
  },
  {
    imgSrc : "img/no.png",
    imgAlt : "No",
    effectTitle : "Effect was canceled",
    effectDesc : "That sign means that an effect was canceled. For example if you catch \"Live deducting\" debuff but your live equals 1."
  }

]

/*Game initialization*/
document.querySelector(buttonDescription).onclick = function() {
  document.querySelector(descriptionBlock).classList.toggle('description--open');
}

document.querySelector(buttonResetResults).onclick = function() {
  if (askConfirm("Do you really want to reset results?")) {
    resetResults();
  }
}
if (localStorage.getItem("cache__userName")) {
  document.querySelector(userNameInput).value = localStorage.getItem("cache__userName");
}
if (localStorage.getItem("cache__userColor")) {
  document.querySelector(userColorInput).value = localStorage.getItem("cache__userColor");
}

document.querySelector(buttonPlayGame).onclick = function() {
  user.name = document.querySelector(userNameInput).value;
  localStorage.setItem("cache__userName", user.name);
  user.color = document.querySelector(userColorInput).value;
  localStorage.setItem("cache__userColor", user.color);
  user.name = user.name.replace(/!/g, "");
  if (user.name.length > 9) {
    alert("The '" + user.name + "' name is too long. Please use less than 9 character");
    return;
  }
  user.color = user.color.replace(/!/g, "");
  if (user.color == "black" || user.color == "#000000" ||  user.color == "rgb(0,0,0)" ||  user.color.slice(0,4) == "rgba") {
    alert("Please do not use black or transparent color");
    return;
  }
  document.querySelector(gameBlock).classList.add("game--active");
  document.querySelector(".start-options").classList.add("start-options--disable");
  playGame();
}
document.querySelector(buttonPasueGame).onclick = function() {stopGame();}
document.querySelector(buttonRestarGame).onclick = function() {
  if (isGameOver || askConfirm("Do you really want to reload the page?")) {
    restartGame();
  }
}

/*~~~~~~~~~~~~*/
/*Templates*/
/*Results table creating*/

var resultsHTML = document.querySelector('.results');

var resultsTemplate = document.querySelector('.resultsTemplate').content.querySelector('.results__item');

for (var i = 0; i < 10; i++) {
  var resultsItem = resultsTemplate.cloneNode(true);

  resultsItem.children[0].textContent = i + 1;
  if (localStorage.getItem("resultsDATA")) {
    bestResults = sortBestResults(getResultsDATA(localStorage.getItem("resultsDATA")));
    if (bestResults.length > i) {
      resultsItem.setAttribute("style", "color: " + bestResults[i].color + ";");
      resultsItem.children[1].textContent = bestResults[i].name;
      resultsItem.children[2].textContent = "Score: " + bestResults[i].score;
      resultsItem.children[3].textContent = "Bricks: " + bestResults[i].bricks;
      resultsItem.children[4].textContent = "Level: " + bestResults[i].level;
    }
  }

  resultsHTML.appendChild(resultsItem);
}
/*Effects list creating*/
var effectsHTML = document.querySelector('.effects');

var effectsTemplate = document.querySelector('.effectsTemplate').content.querySelector('.effects__item');

for (var i = 0; i < effectsDescHTML.length; i++) {
  var effectItem = effectsTemplate.cloneNode(true);

  effectItem.children[0].src = effectsDescHTML[i].imgSrc;
  effectItem.children[0].alt = effectsDescHTML[i].imgAlt;
  effectItem.children[1].children[0].textContent = effectsDescHTML[i].effectTitle;
  effectItem.children[1].children[1].textContent = effectsDescHTML[i].effectDesc;
  effectsHTML.appendChild(effectItem);
}
/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/

function playGame() {
  window.scrollTo(0, 0);
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);
  generateBricks();
  setInterval(draw, 20);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

function drawPad() {
  ctx.beginPath();
  ctx.rect(padX, canvas.height-padHeight, padWidth, padHeight);
  ctx.fillStyle = padColor;
  ctx.fill();
  ctx.closePath();
}

function drawBricks(i,j) {
  ctx.beginPath();
  ctx.rect(bricks[i][j].x, bricks[i][j].y, bricks[i][j].width, brickHeight);
  ctx.fillStyle = bricks[i][j].color;
  ctx.fill();
  ctx.closePath();
}

function drawUserName() {
  ctxMenu.font = "700 28px Poppins";
  ctxMenu.fillStyle = user.color;
  ctxMenu.fillText(user.name, 20, 32);
}

function drawLevel() {
  ctxMenu.font = "700 24px Poppins";
  ctxMenu.fillStyle = user.color;
  ctxMenu.fillText("Level: "+user.level, 20, 56);
}

function drawUserLives() {
  ctxMenu.font = "700 16px Poppins";
  ctxMenu.fillStyle = "#13ff00";
  ctxMenu.fillText("Lives: "+user.lives, 20, 86);
}

function drawScore() {
  ctxMenu.font = "700 16px Poppins";
  ctxMenu.fillStyle = "#13ff00";
  ctxMenu.fillText("Score: "+user.score, 20, 106);
}

function drawBrickTotal() {
  ctxMenu.font = "700 16px Poppins";
  ctxMenu.fillStyle = "#13ff00";
  ctxMenu.fillText("Bricks: "+user.bricks, 20, 126);
}

function drawGameOver() {
  ctx.font = "700 56px Poppins";
  ctx.fillStyle = "#13ff00";
  ctx.fillText("Game Over", canvas.width/5, canvas.height/3 + 28);
  ctx.font = "700 48px Poppins";
  ctx.fillStyle = user.color;
  ctx.fillText("Score: "+user.score, canvas.width/4, canvas.height - canvas.height/4 - 24);

}

function drawEffects() {
  ctxMenu.font = "700 20px Poppins";
  if (Math.abs(dy/BALL_SPPED_X) == 1) {
    ctxMenu.fillStyle = "#9b9b9b";
  } else if (Math.abs(dy/BALL_SPPED_X) < 1) {
    ctxMenu.fillStyle = "#13ff00";
  } else if (Math.abs(dy/BALL_SPPED_X) > 1) {
    ctxMenu.fillStyle = "red";
  }
  ctxMenu.fillText("Ball Speed " + Math.abs(dy/BALL_SPPED_X).toFixed(2) +"x", 20, 160);

  ctxMenu.font = "700 20px Poppins";
    if (padSpeed/PAD_SPEED == 1) {
    ctxMenu.fillStyle = "#9b9b9b";
  } else if (padSpeed/PAD_SPEED > 1) {
    ctxMenu.fillStyle = "#13ff00";
  } else if (padSpeed/PAD_SPEED < 1) {
    ctxMenu.fillStyle = "red";
  }
  ctxMenu.fillText("Pad Speed: " + (padSpeed/PAD_SPEED).toFixed(2) +"x", 20, 185);

  ctxMenu.font = "700 20px Poppins";
      if (padWidth/PAD_WIDTH == 1) {
    ctxMenu.fillStyle = "#9b9b9b";
  } else if (padWidth/PAD_WIDTH > 1) {
    ctxMenu.fillStyle = "#13ff00";
  } else if (padWidth/PAD_WIDTH < 1) {
    ctxMenu.fillStyle = "red";
  }
  ctxMenu.fillText("Pad Width: " + (padWidth/PAD_WIDTH).toFixed(2) +"x", 20, 210);
}

function drawEffectsList() {
  ctxMenu.font = "700 32px Poppins";
  ctxMenu.fillStyle = user.color;
  ctxMenu.fillText("Last effects ", 20, 262);

  ctxMenu.beginPath();
  ctxMenu.lineWidth="2";
  ctxMenu.strokeStyle="#13ff00";
  ctxMenu.rect(20,272,60,60);
  ctxMenu.stroke();
  ctxMenu.rect(20, 272, 60, 60);
  ctxMenu.fillStyle = "#132e01";
  ctxMenu.fill();
  ctxMenu.closePath();

  ctxMenu.beginPath();
  ctxMenu.lineWidth="2";
  ctxMenu.strokeStyle="#0c9d00";
  ctxMenu.rect(90,272,60,60);
  ctxMenu.stroke();
  ctxMenu.rect(90, 272, 60, 60);
  ctxMenu.fillStyle = "#132e01";
  ctxMenu.fill();
  ctxMenu.closePath();

  ctxMenu.beginPath();
  ctxMenu.lineWidth="2";
  ctxMenu.strokeStyle="#076200";
  ctxMenu.rect(160,272,60,60);
  ctxMenu.stroke();
  ctxMenu.rect(160, 272, 60, 60);
  ctxMenu.fillStyle = "#132e01";
  ctxMenu.fill();
  ctxMenu.closePath();


  if (effectsList[effectsList.length-1]) {
    ctxMenu.drawImage(effectsList[effectsList.length-1],20,272,60,60);
  }
  if (effectsList[effectsList.length-2]) {
    ctxMenu.drawImage(effectsList[effectsList.length-2],90,272,60,60);
  }
  if (effectsList[effectsList.length-3]) {
    ctxMenu.drawImage(effectsList[effectsList.length-3],160,272,60,60);
  }
}

function drawBestResult() {
  var r = 0,
      n = "",
      c = "#13ff00";

  if (localStorage.getItem("cache__best-result")) {
    r = " " + localStorage.getItem("cache__best-result");
    n = localStorage.getItem("cache__best-result--name");
    c = localStorage.getItem("cache__best-result--color");
  }

  ctxMenu.font = "700 16px Poppins";
  ctxMenu.fillStyle = "#13ff00";
  ctxMenu.fillText("Best result", 20, canvasMenu.height - 21);

  ctxMenu.font = "700 16px Poppins";
  ctxMenu.fillStyle = c;
  ctxMenu.fillText(n + r, 20, canvasMenu.height);
}

function drawDrankText() {
  ctxMenu.font = "700 24px Poppins";
  ctxMenu.fillStyle = "brown";
  ctxMenu.fillText("Are you drunk!?", 20, 380);
}

function drawBonus(n) {
  ctx.beginPath();
  ctx.rect(bonusList[n].x, bonusList[n].y, bonusWidth, bonusHeight);
  ctx.fillStyle = bonusList[n].color;
  ctx.fill();
  ctx.closePath();
}

/*DRAW FUNCTION Start*/

function draw() {
  if (isGameOver) {
    return;
  }

  if (isGameStop) {
    return;
  }

  brickCollisionDetection();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctxMenu.clearRect(0, 0, canvas.width, canvas.height);

  for (var n = 0; n < bonusList.length; n++) {
    drawBonus(n);
    bonusList[n].y += bonusSpeed;
  }

  /*Menu drawing*/
  drawUserName();
  drawLevel();
  drawUserLives();
  drawScore();
  drawBrickTotal();
  drawEffects();
  drawBestResult()
  /*the ball animation*/
  drawBall();
  drawPad();
  drawEffectsList();
  if (user.isDrunk) {
    drawDrankText();
  }

  if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
      dx = -dx;
  }

  if (y + dy < ballRadius) {
    dy = -dy;

  } else if (y + dy > canvas.height - ballRadius) {
    if (padX <= x && x <= (padX + padWidth/2)) {
      dy = -dy;
      if (!ifBricksExist()) {
        generateBricks();
        user.level += 1;
        user.score += 750;
        effectsList.push(imgLevelUp);
      }

    } else if ((padX + padWidth/2) <= x && x <= (padX + padWidth/2) + padWidth/2) {
      dy = -dy;
      dx = -dx;
      if (!ifBricksExist()) {
        generateBricks();
        user.level += 1;
        user.score += 750;
        effectsList.push(imgLevelUp);
      }

    } else {
      user.lives -= 1;
//      dy = -dy;
      if (user.lives > 0) {
        dy = -dy;
        if (!ifBricksExist()) {
        generateBricks();
        user.level += 1;
        user.score += 750;
        effectsList.push(imgLevelUp);
      }
      } else {
        user.lives = 0;
        if (user.score > localStorage.getItem("cache__best-result")) {
          localStorage.setItem("cache__best-result", user.score);
          localStorage.setItem("cache__best-result--name", user.name);
          localStorage.setItem("cache__best-result--color", user.color);
        }

          currentResult.name = user.name;
          currentResult.score = user.score;
          currentResult.level = user.level;
          currentResult.color = user.color;
          currentResult.bricks = user.bricks;

        if (bestResults.length) {
          bestResults.push(currentResult);
          bestResults = sortBestResults(bestResults);
          localStorage.setItem("resultsDATA", makeResultsDATA(bestResults));
        }
        else {
          bestResults.push(currentResult);
          localStorage.setItem("resultsDATA", makeResultsDATA(bestResults));
        }

        drawGameOver();
        isGameOver = true;
        return ;
      }
      }
  }


  x += dx;
  y += dy;

  /*the pad animation*/

  user.isDrunk ? movePadDrunk() : movePad();

  //drunk();

bonusCollisionDetection();



  /*the bricks animation*/


  for (var i = 0; i < brickRowCount; i++) {
    for (var j = 0; j < brickColumnCount; j++) {
      if (bricks[i][j].status > 0) {

        if (bricks[i][j].status == 3) {
          bricks[i][j].color = "rgb(19,255,0,1)";
        } else if (bricks[i][j].status == 2) {
          bricks[i][j].color = "rgb(19,255,0,0.6)";
        } else if (bricks[i][j].status == 1) {
          bricks[i][j].color = "rgb(19,255,0,0.3)";
        }

        drawBricks(i,j);
      }
    }
  }
}

/*DRAW FUNCTION FINISH*/

function keyDownHandler(b) {
    if (b.keyCode == 39 || b.keyCode == 68) {
        rightPressed = true;
    }
    else if (b.keyCode == 37 || b.keyCode == 65) {
        leftPressed = true;
    }

    if (b.keyCode == 27) {
      stopGame();
    }
}

function keyUpHandler(b) {
    if (b.keyCode == 39 || b.keyCode == 68) {
        rightPressed = false;
    }
    else if (b.keyCode == 37 || b.keyCode == 65) {
        leftPressed = false;
    }
}

function generateBricks() {
  for (var i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (var j = 0; j < brickColumnCount; j++) {
      if (j == 0) {
        bricks[i][j] = {
          x: brickMarginSides,
          y: brickMarginTop,
          width: brickWidth,
          type: calcRandom(1,1000),
          status: calcRandom(1,3)
        }
      }
      if (j > 0) {
        bricks[i][j] = {
          x: bricks[i][j-1].x + 10 + brickWidth,
          y: brickMarginTop,
          width: brickWidth,
          type: calcRandom(1,1000),
          status: calcRandom(1,3)
        }
      }
      if (i > 0) {
        bricks[i][j].y = brickMarginTop + 10 + bricks[i-1][j].y;
      }
    }
  }
}

function brickCollisionDetection() {
  for(var c=0; c < brickColumnCount; c++) {
    for(var r=0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status > 0) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status -= 1;
          user.score += 25;

          if (b.status == 0) {
            user.bricks += 1;

            if (b.type > 420 && b.type < 440) {
                dropEffect(b.x,b.y,"live");
            } else if (b.type > 450 && b.type < 651) {
                dropEffect(b.x,b.y,"points");
            } else if (b.type > 700 && b.type < 771) {
                dropEffect(b.x,b.y,"padWidth");
            } else if (b.type > 800 && b.type < 871) {
                dropEffect(b.x,b.y,"padSpeed");
            } else if (b.type > 900 && b.type < 971) {
                dropEffect(b.x,b.y,"ballSpeed");
            } else if (b.type > 10 && b.type < 22) {
                dropEffect(b.x,b.y,"gold",bonusColorGold);
            } else if (b.type > 21 && b.type < 71) {
                dropEffect(b.x,b.y,"pointsDebuff",bonusColorDebuff);
            } else if (b.type > 72 && b.type < 82) {
                dropEffect(b.x,b.y,"drunk");
            } else if (b.type > 83 && b.type < 108) {
                dropEffect(b.x,b.y,"drunk",bonusColorDebuff);
            }
          }
        }
      }
    }
  }
}

function dropEffect(brickXpos,brickYpos,effectName,color) {
  bonusList.push({
    x: brickXpos + brickWidth/2 - bonusWidth/2,
    y: brickYpos + brickHeight/2 - bonusHeight/2,
    effect: effectName,
    color: bonusColor
  });
  if (color) {
    bonusList[bonusList.length - 1].color = color;
  }
}

function bonusCollisionDetection() {
  for (var i = 0; i < bonusList.length; i++) {
    if (bonusList[i].y >= canvas.height) {
      if (bonusList[i].x >= padX && bonusList[i].x <= padX + padWidth || bonusList[i].x+bonusWidth >= padX && bonusList[i].x+bonusWidth <= padX + padWidth) {
        generateEffect(bonusList[i].effect, 1);
        bonusList.shift();
      } else {
        generateEffect(bonusList[i].effect, 0);
        bonusList.shift();
      }
    }
  }
}

function generateEffect(effectName, a){
  if (effectName == "drunk") {
    if (a) {
      makeDrunk();
      effectsList.push(imgBeer);
    } else if (bonusList.color == "red") {
      effectsList.push(imgBeerMissed);
    }
  }

  if (effectName == "points") {
    if (a) {
      user.score += 200;
      effectsList.push(imgPointsUP);
    } else {
      user.score -= 100;
      effectsList.push(imgPointsDown);
    }
  }

  if (effectName == "live") {
    if (a) {
      user.lives += 1;
      effectsList.push(imgLiveUp);
    } else {
      if (user.lives > 1) {
        user.lives -= 1;
        effectsList.push(imgLiveDown);
      } else {
        effectsList.push(imgLiveDownNO);
      }
    }
  }

  if (effectName == "padWidth") {
    if (a) {
      if (padWidth < PAD_WIDTH * 1.33){
        padWidth += 8;
        effectsList.push(imgPadWidthUp);
      } else {
        effectsList.push(imgPadWidthUpNO);
      }
    } else {
      if (padWidth > PAD_WIDTH * 0.7) {
        padWidth -= 10;
        effectsList.push(imgPadWidthDown);
      } else {
        effectsList.push(imgPadWidthDownNO);
      }
    }
  }

  if (effectName == "padSpeed") {
    if (a) {
      if (padSpeed < PAD_SPEED * 1.6) {
        padSpeed += 2;
        effectsList.push(imgPadSpeedUp);
      } else {
        effectsList.push(imgPadSpeedUpNO);
      }
    } else {
      if (padSpeed > PAD_SPEED * 0.50) {
        padSpeed -= 2;
        effectsList.push(imgPadSpeedDown);
      } else {
        effectsList.push(imgPadSpeedDownNO);
      }
    }
  }

  if (effectName == "ballSpeed") {
    if (a) {
      if (Math.abs(dx) > BALL_SPPED_X * 0.71) {
        dx -= dx * 0.1;
        dy -= dy * 0.1;
        effectsList.push(imgBallSpeedDown);
      } else {
        effectsList.push(imgBallSpeedDownNO);
      }
    } else {
      if (Math.abs(dx) < BALL_SPPED_X * 1.65) {
        dx += dx * 0.15;
        dy += dy * 0.15;
        effectsList.push(imgBallSpeedUp);
      } else {
       effectsList.push(imgBallSpeedUpNO);
      }
    }
  }

  if (effectName == "gold") {
    if (a) {
      user.score += 750;
      effectsList.push(imgGold);
    }
  }

  if (effectName == "pointsDebuff") {
    if (a) {
      user.score -= 200;
      effectsList.push(imgPointsDown);
    }
  }

  if (effectName == "padSpeedDebuff") {
    if (a) {
      if (padSpeed > PAD_SPEED * 0.45) {
        padSpeed -= 2;
      }
      effectsList.push(imgPadSpeedDown);
    }
  }
}

function ifBricksExist() {
  var result = 0;
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status) {
        result += 1;
      }
    }
  }

  return result;
}

function calcRandom(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

function movePad() {
  if (rightPressed && padX < canvas.width - padWidth) {
    padX += padSpeed;
  } else if (leftPressed && padX > 0) {
    padX -= padSpeed;
  }
}

function movePadDrunk() {
  if (leftPressed && padX < canvas.width - padWidth) {
    padX += padSpeed;
  } else if (rightPressed && padX > 0) {
    padX -= padSpeed;
  }
}

function makeDrunk() {
  user.isDrunk = true;
  ballColor = "brown";
  padColor = "brown";

  var drunkTime = setInterval(function () {
    ballColor = "#13ff00";
    padColor = "#13ff00";
    user.isDrunk = false;
    clearInterval(drunkTime);
  }, 15000)
}

function sortBestResults(arr) {
  var newArr = arr.sort(compareScore);
  return newArr;

}

function compareScore(a,b) {
  return b.score - a.score;
}

function getResultsDATA(data){
  var arrData = [];
  var result = [];
  arrData = data.split('!');

  for (var j = 0; j < arrData.length; j +=5) {
    result[j/5] = {};
    result[j/5].name = arrData[j];
    result[j/5].score = arrData[j+1];
    result[j/5].level = arrData[j+2];
    result[j/5].color = arrData[j+3];
    result[j/5].bricks = arrData[j+4];
  }
  return result;
}

function makeResultsDATA(data) {
  var arr = [];
  var result = "";

  for (var i = 0; i < data.length; i++) {
    if (i < data.length - 1) {
      arr.push("" + data[i].name + "!" + data[i].score + "!" + data[i].level + "!" + data[i].color + "!" + data[i].bricks + "!")
    } else {
      arr.push("" + data[i].name + "!" + data[i].score + "!" + data[i].level + "!" + data[i].color + "!" + data[i].bricks)
    }
  }

  return result = arr.join('');
}

function stopGame() {
  if (!isGameOver) {
    if (isGameStop) {
      document.querySelector(buttonPasueGame).innerHTML = "Pause Game";
    } else {
      document.querySelector(buttonPasueGame).innerHTML = "Play";
    }
    isGameStop ^= true;
  }
}

function restartGame() {
  window.location.reload();
}

function askConfirm(text) {
  return confirm(text);
}

function resetResults() {
  localStorage.clear();
}
