import { useState } from 'react'
import { FaBars, FaRegUser, FaShoppingCart, FaTimes } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import logo from '../assets/Logo.png'
import HeaderDesktopMenu from './HeaderDesktopMenu'
import HeaderMobileMenu from './HeaderMobileMenu'
import { useAuth } from '../context/AuthContext'


export type ActiveMenuKey = 'home' | 'shop' | 'about' | 'categories' | 'workshop'

export type HeaderMenuItemData = {
  id: number
  name: string
  children?: HeaderMenuItemData[]
}


const Header = () => {
  const [activeMenu, setActiveMenu] = useState<ActiveMenuKey>('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, role } = useAuth()

  const userRoute = !isAuthenticated ? '/login' : role === 'admin' ? '/admin' : '/profile'

  const menuItems: Array<{ key: ActiveMenuKey; label: string; link: string }> = [
    { key: 'home', label: 'Trang chủ', link: '/' },
    { key: 'shop', label: 'Cửa hàng', link: '/shop' },
    { key: 'about', label: 'Giới thiệu', link: '/about' },
    { key: 'categories', label: 'Danh mục', link: '/categories' },
    { key: 'workshop', label: 'workshop', link: '/workshop' },
  ]

  const [categoryData] = useState<HeaderMenuItemData[]>([
    {
      id: 1,
      name: 'Len',
      children: [
        {
          id: 11,
          name: 'Nam',
          children: [
            { id: 111, name: 'Ao thun' },
            {
              id: 112,
              name: 'Quan',
              children: [
                { id: 1121, name: 'Quan jean' },
                { id: 1122, name: 'Quan tay' },
              ],
            },
          ],
        },
        {
          id: 12,
          name: 'Nu',
          children: [
            { id: 121, name: 'Vay dam' },
            { id: 122, name: 'Ao kieu' },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Công cụ',
      children: [
        {
          id: 21,
          name: 'Tui xach',
          children: [
            { id: 211, name: 'Tui deo cheo' },
            { id: 212, name: 'Tui tote' },
          ],
        },
        {
          id: 22,
          name: 'Trang suc',
          children: [
            { id: 221, name: 'Day chuyen' },
            { id: 222, name: 'Bong tai' },
          ],
        },
      ],
    },
  ])

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className='bg-rose-300'>
      <div className='mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3'>
        <button
          aria-label='Mo menu'
          className='rounded-md p-2 text-gray-700 hover:bg-rose-200 md:hidden'
          onClick={() => {
            setIsMobileMenuOpen((prev) => {
              return !prev
            })
          }}
          type='button'
        >
          {isMobileMenuOpen ? <FaTimes className='h-4 w-4' /> : <FaBars className='h-4 w-4' />}
        </button>

        <a className='text-xl font-black tracking-wider md:text-2xl' href='/'>
          <img
            alt='ShopLen'
            className='h-10 w-auto object-contain md:h-12'
            src={logo}
          />
        </a>

        <div className='flex-1'>
          <div className='relative mx-auto w-4/5'>
            <input
              className='w-full rounded-full border border-gray-300 bg-gray-50 py-1.5 pl-9 pr-4 text-xs outline-none transition-all duration-200 focus:border-amber-700 focus:bg-white focus:shadow-sm md:text-sm'
              placeholder='Tìm kiếm sản phẩm...'
              type='text'
            />
            <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
              <FiSearch aria-hidden='true' className='h-3.5 w-3.5 md:h-4 md:w-4' />
            </span>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Link
            aria-label='Tai khoan'
            className='rounded-full p-2 text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:text-amber-800'
            type='button'
            to={userRoute}
          >
            <FaRegUser aria-hidden='true' className='h-5 w-5' />
            
          </Link>
          <button
            aria-label='Gio hang'
            className='relative rounded-full p-2 text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:text-amber-800'
            type='button'
          >
            <FaShoppingCart aria-hidden='true' className='h-5 w-5' />
              <span className='absolute -right-1 -top-1 inline-flex min-h-4 min-w-3 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white'>
                10
              </span>
          </button>
          
        </div>
      </div>

      <HeaderDesktopMenu
        activeMenu={activeMenu}
        categoryData={categoryData}
        menuItems={menuItems}
        setActiveMenu={setActiveMenu}
      />

      <HeaderMobileMenu
        activeMenu={activeMenu}
        categoryData={categoryData}
        isOpen={isMobileMenuOpen}
        menuItems={menuItems}
        onCloseMenu={closeMobileMenu}
        setActiveMenu={setActiveMenu}
      />
    </header>
  )
}

export default Header
