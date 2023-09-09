function soundSelect() {
    chrome.storage.local.set({ 'uwusound': document.getElementById('soundbox').value });
}

function volumeSelect() {
    chrome.storage.local.set({ 'rawrvolume': document.getElementById('volumeslider').value });
    console.log(document.getElementById('volumeslider').value);
}

document.addEventListener('DOMContentLoaded', function() {
    var sound = document.getElementById('soundbox');
    var slider = document.getElementById('volumeslider');
    // onClick's logic below:
    loadDisplaySaved();
    sound.addEventListener('input', function() {
        soundSelect();
    });
    slider.addEventListener('input', function() {
        volumeSelect();
    })
});

async function loadDisplaySaved() {
    console.log('die funktion geht');
    var savedSound = await chrome.storage.local.get(["uwusound"]);
    var savedVolume = await chrome.storage.local.get(["rawrvolume"]);
    console.log(savedSound['uwusound']);
    if (!(Object.keys(savedSound).length === 0)) {
        document.getElementById('soundbox').value = savedSound['uwusound'];
        console.log('loaded sound');
    }
    if (!(Object.keys(savedVolume).length === 0)) {
        document.getElementById('volumeslider').value = savedVolume['rawrvolume'];
        console.log('loaded volume');
    }
}