import { useState } from 'react'
import { Table, Input, Button } from 'antd';
import type { TableProps } from 'antd/es/table';
import type { Category } from './type/catelogy';

const columns: TableProps<Category>['columns'] = [
{
title: 'ID',
dataIndex: 'categoryId',
key: 'categoryId',
},
{
title: 'Name',
dataIndex: 'categoryName',
key: 'categoryName',
},
{
title: 'Description',
dataIndex: 'categoryDescription',
key: 'categoryDescription',
},
{
title: 'Slug',
dataIndex: 'categorySlug',
key: 'categorySlug',
},
{
title: 'Action',
key: 'action',
  render: () => (
    <div className="flex gap-2">
    <Button type="primary"  className="mr-2">
      Update
    </Button>
    <Button type="primary" danger >
      Delete
    </Button>
    </div>
)
}

];
const AdminManagerCatelogries = () => {
  const [categories] = useState<Category[]>([
    {
      categoryId: 1,
      categoryName: 'Điện thoại',
        categoryDescription: 'Các loại điện thoại thông minh',
        categorySlug: 'dien-thoai',
        categoryImage: 'https://example.com/dien-thoai.jpg',
        childCategories: [
          {
            categoryId: 2,
            categoryName: 'Điện thoại Android',
            categoryDescription: 'Các loại điện thoại chạy hệ điều hành Android',
            categorySlug: 'dien-thoai-android',
            categoryImage: 'https://example.com/dien-thoai-android.jpg',
            childCategories: [],
          },
            {
                categoryId: 3,  
                categoryName: 'Điện thoại iOS',
                categoryDescription: 'Các loại điện thoại chạy hệ điều hành iOS',
                categorySlug: 'dien-thoai-ios',
                categoryImage: 'https://example.com/dien-thoai-ios.jpg',
                childCategories: [],
            },
        ],
    }
  ]);
    const [searchTerm, setSearchTerm] = useState('');
    const filteredCategories = categories.filter((cate) =>
    cate.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const { Search } = Input;
  return (
    <div className='flex flex-col h-full w-full mt-12 md:mt-0' >
        <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold'>Quản lý danh mục</h2>
            <button className='bg-blue-500 text-white p-2  rounded hover:bg-blue-600'>
                Thêm danh mục
            </button>
        </div>
    <div className="mt-5 bg-slate-200 p-10 rounded-lg">
        <Search
          placeholder="input search text"
          allowClear
          enterButton="Search"
          size="large"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
       <Table<Category> columns={columns} dataSource={filteredCategories} />
    </div>
    </div>
  )
}

export default AdminManagerCatelogries
