import React from 'react'
import Link from 'next/link'

function Footer() {
  return (
    <footer className='text-center p-10'>
      © 2024 Nordic Experiences
      <p className='pt-4 text-grey2 text-sm'>School project by <Link href="https://ekerling.com/" target='blank' className='font-semibold'>ekerling.com</Link></p>
    </footer>
  )
}

export default Footer