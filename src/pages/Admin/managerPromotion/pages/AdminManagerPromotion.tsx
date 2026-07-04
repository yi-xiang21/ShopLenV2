import { useCallback, useEffect, useState } from "react";
import { Table, Button } from "antd";
import type { TableProps } from "antd/es/table";

import { useFormModal } from "@/share/hook/useFormModal";
import Notification from "@/share/ComponentCustom/Notification/Notification";
import { promotionApi } from "@/pages/Admin/managerPromotion/api/promotion_api";
import { filterPromotions } from "@/pages/Admin/managerPromotion/constants/promotionFilter";
import { promotionFields } from "@/pages/Admin/managerPromotion/constants/promotionFields";
import {
  FormModalMode,
  type FormModalModeType,
} from "@/share/types/type-form-mode";
import FormModal from "@/share/ComponentCustom/ModelForm";

import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";
import axios from "axios";
import type { promotion } from "@/pages/Admin/managerPromotion/type/promotion";
import FilterHeader from "@/share/ComponentCustom/FilterTableCustom";
import { getPromotionFieldsByMode } from "@/pages/Admin/managerPromotion/constants/sortField";
import { parseToDayjs } from "@/share/ComponentCustom/FormatTime";
import {promotionChildrenFields} from "@/pages/Admin/managerPromotion/constants/promotionChilrenFields";

const defaultFormValues:  promotion = {
  title: "",
  discount_type: "percent",
  value: 0,
  min_order_value: 0,
  status: "active",
  start_date: "",
  end_date: "",
  applicable_products: [],
};

const AdminManagerPromotion = () => {
  const [promotions, setPromotions] = useState<promotion[]>([]);
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
    selectedRecord: selectedPromotion,
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
  } = useFormModal<promotion>();


  const fetchPromotions = useCallback(
      async (page: number, limit: number, currentFilters: Record<string, any>) => {
        try {
          setLoading(true); 
          let response;
  
  
          if (Object.keys(currentFilters).length > 0) {
          
            response = await promotionApi.filter({ ...currentFilters, page, limit });
        
          } 
          else {
            
            response = await promotionApi.getAll(page, limit);
          }
  
          setPromotions(response.data?.data?.promotions ?? []);
          setTotal(response.data?.data?.pagination?.total_items ?? 0);
        } catch (error) {
          console.error("Lỗi khi tải danh sách promotion:", error);
        } finally {
          setLoading(false);
        }
      },
      [setTotal, setLoading]
    );
  
  
    useEffect(() => {
      void fetchPromotions(currentPage, pageSize, filters);
    }, [currentPage, pageSize, filters, fetchPromotions ]);
    

  const handleAction = async (mode: FormModalModeType, record?: promotion) => {
    if (mode === FormModalMode.CREATE) {
      setEditingId("");
      openCreate();
      return;
    }

    if (record) {
      try {
        const response = await promotionApi.getById(record.promotion_id);
        const data = response.data.data?.promotion;
        setEditingId(data.promotion_id);
        


        if (mode === FormModalMode.EDIT) {
          openEdit(data);
        } else {
          openView(data);
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
        setNotifyData({
          key: Date.now().toString(),
          type: "error",
          title: "Thất bại",
          message: "Không thể lấy thông tin promotion này!",
        });
      }
    }
  };

  const handleSubmitForm = async (values: promotion) => {
    try {
      setLoading(true);
      if (modalMode === FormModalMode.CREATE) {
        const payloadCreate = { ...values };

        
        await promotionApi.create(payloadCreate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Tạo promotion mới thành công!",
        });
      } else {
        const payloadUpdate = { ...values };

        await promotionApi.update(editingId, payloadUpdate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Cập nhật promotion thành công!",
        });
      }

      await fetchPromotions(currentPage, pageSize, filters);
      close();
    } catch (error) {
        let message = "khong the luu tai khoan này!";
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
      ? "Không thể tạo voucher mới!"
      : "Không thể cập nhật voucher này!"
  ),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromotion = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa promotion này?")) {
      try {
        setLoading(true);
        await promotionApi.delete(id);
        await fetchPromotions(currentPage, pageSize, filters);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Xóa promotion thành công!",
        });
      } catch (error) {
          let message = "khong thể xóa promotion này!";
          if (axios.isAxiosError(error)) {
            message =
              error.response?.data?.message ??
              error.message;
          }
        setNotifyData({
          key: Date.now().toString(),
          type: "warning",
          title: "Lỗi xóa promotion",
          message: message,
        });
      } finally {
        setLoading(false);
      }
    }
  };


  const columns: TableProps<promotion>["columns"] = [
    { title: "ID", dataIndex: "promotion_id", key: "promotion_id" },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Loại giảm giá", dataIndex: "discount_type", key: "discount_type" },
    { title: "Giá trị", dataIndex: "value", key: "value" },
     {title: 'Trạng thái', dataIndex: 'status', key: 'status',width: 170 ,render: (status) => (
      <span
        className={`px-2 py-1 rounded ${status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
      >
        {status === "active" ? "Hoạt động" : "Không hoạt động"}
      </span>
    )},
    { title: "Ngày bắt đầu", dataIndex: "start_date", key: "start_date" , render: (text) => parseToDayjs(text)?.format("YYYY-MM-DD") || text },
    { title: "Ngày kết thúc", dataIndex: "end_date", key: "end_date" , render: (text) => parseToDayjs(text)?.format("YYYY-MM-DD") || text },
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
            onClick={() => handleDeletePromotion(record.promotion_id as number)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);      
  };


  const modalTitle =
    modalMode === FormModalMode.CREATE
      ? "Thêm khuyến mãi mới"
      : modalMode === FormModalMode.EDIT
        ? "Cập nhật khuyến mãi"
        : "Chi tiết khuyến mãi";

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
        <h2 className="text-2xl font-bold">Quản lý khuyến mãi</h2>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={() => handleAction(FormModalMode.CREATE)}
        >
          Thêm khuyến mãi 
        </button>
      </div>

      <div className="mt-5 bg-slate-200 p-10 rounded-lg">

       <FilterHeader
          fields={filterPromotions}
          onSearch={handleFilter}
          loading={loading}
        />
        
        <Table columns={columns} dataSource={promotions} rowKey="promotion_id" pagination={
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

      <FormModal<promotion>
        isOpen={isModalOpen}
        onClose={close}
        loading={loading}
        mode={modalMode}
        title={modalTitle}
        fields={getPromotionFieldsByMode(promotionFields, modalMode)}
        initialValues={selectedPromotion || defaultFormValues}
        onSubmit={handleSubmitForm}
        hasChildren={true}
        childFields={promotionChildrenFields}
        childKey="applicable_products"
        tabNamePrefix="Sản phẩm áp dụng"
      />
    </div>
  );
};

export default AdminManagerPromotion;
