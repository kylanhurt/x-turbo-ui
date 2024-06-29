export const primaryColumnToTimeline = (primaryColumnNode: Element) => {
  const timeline = primaryColumnNode.firstChild.children[4].firstChild.children[1]
  return timeline
}

export const usernameAreaToUsername = (usernameAreaNode: Element) => {
  const username = usernameAreaNode.children[1].children[0].children[0].querySelector('span').textContent.replace('@', '')
  return username
}

export const hoverCardParentToNoteParent = (hoverCardParentNode: Element) => {
  const firstSibling = hoverCardParentNode.firstChild.firstChild.firstChild.firstChild.firstChild.children[1]
  console.log('firstSibling: ', firstSibling)
  const secondParent = firstSibling.firstChild.firstChild
  return secondParent
}

export const hoverCardParentToUsernameNode = (hoverCardParentNode: Element) => {
  const firstSibling = hoverCardParentNode.firstChild.firstChild.firstChild.firstChild.firstChild.children[1]
  console.log('firstSibling: ', firstSibling)
  const secondSibling = firstSibling.firstChild.firstChild.children[1]
  console.log('secondSibling: ', secondSibling)
  const usernameNode = secondSibling.firstChild.firstChild.firstChild.firstChild  
  return usernameNode
}