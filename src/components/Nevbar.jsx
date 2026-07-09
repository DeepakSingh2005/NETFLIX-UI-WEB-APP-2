import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Search from '../assets/search.svg'
function Nevbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmedQuery = searchQuery.trim()
    if (trimmedQuery) {
      navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`)
    } else {
      navigate('/search')
    }
  }

  return (
    <nav className='bg-transparent bg-opacity-75 fixed w-full top-0 z-50 transition-all duration-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          
          
          <Link to='/' className='flex-shrink-0'>
            <span className='text-red-600 font-bold text-2xl'>NETFLIX</span>
          </Link>

         
          <div className='hidden md:flex gap-8'>
            <Link to='/browse/movies' className='text-gray-300 hover:text-white transition duration-200 text-sm font-medium'>
              Home
            </Link>
            <Link to='/browse/series' className='text-gray-300 hover:text-white transition duration-200 text-sm font-medium'>
              Series
            </Link>
            <Link to='/browse/movies' className='text-gray-300 hover:text-white transition duration-200 text-sm font-medium'>
              Films
            </Link>
            
            <Link to='/profile' className='text-gray-300 hover:text-white transition duration-200 text-sm font-medium'>
              Profile
            </Link>
          </div>

         
          <form onSubmit={handleSearch} className='flex items-center'>
            <input
              type='text'
              placeholder='Search...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='bg-gray-700 text-white px-11 py-2 rounded text-sm focus:outline-none focus:bg-gray-600 transition'
            />
            <button  type='submit' className='ml-2   text-gray-300 hover:text-white'>
             <img className='h-10 w-7  ' src={Search} alt="" />
              
            </button>
          </form>

          <div className='ml-4 hidden items-center gap-3 md:flex'>
            <Link
              to='/login'
              className='rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/10 hover:text-white'
            >
              Login
            </Link>
            <Link
              to='/profile'
              className='rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/10 hover:text-white'
            >
              Profile
            </Link>
            <Link
              to='/signup'
              className='rounded-full bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-500'
            >
              Sign Up
            </Link>
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Nevbar
