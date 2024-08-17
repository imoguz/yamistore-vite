import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { readWishlist } from '../features/wishlistSlice'
import { useUser } from '../contexts/UserContext'
import WishlistCard from '../components/wishlist/WishlistCard'

const Wishlist = () => {
  const { wishlist } = useAppSelector((state) => state.wishlist)
  const dispatch = useAppDispatch()
  const { user } = useUser()

  useEffect(() => {
    if (user) dispatch(readWishlist(user?.uid))
  }, [dispatch, user])

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
