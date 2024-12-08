import React from 'react'

const Sidebar = () => {
  return (
    <section className='bg-zinc-900 min-h-full w-[20%] absolute'>
    <div className='p-4 text-center h-20'>
      <h2 className='text-4xl font-semibold'>Stock<span className='text-yellow-500'>Dev</span></h2>
    </div>
    <div className='bg-yellow-300 p-2'>
      <ul className='bg-orange-400 flex flex-col gap-2'>
        <li className='p-2 bg-red-400'>      
          Dashboard
        </li>
        <li className='p-2 bg-red-400' > Article</li>
        <li className='p-2 bg-red-400' > Location</li>
        <li className='p-2 bg-red-400'>  Transactions</li>
        <li className='p-2 bg-red-400'>  Settings</li>
      </ul>
    </div>
    </section>
  )
}

export default Sidebar