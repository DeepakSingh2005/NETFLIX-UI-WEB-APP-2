import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Card from '../components/Card.jsx'
import {
  hasInWatchlist,
  readWatchlist,
  saveWatchlist,
  toggleWatchlistItem,
} from '../utils/watchlist.js'

function Search() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchText, setSearchText] = useState(searchParams.get('query') || '')
  const [titles, setTitles] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const query = searchParams.get('query') || ''

  useEffect(() => {
    setWatchlist(readWatchlist())

    const loadTitles = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch('https://api.imdbapi.dev/titles?pages=20')
        const data = await response.json()
        const rawItems = Array.isArray(data) ? data : data?.results || data?.titles || []

        setTitles(rawItems)
      } catch (fetchError) {
        setTitles([])
        setError('Unable to load titles from the API right now.')
        console.log('Failed to load search titles:', fetchError)
      } finally {
        setLoading(false)
      }
    }

    loadTitles()
  }, [])

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return []

    return titles.filter((movie) => {
      const title = (movie.primaryTitle || movie.title || movie.originalTitle || '').toLowerCase()
      const description = (movie.description || movie.plot || '').toLowerCase()
      const genres = (Array.isArray(movie.genres) ? movie.genres.join(' ') : String(movie.genres || '')).toLowerCase()
      return title.includes(normalizedQuery) || description.includes(normalizedQuery) || genres.includes(normalizedQuery)
    })
  }, [query, titles])

  const handleSearch = (event) => {
    event.preventDefault()
    const trimmed = searchText.trim()
    setSearchParams(trimmed ? { query: trimmed } : {})
    if (!trimmed) {
      navigate('/search')
    }
  }

  return (
    <div className='min-h-screen bg-gray-900 px-4 py-10 text-white'>
      <div className='mx-auto max-w-6xl'>
        <form onSubmit={handleSearch} className='mb-8 flex flex-col gap-4 sm:flex-row'>
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder='Search movies, series, and genres...'
            className='w-full rounded-2xl border border-white/10 bg-gray-800 px-4 py-3 text-white outline-none focus:border-red-600'
          />
          <button
            type='submit'
            className='rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500'
          >
            Search
          </button>
        </form>

        {loading ? (
          <div className='rounded-3xl border border-white/10 bg-white/5 p-8 text-gray-300'>
            Loading titles from the API...
          </div>
        ) : error ? (
          <div className='rounded-3xl border border-white/10 bg-white/5 p-8 text-gray-300'>
            {error}
          </div>
        ) : !query ? (
          <div className='rounded-3xl border border-white/10 bg-white/5 p-8 text-gray-300'>
            Enter a search term to find movies and series.
          </div>
        ) : results.length === 0 ? (
          <div className='rounded-3xl border border-white/10 bg-white/5 p-8 text-gray-300'>
            No results found for <strong>{query}</strong>.
          </div>
        ) : (
          <div>
            <h1 className='mb-6 text-3xl font-bold text-white'>Search results for "{query}"</h1>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {results.map((movie) => (
                <Card
                  key={movie.id || movie.title}
                  image={movie.primaryImage?.url || movie.image || ''}
                  title={movie.primaryTitle || movie.title}
                  rating={movie.rating ?? movie.aggregateRating}
                  isSaved={hasInWatchlist(watchlist, movie)}
                  onWatchlistToggle={() => {
                    const updated = toggleWatchlistItem(watchlist, movie)
                    setWatchlist(updated)
                    saveWatchlist(updated)
                  }}
                  onClick={() => {
                    const titleId = movie.id || movie.title
                    const payload = JSON.stringify(movie)
                    sessionStorage.setItem(`title-details:${titleId}`, payload)
                    localStorage.setItem(`title-details:${titleId}`, payload)
                    navigate(`/title/${titleId}`, { state: { movie } })
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
