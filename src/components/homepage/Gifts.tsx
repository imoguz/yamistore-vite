import { useNavigate } from 'react-router-dom'
import { readGifts } from '../../features/giftSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useEffect } from 'react'
import { FaCartShopping } from 'react-icons/fa6'

const Gifts = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { gifts } = useAppSelector((state) => state.gift)
  const imageURL = `${import.meta.env.VITE_CLOUDINARY_BASE_URL}`

  useEffect(() => {
    const readGiftFn = async () => {
      await dispatch(readGifts())
    }
    readGiftFn()
  }, [dispatch])

  return (
    <div>
      <p className='text-2xl font-semibold mb-4 mx-3'>Gifts</p>
      <div className='flex flex-wrap lg:flex-nowrap w-full gap-3 justify-center'>
        {gifts.map((item) => (
          <div
            className='relative h-[400px] w-full sm:w-[48%] lg:w-1/3'
            key={item._id}
          >
            <img
              src={imageURL + item.image_url}
              alt={item.label}
              className='h-full w-full object-fill'
            />
            <div className='absolute bottom-7 px-5 flex flex-col gap-3'>
              <p
                style={{
                  color: item.hex_code,
                  fontSize: 28,
                }}
                className='font-semibold'
              >
                {item.label}
              </p>
              <p style={{ color: item.hex_code, fontSize: 20 }}>
                {item.description}
              </p>
              <button
                type='button'
                onClick={() => navigate(`shop/${item.path}`)}
                className='flex items-center justify-center gap-3 shadow hover:shadow-md active:shadow-sm hover:bg-opacity-95 w-28 h-9 rounded-full bg-red-600 text-white transition-all'
              >
                <FaCartShopping />
                SHOP
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Gifts
