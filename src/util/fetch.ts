import axios from "axios"

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
    console.error('fetchUserTargetNotes error', err)
  }
}