import { useCallback, useEffect, useState} from 'react';
import { Table, Input, Button } from 'antd';
import type { TableProps } from 'antd/es/table';
import type { Category, CategoryFormValues } from '@/pages/Admin/managerCatelogy/type/catelogy';
import { categoryFields } from '../constants/categoryFields';
import { FormModalMode, type FormModalModeType } from '@/share/types/type-form-mode'; 
import FormModal from '@/component/ModelForm'; 
import { categoryApi } from '@/pages/Admin/managerCatelogy/api/cate_api';
import { childCategoryFields } from '../constants/catrgoryChildrenField';

const { Search } = Input;

const defaultFormValues: CategoryFormValues = {
  category_name: '',
  description: '',
  image_url: '',
  children: [], 
};

const AdminManagerCatelogries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FormModalModeType>(FormModalMode.CREATE);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFormValues>(defaultFormValues);

  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string >('');
  

  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  



  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);


  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  



  const handleOpenModal = (mode: FormModalModeType, data?: Category) => {
    setModalMode(mode);
    if (data && (mode === FormModalMode.EDIT || mode === FormModalMode.VIEW)) {
      setEditingId(data.id);
      setSelectedCategory({
        category_name: data.category_name,
        description: data.description,
        image_url: data.image_url,
        children: data.children?.map(child => ({
           category_name: child.category_name,
           description: child.description,
          children: child.children || [],
        })) || [],
      });
    } else {
      setEditingId('');
      setSelectedCategory(defaultFormValues);
    }
    setIsModalOpen(true);
  };

  const getCategoryById = async (id: string) => {
    try {
      const response = await categoryApi.getById(id);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch category by ID:', error);
      return null;
    }
  };

  const handleFetchAndOpenModal = async (mode: FormModalModeType, record: Category) => {

    const detailedData = await getCategoryById(record.id);

    if (detailedData) {
      handleOpenModal(mode, detailedData);
    } else {
      alert("Không thể lấy thông tin chi tiết của danh mục này!");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(defaultFormValues);
  };

  const handleSubmitForm = async (values: CategoryFormValues | Category) => {
    if (modalMode === FormModalMode.CREATE) {      
      try { 
        await categoryApi.create(values);
        await fetchCategories();
      } catch (error) {
        console.error(error);
      }
    } else if (modalMode === FormModalMode.EDIT) {
      try {
        console.log('Submitting update for ID:', editingId, 'with values:', values);
        await categoryApi.update(editingId, values);
        await fetchCategories();
      } catch (error) {
        console.error(error);
      }
    }
    handleCloseModal();
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await categoryApi.delete(id);
        await fetchCategories();
        alert('Xóa danh mục thành công!');
      } catch (error) {
        console.error(error);
        alert('dang co san pham thuoc danh muc nay, khong the xoa!');
      } 
    }
  }


  const columns: TableProps<Category>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'category_name', key: 'category_name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Image',
      dataIndex: 'image_url',
      key: 'image_url',
      render: (text) => text ? <img src={text} alt="Category" style={{ width: '50px', height: '50px', objectFit: 'cover' }} /> : <span className="italic text-gray-500">No Image</span>,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (text) => <span className="italic text-gray-500">{text}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
         
          <Button type="default" onClick={() => handleFetchAndOpenModal(FormModalMode.VIEW, record)}>
            View
          </Button>
          <Button type="primary" onClick={() => handleFetchAndOpenModal(FormModalMode.EDIT, record)}>
            Update
          </Button>
          <Button type="primary" danger onClick={() => handleDeleteCategory(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const modalTitle = 
    modalMode === FormModalMode.CREATE ? 'Thêm danh mục mới' :
    modalMode === FormModalMode.EDIT ? 'Cập nhật danh mục' : 
    'Chi tiết danh mục';

  

  return (
    <div className='flex flex-col h-full w-full mt-12 md:mt-0'>

      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Quản lý danh mục</h2>
        <button 
          className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
          onClick={() => handleOpenModal(FormModalMode.CREATE)}
        >
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
        <Table columns={columns} dataSource={filteredCategories} rowKey="id" />
      </div>

      <FormModal<CategoryFormValues>
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        title={modalTitle}
        fields={categoryFields} 
        childFields={childCategoryFields}
        initialValues={selectedCategory}
        onSubmit={handleSubmitForm}
        hasChildren={true}
        nestedLimit={1}
      />
    </div>
  );
};

export default AdminManagerCatelogries;