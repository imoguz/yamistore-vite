import React from 'react'
import { MdErrorOutline } from 'react-icons/md'
import { IoMdHome } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
interface IError {
  error: string
}
const ErrorPage: React.FC<IError> = ({ error }) => {
  const navigate = useNavigate()

  return (
    <div>
      <div className='flex items-center gap-1 px-1 py-0.5 bg-red-500'>
        <MdErrorOutline className='text-white' />
        <p className='text-white'>Error</p>
      </div>
      <p className='mt-2 px-2'>{error}</p>

      <div className='flex justify-around my-3'>
        <button
          type='button'
          onClick={() => navigate(-1)}
          className='flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg active:shadow-md hover:bg-opacity-95 w-[150px] h-10 bg-gray-50 hover:bg-gray-100 transition-all'
        >
          <IoArrowBack />
          Go Back
        </button>
        <button
          type='button'
          onClick={() => navigate(`/`)}
          className='flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg active:shadow-md text-green-500 hover:bg-opacity-95 w-[150px] h-10 bg-gray-50 hover:bg-gray-100 transition-all'
        >
          <IoMdHome />
          Main Page
        </button>
      </div>
    </div>
  )
}

export default ErrorPage
