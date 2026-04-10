import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegUser, FaShoppingCart } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import logo from '../assets/Logo.png'

const Header = () => {
  const { t, i18n } = useTranslation()
  const [activeMenu, setActiveMenu] = useState<'home' | 'shop' | 'about'>('home')

  const menuItems: Array<{ key: 'home' | 'shop' | 'about'; label: string }> = [
    { key: 'home', label: t('header.menu.home') },
    { key: 'shop', label: t('header.menu.shop') },
    { key: 'about', label: t('header.menu.about') },
  ]

  return (
    <header className=' bg-rose-300'>
      <div className='mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3'>
        <a className='text-xl font-black tracking-wider md:text-2xl' href='/'>
          <img
            alt={t('header.title')}
            className='h-10 w-auto object-contain md:h-12'
            src={logo}
          />
        </a>

        <div className='flex-1'>
          <div className='relative mx-auto w-4/5'>
            <input
              className='w-full rounded-full border border-gray-300 bg-gray-50 py-1.5 pl-9 pr-4 text-xs outline-none transition-all duration-200 focus:border-amber-700 focus:bg-white focus:shadow-sm md:text-sm'
              placeholder={t('header.searchPlaceholder')}
              type='text'
            />
            <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
              <FiSearch aria-hidden='true' className='h-3.5 w-3.5 md:h-4 md:w-4' />
            </span>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <button
            aria-label={t('header.account')}
            className='rounded-full p-2 text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:text-amber-800'
            type='button'
          >
            <FaRegUser aria-hidden='true' className='h-5 w-5' />
          </button>
          <button
            aria-label={t('header.cart')}
            className='rounded-full p-2 text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:text-amber-800'
            type='button'
          >
            <FaShoppingCart aria-hidden='true' className='h-5 w-5' />
          </button>
          <button
            className='rounded-full border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-700 hover:bg-amber-50 hover:text-amber-800 md:text-sm'
            onClick={() => i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')}
            type='button'
          >
            {i18n.language === 'vi' ? t('header.switchToEnglish') : t('header.switchToVietnamese')}
          </button>
        </div>
      </div>

      <nav className='fixed bottom-0 left-0 right-0 z-40  bg-rose-300 md:static '>
        <ul className='mx-auto grid w-full max-w-6xl grid-cols-3 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-700 md:flex md:justify-start md:gap-8 md:px-4 md:py-3 md:text-sm'>
          {menuItems.map((item) => {
            const isActive = activeMenu === item.key

            return (
              <li key={item.key}>
                <a
                  className={`relative block px-7 py-3 transition-all duration-200 md:inline ${
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
                  {isActive ? (
                    <span className='absolute bottom-1 left-3 right-3 h-1 rounded-full bg-black' />
                  ) : null}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}

export default Header
