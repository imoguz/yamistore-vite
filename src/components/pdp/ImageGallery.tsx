import React, { useState } from 'react'
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
interface IImagePanelProps {
  images: string[]
}
const ImageGallery: React.FC<IImagePanelProps> = ({ images }) => {
  const imageURL = `${import.meta.env.VITE_CLOUDINARY_BASE_URL}`
  const [imageState, setImageState] = useState({ start: 0, active: 0 })

  const handleUpClick = () => {
    if (imageState.start > 0)
      setImageState({ ...imageState, start: imageState.start - 1 })
  }

  const handleDownClick = () => {
    if (images.length > imageState.start + 6)
      setImageState({ ...imageState, start: imageState.start + 1 })
  }

  const handleForwardClick = () => {
    if (imageState.active < images.length - 1) {
      if (imageState.start + 5 === imageState.active) {
        setImageState({
          start: imageState.start + 1,
          active: imageState.active + 1,
        })
      } else setImageState({ ...imageState, active: imageState.active + 1 })
    } else if (imageState.active === images.length - 1)
      setImageState({ start: 0, active: 0 })
  }

  const handleBackClick = () => {
    if (imageState.active > 0) {
      if (imageState.start === imageState.active) {
        setImageState({
          start: imageState.start - 1,
          active: imageState.active - 1,
        })
      } else setImageState({ ...imageState, active: imageState.active - 1 })
    } else if (imageState.active === 0)
      setImageState({
        start: images.length > 6 ? images.length - 6 : imageState.start,
        active: images.length - 1,
      })
  }

  if (images.length <= 0) return null

  return (
    <div className='flex gap-2.5 select-none'>
      <div className='h-[506] sm:h-[522px] w-[60px] flex flex-col gap-4'>
        <div
          onClick={handleUpClick}
          className='w-[60px] h-[25px] flex justify-center items-center bg-gray-50 hover:text-lg active:text-base cursor-pointer rounded-t'
        >
          <IoIosArrowUp />
        </div>
        <div className='h-[424] sm:h-[440px] flex flex-col gap-4'>
          {images
            .slice(imageState.start, imageState.start + 6)
            .map((image, index) => (
              <div
                key={index}
                className={`w-[60px] h-[60px] rounded-md overflow-hidden cursor-pointer border ${
                  index + imageState.start === imageState.active
                    ? 'border-blue-500'
                    : 'border-transparent'
                }`}
                onClick={() =>
                  setImageState({
                    ...imageState,
                    active: index + imageState.start,
                  })
                }
              >
                <img
                  className='w-full h-full object-fit'
                  src={imageURL + image}
                  alt={`image-${index}`}
                />
              </div>
            ))}
        </div>
        <div
          onClick={handleDownClick}
          className='w-[60px] h-[25px] flex justify-center items-center bg-gray-50 hover:text-lg active:text-base cursor-pointer rounded-b'
        >
          <IoIosArrowDown />
        </div>
      </div>
      <div className='relative h-[506] sm:h-[522px] w-full bg-blue-300 rounded overflow-hidden'>
        <img
          className='w-full h-full object-fill'
          src={imageURL + images[imageState.active]}
          alt='main-image'
        />
        <div className='absolute z-50 right-5 bottom-5 flex gap-2'>
          <div
            onClick={handleBackClick}
            className='w-9 h-9 bg-white shadow-sm rounded-full flex justify-center items-center hover:text-lg active:text-base cursor-pointer'
          >
            <IoIosArrowBack />
          </div>
          <div
            onClick={handleForwardClick}
            className='w-9 h-9 bg-white shadow-sm rounded-full flex justify-center items-center hover:text-lg active:text-base cursor-pointer'
          >
            <IoIosArrowForward />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageGallery
