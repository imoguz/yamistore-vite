import React from 'react'
import { useNavigate } from 'react-router-dom'

interface INavbarDropdownProps {
  openDropdown: IOpenDropdown
  setOpenDropdown: React.Dispatch<React.SetStateAction<IOpenDropdown>>
  activeMenu: string
}

const NavbarDropdown: React.FC<INavbarDropdownProps> = ({
  openDropdown: { open, subMenu, menuName },
  setOpenDropdown,
  activeMenu,
}) => {
  const navigate = useNavigate()

  const handleSubMenuItemClick = (subMenuName: string, subItem: string) => {
    const queryString = `/plp?category=${menuName}-${subMenuName}-${subItem}`
      .toLowerCase()
      .replace(/ /g, '_')
    setOpenDropdown({ open: false, menuName: null, subMenu: null })
    navigate(queryString)
  }

  const handleSubMenuClick = (subMenuName: string) => {
    const queryString = `/plp?category=${menuName}-${subMenuName}`
      .toLowerCase()
      .replace(/ /g, '_')
    setOpenDropdown({ open: false, menuName: null, subMenu: null })
    navigate(queryString)
  }

  if (!open || !subMenu || menuName !== activeMenu) {
    return null
  }

  return (
    <>
      <div className='bg-white z-50 absolute left-0 top-[121px] md:top-[112px] xl:top-[64px] lg:pr-8 w-full flex flex-row gap-10 lg:gap-16 font justify-center pt-6 py-4'>
        {subMenu?.map((item) => (
          <div key={item.name}>
            <p
              onClick={() => handleSubMenuClick(item.name)}
              className='text-[16px] text-gray-800 mb-2'
            >
              {item.name}
            </p>

            {item.subMenuItems.map((subItem) => (
              <p
                key={subItem}
                className='text-gray-600 text-[15px] leading-loose hover:text-gray-950'
                onClick={() => handleSubMenuItemClick(item.name, subItem)}
              >
                {subItem}
                {(subItem === 'Dresses' || subItem === 'shoes') && (
                  <span className='text-red-500'> (Samples)</span>
                )}
              </p>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

export default NavbarDropdown
