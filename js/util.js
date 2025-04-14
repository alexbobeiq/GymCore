// Labels
const infoLabel = document.getElementById('info-label');
const rsLabel = document.getElementById('reps-seconds-label');
const setsLabel = document.getElementById('sets-label');
// Landmarks
const NOSE = 0;
const RIGHT_SHOULDER = 11;
const LEFT_SHOULDER = 12;
const RIGHT_ELBOW = 13;
const LEFT_ELBOW = 14;
const RIGHT_WRIST = 15;
const LEFT_WRIST = 16;
const RIGHT_HIP = 23;
const LEFT_HIP = 24;
const RIGHT_KNEE = 25;
const LEFT_KNEE = 26;
const RIGHT_ANKLE = 27;
const LEFT_ANKLE = 28;
// Sides
const NO_SIDE = 0;
const RIGHT_SIDE = 1;
const LEFT_SIDE = 2;
// States
const STATE_NOT_READY = 0;
const STATE_UP = 1;
const STATE_NEGATIVE = 2;
const STATE_DOWN = 3;
const STATE_POSITIVE = 4;
// Exercise data
let reps;
let seconds;
let sets;
let pause;
// Label functions
function updateInfo(text) {
    infoLabel.innerHTML = text;
}
function updateReps(reps) {
    rsLabel.innerText = "Reps: " + reps;
}
function updateSeconds(seconds) {
    rsLabel.innerText = "Seconds: " + seconds;
}
function updateSets(sets) {
    setsLabel.innerText = "Sets: " + sets;
}
function clearReps() {
    rsLabel.innerText = ""
}
function clearSeconds() {
    rsLabel.innerText = "";
}
function clearSets() {
    setsLabel.innerText = "";
}
// Check if 2 values are equal with certain tolerance
function equal(x, y, tolerance) {
    if (Math.abs(x - y) <= tolerance)
        return true;
    return false;
}

