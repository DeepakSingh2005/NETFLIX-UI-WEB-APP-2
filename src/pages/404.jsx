import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-black px-4 text-white'>
      <div className='max-w-xl text-center'>
        <p className='text-sm uppercase tracking-[0.4em] text-red-400'>404</p>
        <h1 className='mt-4 text-4xl font-black'>Page not found</h1>
        <p className='mt-4 text-gray-300'>
          The page you were looking for does not exist or was moved.
        </p>
        <Link
          to='/browse/movies'
          className='mt-8 inline-flex rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500'
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
