import React, { useEffect, useState } from 'react'
import { createCart, readCart, updateCart } from '../features/cartSlice'
import { createWishlist, readWishlist } from '../features/wishlistSlice'
import { readSingleProduct } from '../features/productSlice'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { useUser } from './../contexts/UserContext'
import { FaBagShopping, FaRegCircleCheck } from 'react-icons/fa6'
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md'
import { IoWarningOutline } from 'react-icons/io5'
import { MdErrorOutline } from 'react-icons/md'
import ColorsAndSizes from '../components/pdp/ColorsAndSizes'
import AddCartDialog from '../components/pdp/AddCartDialog'
import ImageGallery from '../components/pdp/ImageGallery'
import StarRating from '../components/pdp/StarRating'
import DotLoader from 'react-spinners/DotLoader'
import ErrorPage from './ErrorPage'

const ProductDetailPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { user } = useUser()
  const { productId, variantId } = location?.state || {}
  const { product, loading, error } = useAppSelector((state) => state.products)
  const { wishlist } = useAppSelector((state) => state.wishlist)
  const [quantity, setQuantity] = useState(variantId ? variantId.quantity : 1)
  const [openDialog, setOpenDialog] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [selectedVariant, setSelectedVariant] =
    useState<ISelectedVariant | null>(null)

  useEffect(() => {
    const readFn = async () => {
      await dispatch(readSingleProduct(productId))
    }
    readFn()
  }, [dispatch, productId])

  useEffect(() => {
    if (variantId) {
      setSelectedVariant({
        variantId: variantId._id,
        color: variantId.color_id.hex_code,
        size: variantId.size_id.name,
        colorName: variantId.color_id.name,
        stock: variantId.stock,
        image: variantId.image_url,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  useEffect(() => {
    // Set the images of the product for Image Panel
    const productimage = product?.images?.map((item) => item.url) ?? []

    if (selectedVariant && selectedVariant.image && productimage.length > 0) {
      setImages([...productimage, selectedVariant.image])
    } else if (productimage.length > 0) {
      setImages(productimage)
    }
  }, [product, selectedVariant])

  if (loading) {
    return (
      <div className='fixed z-50 left-1/2 top-1/2 transform -translate-1/2 '>
        <DotLoader color='#1565C0' size={50} />
      </div>
    )
  }

  if (error) {
    return <ErrorPage error={error} />
  }

  const handleAddCart = async () => {
    if (user && product && selectedVariant?.variantId) {
      const newCart: INewCart = {
        user_id: user?.uid,
        product_id: product?._id,
        variant_id: selectedVariant?.variantId,
        quantity,
        status: 'pending',
        orderDate: new Date(),
      }
      console.log('newCart', newCart)
      console.log('variantId', variantId)
      if (variantId) {
        await dispatch(
          updateCart({
            updateCartItem: {
              data: { ...newCart },
              cartId: variantId.cartId,
            },
          })
        )
      } else await dispatch(createCart({ newCart }))

      await dispatch(readCart(user?.uid))
    }

    if (variantId) navigate(-1)
    else setOpenDialog(true)
  }

  const handleAddWishlist = async () => {
    if (product && user) {
      const newWishlist: INewWishlist = {
        user_id: user?.uid,
        product_id: product._id,
      }
      await dispatch(createWishlist({ newWishlist }))
      await dispatch(readWishlist(user?.uid))
    } else if (!user) navigate('sign-in')
  }

  const rating: number = 2.1
  console.log('selected', selectedVariant)
  console.log(product)
  console.log(user?.uid)
  return (
    <React.Fragment>
      <div className='flex flex-col md:flex-row justify-between md:h-[calc(100vh-96px)] w-full max-w-[1200px] mx-auto'>
        {/* left column - image gallery */}
        <div className='w-full md:w-[700px] md:min-w-[500px] md:overflow-y-auto custom-scrollbar p-2 order-2 md:order-1'>
          <ImageGallery images={images} />
        </div>
        {/* right column - product detail*/}
        <div className='w-full md:max-w-[500px] md:overflow-y-auto px-2 custom-scrollbar order-1 md:order-2'>
          <div className='flex flex-col gap-1 text-lg'>
            <h3 className='text-gray-800 font-semibold'>{product?.name}</h3>
            <div className='flex flex-wrap gap-2'>
              <StarRating rating={rating} />
              <span className='text-base'>| 125 Reviews</span>
            </div>
            {product && (
              <div className='flex gap-3 text-md'>
                <span>
                  $
                  {(
                    product?.price -
                    (product && product.discount.type === 'monetary'
                      ? product.discount.amount
                      : (product?.price * product?.discount.amount) / 100)
                  ).toFixed(2)}
                </span>
                <span className='text-gray-500 line-through'>
                  ${product?.price}
                </span>
                <span className='text-green-500'>
                  {product?.discount.type === 'monetary' && '$'}
                  {product?.discount.amount}
                  {product?.discount.type === 'percentage' && '%'} off
                </span>
              </div>
            )}
          </div>
          <hr className='my-3' />
          <div>
            <ColorsAndSizes {...{ selectedVariant, setSelectedVariant }} />
          </div>
          <hr className='my-3' />
          <div className='flex gap-3 lg:gap-5 px-0 lg:px-5 my-8'>
            <select
              value={quantity}
              onChange={(event) => {
                setQuantity(+event.target.value)
              }}
              className='w-20 h-10 border-gray-400 border text-center outline-none hover:border-gray-500 cursor-pointer'
            >
              {[...Array(10)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
            <button
              type='button'
              onClick={handleAddCart}
              disabled={
                selectedVariant?.stock && selectedVariant?.stock < quantity
                  ? true
                  : false
              }
              className={`flex items-center justify-center gap-2 font-semibold text-white shadow-md  w-full h-10 transition-all ${
                selectedVariant?.stock && selectedVariant?.stock >= quantity
                  ? 'bg-red-600 active:shadow-md hover:bg-opacity-95 hover:shadow-lg'
                  : 'bg-gray-300'
              }   `}
            >
              <FaBagShopping className='text-white' />
              {variantId ? 'Update Item' : 'Add to Bag'}
            </button>
            <button
              type='button'
              onClick={handleAddWishlist}
              className='flex items-center justify-center gap-2 shadow-md hover:bg-blue-50 active:shadow-sm hover:bg-opacity-95 w-12 text-blue-500 h-10 border border-blue-400 rounded transition-all'
            >
              {wishlist &&
              wishlist.find(
                (item) =>
                  item?.user_id === user?.uid &&
                  item?.product_id?._id === product?._id
              ) ? (
                <MdFavorite className='text-lg text-red-500' />
              ) : (
                <MdFavoriteBorder className='text-lg' />
              )}
            </button>
          </div>
          <div className='flex items-center gap-2 mt-2 pl-5'>
            {selectedVariant && selectedVariant.stock ? (
              selectedVariant.stock > 0 ? (
                selectedVariant.stock >= quantity ? (
                  <>
                    <FaRegCircleCheck className='text-green-500' />
                    <p>In stock</p>
                  </>
                ) : (
                  <>
                    <p className='flex gap-1'>
                      <MdErrorOutline className='text-yellow-600 text-2xl' />
                      Insufficient stock available. Only {selectedVariant.stock}
                      remaining.
                    </p>
                  </>
                )
              ) : (
                <>
                  <IoWarningOutline className='text-red-600' />
                  <p>Out of stock</p>
                </>
              )
            ) : (
              <>
                <IoWarningOutline className='text-red-600' />
                <p>Not available</p>
              </>
            )}
          </div>
        </div>
      </div>
      <AddCartDialog
        {...{ openDialog, setOpenDialog, selectedVariant, quantity }}
      />
    </React.Fragment>
  )
}

export default ProductDetailPage
