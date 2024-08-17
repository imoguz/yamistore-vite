import React from 'react'
import { FaRegCircleUser } from 'react-icons/fa6'
import { IoSettingsOutline } from 'react-icons/io5'
import { FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { signOutUser } from '../../firebase/auth'

interface IUserMEnuProps {
  openUserMenu: boolean
  setOpenUserMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const UserMenu: React.FC<IUserMEnuProps> = ({
  openUserMenu,
  setOpenUserMenu,
}) => {
  const navigate = useNavigate()

  interface IMenuItem {
    title: string
    path: string
    icon: React.ReactNode
  }

  const menuItems: IMenuItem[] = [
    { title: 'Profile', path: '/account/profile', icon: <FaRegCircleUser /> },
    {
      title: 'Settings',
      path: '/account/settings',
      icon: <IoSettingsOutline />,
    },
    { title: 'Log Out', path: '/', icon: <FiLogOut /> },
  ]

  const handleSignOutUser = async () => await signOutUser()

  const handleClick = (path: string) => {
    if (path === '/') handleSignOutUser()
    else navigate(path)

    setOpenUserMenu(false)
  }

  return (
    <div
      className={`absolute top-[50px] right-0 flex flex-col justify-center gap-1 overflow-hidden w-28 bg-white text-gray-800 rounded-md shadow-md shadow-gray-500 transition-height duration-200
    ${openUserMenu ? 'h-28' : 'h-0'}
    `}
    >
      {menuItems.map((item) => (
        <div
          key={item.title}
          className='flex items-center gap-2 py-1 px-2.5 cursor-pointer hover:bg-gray-200'
          onClick={() => handleClick(item?.path)}
        >
          <span className='text-lg'>{item.icon} </span>
          <span className='text-sm'>{item.title}</span>
        </div>
      ))}
    </div>
  )
}

export default UserMenu
