import React from 'react'
import Link from 'next/link';


function HousingList() {
  return (
    <div>
        <section className="text-center">
            <p className="mb-5">
                <Link href="/cart" className="text-primary font-semibold bg-primary px-5 py-2 text-xs text-white rounded-3xl hover:opacity-80">
                    Skip housing
                </Link>
            </p>
            <h1 className="text-2xl font-bold">Housing</h1>
            <p className="text-grey2 dark:text-gray-200 py-3">Select a housing option from our list. (optional)</p>

        </section>
    </div>
  )
}

export default HousingList