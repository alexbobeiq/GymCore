const TOLERANCE_SHOULDER = 0.025;
const TOLERANCE_BODY = 0.3;

let inPause;
let inPlank;
let finished;
let secondsLeft;
let setsLeft;
let pauseLeft;
let clock;

// Set clock to perfom every second
clock = setInterval(function() {
    if (inPause) {
        updateInfo("Pause: " + pauseLeft + "s");
        pauseLeft--;
        if (pauseLeft == 0) {
            inPause = false;
            pauseLeft = pause;
        }
        return;
    }
    if (inPlank) {
        secondsLeft--;
    }
    
    if (secondsLeft == 0) {
        inPause = true;
        secondsLeft = seconds;
        pauseLeft = pause;
        setsLeft--;
        updateSeconds(secondsLeft);
        updateSets(setsLeft);
    }
    if (setsLeft == 0) {
        finished = true;
        clearInterval(clock);
        updateInfo("Done!");
        clearSeconds();
        clearSets();
    }
    
}, 1000);

function setup() {
    updateInfo("Loading...");
    inPause = false;
    inPlank = false;
    finished = false;
    secondsLeft = seconds;
    setsLeft = sets;
    pauseLeft = pause;
}

function entry(sideData) {
    if (inPause == true || finished == true) {
        return;
    }
    if (sideData.side == NO_SIDE){
        updateInfo("The body is not fully visible");
        inPlank = false;
    } else {
        inPlank = isPlank(sideData);
    }

    updateSeconds(secondsLeft);
    updateSets(setsLeft);
}

// Check if user is in plank positions and gives feedback
function isPlank(sideData) {
    if (!equal(sideData.shoulder.x, sideData.elbow.x, TOLERANCE_SHOULDER)) {
        if (sideData.shoulder.x < sideData.elbow.x) {
            if (sideData.side == LEFT_SIDE) {
                updateInfo("Move shoulders forwards");
            } else {
                updateInfo("Move shoulders backwards");
            }
        } else {
            if (sideData.side == LEFT_SIDE) {
                updateInfo("Move shoulders backwards");
            } else {
                updateInfo("Move shoulders forwards");
            }
        }
        return false;
    }
    if ((sideData.hip.x - sideData.shoulder.x) / (sideData.ankle.x - sideData.shoulder.x) - 
        (sideData.hip.y - sideData.shoulder.y) / (sideData.ankle.y - sideData.shoulder.y) > TOLERANCE_BODY) { 
            updateInfo("Move hip lower");
            return false;
        }
    if ((sideData.hip.y - sideData.shoulder.y) / (sideData.ankle.y - sideData.shoulder.y) -
        (sideData.hip.x - sideData.shoulder.x) / (sideData.ankle.x - sideData.shoulder.x) > TOLERANCE_BODY) {
            updateInfo("Move hip higher");
            return false;
        }
    if ((sideData.knee.x - sideData.shoulder.x) / (sideData.ankle.x - sideData.shoulder.x) - 
        (sideData.knee.y - sideData.shoulder.y) / (sideData.ankle.y - sideData.shoulder.y) > TOLERANCE_BODY) {
            updateInfo("Move knee lower");
            return false;
        }
    if ((sideData.knee.y - sideData.shoulder.y) / (sideData.ankle.y - sideData.shoulder.y) -
        (sideData.knee.x - sideData.shoulder.x) / (sideData.ankle.x - sideData.shoulder.x) > TOLERANCE_BODY) {
            updateInfo("Move knee higher");
            return false;
        }
     
    updateInfo("Correct");
    return true;
}