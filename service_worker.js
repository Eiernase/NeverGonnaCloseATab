//Edit this global variable to change the time it takes until a tab closed plays a sound.
//Enter in seconds
//Default is 36000, which equals 10 hours
//Does not affect the value the popup resets to! Change seperately in popup.js
var defaultTabTimeOut = 36000;

//Edit this global variable to the sound file name (including file extension) of your desired default sound file
var defaultSoundFile = 'de_m-1.ogg';



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

class navTab {
    constructor(id, url) {
        this.id = id;
        this.url = url;
    }
}

var currentCache = [];
var navCache = [];
var saveInProgress = false;
var navProcessInProgress = false;

async function saveCacheToStorage() {
    if (!saveInProgress) {       //checks if there is currently an instance of this function processing data
        saveInProgress = true;   //if not, enable check and begin processing
        var tabs = await chrome.storage.local.get(["owotabs"]);
        var openTabs = await chrome.tabs.query({});
        let i;
        for (i = 0; i < openTabs.length; i++) {
            currentCache[currentCache.length] = new AcidTab(openTabs[i].id, Date.now(), openTabs[i].pendingUrl == null ? openTabs[i].url : openTabs[i].pendingUrl);
        }
        if (Object.keys(tabs).length === 0) {     //check if owotabs key in storage is empty  
            tabs = [];      //if yes, create new array to save in
            console.log('array erstellt');
        } else {
            tabs = tabs['owotabs'];     //eine ebene raus nehmen
            isTabSavedYet(tabs);
        }
        while (currentCache.length > 0) {
            tabs[tabs.length] = currentCache.splice(0, 1)[0];       //eine ebene aus cache splice raus nehmen
            console.log('spliced 1 from cache to array');
        }
        chrome.storage.local.set({ "owotabs": tabs }).then(() => {      //store cache variable in storage
            console.log('stored array with new tabs in storage');
        });
        saveInProgress = false;  //resets processing state boolean
    }
}

async function processNavigation() {
    if (!navProcessInProgress) {
        var anythingChanged = false;
        navProcessInProgress = true;
        var tabs = await chrome.storage.local.get(["owotabs"]);
        if (Object.keys(tabs).length === 0) {     //check if owotabs key in storage is empty  
            tabs = [];      //if yes, create new array to save in
            console.log('array erstellt nav');
        } else {
            tabs = tabs['owotabs'];     //eine ebene raus nehmen
            let i;
            let j;
            for (i = navCache.length - 1; i >= 0; i--) {
                console.log('starting check for navigation ' + i);
                for (j = 0; j < tabs.length; j++) {
                    console.log('checking if nav id matches tabid ' + j);
                    if (navCache[i].id === tabs[j].id) {
                        if (!(navCache[i].url === tabs[j].url)) {
                            console.log('matches, old url: ' + tabs[j].url + ' new url: ' + navCache[i].url);
                            tabs[j].url = navCache.splice(i, 1)[0].url;
                            console.log('matches and url is new, updated');
                            anythingChanged = true;
                        } else {
                            navCache.splice(i, 1);
                            console.log('matches but url is the same');
                        }
                        break;
                    }
                }
            }
            if (anythingChanged) {
                chrome.storage.local.set({ "owotabs": tabs }).then(() => {      //store cache variable in storage
                    console.log('stored array with updated urls in storage');
                });
            }
        }
        navProcessInProgress = false;
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
                if (tabs[i].id === currentCache[j].id) {
                    //sachen machen wenn die id stimmt
                    tabs[i].url = currentCache.splice(j, 1)[0].url;
                    console.log('tab with id is saved, url updated');
                    tabs[i].confirmed = true;
                    break;
                } else if (tabs[i].url === currentCache[j].url) {
                    //sachen machen wenn die url stimmt
                    tabs[i].id = currentCache.splice(j, 1)[0].id;
                    console.log('tab with url is saved, id updated');
                    tabs[i].confirmed = true;
                    break;
                }
            }
        }
    }
    for (k = tabs.length - 1; k >= 0; k--) {
        if (tabs[k].confirmed == false) {
            tabs.splice(k, 1);
            console.log('removed saved tab ' + k);
        }
    }
    for (i = 0; i < tabs.length; i++) {
        tabs[i].confirmed = false;
    }
}

function newTab(tab) {
    console.log(tab.id);
    //print id of new tab
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
            var tabTimeOut = await chrome.storage.local.get(["nyatimeout"]);
            if (Object.keys(tabTimeOut).length === 0) {
                tabTimeOut = defaultTabTimeOut;
                console.log('no timeout saved, set to default');
            } else {
                tabTimeOut = tabTimeOut['nyatimeout'];     //eine ebene raus nehmen;
            }
            for (i = 0; i < tabs.length; i++) {
                console.log('checking tab ' + i);
                if (tabs[i].id === tabId) {
                    //sachen machen wenn die id stimmt
                    console.log('id matches');
                    if ((Date.now() - tabs[i].birthdate) > tabTimeOut * 1000) {
                        console.log('Yay, du hast einen alten Tab geschlossen');
                        var soundFileName = await chrome.storage.local.get(["uwusound"]);
                        var volume = await chrome.storage.local.get(["rawrvolume"]);
                        var randomize = await chrome.storage.local.get(["grrandomize"]);
                        if (Object.keys(volume).length === 0) {
                            volume = 1.0;       //set volume to 1.0 if not set yet
                        } else {
                            volume = volume['rawrvolume'];      //eine ebene raus nehmen
                        }
                        if (!(Object.keys(randomize).length === 0)) {
                            if (randomize["grrandomize"]) {
                                //randomize shit
                                var listOfFiles = ["de_m-1.ogg", "de_m-2.ogg", "uwu_hannah.ogg", "f_moan-1.ogg", "metal_pipe_falling.ogg", "samsung.ogg", "step_bro.ogg", "cant_believe.ogg", "rickroll.ogg", "vine_boom.ogg", "amongus_drip.ogg", "amongus_driplong.ogg", "amongus_kill.ogg", "amongus_roundstart.ogg"];
                                soundFileName = listOfFiles[Math.floor(Math.random() * listOfFiles.length)];
                            } else {
                                if (Object.keys(soundFileName).length === 0) {
                                    soundFileName = defaultSoundFile;       //set soundFileName to default if not set yet
                                } else {
                                    soundFileName = soundFileName['uwusound'];      //eine ebene raus nehmen
                                }
                            }
                        } else {
                            if (Object.keys(soundFileName).length === 0) {
                                soundFileName = defaultSoundFile;       //set soundFileName to default if not set yet
                            } else {
                                soundFileName = soundFileName['uwusound'];      //eine ebene raus nehmen
                            }
                        }
                        sendToOffscreen('playsound-default', new SoundProperties('./sounds/' + soundFileName, volume));  //play awesome sound
                        var notificationsEnabled = await chrome.storage.local.get(["ayaya"]);
                        if (!(Object.keys(notificationsEnabled).length === 0)) {
                            if (notificationsEnabled["ayaya"]) {
                                var notifLanguage = await chrome.storage.local.get(["lelelelanguage"]);
                                if (Object.keys(notifLanguage).length === 0) {
                                    notifLanguage = "de";
                                } else {
                                    notifLanguage = notifLanguage["lelelelanguage"];
                                }
                                chrome.notifications.clear("ayaya");
                                switch (notifLanguage) {
                                    case 'de':
                                        chrome.notifications.create("ayaya", {
                                            type: "basic",
                                            iconUrl: "images/kill-512.png",
                                            title: "Yay",
                                            message: "Du hast einen alten Tab geschlossen!",
                                            silent: true
                                        });
                                        break;
                                    case 'en':
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

    }
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

function navigationCommitted(id, navdata) {
    if (navdata.url) {     //check if a navigation occured in the main tab
        navCache[navCache.length] = new navTab(id, navdata.url);     //save the new url and the tab id to cache
        processNavigation();    //process cache
    }
}

chrome.tabs.onCreated.addListener(newTab);

chrome.tabs.onRemoved.addListener(tabClosed);

chrome.tabs.onUpdated.addListener(navigationCommitted);