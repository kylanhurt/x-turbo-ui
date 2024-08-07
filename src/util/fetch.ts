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
    console.error('fetchAuthorTargetNotes error', JSON.stringify(err))
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
          chrome.storage.local.set({ user })
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

export const startValidationPolling = async (url: string) => {
  console.log('in startValidationPolling')
  console.warn('in startValidationPolling')
  // get oauth_token query param from url
  const urlParams = new URLSearchParams(url.split('?')[1])
  const oauthToken = urlParams.get('oauth_token')
  // what if no oauthToken?
  const unixTimestamp = new Date().getTime()
  console.log('startValidationPolling unixTimestamp', unixTimestamp)
  const expires = 15 * 60 * 1000 + unixTimestamp
  chrome.storage.local.set({ validationOauthToken: `${oauthToken}:${expires}` })
  checkIfValidated(oauthToken, 3000, expires)
}