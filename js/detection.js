const video = document.createElement('video');
const out = document.getElementById('output');
const canvasCtx = out.getContext('2d');

let camRes;
let detAcc;
let mirror;
const MIN_VISIBILITY = 0.6;
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

function visibleLandmarks(landmarks, indexes) {
    for (let i = 0; i < indexes.length; i++)
        if (landmarks[indexes[i]].visibility < MIN_VISIBILITY)
            return false;
    return true;
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
function onResultsPose(results) {
    canvasCtx.clearRect(0, 0, out.width, out.height);
    canvasCtx.drawImage(results.image, 0, 0, out.width, out.height);
    
    if (results.poseLandmarks == null)
        return;    
    entry(getSideLandmarks(results.poseLandmarks));

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

// Window setup
out.width = window.innerWidth;
out.height = window.innerHeight;
window.addEventListener('resize', function() {
    // Resize canvas
    out.width = window.innerWidth;
    out.height = window.innerHeight;
});

// Data setup
function loadData() {
    reps = localStorage.getItem("gc_reps");
    seconds = localStorage.getItem("gc_seconds");
    sets = localStorage.getItem("gc_sets");
    pause = localStorage.getItem("gc_pause");
    camRes = localStorage.getItem("gc_camRes");
    detAcc = localStorage.getItem("gc_detAcc");
    mirror = localStorage.getItem("gc_mirror");

    if (reps == null) {
        reps = 1;
    }
    else {
        reps = parseInt(reps);
    }

    if (seconds == null) {
        seconds = 10;
    }
    else {
        seconds = parseInt(seconds);
    }

    if (sets == null) {
        sets = 1;
    }
    else {
        sets = parseInt(sets);
    }

    if (pause == null) {
        pause = 1;
    }
    else {
        pause = parseInt(pause);
    }

    if (camRes == null) {
        camRes = {
            width: 1280,
            height: 720
        }
    }
    else {
        wh = camRes.split("x");
        camRes = {
            width: parseInt(wh[0]),
            height: parseInt(wh[1])
        }
    }

    if (detAcc == null) {
        detAcc = 2;
    }
    else {
        if (detAcc == "Medium") {
            detAcc = 1;
        }
        else {
            detAcc = 2;
        }
    }

    if (mirror == null) {
        mirror = true;
    }
    else {
        if (mirror == "True") {
            mirror = false;
        }
        else {
            mirror = true;
        }
    }
}
loadData();

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
    modelComplexity: detAcc,
    selfieMode: mirror,
    smoothLandmarks: true,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
});
/* CAMERA */
// Camera init
const camera = new Camera(video, {
    onFrame: async () => {
        await pose.send({ image: video });
    },
    width: camRes.width,
    height: camRes.height
});

// Setup
setup();
// Camera start
camera.start();