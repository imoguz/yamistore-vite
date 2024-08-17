import React from 'react'
import { useNavigate } from 'react-router-dom'

interface ISlideCardProps {
  slide: IProduct
}

const SliderCard: React.FC<ISlideCardProps> = ({ slide }) => {
  const imageURL = `${import.meta.env.VITE_CLOUDINARY_BASE_URL}`
  const navigate = useNavigate()

  return (
    <div
      className='h-[296px] w-60 shadow-md border shadow-gray-300 rounded-md cursor-pointer'
      onClick={() =>
        navigate(`/pdp/${slide.slug}`, {
          state: { productId: slide._id },
        })
      }
    >
      <img
        src={imageURL + slide?.images[0]?.url}
        alt='product-image'
        className='w-full h-60 object-fill'
      />
      <div className='flex flex-col justify-center w-full h-14 px-2'>
        <p className='line-clamp-1'>{slide.name}</p>
        <div className='flex gap-2 text-md'>
          <span>
            $
            {(
              slide?.price -
              (slide && slide.discount.type === 'monetary'
                ? slide.discount.amount
                : (slide?.price * slide?.discount.amount) / 100)
            ).toFixed(2)}
          </span>

          <span className='text-gray-500 line-through'>${slide?.price}</span>

          <span className='text-green-500'>
            {slide?.discount.type === 'monetary' && '$'}
            {slide?.discount.amount}
            {slide?.discount.type === 'percentage' && '%'} off
          </span>
        </div>
      </div>
    </div>
  )
}

export default SliderCard
