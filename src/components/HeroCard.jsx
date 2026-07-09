import React from 'react'
import img1 from '../assets/BG.jpg'
function HeroCard() {
  return (
    <section className='relative min-h-[70vh] overflow-hidden bg-black text-white shadow-2xl'>
      <img
        className='absolute inset-0 h-full w-full object-cover opacity-35'
        src={img1}
        alt='Background'
      />
      <div className='absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent' />
      <div className='relative z-10 flex min-h-[70vh] items-end p-8 sm:p-12 lg:p-16'>
        <div className='max-w-4xl'>
          <h1 className='text-4xl font-black tracking-tight sm:text-5xl'>
            Stream all your favorite movies and shows.
          </h1>
          <p className='mt-4 max-w-2xl text-base text-gray-300 sm:text-lg'>
            Browse handpicked categories, save titles to your list, and enjoy a premium Netflix-inspired experience.
          </p>
        </div>
      </div>
    </section>
  )
}

export default HeroCard
