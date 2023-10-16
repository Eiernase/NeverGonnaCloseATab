//Change this value to modify what value the 'Reset' button sets to.
var resetValue = 10;

//Change this value to modify what unit the 'Reset' button sets to. 0 = seconds, 1 = minutes, 2 = hours, 3 = days
var resetUnit = '2';

//Maximum allowed file size in bytes. 5242880 = 5 MB, 2097152
var maxFileSize = 2097152;

//Default sound file
var defaultSoundFile = 'amongus_kill.ogg';

var customAudioBase64;

function soundSelect() {
    var selectedSound = document.getElementById('soundbox').value;
    if (selectedSound === 'custom') {
        document.getElementById('fileselect').style.visibility = 'visible';
    } else {
        //turn off custom sound key?
        document.getElementById('fileselect').style.visibility = 'hidden';
    }
    chrome.storage.local.set({ 'uwusound': document.getElementById('soundbox').value });
}

function customSoundSelect() {
    const fileInput = document.getElementById('fileinput').files;
    const fileInfo = document.getElementById('fileinfo');
    if (fileInput.length === 0) {
        fileInfo.innerHTML = 'None Selected';
    } else if (fileInput[0].type.includes('audio/')) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            if (reader.result.length <= maxFileSize) {        //check for max file size
                customAudioBase64 = reader.result;
                chrome.storage.local.set({ 'owosound': customAudioBase64 });
                var customSoundName = fileInput[0].name.slice(0, 20);
                fileInfo.innerHTML = customSoundName;     //display first 20 characters of selected file name
                chrome.storage.local.set({ 'sowoundname': customSoundName });
            } else {
                fileInfo.innerHTML = 'Too Large';
            }
        });
        reader.readAsDataURL(fileInput[0]);
    } else {
        fileInfo.innerHTML = 'Invalid Type';
    }
}

function volumeSelect() {
    chrome.storage.local.set({ 'rawrvolume': document.getElementById('volumeslider').value });
    if (document.getElementById('volumeslider').value == 0) {
        document.getElementById('soundbox').disabled = true;
        document.getElementById('randomizecheck').disabled = true;
        document.getElementById('chungusdiv').setAttribute('chungussy', '');
        document.getElementById('fileselect').setAttribute('chungussy', '');
        document.getElementById('fileinput').disabled = true;
    } else {
        if (document.getElementById('randomizecheck').checked) {
            document.getElementById('soundbox').disabled = true;
        } else {
            document.getElementById('soundbox').disabled = false;
        }
        document.getElementById('randomizecheck').disabled = false;
        document.getElementById('chungusdiv').removeAttribute('chungussy');
        document.getElementById('fileselect').removeAttribute('chungussy');
        document.getElementById('fileinput').disabled = false;
    }
}

async function unitSelect() {
    var currentUnit = await chrome.storage.local.get(["awoounit"]);
    var newUnit = document.getElementById('unitselect').value;
    if (!(Object.keys(currentUnit) === 0)) {
        var inputvalue = document.getElementById('timeoutinput').value;
        switch (currentUnit['awoounit']) {
            case '0':
                switch (newUnit) {
                    case '1':
                        inputvalue = Math.round(inputvalue / 60);
                        break;
                    case '2':
                        inputvalue = Math.round(inputvalue / 3600);
                        break;
                    case '3':
                        inputvalue = Math.round(inputvalue / 86400);
                        break;
                }
                break;
            case '1':
                switch (newUnit) {
                    case '0':
                        inputvalue = inputvalue * 60;
                        break;
                    case '2':
                        inputvalue = Math.round(inputvalue / 60);
                        break;
                    case '3':
                        inputvalue = Math.round(inputvalue / 1440);
                        break;
                }
                break;
            case '2':
                switch (newUnit) {
                    case '0':
                        inputvalue = inputvalue * 3600;
                        break;
                    case '1':
                        inputvalue = inputvalue * 60;
                        break;
                    case '3':
                        inputvalue = Math.round(inputvalue / 24);
                        break;
                }
                break;
            case '3':
                switch (newUnit) {
                    case '0':
                        inputvalue = inputvalue * 86400;
                        break;
                    case '1':
                        inputvalue = inputvalue * 1440;
                        break;
                    case '2':
                        inputvalue = inputvalue * 24;
                        break;
                }
                break;
        }
        document.getElementById('timeoutinput').value = inputvalue;
    }
    timeoutSelect();
    chrome.storage.local.set({ 'awoounit': document.getElementById('unitselect').value });
    console.log('unit saved ' + newUnit);
    correspondsTo();
}

function timeoutSelect() {
    correspondsTo();
    var inputvalue = document.getElementById('timeoutinput').value;
    var inputUnit = document.getElementById('unitselect').value;
    switch (inputUnit) {
        case '1':
            inputvalue = inputvalue * 60;
            break;
        case '2':
            inputvalue = inputvalue * 3600;
            break;
        case '3':
            inputvalue = inputvalue * 86400;
            break;
    }
    chrome.storage.local.set({ 'nyatimeout': inputvalue });
}

function correspondsTo() {
    var inputvalue = document.getElementById('timeoutinput').value;
    var inputUnit = document.getElementById('unitselect').value;
    var correspondingUnit = 'imposters';
    var correspondingValue = 0;
    switch (inputUnit) {
        case '1':
            inputvalue = inputvalue * 60;
            break;
        case '2':
            inputvalue = inputvalue * 3600;
            break;
        case '3':
            inputvalue = inputvalue * 86400;
            break;
    }
    if (inputvalue > 2629800) {
        //months
        correspondingUnit = 'months';
        correspondingValue = Math.round(inputvalue / 2629800 * 10000) / 10000;
        document.getElementById('displayhours').style.visibility = 'visible';
    } else if (inputvalue > 604800) {
        //weeks
        correspondingUnit = 'weeks';
        correspondingValue = Math.round(inputvalue / 604800 * 1000) / 1000;
        document.getElementById('displayhours').style.visibility = 'visible';
    } else if (inputvalue > 86400) {
        //days
        correspondingUnit = 'days';
        correspondingValue = Math.round(inputvalue / 86400 * 10000) / 10000;
        if (inputUnit >= 3) {
            document.getElementById('displayhours').style.visibility = 'hidden';
        } else {
            document.getElementById('displayhours').style.visibility = 'visible';
        }
    } else if (inputvalue > 3600) {
        correspondingUnit = 'hours';
        correspondingValue = Math.round(inputvalue / 3600 * 10000) / 10000;
        if (inputUnit >= 2) {
            document.getElementById('displayhours').style.visibility = 'hidden';
        } else {
            document.getElementById('displayhours').style.visibility = 'visible';
        }
    } else if (inputvalue > 60) {
        correspondingUnit = 'minutes';
        correspondingValue = Math.round(inputvalue / 60 * 100) / 100;
        if (inputUnit >= 1) {
            document.getElementById('displayhours').style.visibility = 'hidden';
        } else {
            document.getElementById('displayhours').style.visibility = 'visible';
        }
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
    document.getElementById('unitselect').value = resetUnit;
    document.getElementById('timeoutinput').value = resetValue;
    chrome.storage.local.set({ 'awoounit': resetUnit })
    timeoutSelect();
}

function showVersion() {
    fetch('./manifest.json')
        .then((response) => response.json())
        .then((json) => {
            document.getElementById('version').innerHTML = 'v' + json['version'];
        });
}

document.addEventListener('DOMContentLoaded', function () {     //register functions
    var sound = document.getElementById('soundbox');
    var slider = document.getElementById('volumeslider');
    var preview = document.getElementById('previewbutton');
    var timeout = document.getElementById('timeoutinput');
    var resettimeout = document.getElementById('resettimeoutbutton');
    var checkbox = document.getElementById('displaycheckbox');
    var notificationlanguage = document.getElementById('notificationlanguage');
    var randomize = document.getElementById('randomizecheck');
    var unit = document.getElementById('unitselect');
    var fileinput = document.getElementById('fileinput');
    showVersion();
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
    });
    sound.addEventListener('input', function () {
        soundSelect();
    });
    fileinput.addEventListener('change', function () {
        customSoundSelect();
    });
    unit.addEventListener('input', function () {
        unitSelect();
    });
    slider.addEventListener('input', function () {
        volumeSelect();
    });
    preview.addEventListener('click', function () {
        playPreview();
    });
});

async function loadDisplaySaved() {     //display the selected values and options after opening the popup
    var savedSound = await chrome.storage.local.get(["uwusound"]);
    var savedVolume = await chrome.storage.local.get(["rawrvolume"]);
    var savedTimeout = await chrome.storage.local.get(["nyatimeout"]);
    var savedNotification = await chrome.storage.local.get(["ayaya"]);
    var savedLang = await chrome.storage.local.get(["lelelelanguage"]);
    var savedRandom = await chrome.storage.local.get(["grrandomize"]);
    var savedUnit = await chrome.storage.local.get(["awoounit"]);
    var savedFileName = await chrome.storage.local.get(["sowoundname"]);
    customAudioBase64 = await chrome.storage.local.get(["owosound"]);
    customAudioBase64 = customAudioBase64['owosound'];
    if (!(Object.keys(savedSound).length === 0)) {
        document.getElementById('soundbox').value = savedSound['uwusound'];
        console.log('loaded sound');
        if (savedSound['uwusound'] === 'custom') {
            document.getElementById('fileselect').style.visibility = 'visible';
            if (!(Object.keys(savedFileName).length === 0)) {
                document.getElementById('fileinfo').innerHTML = savedFileName['sowoundname'];
            }
        }
    }
    if (!(Object.keys(savedVolume).length === 0)) {
        document.getElementById('volumeslider').value = savedVolume['rawrvolume'];
        if (savedVolume['rawrvolume'] == 0) {
            document.getElementById('soundbox').disabled = true;
            document.getElementById('randomizecheck').disabled = true;
            document.getElementById('chungusdiv').setAttribute('chungussy', '');
            document.getElementById('fileselect').setAttribute('chungussy', '');
            document.getElementById('fileinput').disabled = true;
        }
        console.log('loaded volume');
    }
    if (!(Object.keys(savedUnit).length === 0)) {
        document.getElementById('unitselect').value = savedUnit['awoounit'];
    }
    if (!(Object.keys(savedTimeout).length === 0)) {
        var inputvalue = savedTimeout['nyatimeout'];
        switch (document.getElementById('unitselect').value) {
            case '1':
                inputvalue = inputvalue / 60;
                break;
            case '2':
                inputvalue = inputvalue / 3600;
                break;
            case '3':
                inputvalue = inputvalue / 86400;
                break;
        }
        document.getElementById('timeoutinput').value = inputvalue;
        console.log('loaded timeout');
        correspondsTo();
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
    const audioVolume = document.getElementById('volumeslider').value;
    if (audioVolume == 0) {
        return;
    }
    var soundFileName = './sounds/amongus_kill.ogg';
    if (document.getElementById('randomizecheck').checked) {
        var listOfFiles = document.getElementById('soundbox').getElementsByTagName('option');
        soundFileName = listOfFiles[(Math.floor(Math.random() * listOfFiles.length))].value;
    } else {
        soundFileName = document.getElementById('soundbox').value;
    }
    if (soundFileName === 'custom') {
        if (customAudioBase64) {
            soundFileName = customAudioBase64;
        } else {
            soundFileName = './sounds/' + defaultSoundFile;
        }
    } else {
        soundFileName = './sounds/' + soundFileName;
    }
    const audio = new Audio(soundFileName);
    audio.volume = audioVolume;
    audio.play();
}