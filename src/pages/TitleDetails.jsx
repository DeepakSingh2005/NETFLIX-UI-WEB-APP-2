import React from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import sampleTitles from '../data/sampleTitles.js'
import { getTitleKey } from '../utils/watchlist.js'

function TitleDetails() {
  const location = useLocation()
  const navigate = useNavigate()
  const { titleId } = useParams()

  const cachedMovie = titleId
    ? localStorage.getItem(`title-details:${titleId}`) ||
      sessionStorage.getItem(`title-details:${titleId}`)
    : null

  let parsedMovie = null
  if (cachedMovie) {
    try {
      parsedMovie = JSON.parse(cachedMovie)
    } catch (error) {
      console.log('Could not parse cached title details', error)
    }
  }

  const fallbackMovie = titleId
    ? sampleTitles.find((item) => getTitleKey(item) === titleId)
    : null

  const movie = location.state?.movie || parsedMovie || fallbackMovie

  const extractPrimitiveValue = (value) => {
    if (value == null) return null
    if (typeof value !== 'object') return value

    return (
      extractPrimitiveValue(value.ratingValue) ??
      extractPrimitiveValue(value.aggregateRating) ??
      extractPrimitiveValue(value.value) ??
      extractPrimitiveValue(value.score) ??
      extractPrimitiveValue(value.voteCount) ??
      null
    )
  }

  const getTitle = () =>
    movie?.primaryTitle || movie?.title || movie?.originalTitle || 'Untitled'

  const getImage = () =>
    movie?.primaryImage?.url || movie?.image?.url || movie?.image || ''

  const getRating = () =>
    extractPrimitiveValue(movie?.rating) ??
    extractPrimitiveValue(movie?.aggregateRating) ??
    null

  const entries = movie
    ? Object.entries(movie).filter(([, value]) => {
        if (value == null) return false
        if (typeof value === 'object' && !Array.isArray(value)) return false
        return true
      })
    : []

  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-gray-950 to-gray-900 px-4 py-10 text-white'>
      <div className='mx-auto max-w-6xl'>
        <button
          type='button'
          onClick={() => navigate(-1)}
          className='mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/10'
        >
          Back
        </button>

        {!movie ? (
          <div className='rounded-3xl border border-white/10 bg-white/5 p-8'>
            <h1 className='text-3xl font-bold'>Title details not available</h1>
            <p className='mt-3 text-gray-300'>
              We could not find the title data for <span className='text-white'>{titleId}</span>.
              Go back and open the card again so the page can receive the API object.
            </p>
            <Link
              to='/browse/movies'
              className='mt-6 inline-flex rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500'
            >
              Browse titles
            </Link>
          </div>
        ) : (
          <div className='grid gap-8 lg:grid-cols-[320px_1fr]'>
            <div className='overflow-hidden  rounded-3xl border border-white/10 bg-white/5 shadow-2xl'>
              <img
                src={getImage()}
                alt={getTitle()}
                className='h-full w-full object-cover'
              />
            </div>

            <div className='space-y-6'>
              <div>
                <p className='text-sm uppercase tracking-[0.35em] text-red-400'>
                  Title Details
                </p>
                <h1 className='mt-3 text-4xl font-black'>{getTitle()}</h1>
                <div className='mt-4 flex flex-wrap gap-3 text-sm text-gray-300'>
                  {movie.year && <span>{movie.year}</span>}
                  {movie.releaseYear && <span>{movie.releaseYear}</span>}
                  {movie.titleType && <span>{movie.titleType}</span>}
                  {getRating() !== null && (
                    <span className='rounded-full bg-yellow-500/20 px-3 py-1 font-semibold text-yellow-300'>
                      Rating: {getRating()}
                    </span>
                  )}
                </div>
              </div>

              <div className='rounded-3xl border border-white/10 bg-white/5 p-6'>
                <h2 className='text-2xl font-bold'>Overview</h2>
                <p className='mt-3 leading-7 text-gray-300'>
                  {movie.description || movie.plot || movie.plotSummary || 'No description available from the API.'}
                </p>
              </div>

              {movie.genres && (
                <div className='rounded-3xl border border-white/10 bg-white/5 p-6'>
                  <h2 className='text-2xl font-bold'>Genres</h2>
                  <p className='mt-3 text-gray-300'>
                    {Array.isArray(movie.genres) ? movie.genres.join(', ') : String(movie.genres)}
                  </p>
                </div>
              )}

              <div className='rounded-3xl border border-white/10 bg-black/40 p-6'>
                <div className='mb-4 flex items-center justify-between'>
                  <h2 className='text-2xl font-bold'>All Available Details</h2>
                  <span className='text-sm text-gray-400'>API payload</span>
                </div>

                <div className='grid gap-3 sm:grid-cols-2'>
                  {entries.map(([key, value]) => (
                    <div
                      key={key}
                      className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3'
                    >
                      <p className='text-xs uppercase tracking-[0.25em] text-gray-400'>
                        {key}
                      </p>
                      <p className='mt-1 break-words text-sm text-white'>
                        {Array.isArray(value)
                          ? value.join(', ')
                          : typeof value === 'boolean'
                            ? String(value)
                            : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TitleDetails
