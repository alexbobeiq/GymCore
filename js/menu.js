const contentDiv = document.getElementById("content");
/* Home */
const wallpaper = document.getElementById("home-wallpaper-img");

/* Exercises */
const exercisesOverflowDiv = document.getElementById("exercises-overflow-div");

/* Configure Exercise */
let seconds = 10;
let reps = 1;
let sets = 1;
let pause = 30;
let exerciseHtmlPath;
const configureTitle = document.getElementById("conf-title");
const configureDiv = document.getElementById("conf-div");
const secondsDiv = document.getElementById("seconds-div");
const repsDiv = document.getElementById("reps-div");
const secondsLabel = document.getElementById("seconds-label");
const secondsRange = document.getElementById("seconds-range");
const repsLabel = document.getElementById("reps-label");
const repsRange = document.getElementById("reps-range");
const setsLabel = document.getElementById("sets-label");
const setsRange = document.getElementById("sets-range");
const pauseLabel = document.getElementById("pause-label");
const pauseRange = document.getElementById("pause-range");
const startButton = document.getElementById("start-button");
startButton.addEventListener("click", function(){
    localStorage.setItem("gc_seconds", seconds);
    localStorage.setItem("gc_reps", reps);
    localStorage.setItem("gc_sets", sets);
    localStorage.setItem("gc_pause", pause);
    window.location.href = exerciseHtmlPath;
});
secondsRange.addEventListener("input", function() {
    seconds = secondsRange.value;
    renderSeconds();
});
repsRange.addEventListener("input", function() {
    reps = repsRange.value;
    renderReps();
});
setsRange.addEventListener("input", function() {
    sets = setsRange.value;
    renderSets();
});
pauseRange.addEventListener("input", function() {
    pause = pauseRange.value;
    renderPause();
});
// Seconds Range
secondsRange.min = 10;
secondsRange.max = 300;
secondsRange.step = 10;
// Reps Range
repsRange.min = 1;
repsRange.max = 30;
// Sets Range
setsRange.min = 1;
setsRange.max = 10;
// Pause Range
pauseRange.min = 30;
pauseRange.max = 600;
pauseRange.step = 30;


/* Settings */
const settingsDiv = document.getElementById("settings-div");
const selectCamRes = document.getElementById("select-cam-res");
const selectDetAcc = document.getElementById("select-det-acc");
const selectMirror = document.getElementById("select-mirror");
selectCamRes.onchange = function() {
    localStorage.setItem("gc_camRes", selectCamRes.value);
}
selectDetAcc.onchange = function() {
    localStorage.setItem("gc_detAcc", selectDetAcc.value);
}
selectMirror.onchange = function() {
    localStorage.setItem("gc_mirror", selectMirror.value);
}

/* Render */
// Menu Render
function renderHome() {
    // Hide Exercises
    exercisesOverflowDiv.style.display = "none";
    // Hide Configure
    configureDiv.style.display = "none";
    // Hide Settings
    settingsDiv.style.display = "none";
    // Show Home
    wallpaper.style.display = "block";
}

function renderExercises() {
    // Hide Home
    wallpaper.style.display = "none";
    // Hide Configure
    configureDiv.style.display = "none";
    // Hide Settings
    settingsDiv.style.display = "none";
    // Show Exercises
    exercisesOverflowDiv.style.display = "block";
}

function renderSettings() {
    // Hide Home
    wallpaper.style.display = "none";
    // Hide Exercises
    exercisesOverflowDiv.style.display = "none";
    // Hide Configure
    configureDiv.style.display = "none";
    // Show Settings
    settingsDiv.style.display = "flex";
    
    let camRes = localStorage.getItem("gc_camRes");
    let detAcc = localStorage.getItem("gc_detAcc");
    let mirror = localStorage.getItem("gc_mirror");

    if (camRes == null) {
        selectCamRes.value = "640x360";
    } else {
        selectCamRes.value = camRes;
    }
    if (detAcc == null) {
        selectDetAcc.value = "High";
    } else {
        selectDetAcc.value = detAcc;
    }
    if (mirror == null) {
        selectMirror.value = "False";
    } else {
        selectMirror.value = mirror;
    }
}

// Configure Render
function renderConfigure() {
    // Hide Home
    wallpaper.style.display = "none";
    // Hide Exercises
    exercisesOverflowDiv.style.display = "none";
    // Hide Settings
    settingsDiv.style.display = "none";
    // Show Configure
    configureDiv.style.display = "flex";
}

function renderConfigureStatic(title, htmlPath) {
    renderConfigure();
    // Hide Reps
    repsDiv.style.display = "none";
    // Show Seconds
    secondsDiv.style.display = "flex";
    // Setup
    configureTitle.innerText = title;
    secondsRange.value = seconds;
    renderSeconds();
    setsRange.value = sets;
    renderSets();
    pauseRange.value = pause;
    renderPause();
    exerciseHtmlPath = htmlPath;
}

function renderConfigureDynamic(title, htmlPath) {
    renderConfigure();
    // Hide Seconds
    secondsDiv.style.display = "none";
    // Show Reps
    repsDiv.style.display = "flex";
    // Setup
    configureTitle.innerText = title;
    repsRange.value = reps;
    renderReps();
    setsRange.value = sets;
    renderSets();
    pauseRange.value = pause;
    renderPause();
    exerciseHtmlPath = htmlPath;
}

// Label Render
function renderSeconds() {
    secondsLabel.innerText = "Seconds: " + seconds;
}

function renderReps() {
    repsLabel.innerText = "Reps: " + reps;
}

function renderSets() {
    setsLabel.innerText = "Sets: " + sets;
}

function renderPause() {
    pauseLabel.innerText = "Pause: " + pause + "s";
}

renderHome();