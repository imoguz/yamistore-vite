import * as React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { readWishlist, deleteWishlist } from '../../features/wishlistSlice'
import ErrorPage from '../../pages/ErrorPage'
import { useNavigate } from 'react-router-dom'
import DotLoader from 'react-spinners/DotLoader'
import { IoClose } from 'react-icons/io5'
import { User } from 'firebase/auth'

interface IWishlistCardProps {
  item: IWishlist
  user: User | null
}
const WishlistCard: React.FC<IWishlistCardProps> = ({ item, user }) => {
  const dispatch = useAppDispatch()
  const { wishLoading, error } = useAppSelector((state) => state.wishlist)
  const navigate = useNavigate()

  const defaultVariant = item.product_id.variants.find(
    (variant) => variant.isDefault
  )
  const discount =
    item.product_id.discount.type === 'monetary'
      ? item.product_id.discount.amount
      : (item.product_id.price * item.product_id.discount.amount) / 100

  const handleDelete = async () => {
    if (user) {
      await dispatch(deleteWishlist(item._id))
      await dispatch(readWishlist(user.uid))
    }
  }

  const mainImages = item.product_id.images?.find((image) => image.isMainImage)
  const imageURL = `${import.meta.env.VITE_CLOUDINARY_BASE_URL}`

  if (error) {
    return <ErrorPage error={error} />
  }

  return (
    <div className='w-[46vw] xs:w-[265px] sm:w-[280px] h-[240px] xs:h-[290px] sm:h-[455px] shadow-md shadow-gray-400 border-gray-400 rounded relative'>
      {wishLoading && (
        <div className='fixed z-50 left-1/2 top-1/2 transform -translate-1/2 '>
          <DotLoader color='#1565C0' size={50} />
        </div>
      )}
      <IoClose
        className='absolute right-2 top-2 cursor-pointer text-xl text-gray-500 hover:text-gray-800 '
        onClick={handleDelete}
      />
      <img
        className='w-[46vw] xs:w-[265px] sm:w-[280px] h-[240px] xs:h-[290px] sm:h-[310px] object-cover'
        src={
          mainImages
            ? imageURL + '/' + mainImages.url
            : '/assets/noImageAvailable.jpg'
        }
        alt='wishImage'
      />

      <div className='px-2 py-1'>
        <p className='line-clamp-1'>{item.product_id.name}</p>
        <p>
          Color:{' '}
          {defaultVariant &&
            defaultVariant?.color_id.name[0].toUpperCase() +
              defaultVariant?.color_id.name.slice(1)}
        </p>
        <p>Size: {defaultVariant?.size_id.name}</p>
        <div className='flex gap-2'>
          {' '}
          Price:
          <span className='text-black'>
            ${(item.product_id?.price - discount).toFixed(2)}
          </span>
          <span className='text-gray-400 line-through'>
            {item.product_id?.price}
          </span>
          <span className='text-green-500'>
            {item.product_id?.discount.type === 'monetary' && '$'}
            {item.product_id?.discount.amount}
            {item.product_id?.discount.type === 'percentage' && '%'} off
          </span>
        </div>
      </div>
      <div>
        <div className='flex justify-center text-sm gap-3 px-3'>
          <button
            type='button'
            className='flex items-center justify-center gap-2 shadow-md hover:bg-red-50 active:shadow-sm hover:bg-opacity-95 w-40 text-red-700 h-8 border border-red-500 rounded transition-all'
          >
            ADD TO CART
          </button>
          <button
            type='button'
            onClick={() =>
              navigate(`/pdp/${item.product_id.slug}`, {
                state: { productId: item.product_id._id },
              })
            }
            className='flex items-center justify-center gap-2 shadow-md hover:bg-green-50 active:shadow-sm hover:bg-opacity-95 w-40 text-green-700 h-8 border border-green-500 rounded transition-all'
          >
            PRODUCT DETAIL
          </button>
        </div>
      </div>
    </div>
  )
}
export default WishlistCard
