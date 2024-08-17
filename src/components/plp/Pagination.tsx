import React, { useEffect } from 'react'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { MdKeyboardArrowRight } from 'react-icons/md'

interface IPaginationProps {
  productData: IProductData | null
  rightColumn: React.RefObject<HTMLDivElement>
  setPage: React.Dispatch<React.SetStateAction<number>>
}

const Pagination: React.FC<IPaginationProps> = ({
  productData,
  rightColumn,
  setPage,
}) => {
  const { pages } = productData || {}

  useEffect(() => {
    if (rightColumn.current) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      rightColumn.current.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pages, rightColumn])

  if (!pages || pages.total <= 1) return null

  const pagination: Array<number | string> = []

  if (pages?.total <= 7) {
    pagination.push(
      ...Array.from({ length: pages.total }, (_, index) => index + 1)
    )
  } else {
    if (pages.current < 5) {
      pagination.push(1, 2, 3, 4, 5, '...', pages.total)
    } else if (pages.current > pages.total - 4) {
      pagination.push(
        1,
        '...',
        pages.total - 4,
        pages.total - 3,
        pages.total - 2,
        pages.total - 1,
        pages.total
      )
    } else {
      pagination.push(
        1,
        '...',
        pages.current - 1,
        pages.current,
        pages.current + 1,
        '...',
        pages.total
      )
    }
  }

  const handlePageClick = (item: number | string) => {
    if (item !== '...') setPage(Number(item))
  }

  const handleNextClick = () => {
    if (pages.current < pages.total) setPage(pages.current + 1)
  }

  const handlePrevClick = () => {
    if (pages.current > 1) setPage(pages.current - 1)
  }

  return (
    <div className='flex justify-center items-center gap-2'>
      <div
        onClick={handlePrevClick}
        className={`w-8 h-8 flex justify-center items-center rounded-full ${
          pages.current === 1
            ? 'text-gray-400 cursor-default'
            : 'cursor-pointer hover:bg-gray-200 active:bg-gray-300 transition-colors'
        }`}
      >
        <MdKeyboardArrowLeft className='text-2xl' />
      </div>
      {pagination.map((item, index) => (
        <div
          key={index}
          className={`
          ${
            item === pages.current
              ? 'bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-400'
              : 'bg-white'
          }
          ${
            item === '...'
              ? 'cursor-default'
              : 'cursor-pointer border w-8 h-8 flex justify-center items-center rounded-full'
          }
          ${item !== '...' && item !== pages.current && 'hover:bg-gray-200'}
          transition-colors
        `}
          onClick={() => handlePageClick(item)}
        >
          {item}
        </div>
      ))}
      <div
        onClick={handleNextClick}
        className={`w-8 h-8 flex justify-center items-center rounded-full ${
          pages.current === pages.total
            ? 'text-gray-400 cursor-default'
            : 'cursor-pointer hover:bg-gray-200 active:bg-gray-300 transition-colors'
        }`}
      >
        <MdKeyboardArrowRight className='text-2xl' />
      </div>
    </div>
  )
}

export default Pagination
