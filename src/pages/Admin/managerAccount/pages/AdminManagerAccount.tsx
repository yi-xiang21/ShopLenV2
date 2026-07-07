import { useCallback, useEffect, useState } from "react";
import { Table, Button } from "antd";
import type { TableProps } from "antd/es/table";

import { filterAccount } from "@/pages/Admin/managerAccount/constants/accountFilter";
import { accountFields } from "@/pages/Admin/managerAccount/constants/accountFields";
import { useFormModal } from "@/share/hook/useFormModal";
import Notification from "@/share/ComponentCustom/Notification/Notification";

import {
  FormModalMode,
  type FormModalModeType,
} from "@/share/types/type-form-mode";
import FormModal from "@/share/ComponentCustom/ModelForm";
import {AccountApi } from "@/pages/Admin/managerAccount/api/account_api";
import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";
import axios from "axios";

import type { account } from "@/pages/Admin/managerAccount/type/account";
import FilterHeader from "@/share/ComponentCustom/FilterTableCustom";



const defaultFormValues: account = {
  user_id: 0,
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  status: { active: "active", inactive: "inactive" },
  role: { customer: "customer", admin: "admin" },
 
};

const AdminManagerAccount = () => {
  const [accounts, setAccounts] = useState<account[]>([]);
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
    selectedRecord: selectedAccount,
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
  } = useFormModal<account>();


  const fetchAccounts = useCallback(
      async (page: number, limit: number, currentFilters: Record<string, any>) => {
        try {
          setLoading(true); 
          let response;
  
  
          if (Object.keys(currentFilters).length > 0) {
           

            response = await AccountApi.filter({ ...currentFilters, page, limit });

          } 
          else {
            response = await AccountApi.getAll(page, limit);
          
          }
  
          setAccounts(response.data?.data?.users ?? []);
          setTotal(response.data?.data?.pagination?.total_items ?? 0);
        } catch (error) {
          console.error("Lỗi khi tải danh sách tài khoản:", error);
        } finally {
          setLoading(false);
        }
      },
      [setTotal, setLoading]
    );
  
  
    useEffect(() => {
      void fetchAccounts(currentPage, pageSize, filters);
    }, [currentPage, pageSize, filters, fetchAccounts]);
    

  const handleAction = async (mode: FormModalModeType, record?: account) => {
    if (mode === FormModalMode.CREATE) {
      setEditingId("");
      openCreate();
      return;
    }

    if (record) {
      try {
        const response = await AccountApi.getById(record.user_id);
        const data = response.data;


        setEditingId(data.user_id);
        delete data.password;


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
          message: "Không thể lấy thông tin tài khoản này!",
        });
      }
    }
  };

  const handleSubmitForm = async (values: account) => {
    try {
      setLoading(true);
      if (modalMode === FormModalMode.CREATE) {
        const payloadCreate = { ...values };
        delete payloadCreate.user_id;
        delete payloadCreate.status;

        await AccountApi.create(payloadCreate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Tạo tai khoan mới thành công!",
        });
      } else {
        const payloadUpdate = { ...values };
        delete payloadUpdate.user_id;
        
        await AccountApi.update(editingId, payloadUpdate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Cập nhật tài khoản thành công!",
        });
      }

      await fetchAccounts(currentPage, pageSize, filters);
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
      ? "Không thể tạo tài khoản mới!"
      : "Không thể cập nhật tài khoản này!"
  ),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      try {
        setLoading(true);
        await AccountApi.delete(id);
        await fetchAccounts(currentPage, pageSize, filters);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Xóa tài khoản thành công!",
        });
      } catch (error) {
          let message = "khong thể xóa tài khoản này!";
          if (axios.isAxiosError(error)) {
            message =
              error.response?.data?.message ??
              error.message;
          }
        setNotifyData({
          key: Date.now().toString(),
          type: "warning",
          title: "Lỗi xóa tài khoản",
          message: message,
        });
      } finally {
        setLoading(false);
      }
    }
  };


  const columns: TableProps<account>["columns"] = [
    { title: "user_id", dataIndex: "user_id", key: "id" },
    { title: "Name", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone Number", dataIndex: "phone_number", key: "phone_number" },
    { title: "Status", dataIndex: "status", key: "status",
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded ${status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "First Name", dataIndex: "first_name", key: "first_name" },
    { title: "Last Name", dataIndex: "last_name", key: "last_name" },
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
            onClick={() => handleDeleteAccount(record.user_id as number)}
          >
            Delete
          </Button>
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
      ? "Thêm tài khoản mới"
      : modalMode === FormModalMode.EDIT
        ? "Cập nhật tài khoản"
        : "Chi tiết tài khoản";

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
        <h2 className="text-2xl font-bold">Quản lý tài khoản</h2>
        <button
          className="button_user"
          onClick={() => handleAction(FormModalMode.CREATE)}
        >
          Thêm tài khoản
        </button>
      </div>

      <div className="mt-5 bg-slate-200 p-10 rounded-lg">

       <FilterHeader
          fields={filterAccount}
          onSearch={handleFilter}
          loading={loading}
        />
        
        <Table columns={columns} dataSource={accounts} rowKey="user_id" pagination={
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

      <FormModal<account>
        isOpen={isModalOpen}
        onClose={close}
        loading={loading}
        mode={modalMode}
        title={modalTitle}
        fields={modalMode === (FormModalMode.CREATE) ? accountFields : accountFields.filter(field => field.key !== 'password') }
        initialValues={selectedAccount || defaultFormValues}
        onSubmit={handleSubmitForm}
        hasChildren={false}
        
      />
    </div>
  );
};

export default AdminManagerAccount;
