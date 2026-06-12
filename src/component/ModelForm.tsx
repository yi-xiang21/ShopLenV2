import {  useState } from 'react';
import { Modal, Button } from 'antd';
import DynamicForm from '@/component/DynamicForm';
import ChildTabs from '@/component/ChildTabs'; // Import component vừa tạo
import type { FormField } from '@/share/types/form-field';
import { FormModalMode, type FormModalModeType } from '@/share/types/type-form-mode';

interface FormModalProps<T extends object> {
  isOpen: boolean;
  onClose: () => void;
  mode: FormModalModeType;
  title: string;
  fields: FormField<any>[];
  initialValues: T;
  onSubmit: (values: T) => void;
  
  // PROPS ĐIỀU KHIỂN CẤP CON (Đúng ý tưởng của bạn)
  hasChildren?: boolean;             // Bật/Tắt tính năng có cấp con
  childFields?: FormField<any>[];    // Form của cấp con (Nếu ko truyền, lấy form Cha)
  nestedLimit?: number;              // Số lượng cấp lồng nhau bên trong con (Mặc định 0)
}

const FormModal = <T extends object>({
  isOpen,
  onClose,
  mode,
  title,
  fields,
  initialValues,
  onSubmit,
  hasChildren = false,
  childFields,
  nestedLimit = 0,
}: FormModalProps<T>) => {
  const [formData, setFormData] = useState<any>(initialValues);

  // Lưu lại giá trị initialValues trước đó để so sánh
  const [prevInitialValues, setPrevInitialValues] = useState<T>(initialValues);

  // Nếu dữ liệu truyền vào thay đổi, ta cập nhật lại state formData
  if (initialValues !== prevInitialValues) {
    setPrevInitialValues(initialValues);
    setFormData(initialValues);
  }

  const isViewMode = mode === FormModalMode.VIEW;
  const activeChildFields = childFields || fields;

  // Xử lý thay đổi form Cha
  const handleParentChange = (key: string, value: unknown) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  // Xử lý khi cụm Tab con trả về mảng mới
  const handleChildrenArrayChange = (newChildrenArray: any[]) => {
    setFormData((prev: any) => ({ ...prev, children: newChildrenArray }));
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onClose}
      destroyOnClose
      width={hasChildren ? 900 : 520} // Tự động nới rộng nếu có Tab con
      footer={[
        <Button key="cancel" onClick={onClose}>{isViewMode ? 'Đóng' : 'Hủy'}</Button>,
        !isViewMode && (
          <Button key="submit" type="primary" onClick={() => onSubmit(formData)}>
            {hasChildren ? 'Lưu toàn bộ' : 'Lưu lại'}
          </Button>
        ),
      ]}
    >
      <div className="mt-4 max-h-[75vh] overflow-y-auto p-1 flex flex-col">
        
        {/* 1. KHU VỰC FORM CHA CHÍNH */}
        <div className={hasChildren ? "bg-white p-4 border border-blue-200 rounded-md" : ""}>
          {hasChildren && <h3 className="text-lg font-bold text-blue-600 mb-4">Thông tin gốc</h3>}
          <DynamicForm
            fields={fields}
            values={formData}
            onChange={(key, val) => handleParentChange(key as string, val)}
            disabled={isViewMode}
          />
        </div>

        {/* 2. KHU VỰC TABS CON (Chỉ hiển thị nếu hasChildren = true) */}
        {hasChildren && (
          <ChildTabs
            dataList={formData.children || []}
            onChange={handleChildrenArrayChange}
            fields={activeChildFields}
            nestedLimit={nestedLimit}
            isViewMode={isViewMode}
            tabNamePrefix="Mục con"
          />
        )}

      </div>
    </Modal>
  );
};

export default FormModal;