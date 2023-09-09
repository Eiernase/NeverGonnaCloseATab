//Change this value to modify what the 'Reset' button sets to
var resetValue = 36000;


function soundSelect() {
    chrome.storage.local.set({ 'uwusound': document.getElementById('soundbox').value });
}

function volumeSelect() {
    chrome.storage.local.set({ 'rawrvolume': document.getElementById('volumeslider').value });
}

function timeoutSelect() {
    //if (!document.getElementById('timeoutimput').value == 'null') {
    var timeoutValue = document.getElementById('timeoutinput').value
    chrome.storage.local.set({ 'nyatimeout': timeoutValue });
    document.getElementById('hourscalc').innerHTML = Math.round(timeoutValue / 3600 * 10000) / 10000;
}

function resetTimeout() {
    //reset
    chrome.storage.local.set({ 'nyatimeout': resetValue });
    document.getElementById('timeoutinput').value = resetValue;
}

document.addEventListener('DOMContentLoaded', function () {
    var sound = document.getElementById('soundbox');
    var slider = document.getElementById('volumeslider');
    var preview = document.getElementById('previewbutton');
    var timeout = document.getElementById('timeoutinput');
    var resettimeout = document.getElementById('resettimeoutbutton');
    loadDisplaySaved();
    timeout.addEventListener('input', function () {
        if (!(this.value == null) || !(this.value == "")) {
            timeoutSelect();
        }
    });
    resettimeout.addEventListener('click', function () {
        resetTimeout();
    })
    sound.addEventListener('input', function () {
        soundSelect();
    });
    slider.addEventListener('input', function () {
        volumeSelect();
    })
    preview.addEventListener('click', function () {
        playPreview();
    })
});

async function loadDisplaySaved() {
    var savedSound = await chrome.storage.local.get(["uwusound"]);
    var savedVolume = await chrome.storage.local.get(["rawrvolume"]);
    var savedTimeout = await chrome.storage.local.get(["nyatimeout"]);
    if (!(Object.keys(savedSound).length === 0)) {
        document.getElementById('soundbox').value = savedSound['uwusound'];
        console.log('loaded sound');
    }
    if (!(Object.keys(savedVolume).length === 0)) {
        document.getElementById('volumeslider').value = savedVolume['rawrvolume'];
        console.log('loaded volume');
    }
    if (!(Object.keys(savedTimeout).length === 0)) {
        document.getElementById('timeoutinput').value = savedTimeout['nyatimeout'];
        console.log('loaded timeout');
        document.getElementById('hourscalc').innerHTML = Math.round(savedTimeout['nyatimeout'] / 3600 * 10000) / 10000;
    }
}

function playPreview() {
    const audio = new Audio('/sounds/' + document.getElementById('soundbox').value);
    audio.volume = document.getElementById('volumeslider').value;
    audio.play();
}