import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../components/Card'
import HeroCard from '../components/HeroCard'
import {
  getTitleKey,
  hasInWatchlist,
  readWatchlist,
  saveWatchlist,
  toggleWatchlistItem,
} from '../utils/watchlist.js'

const getTitleType = (item) => {
  const rawType = item?.titleType ?? item?.type ?? item?.titletype ?? ''
  return String(rawType).toLowerCase()
}

const isSeries = (item) => {
  const type = getTitleType(item)
  return (
    type.includes('series') ||
    type.includes('tv') ||
    type.includes('show') ||
    type === 'episode'
  )
}

const isMovie = (item) => {
  const type = getTitleType(item)
  return (
    type.includes('movie') ||
    type.includes('film') ||
    type.includes('feature') ||
    type === 'short'
  )
}

const mergeUniqueTitles = (existingTitles, incomingTitles) => {
  const merged = [...existingTitles]
  const seenKeys = new Set(existingTitles.map(getTitleKey).filter(Boolean))

  incomingTitles.forEach((item) => {
    const key = getTitleKey(item)
    if (!key || seenKeys.has(key)) return
    seenKeys.add(key)
    merged.push(item)
  })

  return merged
}

function Home() {
  const navigate = useNavigate()
  const { category } = useParams()
  const requestInFlightRef = useRef(false)
  const sentinelRef = useRef(null)
  const rawTitlesRef = useRef([])

  const [rawTitles, setRawTitles] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [visibleCount, setVisibleCount] = useState(10)
  const [limit, setLimit] = useState(10)
  const [hasMore, setHasMore] = useState(true)

  const selectedCategory = category || 'movies'

  const filteredTitles = useMemo(() => {
    if (selectedCategory === 'series') return rawTitles.filter(isSeries)
    if (selectedCategory === 'movies') return rawTitles.filter(isMovie)
    return rawTitles
  }, [rawTitles, selectedCategory])

  const visibleTitles = useMemo(() => filteredTitles.slice(0, visibleCount), [filteredTitles, visibleCount])

  const toggleWatchlist = (movie) => {
    const updated = toggleWatchlistItem(watchlist, movie)
    setWatchlist(updated)
    saveWatchlist(updated)
  }

  const loadTitles = useCallback(async (nextLimit = 10) => {
    if (requestInFlightRef.current) return

    requestInFlightRef.current = true

    try {
      if (nextLimit > 10) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      setError('')

      const response = await fetch(`https://api.imdbapi.dev/titles?pages=${nextLimit}`)
      const data = await response.json()
      const rawItems = Array.isArray(data) ? data : data?.results || data?.titles || []

      const baseTitles = nextLimit > 10 ? rawTitlesRef.current : []
      const mergedTitles = nextLimit > 10 ? mergeUniqueTitles(baseTitles, rawItems) : rawItems

      rawTitlesRef.current = mergedTitles
      setRawTitles(mergedTitles)
      setLimit(nextLimit)
      setHasMore(rawItems.length >= nextLimit)
      setVisibleCount((prev) =>
        nextLimit > 10 ? Math.min(prev + 10, mergedTitles.length) : Math.min(nextLimit, mergedTitles.length),
      )
    } catch (err) {
      setRawTitles([])
      rawTitlesRef.current = []
      setLimit(nextLimit)
      setHasMore(false)
      setVisibleCount(0)
      setError('Unable to load titles from the API right now. Please try again.')
      console.log('Failed to load titles from the API:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
      requestInFlightRef.current = false
    }
  }, [])

  useEffect(() => {
    rawTitlesRef.current = rawTitles
  }, [rawTitles])

  useEffect(() => {
    setWatchlist(readWatchlist())
    loadTitles(10)
  }, [loadTitles])

  useEffect(() => {
    setVisibleCount(10)
  }, [selectedCategory])

  useEffect(() => {
    if (!sentinelRef.current) return

    const handleIntersection = (entries) => {
      const [entry] = entries
      
      if (!entry.isIntersecting || loading || loadingMore || !hasMore || requestInFlightRef.current) {
        return
      }

      if (visibleCount < filteredTitles.length) {
        setVisibleCount((prev) => Math.min(prev + 10, filteredTitles.length))
        return
      }

      loadTitles(limit + 10)
    }

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    })

    observer.observe(sentinelRef.current)

    return () => observer.disconnect()
  }, [filteredTitles.length, hasMore, limit, loadTitles, loading, loadingMore, visibleCount])

  return (
    <div className='min-h-screen bg-black'>
      <HeroCard />

      <div className='min-h-screen bg-gray-900 px-6 pt-20'>
        {loading && (
          <div className='flex h-96 items-center justify-center'>
            <p className='text-2xl text-white'>Loading {selectedCategory}...</p>
          </div>
        )}

        {error && !loading && (
          <div className='flex h-96 items-center justify-center'>
            <p className='text-lg text-red-400'>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className='mb-12'>
            <h2 className='mb-6 text-3xl font-bold text-white'>
              {selectedCategory === 'series' ? 'Trending Series' : 'Trending Movies'}
            </h2>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
              {visibleTitles.map((movie) => {
                const titleId = getTitleKey(movie)

                return (
                  <Card
                    key={titleId}
                    image={movie.primaryImage?.url || movie.image?.url || movie.image}
                    title={movie.primaryTitle || movie.title || 'Untitled'}
                    rating={movie.rating ?? movie.aggregateRating}
                    isSaved={hasInWatchlist(watchlist, movie)}
                    onWatchlistToggle={() => toggleWatchlist(movie)}
                    onClick={() => {
                      const payload = JSON.stringify(movie)
                      sessionStorage.setItem(`title-details:${titleId}`, payload)
                      localStorage.setItem(`title-details:${titleId}`, payload)

                      navigate(`/title/${titleId}`, {
                        state: { movie },
                      })
                    }}
                  />
                )
              })}
            </div>

            {filteredTitles.length === 0 && (
              <p className='mt-8 text-gray-300'>
                No {selectedCategory} found right now.
              </p>
            )}

            <div ref={sentinelRef} className='flex items-center justify-center py-12'>
              {loadingMore ? (
                <div className='flex items-center space-x-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-white'></div>
                  <p className='text-sm font-medium text-gray-400'>Loading more titles...</p>
                </div>
              ) : hasMore && visibleCount >= filteredTitles.length ? (
                <p className='text-sm font-medium text-gray-500'>Scroll for more titles</p>
              ) : !hasMore && filteredTitles.length > 0 ? (
                <p className='text-sm font-medium text-gray-500'>No more titles to load</p>
              ) : null}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Home
