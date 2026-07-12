import { useCallback, useEffect, useState } from "react";
import { Table, Button, Popconfirm } from "antd";
import type { TableProps } from "antd/es/table";

import { useFormModal } from "@/share/hook/useFormModal";
import Notification from "@/share/ComponentCustom/Notification/Notification";
import {getVoucherFields} from "@/pages/Admin/managerVoucher/constants/vouchersFields";
import {filterVouchers} from "@/pages/Admin/managerVoucher/constants/vouchersFilter";
import { vouchersApi } from "@/pages/Admin/managerVoucher/api/vouchers_api";
import {
  FormModalMode,
  type FormModalModeType,
} from "@/share/types/type-form-mode";
import FormModal from "@/share/ComponentCustom/ModelForm";

import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";
import axios from "axios";
import type { voucher } from "@/pages/Admin/managerVoucher/type/vouchers"
import FilterHeader from "@/share/ComponentCustom/FilterTableCustom";
import {getVoucherFieldsByMode} from "@/pages/Admin/managerVoucher/constants/sortField";
import { parseToDayjs } from "@/share/ComponentCustom/FormatTime";



const defaultFormValues: voucher = {
  code: "",
  voucher_name: "",
  discount_type: "percent",
  value: 0,
  minimum_value: 0,
  max_discount: undefined,
  quantity: 0,
  start_date: "",
  end_date: "",
 
};

const AdminManagerVoucher = () => {
  const [vouchers, setVouchers] = useState<voucher[]>([]);
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
    selectedRecord: selectedVoucher,
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
  } = useFormModal<voucher>();


  const fetchVouchers = useCallback(
      async (page: number, limit: number, currentFilters: Record<string, any>) => {
        try {
          setLoading(true); 
          let response;
  
  
          if (Object.keys(currentFilters).length > 0) {
          

            response = await vouchersApi.filter({ ...currentFilters, page, limit });

        
          } 
          else {
            response = await vouchersApi.getAll(page, limit);
          
          }
  
          setVouchers(response.data?.data?.vouchers ?? []);
          setTotal(response.data?.data?.pagination?.total_items ?? 0);
        } catch (error) {
          console.error("Lỗi khi tải danh sách voucher:", error);
        } finally {
          setLoading(false);
        }
      },
      [setTotal, setLoading]
    );
  
  
    useEffect(() => {
      void fetchVouchers(currentPage, pageSize, filters);
    }, [currentPage, pageSize, filters, fetchVouchers ]);
    

  const handleAction = async (mode: FormModalModeType, record?: voucher) => {
    if (mode === FormModalMode.CREATE) {
      setEditingId("");
      openCreate();
      return;
    }

    if (record) {
      try {
        const response = await vouchersApi.getById(record.voucher_id);
        const data = response.data.data?.voucher;

        setEditingId(data.voucher_id);
        


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
          message: "Không thể lấy thông tin voucher này!",
        });
      }
    }
  };

  const handleSubmitForm = async (values: voucher) => {
    try {
      setLoading(true);
      if (modalMode === FormModalMode.CREATE) {
        const payloadCreate = { ...values };

        
        await vouchersApi.create(payloadCreate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Tạo voucher mới thành công!",
        });
      } else {
        const payloadUpdate = { ...values };



        await vouchersApi.update(editingId, payloadUpdate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Cập nhật voucher thành công!",
        });
      }

      await fetchVouchers(currentPage, pageSize, filters);
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

  const handleDeleteVoucher = async (id: number) => {
      try {
        setLoading(true);
        await vouchersApi.delete(id);
        await fetchVouchers(currentPage, pageSize, filters);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Xóa tài khoản thành công!",
        });
      } catch (error) {
          let message = "khong thể xóa voucher này!";
          if (axios.isAxiosError(error)) {
            message =
              error.response?.data?.message ??
              error.message;
          }
        setNotifyData({
          key: Date.now().toString(),
          type: "warning",
          title: "Lỗi xóa voucher",
          message: message,
        });
      } finally {
        setLoading(false);
      }
  };


  const columns: TableProps<voucher>["columns"] = [
    {title: "ID", dataIndex: "voucher_id", key: "voucher_id" },
    {title: "Mã voucher", dataIndex: "code", key: "code" },
    { title: "Tên voucher", dataIndex: "voucher_name", key: "voucher_name" },
    { title: "Loại giảm giá", dataIndex: "discount_type", key: "discount_type" },
    { title: "Giá trị giảm giá", dataIndex: "value", key: "value" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Ngày bắt đầu", dataIndex: "start_date", key: "start_date" , render: (text) => parseToDayjs(text, "YYYY-MM-DD") || text },
    { title: "Ngày kết thúc", dataIndex: "end_date", key: "end_date" , render: (text) => parseToDayjs(text, "YYYY-MM-DD") || text },
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
            description="Bạn có chắc chắn muốn xóa voucher này?"
            onConfirm={() => handleDeleteVoucher(record.voucher_id as number)}
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
  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters); // Cập nhật bộ lọc
    setCurrentPage(1);      // Trở về trang 1 mỗi khi đổi bộ lọc tìm kiếm
  };


  const modalTitle =
    modalMode === FormModalMode.CREATE
      ? "Thêm voucher mới"
      : modalMode === FormModalMode.EDIT
        ? "Cập nhật voucher"
        : "Chi tiết voucher";

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
        <h2 className="text-2xl font-bold">Quản lý voucher</h2>
        <button
          className="button_user"
          onClick={() => handleAction(FormModalMode.CREATE)}
        >
          Thêm voucher
        </button>
      </div>

      <div className="mt-5 bg-slate-200 p-10 rounded-lg">

       <FilterHeader
          fields={filterVouchers}
          onSearch={handleFilter}
          loading={loading}
        />
        
        <Table columns={columns} dataSource={vouchers} rowKey="voucher_id" pagination={
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

      <FormModal<voucher>
        isOpen={isModalOpen}
        onClose={close}
        loading={loading}
        mode={modalMode}
        title={modalTitle}
        fields={getVoucherFieldsByMode(getVoucherFields(selectedVoucher), modalMode)}
        initialValues={selectedVoucher || defaultFormValues}
        onSubmit={handleSubmitForm}
        hasChildren={false}
      />
    </div>
  );
};

export default AdminManagerVoucher;
