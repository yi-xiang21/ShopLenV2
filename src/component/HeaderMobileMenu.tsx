import type { ActiveMenuKey } from './Header'
import { Link } from 'react-router-dom'

type HeaderMobileMenuProps = {
  isOpen: boolean
  menuItems: Array<{ key: ActiveMenuKey; label: string; link: string }>
  activeMenu: ActiveMenuKey
  onCloseMenu: () => void
}

const HeaderMobileMenu = ({
  isOpen,
  menuItems,
  activeMenu,
  onCloseMenu,
}: HeaderMobileMenuProps) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className='bg-white px-4 py-3 shadow-sm md:hidden'>
      <ul className='text-left text-sm font-semibold text-gray-700 '>
        {menuItems.map((item) => { 
          const isActive = activeMenu === item.key

          return (
            <li key={item.key}>
              <Link
                className={`block rounded-lg px-3 py-2.5 transition ${
                  isActive
                    ? 'border-l-2 border-[#4d342f] bg-[#fff1ee] text-[#ee4d2d]'
                    : 'hover:bg-orange-50 hover:text-[#ee4d2d]'
                }`}
                to={item.link}
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