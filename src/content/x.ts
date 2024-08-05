chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' });

addEventListener("load", async (event) => {
  const selfUsername = getSelfUsername().toLowerCase()
  console.log('content/x.ts, selfUsername', selfUsername)
  // set to chrome session storage
  await chrome.storage.local.set({ selfUsername }).catch(err => console.error('content/x.ts, error setting selfUsername', err))
  // get from chrome session storage
  chrome.storage.local.get('selfUsername', (result) => {
    console.log('content/x.ts, local storage is ', result);
  });
});

const getSelfUsername = () => {
  const accountSwitcherButton = document.querySelector("[data-testid='SideNav_AccountSwitcher_Button")
  const selfUsername = accountSwitcherButton.children[1].firstChild.children[1].firstChild.firstChild.firstChild.textContent.replace('@', '')
  return selfUsername
}