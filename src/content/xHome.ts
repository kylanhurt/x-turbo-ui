import Overlay from "../components/Overlay.svelte";
import UserNoteInput from "../components/UserNoteInput.svelte";
import { storage } from "../storage";

// Content scripts
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/

// Some global styles on the page
import "../tailwind.css";
import "./styles.css";

// Some JS on the page
// storage.get().then(console.log);
console.log('in xHome')
// data-testid="User-Name"

const visibleUsernames = []

const getUsernameFromNode = (node) => {

}

const config = { attributes: false, childList: true, subtree: false };

let timeline: HTMLElement | null = null
let timelineMountInterval = setInterval(() => {
  timeline = document.querySelector('[aria-label="Timeline: Your Home Timeline"]')
  if (timeline) {
    clearInterval(timelineMountInterval)
    watchTimelineForNewTweets()
  }
}, 5000)

const getUsernameOfTweet = (tweetNode) => {
  const userNameArea = tweetNode.querySelector('[data-testid="User-Name"]')
  // console.log('userNameArea', userNameArea)
  const username = userNameArea.children[1].children[0].children[0].querySelector('span').textContent.replace('@', '')
  console.log('username', username)
  // const username = userNameArea.textContent
  return username

}

const watchTimelineForNewTweets = () => {
  if (!timeline) return
  const targetNode = timeline.firstChild as HTMLElement

  let lastNode
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      lastNode = mutation.addedNodes[0]
      // get username of each tweet
      const usernameArray = []
      for (const tweet of mutation.addedNodes) {
        const username = getUsernameOfTweet(tweet)
        usernameArray.push(username)
      }
    }
  };
  
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);
  
  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

// find hover cards
let hoverCardParent: any
setInterval(() => {
  findHoverCardAndExecute()
}, 1000)

const findHoverCardAndExecute = () => {
  // can optimize later by only searching with specific area
  const [foundHoverCardParent] = document.querySelectorAll('[data-testid="hoverCardParent"]')
  if (!foundHoverCardParent) return
  // if foundHoverCardParent is equal to hoverCardParent
  if (foundHoverCardParent.isEqualNode(hoverCardParent)) return
  hoverCardParent = foundHoverCardParent
  hoverCardParentToUsername(hoverCardParent)
}

const hoverCardParentToUsername = (hoverCardParent: Element) => {
  const firstSibling = hoverCardParent.firstChild.firstChild.firstChild.firstChild.firstChild.children[1]
  console.log('firstSibling: ', firstSibling)
  const secondParent = firstSibling.firstChild.firstChild
  const secondSibling = firstSibling.firstChild.firstChild.children[1]
  console.log('secondSibling: ', secondSibling)
  const usernameNode = secondSibling.firstChild.firstChild.firstChild.firstChild
  const popupUsername = usernameNode.textContent.replace('@', '')
  console.log('popupUsername', popupUsername)
  new UserNoteInput({ target: secondParent })

}