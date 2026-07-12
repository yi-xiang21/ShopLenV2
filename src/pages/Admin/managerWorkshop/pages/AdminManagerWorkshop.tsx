import { useCallback, useEffect, useState } from "react";
import { Table, Button, Popconfirm } from "antd";
import type { TableProps } from "antd/es/table";


import { useFormModal } from "@/share/hook/useFormModal";
import Notification from "@/share/ComponentCustom/Notification/Notification";

import {
  FormModalMode,
  type FormModalModeType,
} from "@/share/types/type-form-mode";
import FormModal from "@/share/ComponentCustom/ModelForm";

import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";
import axios from "axios";
import FilterHeader from "@/share/ComponentCustom/FilterTableCustom";
import type { Workshop } from "@/pages/Admin/managerWorkshop/types/workshop";
import {getWorkshopFieldsByMode} from "@/pages/Admin/managerWorkshop/constants/sortField";
import {workshopFields} from "@/pages/Admin/managerWorkshop/constants/workshopFields";
import {getWorkshopChildrenFields} from "@/pages/Admin/managerWorkshop/constants/workshopChilrenFields";
import {WorkshopApi} from "@/pages/Admin/managerWorkshop/api/workShop_api";

import { filterWorkshop } from "@/pages/Admin/managerWorkshop/constants/workshopFilter";
const defaultFormValues: Workshop = {
  title: "",
  description: "",
  location: "",
  category_id: 0,
  workshop_id: 0,
  product_id: 0,
  status: "active",
  sessions: [],
};

const AdminManagerWorkshop= () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
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
    selectedRecord: selectedWorkshop,
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
  } = useFormModal<Workshop>();


const fetchWorkshops = useCallback(
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

          response = await WorkshopApi.getAll(dataToSend);

        } 
        
        else {
          response = await WorkshopApi.getAll({page, limit});

        }

        setWorkshops(response.data?.data?.workshops ?? []);
        setTotal(response.data?.data?.pagination?.total_items ?? 0);
      } catch (error) {
        console.error("Lỗi khi tải danh sách workshop:", error);
      } finally {
        setLoading(false);
      }
    },
    [setTotal, setLoading]
  );


  useEffect(() => {
    void fetchWorkshops(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchWorkshops]);



  const handleAction = async (mode: FormModalModeType, record?: Workshop) => {
    if (mode === FormModalMode.CREATE) {
      setEditingId("");
      openCreate();
      return;
    }

    if (record) {
      try {
        const response = await WorkshopApi.getById(record.workshop_id);
        const data = response.data.data.workshop;


        setEditingId(data.workshop_id);



        if (mode === FormModalMode.EDIT) {
          openEdit(data);
        } else {
          openView(data);
        }
      } catch (error) {
        console.error("Error fetching workshop details:", error);
        setNotifyData({
          key: Date.now().toString(),
          type: "error",
          title: "Thất bại",
          message: "Không thể lấy thông tin workshop này!",
        });
      }
    }
  };

  const handleSubmitForm = async (values: Workshop) => {
    try {
      
      setLoading(true);
      if (modalMode === FormModalMode.CREATE) {
        const payloadCreate = { ...values };
        

        await WorkshopApi.create(payloadCreate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Tạo workshop mới thành công!",
        });
      } else {
        const payloadUpdate = { ...values };
        console.log("Updating workshop with Payload:", payloadUpdate);
        await WorkshopApi.update(editingId, payloadUpdate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Cập nhật workshop thành công!",
        });
      }

      await fetchWorkshops(currentPage, pageSize, filters);
      close();
    } catch (error) {
        let message = "khong the luu workshop này!";
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
      ? "Không thể tạo workshop mới!"
      : "Không thể cập nhật workshop này!"
  ),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkshop = async (id: number) => {
      try {
        setLoading(true);
        await WorkshopApi.delete(id);
        await fetchWorkshops(currentPage, pageSize, filters);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Xóa workshop thành công!",
        });
      } catch (error) {
          let message = "khong thể xóa workshop này!";
          if (axios.isAxiosError(error)) {
            message =
              error.response?.data?.message ??
              error.message;
          }
        setNotifyData({
          key: Date.now().toString(),
          type: "warning",
          title: "Lỗi xóa workshop",
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

  const columns: TableProps<Workshop>["columns"] = [
    {title: 'ID', dataIndex: 'workshop_id', key: 'workshop_id' },
    {title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    {title: 'Địa điểm', dataIndex: 'location', key: 'location' },
    
    {title: 'Trạng thái', dataIndex: 'status', key: 'status',width: 150 ,render: (status) => (
      <span
        className={`px-2 py-1 rounded ${status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
      >
        {status === "active" ? "Hoạt động" : "Không hoạt động"}
      </span>
    )},
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
            description="Bạn có chắc chắn muốn xóa workshop này?"
            onConfirm={() => handleDeleteWorkshop(record.workshop_id as number)}
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
      ? "Thêm workshop mới"
      : modalMode === FormModalMode.EDIT
        ? "Cập nhật workshop"
        : "Chi tiết workshop";
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
        <h2 className="text-2xl font-bold">Quản lý workshop</h2>
        <button
          className="button_user"
          onClick={() => handleAction(FormModalMode.CREATE)}
        >
          Thêm workshop
        </button>
      </div>

      <div className="mt-5 bg-slate-200 p-10 rounded-lg " >
        <FilterHeader
          fields={filterWorkshop}
          onSearch={handleFilter}
          loading={loading}
        />
        <Table columns={columns} dataSource={workshops} rowKey="workshop_id" pagination={
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
      

      <FormModal<Workshop>
        isOpen={isModalOpen}
        onClose={close}
        childKey="sessions"
        loading={loading}
        mode={modalMode}
        title={modalTitle}
        fields={getWorkshopFieldsByMode(workshopFields, modalMode)}
        childFields={getWorkshopFieldsByMode(getWorkshopChildrenFields(selectedWorkshop), modalMode)}
        initialValues={selectedWorkshop || defaultFormValues}
        onSubmit={handleSubmitForm}
        hasChildren={true}
      />
    </div>
  );
};

export default AdminManagerWorkshop;
