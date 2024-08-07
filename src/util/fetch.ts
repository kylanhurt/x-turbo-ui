import axios from "axios"

const VITE_API_DOMAIN = import.meta.env.VITE_API_DOMAIN

export const fetchAuthorTargetNotesViaTarget = async (author: string, target: string) => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_DOMAIN}/notes/author-target`, {
      params: {
        target: target.toLowerCase(),
        author: author.toLowerCase()
      }
    })
    return data
  } catch (err) {
    console.error('fetchUserTargetNotes error', JSON.stringify(err))
  }
}

export const checkIfValidated = async (oauth_token: string, interval?: number, endTime?: number) => {
  console.log('checkIfValidated oauth_token:', oauth_token)
  const nowTimestamp = Date.now()
  const isPastEndTime = endTime && nowTimestamp > endTime
  if (isPastEndTime || !oauth_token) return
  try {
      const { data: { isValidated, user } } = await axios.get(`${VITE_API_DOMAIN}/twitter/validated?oauth_token=${oauth_token}`, {
          headers: {
              'Content-Type': 'application/json',
          }
      })
      console.log('checkIfValidated isValidated:', isValidated)
      if (isValidated) {
          chrome.storage.local.set(user)
          chrome.storage.local.remove('validationOauthToken')
          console.log('checkIfValidated validated with user: ', user)
      } else {
          console.log('checkIfValidated not validated yet')
          setTimeout(() => checkIfValidated(oauth_token, interval, endTime), interval)
      }
  } catch (err) {
      console.error(err)
  }
}