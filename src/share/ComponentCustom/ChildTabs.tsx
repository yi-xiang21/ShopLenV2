import React from 'react';
import { Tabs, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import DynamicForm from '@/share/ComponentCustom/DynamicForm';
import type { FormField } from '@/share/types/form-field';

interface ChildTabsProps {
  dataList: any[];                      // Mảng dữ liệu con hiện tại
  onChange: (newDataList: any[]) => void; // Hàm trả về mảng mới khi có thay đổi
  fields: FormField<any>[];             // Bộ fields dùng cho con
  
  // Props quản lý lồng nhau
  nestedLimit: number;                  // Số lượng cấp con lồng nhau tối đa được phép
  currentDepth?: number;                // Độ sâu hiện tại (ẩn, dùng cho nội bộ)
  
  isViewMode: boolean;                  // Chế độ xem?
  tabNamePrefix?: string;               // Tiền tố tên tab (VD: "Biến thể", "Danh mục con")
}

const ChildTabs: React.FC<ChildTabsProps> = ({
  dataList = [],
  onChange,
  fields,
  nestedLimit,
  currentDepth = 1,
  isViewMode,
  tabNamePrefix = 'Mục con',
}) => {
  // 1. Thêm một Tab mới
  const handleAddTab = () => {
    onChange([...dataList, {}]); // Thêm 1 object rỗng vào mảng
  };

  // 2. Xóa một Tab
  const handleRemoveTab = (indexToRemove: number) => {
    const newData = [...dataList];
    newData.splice(indexToRemove, 1);
    onChange(newData);
  };

  // 3. Thay đổi dữ liệu form bên trong 1 Tab
  const handleFormChange = (index: number, key: string, value: unknown) => {
    const newData = [...dataList];
    newData[index] = { ...newData[index], [key]: value };
    onChange(newData);
  };

  // 4. Thay đổi mảng con của con (Dành cho cấp lồng nhau)
  const handleNestedChildrenChange = (index: number, newChildrenArray: any[]) => {
    const newData = [...dataList];
    newData[index] = { ...newData[index], children: newChildrenArray };
    onChange(newData);
  };

  const canHaveNestedChildren = currentDepth <= nestedLimit;

  return (
    <div className="bg-slate-50 p-4 border border-slate-200 rounded-md mt-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-slate-700">Danh sách {tabNamePrefix}</h4>
        {!isViewMode && (
          <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddTab} size="small" className="border-blue-400 text-blue-500">
            Thêm {tabNamePrefix}
          </Button>
        )}
      </div>

      {dataList.length > 0 ? (
        <Tabs
          type="card"
          items={dataList.map((item: any, index: number) => ({
            key: index.toString(),
            label: item.category_name || item.sku || `${tabNamePrefix} ${index + 1}`,
            children: (
              <div className="p-4 bg-white border border-t-0 border-slate-200 flex flex-col gap-4">
                {/* Nút xóa Tab */}
                {!isViewMode && (
                  <div className="flex justify-end">
                    <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleRemoveTab(index)}>
                      Xóa {tabNamePrefix} này
                    </Button>
                  </div>
                )}

                {/* Form nhập liệu của Tab này */}
                <DynamicForm
                  fields={fields}
                  values={item}
                  onChange={(key, val) => handleFormChange(index, key as string, val)}
                  disabled={isViewMode}
                />

                {/* RENDER TIẾP TỤC BẢN THÂN NÓ NẾU ĐƯỢC PHÉP LỒNG NHAU */}
                {canHaveNestedChildren && (
                  <ChildTabs
                    dataList={item.children || []}
                    onChange={(newChildren) => handleNestedChildrenChange(index, newChildren)}
                    fields={fields}
                    nestedLimit={nestedLimit}
                    currentDepth={currentDepth + 1}
                    isViewMode={isViewMode}
                    tabNamePrefix={`Con của ${tabNamePrefix}`}
                    
                  />
                )}
              </div>
            ),
          }))}
        />
      ) : (
        <p className="text-gray-400 italic text-sm"> Bấm nút thêm để bắt đầu.</p>
      )}
    </div>
  );
};

export default ChildTabs;