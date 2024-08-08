import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
<footer>
  <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="sm:flex sm:items-center sm:justify-between">
      <div className="flex justify-center text-teal-600 sm:justify-start">
      <Link className="flex items-center text-primary" href="/">
          <img
            src="./mint-logo.png"
            alt="mint-mania-logo"
            className="w-9"
          />
          <span className="text-4xl ml-2">MINT MANIA</span>
        </Link>
      </div>

      <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
        Copyright &copy; 2024. All rights reserved.
      </p>
    </div>
  </div>
</footer>
  )
}

export default Footer