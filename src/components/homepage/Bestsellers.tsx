import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { readProducts } from '../../features/productSlice'
import SliderCard from './SliderCard'
import { MdArrowForwardIos, MdArrowBackIosNew } from 'react-icons/md'
import { GoDotFill } from 'react-icons/go'

const Bestsellers = () => {
  const dispatch = useAppDispatch()
  const { products } = useAppSelector((state) => state.products)
  const [sliderData, setSliderData] = useState<IProduct[]>([])
  const [startIndex, setStartIndex] = useState(0)
  const [slidesPerView, setSlidesPerView] = useState(
    Math.min(Math.floor(window.innerWidth / 290), 5)
  )

  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(Math.min(Math.floor(window.innerWidth / 290), 5))
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(readProducts())
    }

    fetchProducts()
  }, [dispatch])

  useEffect(() => {
    if (products && products.data.length > 0) {
      const visibleItems = products.data.slice(
        startIndex,
        startIndex + slidesPerView
      )
      if (visibleItems.length < slidesPerView) {
        visibleItems.push(
          ...products.data.slice(0, slidesPerView - visibleItems.length)
        )
      }
      setSliderData(visibleItems)
    }
  }, [products, startIndex, slidesPerView])

  useEffect(() => {
    if (products && products.data.length > 0) {
      const interval = setInterval(() => {
        setStartIndex((prev) =>
          prev + slidesPerView >= products.data.length ? 0 : prev + 1
        )
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [products, slidesPerView])

  const handlePrev = () => {
    if (products && products.data.length > 0) {
      setStartIndex((prev) =>
        prev - 1 < 0 ? products.data.length - 1 : prev - 1
      )
    }
  }

  const handleNext = () => {
    if (products && products.data.length > 0) {
      setStartIndex((prev) => (prev + 1 >= products.data.length ? 0 : prev + 1))
    }
  }

  return (
    <React.Fragment>
      <p className='text-2xl font-semibold mb-4 mx-3'>Bestsellers</p>
      <div className='w-full h-80 flex items-center select-none'>
        <MdArrowBackIosNew
          className='h-20 text-2xl w-10 ml-1 rounded-l-md hover:bg-gray-800  text-gray-400 hover:text-gray-100 active:text-gray-400 cursor-pointer transition-colors duration-300'
          onClick={handlePrev}
        />
        <div className='flex h-full flex-1 justify-center items-center gap-10'>
          {sliderData.length > 0 &&
            sliderData.map((slide) => (
              <SliderCard key={slide._id} slide={slide} />
            ))}
        </div>
        <MdArrowForwardIos
          className='h-20 text-2xl w-10 mr-1 rounded-r-md hover:bg-gray-800 text-gray-400 hover:text-gray-100 active:text-gray-400 cursor-pointer transition-colors duration-300'
          onClick={handleNext}
        />
      </div>
      <div className='flex gap-0.5 justify-center'>
        {sliderData &&
          [...Array(sliderData.length)].map((_, index) => (
            <GoDotFill
              key={index}
              onClick={() => setStartIndex(index)}
              className={`cursor-pointer  ${
                index === startIndex ? 'text-blue-500' : 'text-gray-300'
              }`}
            />
          ))}
      </div>
    </React.Fragment>
  )
}

export default Bestsellers
