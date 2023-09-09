//TODO: Implement multi-window usage, closing a second window currently resets saved array
//closing second window sets chromeStarting to true, which causes opening a new tab in old window to delete all existing tabs, maybe work with checking currently open tabs

//Edit this global variable to change the time it takes until a tab closed plays a sound.
//Enter in seconds
//Default is 36000, which equals 10 hours
var tabTimeOut = 36000;



chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
        console.log("yay");
    }
    if (reason === 'update') {
        console.log("New and improved!")
    }
});

class AcidTab {
    constructor(id, birthdate, url) {
        this.id = id;
        this.birthdate = birthdate;
        this.url = url;
        this.confirmed = false;
    }
}

class SoundProperties {
    constructor(source, volume) {
        this.source = source;
        this.volume = volume;
    }
}

var currentCache = [];
var saveInProgress = false;
var chromeStarting = true;

async function saveCacheToStorage() {
    if (!saveInProgress) {       //checks if there is currently an instance of this function processing data
        saveInProgress = true;   //if not, enable check and begin processing
        var tabs = await chrome.storage.local.get(["owotabs"]);
        var openingStatus = false;
        if (Object.keys(tabs).length === 0) {     //check if owotabs key in storage is empty  
            tabs = [];      //if yes, create new array to save in
            console.log('array erstellt');
        } else {
            tabs = tabs['owotabs'];     //eine ebene raus nehmen
            if (chromeStarting) {
                isTabSavedYet(tabs);
            }
        }
        while (currentCache.length > 0) {
            var splicedTab = currentCache.splice(0, 1)[0];
            tabs[tabs.length] = splicedTab;       //eine ebene aus cache splice raus nehmen
            console.log('spliced 1 from cache to array');

        }
        chrome.storage.local.set({ "owotabs": tabs }).then(() => {      //store cache variable in storage
            console.log('stored array with new tabs in storage');
        });
        saveInProgress = false;  //resets processing state boolean
    }
}

function isTabSavedYet(tabs) {
    let i;
    let j;
    let k;
    for (j = currentCache.length - 1; j >= 0; j--) {
        console.log('starting check for current tab ' + j);
        for (i = 0; i < tabs.length; i++) {
            console.log('checking if currentCache tab ' + j + ' matches saved tab ' + i);
            if (!tabs[i].confirmed) {
                if (tabs[i].id === currentCache[0].id) {
                    //sachen machen wenn die id stimmt
                    tabs[i].url = currentCache.splice(j, 1)[0].url;
                    console.log('tab with id is saved, url updated');
                    tabs[i].confirmed = true;
                }
                if (tabs[i].url === currentCache[j].url) {
                    //sachen machen wenn die url stimmt
                    tabs[i].id = currentCache.splice(j, 1)[0].id;
                    console.log('tab with url is saved, id updated');
                    tabs[i].confirmed = true;
                }
            }
        }
    }
    for (k = tabs.length - 1; k >= 0; k--) {
        if (tabs[k].confirmed = false) {
            tabs.splice(k, 1);
            console.log('removed saved tab ' + k);      //
        }
    }
    for (i = 0; i < tabs.length; i++) {
        tabs[i].confirmed = false;
    }
    chromeStarting = false;
}

function newTab(tab) {
    console.log(tab.id);
    //print id of new tab
    var lsd25 = new AcidTab(tab.id, Date.now(), tab.pendingUrl == null ? tab.url : tab.pendingUrl);
    currentCache[currentCache.length] = lsd25;
    saveCacheToStorage();
    //save tab id with creation time
}

async function tabClosed(tabId, removeInfo) {
    if (!removeInfo.isWindowClosing) {      //check that tab is not closing due to window being closed
        var tabs = await chrome.storage.local.get(["owotabs"]);
        let i;
        var tabFound = false;
        if (Object.keys(tabs).length === 0) {     //check if owotabs key in storage is empty

            console.log('array beim loeschen nicht vorhanden');
        } else {
            tabs = tabs['owotabs'];     //eine ebene raus nehmen
            console.log('array loaded');
            for (i = 0; i < tabs.length; i++) {
                console.log('checking tab ' + i);
                if (tabs[i].id === tabId) {
                    //sachen machen wenn die id stimmt
                    console.log('id matches');
                    if ((Date.now() - tabs[i].birthdate) > tabTimeOut * 1000) {
                        console.log('Yay, du hast einen alten Tab geschlossen');
                        var soundFileName = await chrome.storage.local.get(["uwusound"]);
                        var volume = await chrome.storage.local.get(["rawrvolume"]);
                        if (Object.keys(soundFileName).length === 0) {
                            soundFileName = 'de_m-1';
                        } else {
                            soundFileName = soundFileName['uwusound'];      //eine ebene raus nehmen
                        }
                        if (Object.keys(volume).length === 0) {
                            volume = 1.0;
                        } else {
                            volume = volume['rawrvolume'];      //eine ebene raus nehmen
                        }
                        console.log(volume);
                        sendToOffscreen('playsound-default', new SoundProperties('/sounds/' + soundFileName + '.ogg', volume) );
                    }
                    tabFound = true;
                    break;
                }
            }
        }

        //delete closed tab from array
        if (tabFound === true) {
            tabs.splice(i, 1);
            chrome.storage.local.set({ "owotabs": tabs }).then(() => {      //write array to storage
                console.log('neues array ohne alten tab gespeichert');
            });
        } else {
            console.log('tab not in array');
        }
        console.log(tabId);     //print id of closed tab

    } else {
        chromeStarting = true;      //TODO: add check for second window
    }
}


function chromeIsStarting() {
    chromeStarting = true;
}

async function sendToOffscreen(type, data) {
    // Create an offscreen document if one doesn't exist yet
    if (!(await hasDocument())) {
        await chrome.offscreen.createDocument({
            url: '/offscreen.html',
            reasons: ['AUDIO_PLAYBACK'],
            justification: 'Play sound'
        });
        console.log('offscreen doc created');
    }
    // Now that we have an offscreen document, we can dispatch the
    // message.
    chrome.runtime.sendMessage({
        type,
        //target: 'offscreen',
        data
    });
    console.log('message sent');
}

async function hasDocument() {
    // Check all windows controlled by the service worker if one of them is the offscreen document
    const matchedClients = await clients.matchAll();
    for (const client of matchedClients) {
        if (client.url.endsWith('/offscreen.html')) {
            return true;
        }
    }
    return false;
}

chrome.tabs.onCreated.addListener(newTab);

chrome.tabs.onRemoved.addListener(tabClosed);

chrome.runtime.onStartup.addListener(() => { chromeStarting = true; });