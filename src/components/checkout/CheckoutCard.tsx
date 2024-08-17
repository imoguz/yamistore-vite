import React, { useState } from 'react'
import { updateCart, readCart, deleteCart } from '../../features/cartSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { createWishlist, readWishlist } from '../../features/wishlistSlice'
import { useNavigate } from 'react-router-dom'
import ErrorPage from '../../pages/ErrorPage'
import DotLoader from 'react-spinners/DotLoader'
import { FaRegCircleCheck } from 'react-icons/fa6'
import { MdErrorOutline } from 'react-icons/md'
import { MdEdit } from 'react-icons/md'
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md'
import { MdDeleteOutline } from 'react-icons/md'
import { User } from 'firebase/auth'
import BounceLoader from 'react-spinners/BounceLoader'

interface ICheckoutCardProps {
  item: ICart
  user: User | null
}
const CheckoutCard: React.FC<ICheckoutCardProps> = ({ item, user }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { wishlist, wishLoading } = useAppSelector((state) => state.wishlist)
  const [quantity, setQuantity] = useState<number>(item.quantity)
  const [currentItemID, setCurrentItemID] = useState<null | string>(null)
  const [deletedItem, setDeletedItem] = React.useState<string | null>(null)
  const { loading, error } = useAppSelector((state) => state.cart)
  const imageURL = `${import.meta.env.VITE_CLOUDINARY_BASE_URL}`
  const discount =
    item.product_id.discount.type === 'monetary'
      ? item.product_id.discount.amount
      : (item.product_id.price * item.product_id.discount.amount) / 100

  const handleQuantity = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setQuantity(+event.target.value)
    await dispatch(
      updateCart({
        updateCartItem: {
          data: { quantity: +event.target.value },
          cartId: item._id,
        },
      })
    )

    await dispatch(readCart(item.user_id))
  }

  const handleClickWishlist = async (id: string) => {
    if (user) {
      setCurrentItemID(id)
      const newWishlist: INewWishlist = {
        user_id: user.uid,
        product_id: item.product_id._id,
      }
      await dispatch(createWishlist({ newWishlist }))
      await dispatch(readWishlist(user.uid))
    }
    setCurrentItemID(null)
  }
  console.log(item)
  const handleDeleteCartItem = async () => {
    setDeletedItem(item._id)
    await dispatch(deleteCart(item._id))
    await dispatch(readCart(item.user_id))
  }

  if (error) {
    return <ErrorPage error={error} />
  }

  return (
    <div className='flex flex-col sm:flex-row w-full h-min-[160px] p-0.5 bg-white border border-gray-100 rounded shadow-md shadow-gray-400 hover:shadow-red-500'>
      {loading && deletedItem === item._id && (
        <div className='fixed z-50 left-1/2 top-1/2 transform -translate-1/2 '>
          <DotLoader color='#1565C0' size={50} />
        </div>
      )}
      <div className='w-max-[150px] w-min-[120px] h-[160px] p-1'>
        <img
          className='h-full w-full object-contain'
          src={imageURL + '/' + item.variant_id.image_url}
          alt='product-image'
        />
      </div>

      <div className='w-max-[520px] w-min-[400px] py-1 px-3 sm:px-1'>
        <p className='text-lg font-semibold'>{item.product_id.name}</p>
        <p>Size: {item.variant_id.size_id.name}</p>
        <p>
          Color:{' '}
          {item?.variant_id?.color_id?.name[0]?.toUpperCase() +
            item?.variant_id?.color_id?.name?.slice(1)}
        </p>
        <p>
          Item Price: ${(item.product_id.price - discount).toFixed(2)}
          <span className='pl-2 text-gray-700 line-through'>
            ${item.product_id.price}
          </span>
        </p>
        <div className='flex items-center gap-10 px-10 mt-2'>
          <div className='flex mt-0.5 gap-1 items-center'>
            <label htmlFor='quantity' className=' text-gray-700'>
              Quantity:
            </label>
            <select
              id='quantity'
              value={quantity}
              onChange={(event) => handleQuantity(event)}
              className='w-16 h-8 border-gray-400 rounded border text-center outline-none hover:border-gray-500 cursor-pointer'
            >
              {[...Array(10)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
          <div className='flex gap-1 h-50'>
            {item.variant_id.stock > 0 ? (
              item.variant_id.stock >= quantity ? (
                <>
                  <FaRegCircleCheck className='text-green-500 text-lg mt-1' />
                  In stock
                </>
              ) : (
                <>
                  <MdErrorOutline className='text-yellow-600 text-lg mt-1' />
                  Insufficient stock, only {item.variant_id.stock} remaining.
                </>
              )
            ) : (
              <>
                <MdErrorOutline className='text-red-500 text-lg mt-1' />
                Out of stock
              </>
            )}
          </div>
        </div>
      </div>

      <div className='w-full sm:w-[130px] h-full flex flex-row sm:flex-col justify-between'>
        <div className='flex justify-around items-center text-xl'>
          <button
            type='button'
            onClick={handleDeleteCartItem}
            className='relative flex justify-center items-center w-9 h-9 rounded-full hover:bg-gray-200 transition-colors duration-300'
          >
            <MdDeleteOutline className='text-orange-700' />
          </button>

          <button
            type='button'
            className='relative flex justify-center items-center w-9 h-9 rounded-full hover:bg-gray-200 transition-colors duration-300'
            onClick={() =>
              navigate(`/pdp/${item.product_id.slug}`, {
                state: {
                  productId: item.product_id._id,
                  variantId: {
                    ...item.variant_id,
                    quantity,
                    cartId: item._id,
                  },
                },
              })
            }
          >
            <MdEdit className='text-blue-500' />
          </button>

          <button
            type='button'
            className='relative flex justify-center items-center w-9 h-9 rounded-full hover:bg-gray-200 transition-colors duration-300'
            onClick={() => handleClickWishlist(item._id)}
          >
            {wishLoading && item._id === currentItemID ? (
              <BounceLoader size={20} color='#EF4444' />
            ) : wishlist.find(
                (wish) =>
                  wish.user_id === item.user_id &&
                  wish.product_id._id === item.product_id._id
              ) ? (
              <MdFavorite className='text-red-500' />
            ) : (
              <MdFavoriteBorder className='text-red-500' />
            )}
          </button>
        </div>
        <div className='px-3 sm:px-0 text-lg mb-2 text-center'>
          <p>Item Total</p>
          <span>
            ${((item.product_id.price - discount) * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CheckoutCard
