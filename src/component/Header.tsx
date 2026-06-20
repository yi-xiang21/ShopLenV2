import { useEffect, useState } from 'react'
import { FaBars, FaRegUser, FaShoppingCart, FaTimes ,FaHeart } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import logo from '@/assets/Logo.png'
import HeaderDesktopMenu from '@/component/HeaderDesktopMenu'
import HeaderMobileMenu from '@/component/HeaderMobileMenu'
import Badge from 'antd/es/badge/Badge'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { getWishlistThunk } from '@/pages/User/whistlist/store/wishlist_thunck'


export type ActiveMenuKey = 'home' | 'shop' | 'about' | 'workshop'


const Header = () => {
  const dispatch = useAppDispatch();
   const { user } = useAppSelector((state) => state.auth);
   const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

   useEffect(() => {
     if (user) {
       dispatch(getWishlistThunk());
     }
   }, [user, dispatch]);
   const router = () =>{ 
    if (!user) return '/auth/login';

    return user.role === 'admin' ? '/admin' : '/profile';
  }
  const [activeMenu, setActiveMenu] = useState<ActiveMenuKey>('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


  const menuItems: Array<{ key: ActiveMenuKey; label: string; link: string }> = [
    { key: 'home', label: 'Trang chủ', link: '/' },
    { key: 'shop', label: 'Cửa hàng', link: '/shop' },
    { key: 'about', label: 'Giới thiệu', link: '/about' },
    { key: 'workshop', label: 'workshop', link: '/workshop' },
  ]


  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <div className='sticky top-0 z-50 bg-white shadow-sm '>
        <div className='mx-auto flex w-full max-w-6xl items-center gap-3 px-1 py-1'>
          <button
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
              className='h-10 w-auto object-contain md:h-20'
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
              to={router()}
            >
              <FaRegUser aria-hidden='true' className='h-5 w-5' />
            </Link>
            <Link
              aria-label='Yêu thích'
              className='rounded-full p-2 text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:text-amber-800'
              to={"/wishlist"}
            >
              <Badge count={wishlistItems.length} >
                <FaHeart aria-hidden='true' className='h-5 w-5' />
              </Badge>
            </Link>
            {/* thay bang antdesign badge */}
            <button
              aria-label='Gio hang'
              className='relative rounded-full p-2 text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:text-amber-800'
              type='button'
            >
              {/* sua lai thanh route gio hang sau khi lam xong chuc nang */}
              <Badge count={5}>
                <FaShoppingCart aria-hidden='true' className='h-5 w-5' />
              </Badge>
            </button>
          </div>
        </div>
      </div>

      <header className='bg-white shadow-sm h-auto'>
      <div className='bg-white'>
        <HeaderDesktopMenu
          activeMenu={activeMenu}
          menuItems={menuItems}
          setActiveMenu={setActiveMenu}
        />
      </div>

      <HeaderMobileMenu
        activeMenu={activeMenu}
        isOpen={isMobileMenuOpen}
        menuItems={menuItems}
        onCloseMenu={closeMobileMenu}
        setActiveMenu={setActiveMenu}
      />
      </header>
    </>
  )
}

export default Header
