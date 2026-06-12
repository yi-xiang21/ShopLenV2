import { useEffect, useState} from 'react';
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

  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 1. Gộp gọn gọi API vào useEffect
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        const dataList =  response.data;
        setCategories(dataList);
      }
      catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    console.log('State categories hiện tại:', categories);
  }, [categories]);
  



  const handleOpenModal = (mode: FormModalModeType, record?: Category) => {
    setModalMode(mode);
    if (record && (mode === FormModalMode.EDIT || mode === FormModalMode.VIEW)) {
      setSelectedCategory({
        category_name: record.category_name,
        description: record.description,
        image_url: record.image_url,
        children: record.children?.map(child => ({
           category_name: child.category_name,
           description: child.description,
          children: child.children || [],
        })) || [],
      });
    } else {
      setSelectedCategory(defaultFormValues);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(defaultFormValues);
  };

  const handleSubmitForm = async (values: CategoryFormValues) => {
    if (modalMode === FormModalMode.CREATE) {      
      try {
        const formData = new FormData();
        formData.append('category', JSON.stringify(values));
        console.log('FormData trước khi gửi:', formData.get('category'));
        await categoryApi.create(formData);
      } catch (error) {
        console.error(error);
      }
    } else if (modalMode === FormModalMode.EDIT) {
      // Cập nhật danh mục (chưa có API cụ thể, giả sử có endpoint update)
    }
    // handleCloseModal();
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await categoryApi.delete(id);
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        alert('Xóa danh mục thành công!');
      } catch (error) {
        console.error(error);
        alert('Thất bại!');
      } 
    }
  }


  const columns: TableProps<Category>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'category_name', key: 'category_name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="default" onClick={() => handleOpenModal(FormModalMode.VIEW, record)}>View</Button>
          <Button type="primary" onClick={() => handleOpenModal(FormModalMode.EDIT, record)}>Update</Button>
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