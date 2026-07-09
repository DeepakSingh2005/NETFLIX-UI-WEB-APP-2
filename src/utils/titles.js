import sampleTitles from '../data/sampleTitles.js'

const getFallbackTitles = (limit = 10) => sampleTitles.slice(0, Math.max(1, limit))

export async function fetchTitles(limit = 10) {
  const apiUrl = import.meta.env.VITE_TITLES_API_URL || 'https://api.imdbapi.dev/titles'

  try {
    const response = await fetch(`${apiUrl}?pages=${limit}`)
    if (!response.ok) {
      throw new Error(`Title API responded with ${response.status}`)
    }

    const data = await response.json()
    const rawItems = Array.isArray(data) ? data : data?.results || data?.titles || []

    if (Array.isArray(rawItems) && rawItems.length > 0) {
      return rawItems
    }
  } catch (error) {
    console.warn('Falling back to local sample titles:', error)
  }

  return getFallbackTitles(limit)
}
