import { useEffect, useState } from "react";
import { Table, Input, Button } from "antd";
import type { TableProps } from "antd/es/table";
import type {
  Category,
  CategoryFormValues,
} from "@/pages/Admin/managerCatelogy/type/catelogy";
import { categoryFields } from "../constants/categoryFields";
import { useFormModal } from "@/share/hook/useFormModal";
import Notification from "@/share/ComponentCustom/Notification/Notification";

import {
  FormModalMode,
  type FormModalModeType,
} from "@/share/types/type-form-mode";
import FormModal from "@/component/ModelForm";
import { categoryApi } from "@/pages/Admin/managerCatelogy/api/cate_api";
import { childCategoryFields } from "../constants/catrgoryChildrenField";
import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";

const { Search } = Input;

const defaultFormValues: CategoryFormValues = {
  category_name: "",
  description: "",
  image_url: "",
  children: [],
};

const AdminManagerCatelogries = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string>("");
  const [notifyData, setNotifyData] = useState<{
    key: string;
    type: NotificationType;
    title: string;
    message: string;
  } | null>(null);

  const {
    open: isModalOpen,
    mode: modalMode,
    loading,
    selectedRecord: selectedCategory,
    openCreate,
    openView,
    openEdit,
    close,
    setLoading,
  } = useFormModal<CategoryFormValues>();

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data?.data?.categories ?? []);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    void fetchCategories();
  }, []);

  const handleAction = async (mode: FormModalModeType, record?: Category) => {
    if (mode === FormModalMode.CREATE) {
      setEditingId("");
      openCreate();
      return;
    }

    if (record) {
      try {
        const response = await categoryApi.getById(record.id);
        const data = response.data;

        setEditingId(data.id);

        const mapChildren = (childrenArray: any[]): any[] => {
          if (!childrenArray) return [];
          return childrenArray.map((child: any) => ({
            id: child.id,
            category_name: child.category_name,
            description: child.description,
            children: mapChildren(child.children),
          }));
        };

        const mappedData: CategoryFormValues = {
          id: data.id,
          category_name: data.category_name,
          description: data.description,
          image_url: data.image_url,
          children: mapChildren(data.children),
        };

        if (mode === FormModalMode.EDIT) {
          openEdit(mappedData);
        } else {
          openView(mappedData);
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
        setNotifyData({
          key: Date.now().toString(),
          type: "error",
          title: "Thất bại",
          message: "Không thể lấy thông tin chi tiết của danh mục này!",
        });
      }
    }
  };

  const handleSubmitForm = async (values: CategoryFormValues) => {
    try {
      setLoading(true);
      if (modalMode === FormModalMode.CREATE) {
        const payloadCreate = { ...values };
        delete payloadCreate.id;

        await categoryApi.create(payloadCreate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Tạo danh mục mới thành công!",
        });
      } else {
        const payloadUpdate = {
          ...values,
          parent_category_id: null,
        };
        await categoryApi.update(editingId, payloadUpdate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Cập nhật danh mục thành công!",
        });
      }

      await fetchCategories();
      close();
    } catch (error) {
      console.error("Error submitting form:", error);
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Thất bại",
        message:
          modalMode === FormModalMode.CREATE
            ? "Không thể tạo danh mục mới!"
            : "Không thể cập nhật danh mục này!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        setLoading(true);
        await categoryApi.delete(id);
        await fetchCategories();
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Xóa danh mục thành công!",
        });
      } catch (error) {
        console.error("Error deleting category:", error);
        setNotifyData({
          key: Date.now().toString(),
          type: "warning",
          title: "Lỗi xóa danh mục",
          message: "Đã xảy ra sự cố khi xóa danh mục khỏi hệ thống.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns: TableProps<Category>["columns"] = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "category_name", key: "category_name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image_url",
      render: (text) =>
        text ? (
          <img
            src={text}
            alt="Category"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          <span className="italic text-gray-500">No Image</span>
        ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (text) => <span className="italic text-gray-500">{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="default"
            onClick={() => handleAction(FormModalMode.VIEW, record)}
          >
            View
          </Button>
          <Button
            type="primary"
            onClick={() => handleAction(FormModalMode.EDIT, record)}
          >
            Update
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleDeleteCategory(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const modalTitle =
    modalMode === FormModalMode.CREATE
      ? "Thêm danh mục mới"
      : modalMode === FormModalMode.EDIT
        ? "Cập nhật danh mục"
        : "Chi tiết danh mục";

  return (
    <div className="flex flex-col h-full w-full mt-12 md:mt-0">
      {notifyData && (
        <Notification
          key={notifyData.key}
          type={notifyData.type}
          title={notifyData.title}
          message={notifyData.message}
        />
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý danh mục</h2>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={() => handleAction(FormModalMode.CREATE)}
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
        onClose={close}
        loading={loading}
        mode={modalMode}
        title={modalTitle}
        fields={categoryFields}
        childFields={childCategoryFields}
        initialValues={selectedCategory || defaultFormValues}
        onSubmit={handleSubmitForm}
        hasChildren={true}
        nestedLimit={1}
      />
    </div>
  );
};

export default AdminManagerCatelogries;
