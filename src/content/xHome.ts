import { fetchAuthorTargetNotesViaTarget, hoverCardParentToNoteParent, hoverCardParentToUsernameNode, primaryColumnToTimeline, usernameAreaToUsername } from "../util";
import UserNoteInput from "../components/UserNoteInput.svelte";

// Content scripts
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/

// Some global styles on the page
import "../tailwind.css";
import "./styles.css";
import axios from "axios";

// Some JS on the page
// storage.get().then(console.log);
console.log('in xHome')
// data-testid="User-Name"

const authorNotes = {}

const visibleUsernames = []

const getUsernameFromNode = (node) => {

}

const config = { attributes: false, childList: true, subtree: false };

let timeline: HTMLElement | null = null
let timelineMountInterval = setInterval(() => {
  // find primary column
  const primaryColumn = document.querySelector('[data-testid="primaryColumn"]')
  if (!primaryColumn) return
  // navigate from primaryColumn to timeline
  timeline = primaryColumnToTimeline(primaryColumn)
  if (timeline) {
    clearInterval(timelineMountInterval)
    watchTimelineForNewTweets()
  }
}, 5000)

const getUsernameOfTweet = (tweetNode) => {
  const userNameArea = tweetNode.querySelector('[data-testid="User-Name"]')
  // console.log('userNameArea', userNameArea)
  const username = usernameAreaToUsername(userNameArea)
  console.log('username', username)
  // const username = userNameArea.textContent
  return username

}

const watchTimelineForNewTweets = () => {
  if (!timeline) return
  const targetNode = timeline.firstChild as HTMLElement

  let lastNode
  const callback = async (mutationList, observer) => {
    for (const mutation of mutationList) {
      lastNode = mutation.addedNodes[0]
      // get username of each tweet
      const usernameArray = []
      for (const tweet of mutation.addedNodes) {
        const targetUsername: string = getUsernameOfTweet(tweet)
        const { selfUsername } = await chrome.storage.local.get('selfUsername')
        const notes = await fetchAuthorTargetNotesViaTarget(selfUsername.toLowerCase(), targetUsername.toLowerCase())
        console.log('notes', notes)
        if (notes.length > 0) {
          authorNotes[targetUsername] = notes
          chrome.storage.local.set({ authorNotes })
          console.log('authorNotes', authorNotes)
          // get author target notes and inject into Tweet?
        }
        usernameArray.push(targetUsername)
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
}, 10)

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
  const usernameNode = hoverCardParentToUsernameNode(hoverCardParent)
  const popupUsername = usernameNode.textContent.replace('@', '')
  console.log('popupUsername', popupUsername)
  const secondParent = hoverCardParentToNoteParent(hoverCardParent)
  new UserNoteInput({ target: secondParent, props: { targetUsername: popupUsername }})
}
