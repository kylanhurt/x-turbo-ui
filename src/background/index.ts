import { checkIfValidated } from "../util";
import { storage } from "../storage";

// Background service workers
// https://developer.chrome.com/docs/extensions/mv3/service_workers/

console.log('in background index')
chrome.runtime.onInstalled.addListener(() => {
    console.log('background onInstalled listener executing')
    storage.get().then((data) => {
        console.log('background index got storage data', JSON.stringify(data))
    });
});

// NOTE: If you want to toggle the side panel from the extension's action button,
// you can use the following code:
// chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
//    .catch((error) => console.error(error));

chrome.storage.local.get(['user', 'validationOauthToken']).then((data) => {
    console.log('background/index.ts', data)
    const nowTimestamp = Date.now()
    const { validationOauthToken } = data
    if (validationOauthToken) {
        console.log('background/index.ts raw validationOauthToken', validationOauthToken)
        const [token, expiration] = validationOauthToken.split(':')
        const expirationTimestamp = new Date(expiration).getTime()
        console.log('background/index.ts token, expiration', token, expiration)
        if (expirationTimestamp > nowTimestamp) {
            checkIfValidated(token, 3000, expirationTimestamp)
        }
    }
  });