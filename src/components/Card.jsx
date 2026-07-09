import React, { useState } from 'react'

function Card({ image, title, rating, onClick, onWatchlistToggle, isSaved }) {
  const [isHovered, setIsHovered] = useState(false)
  const fallbackImage = 'https://via.placeholder.com/400x600/111827/FFFFFF?text=No+Image'

  const extractPrimitiveRating = (value) => {
    if (value == null) return null
    if (typeof value !== 'object') return value

    return (
      extractPrimitiveRating(value.ratingValue) ??
      extractPrimitiveRating(value.aggregateRating) ??
      extractPrimitiveRating(value.value) ??
      extractPrimitiveRating(value.score) ??
      extractPrimitiveRating(value.voteCount) ??
      null
    )
  }

  const displayRating = extractPrimitiveRating(rating)

  return (
    <div
      className='group relative h-72 w-48 cursor-pointer overflow-hidden rounded-lg'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <img
        src={image || fallbackImage}
        alt={title}
        className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
      />

      {isHovered && (
        <div className='absolute inset-0 flex flex-col justify-end bg-black/60 p-4 transition-opacity duration-300'>
          <h3 className='mb-2 text-lg font-bold text-white line-clamp-2'>{title}</h3>

          {displayRating !== undefined && displayRating !== null && (
            <div className='mb-3 flex items-center space-x-2'>
              <span className='text-sm font-semibold text-yellow-400'>
                Rating: {displayRating}
              </span>
            </div>
          )}

          <div className='flex justify-center space-x-3'>
            <button className='rounded bg-white px-6 py-2 text-sm font-bold text-black transition hover:bg-gray-200'>
              Play
            </button>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                onWatchlistToggle?.()
              }}
              className='rounded border-2 border-gray-400 px-4 py-2 text-sm text-white transition hover:border-white'
            >
              {isSaved ? '✓' : '+'}
            </button>
          </div>
        </div>
      )}

      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 group-hover:hidden'>
        <p className='text-sm font-semibold text-white line-clamp-2'>{title}</p>
      </div>
    </div>
  )
}

export default Card
