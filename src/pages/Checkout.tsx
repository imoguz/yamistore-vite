import { useEffect, useState } from 'react'
import { readCart } from '../features/cartSlice'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useUser } from './../contexts/UserContext'
import ErrorPage from './ErrorPage'
import CheckoutCard from '../components/checkout/CheckoutCard'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalDiscount, setTotalDiscount] = useState(0)
  const [promoCode, setPromoCode] = useState('')
  const { cart, error } = useAppSelector((state) => state.cart)
  const { user } = useUser()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) dispatch(readCart(user?.uid))
  }, [user, dispatch])

  useEffect(() => {
    if (cart && cart.length > 0) {
      const { totalPrice, totalDiscount } = cart.reduce(
        (acc, item) => {
          const discount =
            item.product_id.discount.type === 'monetary'
              ? item.product_id.discount.amount
              : (item.product_id.price * item.product_id.discount.amount) / 100

          acc.totalPrice += item.product_id.price * item.quantity
          acc.totalDiscount += discount * item.quantity
          return acc
        },
        { totalPrice: 0, totalDiscount: 0 }
      )

      setTotalPrice(totalPrice)
      setTotalDiscount(totalDiscount)
    }
  }, [cart])

  if (error) {
    return <ErrorPage error={error} />
  }
  const handlePromoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // will be added promo code function
    event.preventDefault()
    const trimmedValue = promoCode.trim()
    console.log(trimmedValue)
  }
  return (
    <>
      {cart.length > 0 ? (
        <div className='flex flex-col lg:flex-row justify-center mx-auto items-center lg:items-start min-h-[calc(100vh-128px)] w-full max-w-[1236px] px-2 my-3 gap-5'>
          {/* left column card items */}
          <div className='w-max-[800px] order-2 lg:order-1'>
            <div className='flex justify-between w-full text-xl font-semibold my-2 px-1'>
              <p>Shopping Cart</p>
              <p>
                ({cart.length}) item{cart.length > 1 && 's'}
              </p>
            </div>
            <div className='flex flex-col gap-3'>
              {cart.map((item) => (
                <CheckoutCard key={item._id} {...{ item, user }} />
              ))}
            </div>
          </div>
          {/* right column order summary*/}
          <div className='w-max-[400px] order-1 lg:order-2'>
            <p className='font-semibold w-full text-xl my-2 px-1'>
              Order Summary
            </p>
            <div className='p-5 border border-gray-100 shadow-md shadow-gray-400 hover:shadow-red-500'>
              <form
                onSubmit={handlePromoSubmit}
                className='relative mx-auto h-16 w-[320px]'
              >
                <label className='text-gray-700'>
                  Do you have a promo code?
                </label>
                <input
                  className='border border-gray-400 h-10 w-full mt-1 pl-3 pr-[90px] bg-gray-100  text-gray-800 focus:outline-none  focus:border-gray-600'
                  type='text'
                  name='code'
                  placeholder='Promo Code'
                  onChange={(event) => setPromoCode(event?.target.value)}
                />
                <button
                  type='button'
                  className='absolute -bottom-1 right-0 shadow-md hover:shadow-lg active:bg-black hover:bg-opacity-95 w-20  h-10 bg-gray-800 text-white transition-all'
                >
                  SUBMIT
                </button>
              </form>

              <div className='overflow-x-auto mt-8'>
                <table className='w-[90%] mx-auto text-sm'>
                  <tbody>
                    <tr className='border-b'>
                      <td colSpan={2} className='py-2 px-1'>
                        Order Value
                      </td>
                      <td className='py-2 px-1 text-right'>
                        ${totalPrice.toFixed(2)}
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td colSpan={2} className='py-2 px-1'>
                        Discount
                      </td>
                      <td className='py-2 px-1 text-right'>
                        ${totalDiscount.toFixed(2)}
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td colSpan={2} className='p-2'>
                        Shipping
                      </td>
                      <td className='p-2 text-right'>
                        {totalPrice - totalDiscount < 500 ? '$125.0' : '$0.00'}
                      </td>
                    </tr>
                    <tr className='bg-gray-300'>
                      <td colSpan={2} className='py-2 px-1 font-semibold'>
                        Order Total
                      </td>
                      <td className='p-2 text-right'>
                        $
                        {totalPrice - totalDiscount < 500
                          ? (totalPrice - totalDiscount + 125).toFixed(2)
                          : (totalPrice - totalDiscount).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className='text-center mt-3'>
                <button
                  type='button'
                  className='flex items-center justify-center shadow-md hover:shadow-lg active:shadow-md hover:bg-opacity-95 w-64 h-10 mx-auto mt-5 rounded-full bg-red-600 text-white transition-all'
                >
                  CONTINUE TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='min-h-[40vh] p-2'>
          <div>
            <p className='text-lg mb-3'>Your shopping bag is empty!</p>
            <button
              type='button'
              onClick={() => navigate('/')}
              className='flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg active:shadow-md hover:bg-opacity-95 w-80 h-10 bg-red-600 text-white transition-all'
            >
              CONTINUE TO SHOPPING
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Checkout
