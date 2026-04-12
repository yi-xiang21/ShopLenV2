import type { ActiveMenuKey, HeaderMenuItemData } from './Header'
import MenuMulti from './MenuMulti'
import { Link } from 'react-router-dom'

type HeaderMobileMenuProps = {
  isOpen: boolean
  menuItems: Array<{ key: ActiveMenuKey; label: string; link: string }>
  activeMenu: ActiveMenuKey
  setActiveMenu: (key: ActiveMenuKey) => void
  categoryData: HeaderMenuItemData[]
  onCloseMenu: () => void
}

const HeaderMobileMenu = ({
  isOpen,
  menuItems,
  activeMenu,
  setActiveMenu,
  categoryData,
  onCloseMenu,
}: HeaderMobileMenuProps) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className='border-t border-orange-200 bg-white px-4 py-3 shadow-sm md:hidden'>
      <ul className='space-y-2 text-left text-sm font-semibold text-gray-700'>
        {menuItems.map((item) => { 
          const isActive = activeMenu === item.key

          if (item.key === 'categories') {
            return (
              <li key={item.key}>
                <MenuMulti
                  data={categoryData}
                  isActive={isActive}
                  label={item.label}
                  setActiveMenu={setActiveMenu}
                  variant='mobile'
                />
              </li>
            )
          }

          return (
            <li key={item.key}>
              <Link
                className={`block rounded-lg px-3 py-2.5 transition ${
                  isActive
                    ? 'border-l-2 border-[#ee4d2d] bg-[#fff1ee] text-[#ee4d2d]'
                    : 'hover:bg-orange-50 hover:text-[#ee4d2d]'
                }`}
                to={item.link}
                onClick={() => {
                  setActiveMenu(item.key)
                  onCloseMenu()
                }}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default HeaderMobileMenu