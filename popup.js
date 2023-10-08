//Change this value to modify what the 'Reset' button sets to
var resetValue = 36000;


function soundSelect() {
    chrome.storage.local.set({ 'uwusound': document.getElementById('soundbox').value });
}

function volumeSelect() {
    chrome.storage.local.set({ 'rawrvolume': document.getElementById('volumeslider').value });
    if (document.getElementById('volumeslider').value == 0) {
        document.getElementById('soundbox').disabled = true;
        document.getElementById('randomizecheck').disabled = true;
    } else {
        if (document.getElementById('randomizecheck').checked) {
            document.getElementById('soundbox').disabled = true;
        } else {
            document.getElementById('soundbox').disabled = false;
        }
        document.getElementById('randomizecheck').disabled = false;
    }
}

function timeoutSelect() {
    //if (!document.getElementById('timeoutimput').value == 'null') {
    var timeoutValue = document.getElementById('timeoutinput').value
    chrome.storage.local.set({ 'nyatimeout': timeoutValue });
    correspondsTo(timeoutValue);
}

function correspondsTo(inputvalue) {
    var correspondingUnit = 'imposters';
    var correspondingValue = 0;
    if (inputvalue > 3600) {
        correspondingUnit = 'hours';
        correspondingValue = Math.round(inputvalue / 3600 * 10000) / 10000;
        document.getElementById('displayhours').style.visibility = 'visible';
    } else if (inputvalue > 60) {
        correspondingUnit = 'minutes';
        correspondingValue = Math.round(inputvalue / 60 * 100) / 100;
        document.getElementById('displayhours').style.visibility = 'visible';
    } else {
        document.getElementById('displayhours').style.visibility = 'hidden';
    }
    document.getElementById('displayhours').innerHTML = 'Corresponds to ' + correspondingValue + ' ' + correspondingUnit;
}

function notificationSelect() {
    chrome.storage.local.set({ 'ayaya': document.getElementById('displaycheckbox').checked });
    if (document.getElementById('displaycheckbox').checked) {
        document.getElementById('notificationlanguage').disabled = false;
    } else {
        document.getElementById('notificationlanguage').disabled = true;
    }
}

function randomizeSelect() {
    chrome.storage.local.set({ 'grrandomize': document.getElementById('randomizecheck').checked });
    if (document.getElementById('randomizecheck').checked) {
        document.getElementById('soundbox').disabled = true;
    } else {
        document.getElementById('soundbox').disabled = false;
    }
}

function languageSelect() {
    chrome.storage.local.set({ 'lelelelanguage': document.getElementById('notificationlanguage').value })
}

function resetTimeout() {
    //reset
    chrome.storage.local.set({ 'nyatimeout': resetValue });
    document.getElementById('timeoutinput').value = resetValue;
    document.getElementById('hourscalc').innerHTML = Math.round(resetValue / 3600 * 10000) / 10000;
}

document.addEventListener('DOMContentLoaded', function () {
    var sound = document.getElementById('soundbox');
    var slider = document.getElementById('volumeslider');
    var preview = document.getElementById('previewbutton');
    var timeout = document.getElementById('timeoutinput');
    var resettimeout = document.getElementById('resettimeoutbutton');
    var checkbox = document.getElementById('displaycheckbox');
    var notificationlanguage = document.getElementById('notificationlanguage');
    var randomize = document.getElementById('randomizecheck');
    loadDisplaySaved();
    checkbox.addEventListener('click', function () {
        notificationSelect();
    });
    randomize.addEventListener('click', function () {
        randomizeSelect();
    });
    notificationlanguage.addEventListener('input', function () {
        languageSelect();
    });
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
    var savedNotification = await chrome.storage.local.get(["ayaya"]);
    var savedLang = await chrome.storage.local.get(["lelelelanguage"]);
    var savedRandom = await chrome.storage.local.get(["grrandomize"]);
    if (!(Object.keys(savedSound).length === 0)) {
        document.getElementById('soundbox').value = savedSound['uwusound'];
        console.log('loaded sound');
    }
    if (!(Object.keys(savedVolume).length === 0)) {
        document.getElementById('volumeslider').value = savedVolume['rawrvolume'];
        if (savedVolume['rawrvolume'] == 0) {
            document.getElementById('soundbox').disabled = true;
            document.getElementById('randomizecheck').disabled = true;
        }
        console.log('loaded volume');
    }
    if (!(Object.keys(savedTimeout).length === 0)) {
        document.getElementById('timeoutinput').value = savedTimeout['nyatimeout'];
        console.log('loaded timeout');
        correspondsTo(savedTimeout['nyatimeout']);
    } else {
        correspondsTo(document.getElementById('timeoutinput').value);
    }
    if (!(Object.keys(savedNotification).length === 0)) {
        document.getElementById('displaycheckbox').checked = savedNotification['ayaya'];
        if (!savedNotification['ayaya']) {
            document.getElementById('notificationlanguage').disabled = true;
        } else {
            document.getElementById('notificationlanguage').disabled = false;
        }
    }
    if (!(Object.keys(savedLang).length === 0)) {
        document.getElementById('notificationlanguage').value = savedLang['lelelelanguage'];
    }
    if (!(Object.keys(savedRandom).length === 0)) {
        document.getElementById('randomizecheck').checked = savedRandom['grrandomize'];
        if (savedRandom['grrandomize']) {
            document.getElementById('soundbox').disabled = true;
        }
    }
}

function playPreview() {
    var soundFileName = "de_m-1.ogg";
    if (document.getElementById('randomizecheck').checked) {
        var listOfFiles = document.getElementById('soundbox').getElementsByTagName('option');
        soundFileName = listOfFiles[(Math.floor(Math.random() * listOfFiles.length))].value;
    } else {
        soundFileName = document.getElementById('soundbox').value;
    }
    const audio = new Audio('./sounds/' + soundFileName);
    audio.volume = document.getElementById('volumeslider').value;
    audio.play();
    if (document.getElementById('displaycheckbox').checked) {
        chrome.notifications.clear("ayaya");
        switch (document.getElementById('notificationlanguage').value) {
            case "de":
                chrome.notifications.create("ayaya", {
                    type: "basic",
                    iconUrl: "images/kill-512.png",
                    title: "Yay",
                    message: "Du hast einen alten Tab geschlossen!",
                    silent: true
                });
                break;
            case "en":
                chrome.notifications.create("ayaya", {
                    type: "basic",
                    iconUrl: "images/kill-512.png",
                    title: "Yay",
                    message: "You closed an old tab!",
                    silent: true
                });
                break;
            default:
                chrome.notifications.create("ayaya", {
                    type: "basic",
                    iconUrl: "images/kill-512.png",
                    title: "SUS",
                    message: "AMOGUS????? U BREAK MA SHIT MEEEN!!!!11"
                });
        }
    }
}