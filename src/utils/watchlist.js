const WATCHLIST_KEY = 'watchlist'

export const getTitleKey = (item) =>
  item?.id || item?.title || item?.primaryTitle || item?.originalTitle

export const readWatchlist = () => {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.log('Could not read watchlist', error)
    return []
  }
}

export const saveWatchlist = (items) => {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items))
  return items
}

export const hasInWatchlist = (watchlist, movie) => {
  const titleId = getTitleKey(movie)
  return watchlist.some((item) => getTitleKey(item) === titleId)
}

export const toggleWatchlistItem = (watchlist, movie) => {
  const titleId = getTitleKey(movie)
  if (!titleId) return watchlist

  if (hasInWatchlist(watchlist, movie)) {
    return watchlist.filter((item) => getTitleKey(item) !== titleId)
  }

  return [...watchlist, movie]
}
