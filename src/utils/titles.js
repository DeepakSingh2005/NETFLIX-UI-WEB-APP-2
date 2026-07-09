import sampleTitles from '../data/sampleTitles.js'

const getFallbackTitles = (limit = 10) => sampleTitles.slice(0, Math.max(1, limit))

export async function fetchTitles(limit = 10, pageToken = null) {
  const apiUrl = import.meta.env.VITE_TITLES_API_URL || 'https://api.imdbapi.dev/titles'
  const params = new URLSearchParams()

  if (pageToken) {
    params.set('pageToken', pageToken)
  }

  if (limit) {
    params.set('limit', String(limit))
  }

  const url = `${apiUrl}${params.toString() ? `?${params.toString()}` : ''}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Title API responded with ${response.status}`)
    }

    const data = await response.json()
    const rawItems = Array.isArray(data) ? data : data?.results || data?.titles || []
    const nextPageToken = data?.nextPageToken || null

    if (Array.isArray(rawItems) && rawItems.length > 0) {
      return {
        titles: rawItems,
        nextPageToken,
      }
    }
  } catch (error) {
    console.warn('Falling back to local sample titles:', error)
  }

  return {
    titles: getFallbackTitles(limit),
    nextPageToken: null,
  }
}
