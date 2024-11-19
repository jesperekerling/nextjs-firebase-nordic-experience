import React from 'react'
import Link from 'next/link'

function Footer() {
  return (
    <footer className='text-center p-10 bg-secondary dark:bg-primary'>
      <span className="font-semibold text-sm">© 2024 Nordic Experiences</span>
      <p className='pt-4 text-grey2 text-xs dark:text-white pb-40'>School project by <Link href="https://ekerling.com/" target='blank' className='font-semibold hover:opacity-80'>ekerling.com</Link></p>
    </footer>
  )
}

export default Footer