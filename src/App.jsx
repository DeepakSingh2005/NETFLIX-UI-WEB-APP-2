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

  useEffect(() => {
    setIsVisible(false)
    const frame = requestAnimationFrame(() => setIsVisible(true))

    return () => cancelAnimationFrame(frame)
  }, [location.pathname])

  return (
    <div className='bg-gray-900 min-h-screen'>
      <Nevbar />
      <div className='pt-16'>
        <div
          key={location.pathname}
          className={`transform transition-all duration-300 ease-out will-change-transform ${
            isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[0.985] opacity-0'
          }`}
        >
          <Routes location={location}>
            <Route path='/' element={<Navigate to='/browse/movies' replace />} />
            <Route path='/browse/:category' element={<Home />} />
            <Route path='/title/:titleId' element={<TitleDetails />} />
            <Route path='/login' element={<Login />} />
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
