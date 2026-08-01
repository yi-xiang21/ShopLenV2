import { useCallback, useEffect, useState } from "react";
import { Table, Button, Popconfirm } from "antd";
import type { TableProps } from "antd/es/table";

import { productFields } from "@/pages/Admin/managerProducts/constants/ProductsFields";
import { childrenProductsFields } from "@/pages/Admin/managerProducts/constants/productsChildrenField";
import { useFormModal } from "@/share/hook/useFormModal";
import Notification from "@/share/ComponentCustom/Notification/Notification";

import {
  FormModalMode,
  type FormModalModeType,
} from "@/share/types/type-form-mode";
import FormModal from "@/share/ComponentCustom/ModelForm";
import { ProductApi } from "@/pages/Admin/managerProducts/api/products_api";
import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";
import axios from "axios";

import type { Product } from "@/pages/Admin/managerProducts/type/products";
import {getProductFieldsByMode,getVariantFieldsByMode} from "@/pages/Admin/managerProducts/constants/sortField";
import FilterHeader from "@/share/ComponentCustom/FilterTableCustom";
import { filterProducts } from "../constants/filterProducts";

import { importProductsFromExcel, downloadProductTemplate } from '@/share/utils/excelImport';


const defaultFormValues: Product = {
  product_id: 0,
  type_id: 0,
  category_id: 0,
  product_name: "",
  description: "",
  product_status: "active",
  variants: [],
};

const AdminManagerProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | "">("");
  const [filters, setFilters] = useState<Record<string, any>>({});
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
    selectedRecord: selectedProduct,
    currentPage,
    pageSize,
    total,
    openCreate,
    openView,
    openEdit,
    close,
    setCurrentPage,
    setPageSize,
    setTotal,
    setLoading,
  } = useFormModal<Product>();


const fetchProducts = useCallback(
    async (page: number, limit: number, currentFilters: Record<string, any>) => {
      try {
        setLoading(true); 
        let response;


        if (Object.keys(currentFilters).length > 0) {
          const dataToSend = {
            ...currentFilters,
            page,
            limit,
          };

          response = await ProductApi.filter(dataToSend);

        } 
        else {
          response = await ProductApi.getAll(page, limit);
        }

        setProducts(response.data?.data?.products ?? []);
        setTotal(response.data?.data?.pagination?.total_items ?? 0);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    },
    [setTotal, setLoading]
  );


  useEffect(() => {
    void fetchProducts(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchProducts]);



  const handleAction = async (mode: FormModalModeType, record?: Product) => {
    if (mode === FormModalMode.CREATE) {
      setEditingId("");
      openCreate();
      return;
    }

    if (record) {
      try {
        const response = await ProductApi.getById(record.product_id);
        const data = response.data.data.product;

        setEditingId(data.product_id);

        const dataFormatPrice = {
          ...data,
          variants: data.variants.map((variant: any) => ({
            ...variant,
            price: Number(variant.price).toLocaleString("vi-VN") + "đ",
          })),
        };



        if (mode === FormModalMode.EDIT) {
          openEdit(data);
        } else {
          openView(dataFormatPrice);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setNotifyData({
          key: Date.now().toString(),
          type: "error",
          title: "Thất bại",
          message: "Không thể lấy thông tin sản phẩm này!",
        });
      }
    }
  };

  const handleSubmitForm = async (values: Product) => {
    try {
      
      setLoading(true);
      if (modalMode === FormModalMode.CREATE) {
        const payloadCreate = { ...values };
        
        console.log("Payload for creating product:", payloadCreate);
        await ProductApi.create(payloadCreate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Tạo sản phẩm mới thành công!",
        });
      } else {
        const payloadUpdate = { ...values };
        
        console.log("data upload gui len " ,payloadUpdate);
        await ProductApi.update(editingId, payloadUpdate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Cập nhật sản phẩm thành công!",
        });
      }

      await fetchProducts(currentPage, pageSize, filters);
      close();
    } catch (error) {
        let message = "khong the luu san pham này!";
        if (axios.isAxiosError(error)) {
          message =
            error.response?.data?.message ??
            error.message;
        }
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Thất bại",
        message:
  message ||
  (
    modalMode === FormModalMode.CREATE
      ? "Không thể tạo sản phẩm mới!"
      : "Không thể cập nhật sản phẩm này!"
  ),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
      try {
        setLoading(true);
        await ProductApi.delete(id);
        await fetchProducts(currentPage, pageSize, filters);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Xóa sản phẩm thành công!",
        });
      } catch (error) {
          let message = "khong thể xóa sản phẩm này!";
          if (axios.isAxiosError(error)) {
            message =
              error.response?.data?.message ??
              error.message;
          }
        setNotifyData({
          key: Date.now().toString(),
          type: "warning",
          title: "Lỗi xóa sản phẩm",
          message: message,
        });
      } finally {
        setLoading(false);
      }
  };




  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters); 
    setCurrentPage(1);     
  };

  const handleUploadExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;

  const excelFile = files.find(f => f.name.endsWith('.xlsx') || f.name.endsWith('.xls'));
  const imageFiles = files.filter(f => f.type.startsWith('image/'));

  if (!excelFile) {
    setNotifyData({
      key: Date.now().toString(),
      type: "error",
      title: "Thất bại",
      message: "Vui lòng chọn file Excel (.xlsx hoặc .xls)",
    });
    return;
  }

  try {

    const base64ImageMap: Record<string, string> = {};
    for (const img of imageFiles) {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
      base64ImageMap[img.name] = base64;
    }

    const productsData = await importProductsFromExcel(excelFile, base64ImageMap);
    console.log(productsData)
    if(productsData.length > 0){
      const res = await ProductApi.create(productsData);
        console.log(res)
      }
      setNotifyData({
        key: Date.now().toString(),
        type: "success",
        title: "Thành công",
        message: "Import sản phẩm thành công!",
      });
      await fetchProducts(currentPage, pageSize, filters);
    } catch (error:any) {
        let message = "Lỗi đọc file!";
        if (error.isAxiosError && error.response?.data?.message) {
          message = error.response.data.message;
        }
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Thất bại",
        message: message,
      });
    }
  };

  const columns: TableProps<Product>["columns"] = [
    {title: 'ID', dataIndex: 'product_id', key: 'product_id'},
    { title: "Tên sản phẩm", dataIndex: "product_name", key: "product_name" },

    {title: 'Trang Thái', dataIndex: 'product_status', key: 'product_status',
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded ${status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {title : 'Tên Danh Mục', dataIndex: 'category_name', key: 'category_name'},
    {
      title: "Tên Loại",
      dataIndex: "type_name",
      key: "type_name",
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
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDeleteProduct(record.product_id as number)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const modalTitle =
    modalMode === FormModalMode.CREATE
      ? "Thêm sản phẩm mới"
      : modalMode === FormModalMode.EDIT
        ? "Cập nhật sản phẩm"
        : "Chi tiết sản phẩm";
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
        <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={downloadProductTemplate}
            className="px-4 py-2 bg-emerald-50 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200 cursor-pointer text-sm shadow-sm"
          >
            Tải File Mẫu
          </button>
          
          <label className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 text-sm shadow-sm flex items-center justify-center">
            Upload Excel & Ảnh (File)
            <input 
              type="file" 
              accept=".xlsx, .xls, image/*" 
              multiple
              onChange={handleUploadExcel} 
              title="Import dữ liệu Excel và Ảnh"
              className="hidden"
            />
          </label>

          <label className="cursor-pointer px-4 py-2 bg-purple-50 text-purple-600 font-semibold rounded-lg hover:bg-purple-100 transition-colors border border-purple-200 text-sm shadow-sm flex items-center justify-center">
            Upload Excel & Ảnh (Folder)
            <input 
              type="file" 
              
              multiple
              onChange={handleUploadExcel} 
              title="Import dữ liệu Excel và Ảnh từ Folder"
              className="hidden"
              {...{ webkitdirectory: "", directory: "" } as any} 
            />
          </label>
          
          <button
            className="button_user"
            onClick={() => handleAction(FormModalMode.CREATE)}
          >
            Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="mt-5 bg-slate-200 p-10 rounded-lg">
        <FilterHeader
          fields={filterProducts}
          onSearch={handleFilter}
          loading={loading}
        />
        <Table columns={columns} dataSource={products} rowKey="product_id" pagination={
          {
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }
        } />
      </div>
      

      <FormModal<Product>
        isOpen={isModalOpen}
        onClose={close}
        childKey="variants"
        loading={loading}
        mode={modalMode}
        title={modalTitle}
        fields={getProductFieldsByMode(productFields, modalMode)}
        childFields={getVariantFieldsByMode(childrenProductsFields, modalMode)}
        initialValues={selectedProduct || defaultFormValues}
        onSubmit={handleSubmitForm}
        tabNamePrefix="biến thể"
        hasChildren={true}
      />
    </div>
  );
};

export default AdminManagerProducts;
