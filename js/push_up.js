const video = document.createElement('video');
const out = document.getElementById('output');
const canvasCtx = out.getContext('2d');
/* Model */
const infoLabel = document.getElementById('info-label');
const repsLabel = document.getElementById('reps-seconds-label');
const setsLabel = document.getElementById('sets-label');
let reps = 10;
let sets = 10;
let pause;
let camRes;
let detAcc;
let mirror;
let state = STATE_NOT_READY;
const LEFT_INDEXES = [
    LEFT_SHOULDER,
    LEFT_ELBOW,
    LEFT_WRIST,
    LEFT_HIP,
    LEFT_KNEE,
    LEFT_ANKLE
];
const RIGHT_INDEXES = [
    RIGHT_SHOULDER,
    RIGHT_ELBOW,
    RIGHT_WRIST,
    RIGHT_HIP,
    RIGHT_KNEE,
    RIGHT_ANKLE
];
// Tolerances
const TOLERANCE_SHOULDER = 0.025;
const TOLERANCE_BODY = 0.3;

/* Controler */
function pushUp(landmarks) {
    sideData = getSideLandmarks(landmarks);
    if (sideData.side == NO_SIDE){
        updateInfo("no side");
        return;
    }
    if (sideData.side == LEFT_SIDE)
        updateInfo("left<br>" + isStateUp(sideData));
    else
        updateInfo("right<br>" + isStateUp(sideData));
}

function getSideLandmarks(landmarks) {
    let sideLandmarks = {
        side: undefined,
        shoulder: undefined,
        elbow: undefined,
        wrist: undefined,
        hip: undefined,
        knee: undefined,
        ankle: undefined
    } 
    if (visibleLandmarks(landmarks, LEFT_INDEXES)) {
        sideLandmarks.side = LEFT_SIDE;
        sideLandmarks.shoulder = landmarks[LEFT_SHOULDER];
        sideLandmarks.elbow = landmarks[LEFT_ELBOW];
        sideLandmarks.wrist = landmarks[LEFT_WRIST];
        sideLandmarks.hip = landmarks[LEFT_HIP];
        sideLandmarks.knee = landmarks[LEFT_KNEE];
        sideLandmarks.ankle = landmarks[LEFT_ANKLE];
    } else if (visibleLandmarks(landmarks, RIGHT_INDEXES)) {
        sideLandmarks.side = RIGHT_SIDE;
        sideLandmarks.shoulder = landmarks[RIGHT_SHOULDER];
        sideLandmarks.elbow = landmarks[RIGHT_ELBOW];
        sideLandmarks.wrist = landmarks[RIGHT_WRIST];
        sideLandmarks.hip = landmarks[RIGHT_HIP];
        sideLandmarks.knee = landmarks[RIGHT_KNEE];
        sideLandmarks.ankle = landmarks[RIGHT_ANKLE];
        return sideLandmarks;
    } else {
        sideLandmarks.side = NO_SIDE;
    }
    
    return sideLandmarks;
}

function isStateUp(sideData) {
    if (state == STATE_NOT_READY) {
        if (!equal(sideData.shoulder.x, sideData.elbow.x, TOLERANCE_SHOULDER))
            return false;
        if (!equal(sideData.shoulder.x, sideData.elbow.x, TOLERANCE_SHOULDER))
            return false;
        if ((sideData.hip.x - sideData.shoulder.x) / (sideData.ankle.x - sideData.shoulder.x) - 
            (sideData.hip.y - sideData.shoulder.y) / (sideData.ankle.y - sideData.shoulder.y) > TOLERANCE_BODY) {
                return false;
            }
        if ((sideData.hip.y - sideData.shoulder.y) / (sideData.ankle.y - sideData.shoulder.y) -
            (sideData.hip.x - sideData.shoulder.x) / (sideData.ankle.x - sideData.shoulder.x) > TOLERANCE_BODY) {
                return false;
            }
        if ((sideData.knee.x - sideData.shoulder.x) / (sideData.ankle.x - sideData.shoulder.x) - 
            (sideData.knee.y - sideData.shoulder.y) / (sideData.ankle.y - sideData.shoulder.y) > TOLERANCE_BODY) {
                return false;
            }
        if ((sideData.knee.y - sideData.shoulder.y) / (sideData.ankle.y - sideData.shoulder.y) -
            (sideData.knee.x - sideData.shoulder.x) / (sideData.ankle.x - sideData.shoulder.x) > TOLERANCE_BODY) {
                return false;
            }
    }
    return true;
}


/* View */
function updateInfo(text) {
    infoLabel.innerHTML = text;
}
function updateReps() {
    repsLabel.innerText = "Reps: " + reps;
}
function updateSets() {
    setsLabel.innerText = "Sets: " + sets;
}

/* POSE MODEL*/
// Pose init
const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
});
// Set pose callback method
pose.onResults(onResultsPose);
// Set pose options
pose.setOptions({
    modelComplexity: 2,
    selfieMode: true,
    smoothLandmarks: true,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
});

/* CAMERA */
// Camera init
const camera = new Camera(video, {
    onFrame: async () => {
        await pose.send({ image: video });
    },
    width: 1280,
    height: 720,
});

// Perfom every frame
function onResultsPose(results) {
    canvasCtx.clearRect(0, 0, out.width, out.height);
    canvasCtx.drawImage(results.image, 0, 0, out.width, out.height);
    
    if (results.poseLandmarks == null)
        return;    
    pushUp(results.poseLandmarks);
   
    drawConnectors(
        canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
            color: '#FFFFFF',
            lineWidth: 2
        }
    );
    drawLandmarks(
        canvasCtx, 
        results.poseLandmarks, 
        {
            color: '#1d94f5',
            fillColor: '#FFFFFF',
            radius: (landmark) => {
                return 4;
            }
        }
    );
}

// Setup
updateInfo("not ready");
updateReps();
updateSets();
out.width = window.innerWidth;
out.height = window.innerHeight;
window.addEventListener('resize', function() {
    // Resize canvas
    out.width = window.innerWidth;
    out.height = window.innerHeight;
});


// Test 
function getData() {
    reps = localStorage.getItem("gc_reps");
    sets = localStorage.getItem("gc_sets");
    pause = localStorage.getItem("gc_pause");
    camRes = localStorage.getItem("gc_camRes");
    detAcc = localStorage.getItem("gc_detAcc");
    mirror = localStorage.getItem("gc_mirror");
    console.log("reps: " + reps);
    console.log("sets: " + sets);
    console.log("pause: " + pause);
    console.log("camRes: " + camRes);
    console.log("detAcc: " + detAcc);
    console.log("mirror: " + mirror);
}

getData();

// Camera start => Start Point
camera.start();