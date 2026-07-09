import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTitleKey, readWatchlist, saveWatchlist } from '../utils/watchlist.js'

function Profile() {
  const navigate = useNavigate()
  const [watchlist, setWatchlist] = useState([])

  useEffect(() => {
    setWatchlist(readWatchlist())
  }, [])

  const handleRemove = (item) => {
    const next = watchlist.filter((movie) => getTitleKey(movie) !== getTitleKey(item))
    setWatchlist(next)
    saveWatchlist(next)
  }

  const handleClear = () => {
    setWatchlist([])
    saveWatchlist([])
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-gray-950 to-gray-900 px-4 py-10 text-white'>
      <div className='mx-auto max-w-5xl'>
        <div className='rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur'>
          <p className='text-sm uppercase tracking-[0.35em] text-red-400'>Profile</p>
          <h1 className='mt-4 text-4xl font-black'>Your Watchlist</h1>
          <p className='mt-3 text-gray-300'>
            Titles saved with the plus button will appear here.
          </p>

          <div className='mt-8 grid gap-4 sm:grid-cols-2'>
            <div className='rounded-2xl border border-white/10 bg-black/30 p-5'>
              <p className='text-xs uppercase tracking-[0.2em] text-gray-400'>Saved Titles</p>
              <p className='mt-2 text-lg font-semibold text-white'>{watchlist.length}</p>
            </div>

            <div className='rounded-2xl border border-white/10 bg-black/30 p-5'>
              <p className='text-xs uppercase tracking-[0.2em] text-gray-400'>Storage</p>
              <p className='mt-2 text-lg font-semibold text-white'>Local browser</p>
            </div>
          </div>

          <div className='mt-8'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-2xl font-bold'>Saved Items</h2>
              <button
                type='button'
                onClick={handleClear}
                className='rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/10'
              >
                Clear All
              </button>
            </div>

            {watchlist.length === 0 ? (
              <div className='rounded-2xl border border-dashed border-white/15 bg-black/30 p-6 text-gray-300'>
                Click the `+` button on any movie or series card to save it here.
              </div>
            ) : (
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {watchlist.map((item) => (
                  <div key={getTitleKey(item)} className='rounded-2xl border border-white/10 bg-black/30 p-4'>
                    <h3 className='font-semibold text-white'>
                      {item.primaryTitle || item.title || 'Untitled'}
                    </h3>
                    <p className='mt-1 text-sm text-gray-400'>
                      {item.titleType || item.type || 'Saved title'}
                    </p>
                    <button
                      type='button'
                      onClick={() => handleRemove(item)}
                      className='mt-4 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-gray-200 transition hover:bg-white/10'
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
            <button
              type='button'
              onClick={() => navigate('/browse/movies')}
              className='rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500'
            >
              Continue Watching
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
