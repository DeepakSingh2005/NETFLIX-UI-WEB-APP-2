import sampleTitles from '../data/sampleTitles.js'

const getFallbackTitles = (limit = 10) => sampleTitles.slice(0, Math.max(1, limit))

<<<<<<< HEAD
export async function fetchTitles(limit = 10) {
  const apiUrl = import.meta.env.VITE_TITLES_API_URL || 'https://api.imdbapi.dev/titles'

  try {
    const response = await fetch(`${apiUrl}?pages=${limit}`)
=======
export async function fetchTitles(limit = 10, pageToken = null) {
  const apiUrl ='https://api.imdbapi.dev/titles'
  const url = pageToken ? `${apiUrl}?pageToken=${encodeURIComponent(pageToken)}` : apiUrl

  try {
    const response = await fetch(url)
>>>>>>> 115fcb1 (Install Tailwind Vite plugin)
    if (!response.ok) {
      throw new Error(`Title API responded with ${response.status}`)
    }

    const data = await response.json()
    const rawItems = Array.isArray(data) ? data : data?.results || data?.titles || []
<<<<<<< HEAD

    if (Array.isArray(rawItems) && rawItems.length > 0) {
      return rawItems
=======
    const nextPageToken = data?.nextPageToken || null

    if (Array.isArray(rawItems) && rawItems.length > 0) {
      return {
        titles: rawItems,
        nextPageToken,
      }
>>>>>>> 115fcb1 (Install Tailwind Vite plugin)
    }
  } catch (error) {
    console.warn('Falling back to local sample titles:', error)
  }

<<<<<<< HEAD
  return getFallbackTitles(limit)
=======
  return {
    titles: getFallbackTitles(limit),
    nextPageToken: null,
  }
>>>>>>> 115fcb1 (Install Tailwind Vite plugin)
}
