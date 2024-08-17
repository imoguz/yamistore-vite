import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { readProducts } from '../../features/productSlice'
import { useNavigate } from 'react-router-dom'

const NewArrivals = () => {
  const dispatch = useAppDispatch()
  const { products } = useAppSelector((state) => state.products)
  const [newArrivals, setNewArrivals] = useState<IProduct[]>([])
  const imageURL = `${import.meta.env.VITE_CLOUDINARY_BASE_URL}`
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(readProducts())
    }

    fetchProducts()
  }, [dispatch])

  useEffect(() => {
    if (products && products.data.length > 4) {
      setNewArrivals(products.data.slice(0, 4))
    }
  }, [products])

  return (
    <div className=''>
      <p className='text-center font-semibold text-2xl my-5'>New Arrivals</p>
      <div className='flex justify-between flex-wrap md:flex-nowrap gap-2 md:gap-3 lg:gap-5 xl:gap-10'>
        {newArrivals.map((item) => (
          <div
            key={item._id}
            className='group relative h-[420px] xs:h-[340px] lg:h-[380px] xl:h-[420px] w-full xs:w-[48%] md:w-1/4 shadow-lg border cursor-pointer overflow-hidden'
            onClick={() =>
              navigate(`/pdp/${item.slug}`, {
                state: { productId: item._id },
              })
            }
          >
            <img
              src={imageURL + item?.images[0]?.url}
              alt='product-image'
              className='w-full h-full object-fill transition-transform duration-500 ease-in-out group-hover:scale-105'
            />
            <div className='absolute bottom-0 flex flex-col justify-evenly items-center w-full h-14 px-1 bg-black text-gray-200 bg-opacity-70'>
              <p className='line-clamp-1 text-center'>{item.name}</p>
              <div className='flex gap-2'>
                <span>
                  $
                  {(
                    item?.price -
                    (item && item.discount.type === 'monetary'
                      ? item.discount.amount
                      : (item?.price * item?.discount.amount) / 100)
                  ).toFixed(2)}
                </span>

                <span className='text-gray-400 line-through'>
                  ${item?.price}
                </span>

                <span className='text-green-500'>
                  {item?.discount.type === 'monetary' && '$'}
                  {item?.discount.amount}
                  {item?.discount.type === 'percentage' && '%'} off
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewArrivals
