import React, { useEffect, useState } from 'react'
import { FaSquareFull } from 'react-icons/fa'
import { SlArrowUp } from 'react-icons/sl'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useUser } from '../../contexts/UserContext'
import { createWishlist, readWishlist } from '../../features/wishlistSlice'
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md'
import BounceLoader from 'react-spinners/BounceLoader'

interface IProductCardProps {
  product: IProduct
  rightColumn: React.MutableRefObject<HTMLDivElement | null>
}
const ProductCards: React.FC<IProductCardProps> = ({
  product,
  rightColumn,
}) => {
  const [imageToggle, setImageToggle] = React.useState(false)
  const [showButton, setShowButton] = useState(false)

  const [isFav, setIsFav] = React.useState(false)
  const [hoveredColor, setHoveredColor] = React.useState<string | null>(null)
  const { wishlist, wishLoading } = useAppSelector((state) => state.wishlist)
  const { user } = useUser()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    setIsFav(
      Boolean(
        wishlist.find(
          (item) =>
            item?.user_id === user?.uid &&
            item?.product_id?._id === product?._id
        )
      )
    )
  }, [wishlist, user?.uid, product?._id])

  const imageURL = `${import.meta.env.VITE_CLOUDINARY_BASE_URL}`

  const mainImages = product.images
    ?.map((image) => (image.isMainImage ? image.url : null))
    .filter((url) => url !== null)

  const uniqueColors = [
    ...new Set(
      product.variants.map((item) => {
        return item.color_id.hex_code
      })
    ),
  ]

  const colorOptions = uniqueColors.map((color) => {
    const variant = product.variants.find(
      (item) => item.color_id.hex_code === color
    )
    return { hex_code: color, image_url: variant?.image_url }
  })

  const backgroundImage = () => {
    if (hoveredColor) {
      return `url(${imageURL + hoveredColor})`
    } else if (mainImages.length > 1) {
      return `url(${imageURL}${imageToggle ? mainImages[1] : mainImages[0]})`
    } else if (mainImages.length === 1) {
      return `url(${imageURL + mainImages[0]})`
    } else {
      return `url("/images/imageNotAvailable.png")`
    }
  }

  const handleAddWishlist = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation()

    if (product && user) {
      const newWishlist: INewWishlist = {
        user_id: user?.uid,
        product_id: product._id,
      }
      await dispatch(createWishlist({ newWishlist }))
      await dispatch(readWishlist(user?.uid))
    } else {
      navigate('sign-in')
    }
  }

  useEffect(() => {
    const rightColumnNode = rightColumn?.current

    const handleScroll = () => {
      if (
        window.scrollY > 300 ||
        (rightColumnNode && rightColumnNode.scrollTop > 300)
      ) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    if (rightColumnNode) {
      rightColumnNode.addEventListener('scroll', handleScroll)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rightColumnNode) {
        rightColumnNode.removeEventListener('scroll', handleScroll)
      }
    }
  }, [rightColumn])

  const scrollToTop = () => {
    if (rightColumn?.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      rightColumn.current.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <div
        onClick={() =>
          navigate(`/pdp/${product.slug}`, {
            state: { productId: product._id },
          })
        }
        className='group relative w-[46vw] xs:w-[265px] sm:w-[280px] md:w-[215px] lg:w-[280px] h-[320px] xs:h-[390px] sm:h-[400px] md:h-[350px] lg:h-[400px] rounded cursor-pointer shadow-md shadow-blue-100 hover:shadow-lg hover:shadow-blue-100'
      >
        <button
          type='button'
          onClick={handleAddWishlist}
          className='peer absolute invisible group-hover:visible flex items-center justify-center text-xl right-2 top-2 z-50'
        >
          {wishLoading ? (
            <BounceLoader size={20} color='#EF4444' />
          ) : isFav ? (
            <MdFavorite className=' text-red-500' />
          ) : (
            <MdFavoriteBorder className='' />
          )}
        </button>
        <span
          className={`peer-hover:visible invisible absolute top-8 ${
            isFav ? '-right-6' : '-right-3'
          }  rounded-md shadow-md px-2 py-0.5 bg-gray-50 text-[10px] text-black w-max max-w-64 z-10`}
        >
          {isFav ? 'remove favorite' : 'add favorite'}
        </span>
        <div
          className='relative w-[46vw] xs:w-[265px] sm:w-[280px] md:w-[215px] lg:w-[280px] h-[240px] xs:h-[290px] sm:h-[310px] md:h-[260px] lg:h-[310px]'
          style={{
            backgroundImage: backgroundImage(),
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            objectFit: 'cover',
            transition: 'background-image 0.2s ease-in',
          }}
          onMouseOver={() => setImageToggle(true)}
          onMouseLeave={() => setImageToggle(false)}
        />
        <div className='w-[46vw] xs:w-[265px] sm:w-[280px] md:w-[215px] lg:w-[280px] h-[80px] xs:h-[90px] flex flex-col justify-evenly px-1.5'>
          <div className='flex items-center gap-1'>
            {colorOptions
              .slice(0, colorOptions.length > 4 ? 4 : colorOptions.length)
              .map((item, index) => (
                <FaSquareFull
                  key={index}
                  className={`
                    ${
                      item.image_url === hoveredColor && 'ring-1 ring-offset-1'
                    } 
                    hover:ring-1 hover:ring-offset-1 ring-black cursor-pointer`}
                  style={{ color: item.hex_code, fontSize: '22px' }}
                  onMouseOver={() =>
                    item.image_url && setHoveredColor(item.image_url)
                  }
                />
              ))}

            {colorOptions.length > 4 && (
              <span className='text-xs text-gray-500'>{`+${
                colorOptions.length - 4
              } More`}</span>
            )}
          </div>
          <p className='w- line-clamp-1 text-md'>{product.name}</p>
          {product && (
            <div className='flex gap-2 sm:gap-3 text-md'>
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
      </div>
      <div
        className={`fixed overflow-hidden h-[72px] right-2 md:right-10 flex flex-col gap-1 items-center text-center shadow-sm w-min px-2 py-1 text-xs rounded-t-md cursor-pointer text-gray-100 bg-gray-600 hover:bg-gray-700 active:bg-gray-600  transition-all duration-300  ${
          showButton ? '-bottom-2' : '-bottom-24'
        }`}
        onClick={scrollToTop}
      >
        <SlArrowUp className='text-lg' />
        RETURN TO TOP
      </div>
    </>
  )
}

export default ProductCards
