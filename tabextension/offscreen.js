chrome.runtime.onMessage.addListener(handleMessages);

async function handleMessages(message) {
    /*
      // Return early if this message isn't meant for the offscreen document.
    if (message.target !== 'offscreen') {
      return false;
    }
    */
    console.log('du stinkst lool');
    console.log(message);
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
    //TODO: decode message and play corresponding sound file
    const audio = new Audio(data.source);
    audio.volume = data.volume;
    audio.play();
    /*
    switch (massage.soundtype) {
      case 'de_m-1mono':
        //play default sound
        break;
      case 'de_m-1stereo':

      default:
        console.log('no sound selected');
    }
    */
}