import * as React from 'react'
import { useAppSelector } from '../../app/hooks'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { FaCircleCheck } from 'react-icons/fa6'

interface IAddCartDialog {
  quantity: number
  openDialog: boolean
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  selectedVariant: ISelectedVariant | null
}
const AddCartDialog: React.FC<IAddCartDialog> = ({
  quantity,
  openDialog,
  setOpenDialog,
  selectedVariant,
}) => {
  const { product } = useAppSelector((state) => state.products)
  const imageURL = `${import.meta.env.VITE_CLOUDINARY_BASE_URL}`
  const navigate = useNavigate()

  const renderPosition = document.getElementById('bag-icon')
  React.useEffect(() => {
    if (openDialog) {
      const timerId = setTimeout(() => {
        setOpenDialog(false)
      }, 5000)
      return () => clearTimeout(timerId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDialog])

  return (
    <>
      {renderPosition &&
        createPortal(
          <div
            className={`absolute right-0 top-12 p-1 text-base  bg-white shadow-lg shadow-gray-400 rounded overflow-hidden transition-all duration-300 ${
              openDialog ? 'w-[380px] h-[230px] ' : 'w-0 h-0'
            }`}
          >
            <div className='p-2'>
              <div className='flex items-center gap-2'>
                <FaCircleCheck className='text-green-600' />
                <p>Added to cart</p>
              </div>
              <div className='flex gap-2'>
                <div>
                  <img
                    className='h-[120px] w-[110px] object-contain mt-1'
                    src={imageURL + selectedVariant?.image}
                    alt='product-image'
                  />
                </div>
                <div>
                  <p className='mb-0.5 max-w-[250px] line-clamp-1'>
                    {product?.name}
                  </p>
                  <div>
                    <p className='mb-0.5'>Size: {selectedVariant?.size}</p>
                    <p className='mb-0.5'>
                      Color:{' '}
                      {selectedVariant?.colorName &&
                        selectedVariant?.colorName[0].toUpperCase() +
                          selectedVariant.colorName.slice(1)}
                    </p>
                    <p className='mb-0.3'>Quantity: {quantity}</p>
                    <p>
                      Price: $
                      {product &&
                        (
                          product?.price -
                          (product.discount.type === 'monetary'
                            ? product.discount.amount
                            : (product?.price * product?.discount.amount) / 100)
                        ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <div className='flex justify-center text-sm gap-3 mt-3'>
                <button
                  type='button'
                  onClick={() => setOpenDialog(false)}
                  className='flex items-center justify-center gap-2 shadow-md hover:bg-red-50 active:shadow-sm hover:bg-opacity-95 w-40 text-red-700 h-9 border border-red-500 rounded transition-all'
                >
                  CONTINUE SHOPPING
                </button>
                <button
                  type='button'
                  onClick={() => navigate('/checkout')}
                  className='flex items-center justify-center gap-2 shadow-md hover:bg-green-50 active:shadow-sm hover:bg-opacity-95 w-40 text-green-700 h-9 border border-green-500 rounded transition-all'
                >
                  CHECKOUT
                </button>
              </div>
            </div>
          </div>,
          renderPosition
        )}
    </>
  )
}

export default AddCartDialog
