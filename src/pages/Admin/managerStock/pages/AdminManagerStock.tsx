import { useCallback, useEffect, useState } from "react";
import { Table, Button } from "antd";
import type { TableProps } from "antd/es/table";

import { stockFields } from "@/pages/Admin/managerStock/constants/StockFields";
import { useFormModal } from "@/share/hook/useFormModal";
import Notification from "@/share/ComponentCustom/Notification/Notification";

import { FormModalMode, type FormModalModeType } from "@/share/types/type-form-mode";
import FormModal from "@/share/ComponentCustom/ModelForm";
import { stockApi } from "@/pages/Admin/managerStock/api/stock_api";
import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";
import axios from "axios";

import type { stock ,StockHistoryItem} from "@/pages/Admin/managerStock/type/stock";
import {getStockFieldsByMode} from "@/pages/Admin/managerStock/constants/sortField";
import FilterHeader from "@/share/ComponentCustom/FilterTableCustom";
import { filterStocks } from "@/pages/Admin/managerStock/constants/StockFilter";
import { TRANSACTION_TYPE } from '@/pages/Admin/managerStock/type/stock';
import { importStockFromExcel, downloadStockTemplate } from '@/share/utils/excelImportStock';
const defaultFormValues: stock = {
  variant_id: 0,
  quantity_change: 0,
  transaction_type: TRANSACTION_TYPE[0].value,
};

const AdminManagerStock = () => {
  const [stock, setStock] = useState<stock[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistoryItem []>([]);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [historyVariantId, setHistoryVariantId] = useState<number | null>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(false);
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
    selectedRecord: selectedStock,
    currentPage,
    pageSize,
    total,
    openCreate,
    close,
    setCurrentPage,
    setPageSize,
    setTotal,
    setLoading,
  } = useFormModal<stock>();

const fetchStock = useCallback(
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
          console.log("Sending filter data:", dataToSend);
          response = await stockApi.filter(dataToSend);
          setStock(response.data?.data?.inventory ?? []);
        } 
        else {
          response = await stockApi.filter({ page, limit });
          console.log("Fetched stock data:", response.data);
           setStock(response.data?.data?.inventory ?? []);
        }

       
        setTotal(response.data?.data?.pagination?.total_items ?? 0);
      } catch (error) {
        console.error("Lỗi khi tải danh sách tồn kho:", error);
      } finally {
        setLoading(false);
      }
    },
    [setTotal, setLoading]
  );

  useEffect(() => {
    void fetchStock(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchStock]);

  const handleAction = async (mode: FormModalModeType, record?: stock) => {

    if (record) {
      try {
        const response = await stockApi.getHistory(record.variant_id, 1, historyPageSize);
        const data = response.data.data;
        setHistoryVariantId(record.variant_id);
        setHistoryPage(1);
        setStockHistory(data.history ?? []);
        setHistoryTotal(data.pagination?.total_items ?? 0);
        setIsViewingHistory(mode === FormModalMode.VIEW);

        if (mode === FormModalMode.CREATE) {
          setIsViewingHistory(false);
          defaultFormValues.variant_id = record.variant_id;
          openCreate();
        }
      } catch (error) {
        console.error("Error fetching stock detail:", error);
        setNotifyData({
          key: Date.now().toString(),
          type: "error",
          title: "Thất bại",
          message: "Không thể lấy thông tin tồn kho!",
        });
      }
    }
  };

  const fetchHistory = useCallback(
    async (variantId: number, page: number, limit: number) => {
      try {
        setHistoryLoading(true);
        const response = await stockApi.getHistory(variantId, page, limit);
        const data = response.data?.data;


        setStockHistory(data?.history ?? []);
        setHistoryTotal(data?.pagination?.total_items ?? 0);
      } catch (error) {
        console.error("Lỗi khi tải lịch sử tồn kho:", error);
      } finally {
        setHistoryLoading(false);
      }
    },
    []
  );

  const handleBackToStockList = () => {
    setIsViewingHistory(false);
    setStockHistory([]);
    setHistoryVariantId(null);
    setHistoryPage(1);
    setHistoryPageSize(10);
    setHistoryTotal(0);
  };

  const handleSubmitForm = async (values: stock) => {
    try {
      setLoading(true);
      values.quantity_change = Number(values.quantity_change);
      await stockApi.updateStock(values);
      await fetchStock(currentPage, pageSize, filters);
      setNotifyData({
        key: Date.now().toString(),
        type: "success",
        title: "Thành công",
        message: "Cập nhật tồn kho thành công!",
      });
      close();
    } catch (error) {
        let message = "khong the luu ton kho này!";
        if (axios.isAxiosError(error)) {
          message =
            error.response?.data?.message ??
            error.message;
        }
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Thất bại",
        message:message || "Không thể cập nhật tồn kho này!"
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
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        const stockPayloads = await importStockFromExcel(file);
        if (stockPayloads.length > 0) {
          await stockApi.updateStock(stockPayloads);
        }

        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Import tồn kho thành công!",
        });
        await fetchStock(currentPage, pageSize, filters);
      } catch (error: any) {
        console.error("Lỗi đọc file:", error);
        let message = "Lỗi import tồn kho!";
        if (error.isAxiosError && error.response?.data?.message) {
          message = error.response.data.message;
        }
        setNotifyData({
          key: Date.now().toString(),
          type: "error",
          title: "Thất bại",
          message: message,
        });
      } finally {
        setLoading(false);
        e.target.value = ''; // Đặt lại input để có thể upload lại cùng 1 file nếu cần
      }
    }
  };

  const columns: TableProps<stock>["columns"] = [
    {title: 'ID', dataIndex: 'variant_id', key: 'variant_id'},
    {title: 'SKU', dataIndex: 'sku', key: 'sku'},
    {title: 'Color', dataIndex: 'color', key: 'color'},
    {title: 'Size', dataIndex: 'size', key: 'size'},
    {title: 'Available Stock', dataIndex: 'available_stock', key: 'available_stock'},
    {title: 'Reserved Stock', dataIndex: 'reserved_stock', key: 'reserved_stock'},
    {title: 'Physical Stock', dataIndex: 'physical_stock', key: 'physical_stock'},
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="default"
            onClick={() => handleAction(FormModalMode.VIEW, record)}
          >
            View History
          </Button>
          <Button
            type="primary"
            onClick={() => handleAction(FormModalMode.CREATE, record)}
          >
            Update
          </Button>
        </div>
      ),
    },
  ];

  const columnsHistory: TableProps<StockHistoryItem>["columns"] = [
    {title: 'History ID', dataIndex: 'history_id', key: 'history_id'},
    {title: 'Transaction Type', dataIndex: 'transaction_type', key: 'transaction_type'},
    {title: 'Quantity Changed', dataIndex: 'quantity_change', key: 'quantity_change'},
    {title: 'New Stock', dataIndex: 'new_stock', key: 'new_stock'},
    {title: 'Performed By', dataIndex: 'performed_by', key: 'performed_by'},
    {title: 'Note', dataIndex: 'note', key: 'note'},
    {title: 'Reference Code', dataIndex: 'reference_code', key: 'reference_code'},
  ];
  const modalTitle =
      modalMode === FormModalMode.EDIT
        ? "Cập nhật tồn kho"
        : "Lịch sử tồn kho";
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

      <div className="flex justify-between items-center mt-2 mb-4">
        <h2 className="text-2xl font-bold">Quản lý tồn kho</h2>
        {!isViewingHistory && (
          <div className="flex items-center gap-3">
            <button 
              onClick={downloadStockTemplate}
              className="px-4 py-2 bg-emerald-50 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200 cursor-pointer text-sm shadow-sm"
            >
              Tải File Mẫu
            </button>
            
            <label className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 text-sm shadow-sm flex items-center justify-center">
              Upload Excel
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleUploadExcel} 
                title="Import dữ liệu Excel"
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      <div className="mt-5 bg-slate-200 p-10 rounded-lg">
        {
          !isViewingHistory && (
             <FilterHeader
          fields={filterStocks}
          onSearch={handleFilter}
          loading={loading}
        />
          )
        }
       
        { !isViewingHistory &&(

          <Table columns={columns} dataSource={stock} rowKey="variant_id" pagination={
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
        )
          
        }
        

        {
          isViewingHistory && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Button onClick={handleBackToStockList} className="w-fit">
                  Quay lại danh sách tồn kho
                </Button>
                <span className="text-sm text-slate-600">
                  Variant ID: {historyVariantId ?? "-"}
                </span>
              </div>
              <Table
                columns={columnsHistory}
                dataSource={stockHistory}
                rowKey="history_id"
                loading={historyLoading}
                pagination={{
                  current: historyPage,
                  pageSize: historyPageSize,
                  total: historyTotal,
                  showSizeChanger: true,
                  onChange: (page, pageSize) => {
                    setHistoryPage(page);
                    setHistoryPageSize(pageSize);
                    if (historyVariantId !== null) {
                      void fetchHistory(historyVariantId, page, pageSize);
                    }
                  },
                }}
              />
            </div>
          )
        }
      </div>
      
      <FormModal<stock>
        isOpen={isModalOpen}
        onClose={close}
        loading={loading}
        mode={modalMode}
        title={modalTitle}
        fields={getStockFieldsByMode( stockFields,modalMode)}
        initialValues={selectedStock || defaultFormValues}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};

export default AdminManagerStock;
