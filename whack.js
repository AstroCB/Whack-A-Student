var imgs = [{
        src: "Images/Students/0.png",
        name: "Cool"
    }, {
        src: "Images/Students/1.png",
        name: "Excited"
    }, {
        src: "Images/Students/2.png",
        name: "Serious"
    }, {
        src: "Images/Students/3.png",
        name: "Happy"
    }, {
        src: "Images/Students/4.png",
        name: "Furry"
    }, {
        src: "Images/Students/5.png",
        name: "Surprised"
    }, {
        src: "Images/Students/6.png",
        name: "Determined"
    }],
    html = document.getElementsByTagName("html")[0],
    currentSrc = "",
    globalTimer,
    intervalTime = 3000,
    score = 0,
    first = true,
    holeInd = null,
    waitingForRestart = false;

function setUp() {
    loadImgs();
    randImg();
    first = true;
}

function loadImgs() {
    for (var i = 0; i < imgs.length; i++) {
        var imgL = new Image(imgs[i].src);
    }
    var cursor = new Image("hammer.png"),
        clickCursor = new Image("hammerDown.png");
}

function randImg() {
    var randStu = imgs[Math.floor(Math.random() * 7)];
    holeInd = Math.floor(Math.random() * 9);
    document.getElementsByClassName("filler")[holeInd].setAttribute("src", randStu.src);
    document.getElementById("head").textContent = "Whack the " + randStu.name + " Student!";
    document.getElementById("ex").setAttribute("src", randStu.src);

    currentSrc = randStu.src;
    var others = addMore();
    addOthers(others);

    others.push(randStu);
    hideOthers(others);
}

function addMore() {
    // Seems a bit repetitive, but likely necessary to maintain array structure & passing b/t function calls
    var except = [];
    var rand1 = getRand(except);
    except.push(rand1);
    var rand2 = getRand(except);
    except.push(rand2);
    var rand3 = getRand(except);
    except.push(rand3);
    var rand4 = getRand(except);
    except.push(rand4);
    var rand5 = getRand(except);
    except.push(rand5);
    var rand6 = getRand(except);
    except.push(rand6);
    var rand7 = getRand(except);
    except.push(rand7);
    var rand8 = getRand(except);
    except.push(rand8);

    return except;
}

function getRand(except) {
    var rand = imgs[Math.floor(Math.random() * 7)];
    while (except.indexOf(rand.src) !== -1) {
        rand = imgs[Math.floor(Math.random() * 6)];
    }
    return rand;
}

function addOthers(others) {
    var filledHoles = [holeInd];
    for (var i = 0; i < others.length; i++) {
        var hole = Math.floor(Math.random() * 9);
        while (filledHoles.indexOf(hole) !== -1) {
            hole = Math.floor(Math.random() * 9);
        }
        document.getElementsByClassName("filler")[hole].setAttribute("src", others[i].src);
        filledHoles.push(hole);
    }
}

function mDown(e) {
    e.preventDefault();

    if (first) {
        setGameTimer();
        first = false;
    }

    html.style.cursor = "url('Images/hammerDown.png'), pointer";

    var x = e.clientX + 25,
        y = e.clientY + 25;

    var target = document.elementFromPoint(x, y);

    // Check for ID to make sure that it isn't the example image
    if (target.getAttribute("src") === currentSrc && !target.getAttribute("id")) {
        // Whack successful
        changePoints(true);
    } else {
        // Missed
        if (!waitingForRestart) {
            // Don't count the mousedown from the ending screen
            changePoints(false);
        }
    }

    if (waitingForRestart) {
        fadeOut(document.getElementById("alert"));
        document.getElementById("overlay").setAttribute("hidden", "hidden");
        waitingForRestart = false;
    }

    resetBoard();
    setTimer();
}

function mUp(e) {
    e.preventDefault();
    html.style.cursor = "url('Images/hammer.png'), pointer";
}

function hideOthers(usedImgs) {
    var fillers = document.getElementsByClassName("filler");
    for (var i = 0; i < fillers.length; i++) {
        if (usedImgs.indexOf(fillers[i].getAttribute("src")) !== -1) {
            fillers[i].style.visibility = "hidden";
        }
    }
}

function changePoints(up) {
    var scoreDiv = document.getElementById("scoreVal");
    if (up) {
        score += 10;
    } else {
        score -= 10;
    }
    scoreDiv.textContent = score;
}

function resetImgs() {
    var imgs = document.getElementsByClassName("filler");
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].style.visibility = "visible";
        imgs[i].removeAttribute("src");
    }
}

function resetBoard() {
    resetImgs();
    randImg();
}

function setTimer() {
    clearInterval(globalTimer);
    globalTimer = setInterval(timedOut, intervalTime);
}

function timedOut() {
    resetBoard();
    changePoints(false);
    setTimer();
}

function setGameTimer() {
    var curTime = 0;
    var gInt = setInterval(function() {
        var cVal = 29 - curTime;
        document.getElementById("timeVal").textContent = cVal;
        if (cVal === 0) {
            clearInterval(gInt);
            var highScore = getHighScore();
            var isHigher = false;

            // Slightly redundant, but safe
            if (highScore && score > highScore) {
                isHigher = true;
                setHighScore();
            } else if (!highScore) {
                isHigher = true;
                setHighScore();
            }
            var alertStr = "Game over!<br/><br/><br/>Your score was " + score;
            if (isHigher) {
                alertStr += ", which is your new high score.";
            } else {
                if (localStorage.getItem("highScore")) {
                    alertStr += " and your high score is " + localStorage.getItem("highScore") + ".";
                } else {
                    alertStr += ".";
                }
            }
            document.getElementById("alertText").innerHTML = alertStr;
            document.getElementById("overlay").removeAttribute("hidden");
            fadeIn(document.getElementById("alert"));
            waitingForRestart = true;

            gameTimedOut();
        }
        curTime++;
    }, 1000)
}

function gameTimedOut() {
    resetBoard();
    clearInterval(globalTimer);
    resetVals();
}

function resetVals() {
    score = 0;
    document.getElementById("scoreVal").textContent = 0;
    document.getElementById("timeVal").textContent = 30;
    intervalTime = 3000;
    first = true;
    holeInd = null;
}

function getHighScore() {
    if (localStorage.getItem("highScore")) {
        return localStorage.getItem("highScore");
    }
    return null;
}

function setHighScore() {
    localStorage.setItem("highScore", score);
}

function fadeIn(elem) {    
    var opac = 0.1;
    elem.style.visibility = "visible";
    var fadeTimer = setInterval(function() {
        if (opac >= 1) {
            clearInterval(fadeTimer);
        }
        elem.style.opacity = opac;
        elem.style.filter = 'alpha(opacity=' + opac * 100 + ")";
        opac += opac * 0.1;
    }, 10);
}

function fadeOut(elem) {
    var opac = 1;
    var fadeTimer = setInterval(function() {
        if (opac < 0.1) {
            elem.style.visibility = "hidden";
            clearInterval(fadeTimer);
        }
        elem.style.opacity = opac;
        elem.style.filter = 'alpha(opacity=' + opac * 100 + ")";
        opac -= opac * 0.1;
    }, 10);
}

window.addEventListener("load", setUp, false);
document.addEventListener("mousedown", mDown, false);
document.addEventListener("mouseup", mUp, false);
