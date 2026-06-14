import {  useEffect, useState } from 'react';
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
  loading?: boolean;  

  hasChildren?: boolean;             
  childFields?: FormField<any>[];   
  nestedLimit?: number;             
}

const FormModal = <T extends object>({
  isOpen,
  onClose,
  mode,
  title,
  fields,
  initialValues,
  onSubmit,
  loading ,
  hasChildren = false,
  childFields,
  nestedLimit = 0,
}: FormModalProps<T>) => {
  const [formData, setFormData] = useState<any>(initialValues);

  
  useEffect(() => {
    if (isOpen) {
      setFormData(initialValues);
    }
  }, [isOpen, initialValues]);

  const isViewMode = mode === FormModalMode.VIEW;
  const activeChildFields = childFields || fields;

  
  const handleParentChange = (key: string, value: unknown) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleChildrenArrayChange = (newChildrenArray: any[]) => {
    setFormData((prev: any) => ({ ...prev, children: newChildrenArray }));
  };

  return (
    
    <Modal
      title={title}
      open={isOpen}
      onCancel={onClose}
      destroyOnClose
      centered
      width={hasChildren ? 900 : 520} 
      footer={[
        <Button key="cancel" onClick={onClose}>{isViewMode ? 'Đóng' : 'Hủy'}</Button>,
        !isViewMode && (
          <Button key="submit" type="primary" onClick={() => onSubmit(formData)} loading={loading}> 
            {hasChildren ? 'Lưu toàn bộ' : 'Lưu lại'}
          </Button>
        ),
      ]}
    >
      <div className="mt-4 max-h-[75vh] overflow-y-auto p-1 flex flex-col">
        
        <div className={hasChildren ? "bg-white p-4 border border-blue-200 rounded-md" : ""}>
          {hasChildren && <h3 className="text-lg font-bold text-blue-600 mb-4">Thông tin gốc</h3>}
          <DynamicForm
            fields={fields}
            values={formData}
            onChange={(key, val) => handleParentChange(key as string, val)}
            disabled={isViewMode}
          />
        </div>

        
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