import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  return (
    <div className='flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white'>
      <div className='w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur'>
        <p className='text-sm uppercase tracking-[0.35em] text-red-400'>Account</p>
        <h1 className='mt-4 text-3xl font-black'>Sign In</h1>
        <p className='mt-3 text-gray-300'>
          This is a frontend-only login screen. It does not connect to any backend.
        </p>

        <form className='mt-8 space-y-5'>
          <div>
            <label className='mb-2 block text-sm font-semibold text-gray-300' htmlFor='email'>
              Email
            </label>
            <input
              id='email'
              type='email'
              className='w-full rounded-2xl border border-white/10 bg-gray-900 px-4 py-3 text-white outline-none focus:border-red-600'
              placeholder='you@example.com'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-semibold text-gray-300' htmlFor='password'>
              Password
            </label>
            <input
              id='password'
              type='password'
              className='w-full rounded-2xl border border-white/10 bg-gray-900 px-4 py-3 text-white outline-none focus:border-red-600'
              placeholder='Enter your password'
            />
          </div>

          <button
            type='button'
            onClick={() => navigate('/profile')}
            className='w-full rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500'
          >
            Sign In
          </button>
        </form>

        <p className='mt-6 text-sm text-gray-400'>
          Don&apos;t have an account?{' '}
          <Link className='text-red-400 hover:text-red-300' to='/signup'>
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
