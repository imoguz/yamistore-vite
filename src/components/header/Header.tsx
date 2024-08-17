import { BsBag } from 'react-icons/bs'
import { IoMdHeartEmpty } from 'react-icons/io'
import { SlMagnifier } from 'react-icons/sl'
import { FiMenu } from 'react-icons/fi'
import { BiUser } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { readWishlist } from '../../features/wishlistSlice'
import { readCart } from '../../features/cartSlice'
import { useUser } from '../../contexts/UserContext'
import { navMenuItems } from './navMenuItems'
import NavbarDrawer from './NavbarDrawer'
import NavbarDropdown from './NavbarDropdown'
import UserMenu from './UserMenu'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { cart } = useAppSelector((state) => state.cart)
  const { wishlist } = useAppSelector((state) => state.wishlist)
  const [searchValue, setSearchValue] = useState<string>('')
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [openDropdown, setOpenDropdown] = useState<IOpenDropdown>({
    open: false,
    menuName: null,
    subMenu: null,
  })
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      dispatch(readCart(user?.uid))
      dispatch(readWishlist(user?.uid))
    }
  }, [user, dispatch])

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedValue = searchValue.trim()
    setSearchValue('')
    if (trimmedValue) {
      navigate(`/plp?query=${trimmedValue}`)
    }
  }

  return (
    <header>
      <div
        className={`fixed inset-0 top-0 bg-black ${
          openDropdown.open || openDrawer
            ? ' bg-opacity-50 z-30 transition-opacity duration-300'
            : 'opacity-0 -z-50'
        }`}
      />
      <section
        className={`fixed top-0 left-0 right-0
        ${openDrawer ? 'z-20' : 'z-[100]'}
         flex items-center justify-end gap-2 pr-10 h-8 text-xs bg-gray-100 text-gray-400 font-semibold`}
      >
        <span className='cursor-pointer text-gray-700 hover:text-black active:text-gray-700'>
          Find a Store
        </span>
        |
        <span className='cursor-pointer text-gray-700 hover:text-black active:text-gray-700'>
          Help
        </span>
        |
        {user ? (
          <div
            className='relative group flex items-center cursor-pointer h-16'
            onMouseEnter={() => setOpenUserMenu(true)}
            onMouseLeave={() => setOpenUserMenu(false)}
          >
            <div className='text-xs font-semibold mr-2 text-gray-800 group-hover:text-black max-w-32 text-right line-clamp-1'>
              Hi, {user?.displayName}
            </div>

            <BiUser className='text-xl text-gray-800 group-hover:text-black' />

            <UserMenu {...{ openUserMenu, setOpenUserMenu }} />
          </div>
        ) : (
          <span
            className='cursor-pointer text-gray-700 hover:text-black active:text-gray-700'
            onClick={() => navigate('/sign-in')}
          >
            Sign in
          </span>
        )}
      </section>
      <nav
        className={`fixed top-8 left-0 right-0
          ${openDrawer ? 'z-20' : 'z-50'} 
          flex flex-wrap justify-between h-24 md:h-28 xl:h-16 bg-white border-b border-gray-100`}
      >
        <div className='flex sm:hidden justify-center w-full'>
          <form
            onSubmit={handleSearchSubmit}
            className='relative h-8 mt-2 mx-10 w-96'
          >
            <input
              className='border border-gray-400 h-full w-full rounded-full bg-gray-100 pl-8 pr-2 text-sm text-gray-800 focus:outline-none  focus:border-blue-400'
              type='search'
              name='query'
              placeholder='Search Products...'
            />
            <button
              type='submit'
              className='absolute top-[1px] left-[1px] flex items-center justify-center rounded-l-full hover:bg-gray-200 h-[30px] w-[30px] cursor-pointer'
            >
              <SlMagnifier className='text-sm' />
            </button>
          </form>
        </div>
        <div className='flex md:hidden items-center ml-2'>
          <div
            onClick={() => setOpenDrawer(true)}
            className=' hover:bg-gray-200 p-2 rounded-full cursor-pointer transition-colors duration-300'
          >
            <FiMenu className='text-xl' />
          </div>
        </div>
        <div className='md:w-1/3 xl:w-2/12 flex items-center xl:justify-center xl:order-1'>
          <img
            src='/images/yamilogo.jpg'
            alt='Firm Logo'
            width={145}
            height={65}
            onClick={() => navigate('/')}
          />
        </div>
        <div className='hidden md:flex justify-center order-last xl:order-2 w-full xl:w-7/12 min-h-12'>
          {navMenuItems.map((item) => (
            <div
              id={item.mainMenu}
              key={item.mainMenu}
              className='flex items-center font-medium text-[16px] text-gray-700 hover:text-black px-4 cursor-pointer border-2 border-white hover:border-b-black transition-colors duration-100'
              onMouseEnter={() =>
                setOpenDropdown({
                  open: true,
                  menuName: item.mainMenu,
                  subMenu: item.subMenu,
                })
              }
              onMouseLeave={() =>
                setOpenDropdown({ ...openDropdown, open: false })
              }
            >
              {item.mainMenu}
              <NavbarDropdown
                {...{
                  openDropdown,
                  setOpenDropdown,
                  activeMenu: item.mainMenu,
                }}
              />
            </div>
          ))}
        </div>
        <div className='md:w-2/3 xl:w-3/12 flex items-center justify-around text-lg xl:order-3'>
          <form
            onSubmit={handleSearchSubmit}
            className='relative sm:w-2/3 md:w-1/2 xl:w-4/6 h-8 hidden sm:flex'
          >
            <input
              className='border border-gray-400 h-full w-full rounded-full bg-gray-100 pl-8 pr-2 text-sm text-gray-800 focus:outline-none  focus:border-blue-400'
              type='search'
              name='query'
              placeholder='Search Products...'
              onChange={(event) => setSearchValue(event?.target.value)}
            />
            <button
              type='submit'
              className='absolute top-[1px] left-[1px] flex items-center justify-center rounded-l-full hover:bg-gray-200 h-[30px] w-[30px] cursor-pointer'
            >
              <SlMagnifier className='text-sm' />
            </button>
          </form>

          <div className='flex sm:w-1/3 md:w-1/2 xl:w-2/6 gap-5 pr-3 md:pr-10 lg:p-3 justify-end'>
            <button
              onClick={() => navigate('/wishlist')}
              className='relative flex justify-center items-center w-9 h-9 rounded-full hover:bg-gray-200 transition-colors duration-300'
            >
              <IoMdHeartEmpty className='text-2xl' />
              <div
                className={`${
                  wishlist?.length > 0 ? 'flex' : 'hidden'
                } absolute bottom-[22px] left-5 text-white bg-red-500 min-w-[18px] h-[18px] rounded-full px-1 text-[11px]  items-center justify-center`}
              >
                {wishlist?.length}
              </div>
            </button>
            <div id='bag-icon' className='relative'>
              <button
                onClick={() => navigate('/checkout')}
                className='relative flex justify-center items-center w-9 h-9 rounded-full hover:bg-gray-200 transition-colors duration-300'
              >
                <BsBag className='text-xl' />
                <div
                  className={`${
                    cart.length > 0 ? 'flex' : 'hidden'
                  } absolute bottom-[22px] left-5 text-white bg-red-500 min-w-[18px] h-[18px] rounded-full px-1 text-[11px]  items-center justify-center`}
                >
                  {cart.length}
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <NavbarDrawer {...{ openDrawer, setOpenDrawer }} />
      <div className='h-32 md:h-36 xl:h-24 bg-zinc-600' />
    </header>
  )
}

export default Header
