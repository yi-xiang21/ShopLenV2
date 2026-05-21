import React from 'react'
import {useNavigate} from 'react-router-dom'

const Sildebar = () => {
    const navigate = useNavigate();
    const menuItems = [
        { name: 'Dashboard', link: '' },
        { name: 'Quản lý người dùng', link: '' },
        { name: 'Quản lý đơn hàng', link: '' },
        { name: 'Quản lý sản phẩm', link: '' },
        { name : 'Quản lý Kho', link: '' },
        { name: 'Quản lý danh mục', link: '' },
        { name: 'Quản lý workshop', link: '' },
        { name: 'Quay về trang chủ', link: '/',},
        { name: 'Cài đặt', link: 'Manager-Setting' }
    ]
  return (
    <div className='w-64 bg-gray-200 p-4' h-full>
      <h2 className='text-xl font-bold mb-4'>Admin </h2>
      <ul className='space-y-2'>
        {menuItems.map((item, index) => (
          <li 
            key={index} 
            className='hover:bg-gray-300 p-2 cursor-pointer' 
            onClick={() => navigate(item.link)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sildebar
