import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import { navMenuItems } from './navMenuItems'
import { useNavigate } from 'react-router-dom'

interface INavbarDrawerProps {
  openDrawer: boolean
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>
}

const NavbarDrawer: React.FC<INavbarDrawerProps> = ({
  openDrawer,
  setOpenDrawer,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const [selectedMenu, setSelectedMenu] = useState({
    maincategory: '',
    subcategory: '',
    productcategory: '',
  })

  const [currentMenuItems, setCurrentMenuItems] = useState<string[]>([])

  useEffect(() => {
    if (!selectedMenu.maincategory) {
      setCurrentMenuItems(navMenuItems.map((item) => item.mainMenu))
    }
    if (selectedMenu.maincategory && !selectedMenu.subcategory) {
      setCurrentMenuItems(
        navMenuItems
          .find((item) => item.mainMenu === selectedMenu.maincategory)
          ?.subMenu.map((sub) => sub.name) || []
      )
    }
    if (
      selectedMenu.maincategory &&
      selectedMenu.subcategory &&
      !selectedMenu.productcategory
    ) {
      setCurrentMenuItems(
        navMenuItems
          .find((item) => item.mainMenu === selectedMenu.maincategory)
          ?.subMenu.find((sub) => sub.name === selectedMenu.subcategory)
          ?.subMenuItems || []
      )
    }
  }, [selectedMenu])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node))
        setOpenDrawer(false)
    }
    if (openDrawer) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      setSelectedMenu({
        maincategory: '',
        subcategory: '',
        productcategory: '',
      })
    }
  }, [openDrawer, setOpenDrawer])

  const handleClick = (item: string) => {
    if (!selectedMenu.maincategory) {
      setSelectedMenu({ ...selectedMenu, maincategory: item })
    } else if (!selectedMenu.subcategory) {
      setSelectedMenu({ ...selectedMenu, subcategory: item })
    } else if (!selectedMenu.productcategory) {
      // product category selected, navigate to plp
      setSelectedMenu({ ...selectedMenu, productcategory: item })
      const queryString =
        `/plp?category=${selectedMenu.maincategory}-${selectedMenu.productcategory}-${selectedMenu.subcategory}`
          .toLowerCase()
          .replace(/ /g, '_')
      navigate(queryString)
      setOpenDrawer(false)
    }
  }

  return (
    <div
      ref={ref}
      className={`fixed inset-y-0 left-0 w-72 bg-white z-50 transition-transform duration-300 transform ${
        openDrawer ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className='w-full flex items-center justify-center my-2'>
        <img src='/images/yamilogo.jpg' alt='brand' height={40} width={120} />
      </div>
      {currentMenuItems?.map((item) => (
        <div
          key={item}
          className='flex items-center justify-between gap-2 h-14 px-3 hover:bg-gray-100 cursor-pointer'
          onClick={() => handleClick(item)}
        >
          <div
            className={`flex items-center gap-2 ${
              selectedMenu.maincategory && 'pl-3'
            }`}
          >
            {!selectedMenu.maincategory && (
              <img
                src={
                  navMenuItems.find((navItem) => navItem.mainMenu === item)
                    ?.image || '/images/imageNotAvailable.png'
                }
                alt='Menu Picture'
                width={40}
                height={40}
                className='w-10 h-10 rounded-full object-cover'
              />
            )}
            {item}
          </div>
          {!selectedMenu.subcategory && <IoIosArrowForward />}
        </div>
      ))}
    </div>
  )
}

export default NavbarDrawer
