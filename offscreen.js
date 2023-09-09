chrome.runtime.onMessage.addListener(handleMessages);

async function handleMessages(message) {
    /*
      // Return early if this message isn't meant for the offscreen document.
    if (message.target !== 'offscreen') {
      return false;
    }
    */
    console.log('du stinkst lool');
    switch (message.type) {
        case 'playsound-default':
            playsoundDefault(message.data);
            break;
        default:
            console.warn(`Unexpected message type received: '${message.type}'.`);
            return false;
    }
}

function playsoundDefault(data) {
    const audio = new Audio(data.source);
    audio.volume = data.volume;
    audio.play();
}