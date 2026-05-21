import React from 'react'
import { Input } from 'antd';

const { Search } = Input;
const AdminManagerAccount = () => {
    const onSearch = (value: string) => console.log(value);
  return (
    <div className='flex flex-col h-full w-full'>
      <div className='flex justify-between items-center'>
         <h2 className='text-2xl font-bold'>Quản lý người dùng</h2>   
         <button className='bg-blue-500 text-white p-2  rounded hover:bg-blue-600'>
           Thêm user
         </button>
      </div>
      <div className='mt-4 bg-white rounded shadow p-4 flex-1'>
         <Search placeholder="input search text" onSearch={onSearch} enterButton />
      </div>
    </div>
  )
}

export default AdminManagerAccount
