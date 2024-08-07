import { checkIfValidated } from "../util";
import { storage } from "../storage";
import Overlay from "../components/Overlay.svelte";

chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' });

console.log('in content/x.ts')
// new Overlay ({ target: document.body });

addEventListener("load", async (event) => {
  const selfUsername = getSelfUsername().toLowerCase()
  console.log('content/x.ts, selfUsername', selfUsername)
  // set to chrome local storage
  chrome.storage.local.get(['user', 'validationOauthToken'], (result) => {
    console.log('content/x.ts, local storage user and token is ', result);
  });
});

const getSelfUsername = () => {
  const accountSwitcherButton = document.querySelector("[data-testid='SideNav_AccountSwitcher_Button")
  const selfUsername = accountSwitcherButton?.children[1]?.firstChild?.children[1]?.firstChild?.firstChild?.firstChild?.textContent.replace('@', '')
  return selfUsername
}