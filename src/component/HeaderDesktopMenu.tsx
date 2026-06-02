import type { ActiveMenuKey } from './Header'
import { Link } from 'react-router-dom'

type HeaderDesktopMenuProps = {
  menuItems: Array<{ key: ActiveMenuKey; label: string; link: string }>
  activeMenu: ActiveMenuKey
  setActiveMenu: (key: ActiveMenuKey) => void
}

const HeaderDesktopMenu = ({
  menuItems,
  activeMenu,
  setActiveMenu,
}: HeaderDesktopMenuProps) => {
  return (
    <nav className='hidden bg-white md:block'>
      <ul className='mx-auto grid w-full max-w-6xl grid-cols-3 px-4 py-2 text-center text-xs font-semibold tracking-wider text-gray-700 md:flex md:justify-start md:gap-8 md:px-4 md:py-3 md:text-sm'>
        {menuItems.map((item) => {
          const isActive = activeMenu === item.key
          return (
            <li key={item.key} className='relative px-7 py-3'>
              <Link
                className={`block transition-all duration-200 md:inline ${
                  isActive
                    ? '-translate-y-0.5 text-amber-800 italic'
                    : 'hover:-translate-y-0.5 hover:text-amber-800 hover:italic'
                }`}
                to={item.link}
                onClick={() => {
                  setActiveMenu(item.key)
                }}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default HeaderDesktopMenu