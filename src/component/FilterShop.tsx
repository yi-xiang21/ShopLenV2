import { useState } from "react";
import { Button, Radio, Select } from "antd"; // Xóa Checkbox, chỉ dùng Radio
import type { Category } from "@/pages/Admin/managerCatelogy/type/catelogy";
import { RiResetRightFill } from "react-icons/ri";
import { getParentCategories } from "@/pages/Admin/managerCatelogy/constants/getParentCate";
interface FilterShopProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
  categories: Category[];
  initialCategoryId?: string | null; // Thêm dòng này
}

const FilterShop = ({
  onSubmit,
  loading,
  categories = [],
  initialCategoryId = null, // Thêm dòng này
}: FilterShopProps) => {
  const [formData, setFormData] = useState<any>({
    category_id: initialCategoryId ? initialCategoryId : undefined, 
    type_ids: [],
    "min_price": null,  
    "max_price": null,
  });
  const parentCategories = getParentCategories(categories);


  const handleChange = (key: string, value: unknown) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  
  const handleCategoryCheck = (id: string) => {
    handleChange("category_id", id); 
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleRadioChange = (e: any) => {
    handleChange("type_ids", [e.target.value]); 
  };

  const handlePriceChange = (value: string) => {

    if (!value) {
      setFormData((prev: any) => ({
        ...prev,
        min_price: null,
        max_price: null,
      }));
      return;
    }

   
    const [min, max] = value.split("-");
    
    setFormData((prev: any) => ({
      ...prev,
      min_price: Number(min),
      max_price: Number(max),
    }));
  };

 
  const currentPriceValue = 
    formData.min_price !== null && formData.min_price !== undefined && 
    formData.max_price !== null && formData.max_price !== undefined
      ? `${formData.min_price}-${formData.max_price}`
      : null;


  const resetForm = () => {
    const emptyData = {
      keyword: "",
      category_id: undefined,
      type_ids: [],
      min_price: null,
      max_price: null,
    };
    
    setFormData(emptyData);
    setExpandedCategories([]);
    onSubmit(emptyData); 
  };

  return (
    <div className="w-full h-full">
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Bộ Lọc</h3>

        <div className="mb-6">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-2 cursor-pointer">
            <span className="font-semibold text-gray-700">Danh mục</span>
          </div>

          <div className="pl-2 pr-2">
            {parentCategories.map((parent) => {
              const isExpanded = expandedCategories.includes(parent.id);

              return (
                <div key={parent.id} className="mb-2">
                  <div
                    className="flex justify-between items-center py-2 cursor-pointer text-gray-600 hover:text-gray-900"
                    onClick={() => toggleCategory(parent.id)}
                  >
                    <span className="font-medium text-sm">
                      {parent.category_name}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {isExpanded &&
                    parent.children &&
                    parent.children.length > 0 && (
                      <div className="flex flex-col gap-3 pl-4 py-2">
                        {parent.children.map((child) => (
                          <Radio
                            key={child.id}
                            checked={formData.category_id === child.id}
                            onChange={() => handleCategoryCheck(child.id)}
                            className="text-gray-500 text-sm"
                          >
                            {child.category_name}
                          </Radio>
                        ))}
                      </div>
                    )}
                  {/* Trường hợp danh mục cha mở ra nhưng không có children */}
                  {isExpanded &&
                    (!parent.children || parent.children.length === 0) && (
                      <div className="pl-4 py-1 text-xs text-gray-400 italic">
                        Không có danh mục con
                      </div>
                    )}
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-2 cursor-pointer mt-4">
            <span className="font-semibold text-gray-700">Loại Sản Phẩm</span>
          </div>
          <div className="pl-2 pr-2">
            <Radio.Group
              
              value={formData.type_ids[0]} 
              onChange={handleRadioChange}
              options={[
                { value: 1, label: "Cuộn Len" },
                { value: 2, label: "Công Cụ" }
              ]}
            />
          </div>
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-2 cursor-pointer mt-4">
            <span className="font-semibold text-gray-700">Khoảng giá</span>
          </div>
          <div className="pl-2 pr-2 flex gap-2">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-2 cursor-pointer mt-4">
            <span className="font-semibold text-gray-700">Mức Giá</span>
            </div>
          </div>

          <div className="pl-2 pr-2 mb-6">
            <Select
              className="w-full h-10"
              placeholder="Chọn mức giá"
              value={currentPriceValue}
              onChange={handlePriceChange}
              allowClear 
              options={[
                { value: "0-100000", label: "Từ 0đ - 100.000đ" },
                { value: "100000-200000", label: "Từ 100.000đ - 200.000đ" },
                { value: "200000-500000", label: "Từ 200.000đ - 500.000đ" },
                { value: "500000-1000000", label: "Từ 500.000đ - 1.000.000đ" },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            key="submit"
            type="primary"
            className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            loading={loading}
          >
            Lọc Sản Phẩm
          </Button>
          <Button
            className="w-10 h-10 mt-2 shadow-2xl rounded-xl"
            onClick={resetForm}
          >
            <RiResetRightFill />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterShop;