import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Nevbar from './components/Nevbar.jsx'
import Home from './pages/Home.jsx'
import TitleDetails from './pages/TitleDetails.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Profile from './pages/Profile.jsx'
import Search from './pages/Search.jsx'
import NotFound from './pages/404.jsx'

function App() {
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true))

  useEffect(() => {
    setIsVisible(false)
    const frame = requestAnimationFrame(() => setIsVisible(true))

    return () => cancelAnimationFrame(frame)
  }, [location.pathname])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className='bg-gray-900 min-h-screen'>
      <div className='fixed right-4 top-4 z-[60]'>
        <div
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur ${
            isOnline
              ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300'
              : 'border-red-400/30 bg-red-500/15 text-red-300'
          }`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-400'}`} />
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>
      <Nevbar />
      <div className='pt-16'>
        <div
          key={location.pathname}
          className={`transform transition-all duration-300 ease-out will-change-transform ${
            isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[0.985] opacity-0'
          }`}
        >
          <Routes location={location}>
            <Route path='/home' element={<Navigate to='/browse/movies' replace />} />
            <Route path='/browse/:category' element={<Home />} />
            <Route path='/title/:titleId' element={<TitleDetails />} />
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/search' element={<Search />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
