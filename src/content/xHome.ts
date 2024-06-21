import Overlay from "../components/Overlay.svelte";
import { storage } from "../storage";

// Content scripts
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/

// Some global styles on the page
import "../tailwind.css";
import { debounce } from "../util/util";
import "./styles.css";

// Some JS on the page
// storage.get().then(console.log);
console.log('in xHome')
// data-testid="User-Name"

const visibleUsernames = []

const getUsernameFromNode = (node) => {

}

const config = { attributes: true, childList: true, subtree: true };

let timeline: HTMLElement | null = null
let timelineMountInterval = setInterval(() => {
  timeline = document.querySelector('[aria-label="Timeline: Your Home Timeline"]')
  if (timeline) {
    console.log('timeline', timeline)
    clearInterval(timelineMountInterval)
    watchTimelineForNewTweets()
  }
}, 1000)

const getUsernameOfTweet = (tweet) => {
  const username = tweet.querySelector('[data-testid="User-Name"]').textContent
  return username

}

const watchTimelineForNewTweets = () => {
  console.log('watchTimelineForNewTweets', timeline)
  if (!timeline) return
  const targetNode = timeline.firstChild as HTMLElement

  console.log('targetNode: ', targetNode)
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        // console.log('recheck children length', targetNode.children.length)
        const children = targetNode.children
        // get username of each tweet
        const usernameArray = []
        for (let i = 0; i < children.length; i++) {
          const tweet = children[i]
          const username = getUsernameOfTweet(tweet)
          usernameArray.push(username)
        }
        console.log('usernameArray', usernameArray)
        // console.log("A child node has been added or removed.");
      } /* else if (mutation.type === "attributes") {
        console.log(`The ${mutation.attributeName} attribute was modified.`);
      } */
    }
  };
  
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);
  
  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

// addEventListener('load', function() {
//   const targetNode = document.querySelector("body");
//   console.log('targetNode: ', targetNode)
//   console.log('load')
//   // find all Tweets in DOM
//   let tweets = document.querySelectorAll('[data-testid="tweet"]')
//   console.log('tweets', tweets)
//   let userNames = document.querySelectorAll('[data-testid="User-Name"]')
//   console.log('userNames', userNames)

//   const callback = (mutationList, observer) => {
//     for (const mutation of mutationList) {
//       if (mutation.type === "childList") {
//         console.log("A child node has been added or removed.");
//       } else if (mutation.type === "attributes") {
//         console.log(`The ${mutation.attributeName} attribute was modified.`);
//       }
//     }
//   };
  
//   // Create an observer instance linked to the callback function
//   const observer = new MutationObserver(callback);
  
//   // Start observing the target node for configured mutations
//   observer.observe(targetNode, config);
// })
