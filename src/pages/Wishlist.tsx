import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { readWishlist } from '../features/wishlistSlice'
import { useUser } from '../contexts/UserContext'
import WishlistCard from '../components/wishlist/WishlistCard'
import ErrorPage from './ErrorPage'
import { DotLoader } from 'react-spinners'

const Wishlist = () => {
  const { wishlist, wishLoading, wishError } = useAppSelector(
    (state) => state.wishlist
  )
  const dispatch = useAppDispatch()
  const { user } = useUser()

  useEffect(() => {
    if (user) dispatch(readWishlist(user?.uid))
  }, [dispatch, user])

  if (wishLoading) {
    return (
      <div className='fixed z-50 left-1/2 top-1/2 transform -translate-1/2 '>
        <DotLoader color='#1565C0' size={50} />
      </div>
    )
  }

  if (wishError) {
    return <ErrorPage error={wishError} />
  }

  return (
    <div className='my-1 mx-2'>
      <p className='text-xl text-gray-900 font-semibold text-center my-3'>
        My Wishlist ({wishlist?.length})
      </p>

      <div className='flex justify-center gap-7 mt-0.5'>
        {wishlist.map((item, index) => (
          <WishlistCard key={index} {...{ item, user }} />
        ))}
      </div>
    </div>
  )
}

export default Wishlist
