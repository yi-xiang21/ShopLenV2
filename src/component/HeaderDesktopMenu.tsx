import type { ActiveMenuKey, HeaderMenuItemData } from './Header'
import MenuMulti from './MenuMulti'

type HeaderDesktopMenuProps = {
  menuItems: Array<{ key: ActiveMenuKey; label: string }>
  activeMenu: ActiveMenuKey
  setActiveMenu: (key: ActiveMenuKey) => void
  categoryData: HeaderMenuItemData[]
}

const HeaderDesktopMenu = ({
  menuItems,
  activeMenu,
  setActiveMenu,
  categoryData,
}: HeaderDesktopMenuProps) => {
  return (
    <nav className='hidden bg-rose-300 md:block'>
      <ul className='mx-auto grid w-full max-w-6xl grid-cols-3 px-4 py-2 text-center text-xs font-semibold tracking-wider text-gray-700 md:flex md:justify-start md:gap-8 md:px-4 md:py-3 md:text-sm'>
        {menuItems.map((item) => {
          const isActive = activeMenu === item.key

          if (item.key === 'categories') {
            return (
              <MenuMulti
                key={item.key}
                data={categoryData}
                isActive={isActive}
                label={item.label}
                setActiveMenu={setActiveMenu}
              />
            )
          }

          return (
            <li key={item.key} className='relative px-7 py-3'>
              <a
                className={`block transition-all duration-200 md:inline ${
                  isActive
                    ? '-translate-y-0.5 text-amber-800 italic'
                    : 'hover:-translate-y-0.5 hover:text-amber-800 hover:italic'
                }`}
                href='#'
                onClick={(event) => {
                  event.preventDefault()
                  setActiveMenu(item.key)
                }}
              >
                {item.label}
              </a>
              {isActive ? (
                <span className='absolute bottom-0 left-0 right-0 h-1 rounded-full bg-black' />
              ) : null}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default HeaderDesktopMenu