# Psychological Tab Manager
Psychological Tab Manager helps you Pavlov yourself into closing old tabs more often by playing amazing sounds and voicelines 
upon closing a tab that has been open and unused for a long time. 

It comes with an easy-to-use control panel featuring a funky, eye-catching design and options for customization, 
like changing the played sound and the timeout until it's triggered.

The measurement for how long a tab has been open is saved between sessions! 
Because tabs mainly pile up when restoring last open tabs on the next launch.

# Installation
The Extension currently only works on chromium-based browsers supporting manifest v3. The .crx packages under "Releases" usually simply be dropped onto the browser window.
## Google Chrome
Since Google Chrome does not allow for installing extensions which are not listed on the Chrome Web Store (and I don't have a credit card to pay 5$ to create a developer account), 
the extension needs to be installed as an unpacked extension with developer mode active: 

1. Download source code
2. Unpack
3. Go to chrome://extensions
4. Enable "Developer Mode"
5. Click on "Load unpacked"
6. Select source code folder
7. Enjoy

## Chromium
Download the .crx file from the [Releases Page](https://github.com/Eiernase/NeverGonnaCloseATab/releases/) and drop it onto the browser or in some cases the extension page.

## Microsoft Edge
For Microsoft Edge the same procedure as for Google Chrome applies:

1. Download source code
2. Unpack
3. Go to edge://extensions
4. Enable "Developer Mode"
5. Click on "Load unpacked"
6. Select source code folder
7. Enjoy

## Operra
While Operra is chromium-based and the extension installs successfully, 
it is not able to play the sound upon closing a tab because the offscreen document api (which is used to play the sound) is not supported. 

I have submitted the extension to the Operra Web Store before finding this out. It is available on Developer and Beta but as of now still pending for review on Stable.

## Firefox
Firefox *says* they support manifest v3, but many features are indeed still manifest v2. The service worker can not be recognized (because service workers aren't supported yet), 
and such the extension is deemed as being faulty and cannot be installed.
