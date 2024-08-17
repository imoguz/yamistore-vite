import { useEffect, useState } from 'react'
import { readBanners } from '../../features/bannerSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { FaCartShopping } from 'react-icons/fa6'
import { FiMinus } from 'react-icons/fi'
import { MdArrowForwardIos, MdArrowBackIosNew } from 'react-icons/md'

function Banner() {
  const dispatch = useAppDispatch()
  const { banners } = useAppSelector((state) => state.banner)
  const [activeIndex, setActiveIndex] = useState(0)
  const imageURL = `${import.meta.env.VITE_CLOUDINARY_BASE_URL}`

  useEffect(() => {
    const readBannerFn = async () => {
      await dispatch(readBanners())
    }
    readBannerFn()
  }, [dispatch])

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [banners])

  return (
    <>
      {banners.length > 0 && (
        <div className='relative w-full h-[300px] sm:h-[400px] md:h-[475px] lg:h-[550px]'>
          <div
            className='w-full h-full'
            style={{
              backgroundImage: `url(${
                imageURL + banners[activeIndex].image_url
              })`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              objectFit: 'cover',
              transition: 'background-image 0.3s ease-in',
            }}
          />
          <div className='absolute inset-y-0 flex items-center justify-between w-full px-10 text-3xl '>
            <MdArrowBackIosNew
              className='cursor-pointer text-white opacity-50 hover:opacity-100 active:opacity-75'
              onClick={() =>
                setActiveIndex(
                  activeIndex === 0 ? banners.length - 1 : activeIndex - 1
                )
              }
            />
            <MdArrowForwardIos
              className='cursor-pointer text-white opacity-50 hover:opacity-100 active:opacity-75'
              onClick={() =>
                setActiveIndex(
                  activeIndex === banners.length - 1 ? 0 : activeIndex + 1
                )
              }
            />
          </div>
          <div className='absolute bottom-5 flex flex-col justify-center gap-2 items-center w-full text-white'>
            <p className='text-3xl font-semibold'>
              {banners[activeIndex].label}
            </p>
            <p>{banners[activeIndex].description}</p>
            <button
              type='button'
              className='flex items-center justify-center gap-3 shadow hover:shadow-md active:shadow-sm hover:bg-opacity-95 w-36 h-9 rounded bg-red-600 text-white transition-all'
            >
              <FaCartShopping />
              SHOP NOW
            </button>
            <div className='flex gap-1'>
              {banners &&
                [...Array(banners.length)].map((_, index) => (
                  <FiMinus
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`text-5xl cursor-pointer  ${
                      index === activeIndex ? 'text-white' : 'text-gray-300'
                    }`}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Banner
