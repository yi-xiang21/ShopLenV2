import React from 'react';

interface CardItemOrderProps {
  item: any;
  onUpdateQuantity: (variant_id: number, quantity: number, stock_quantity: number) => void;
}

const CardItemOrder: React.FC<CardItemOrderProps> = ({ item, onUpdateQuantity }) => {
  return (
    <div
      className="flex items-center justify-between gap-4 border border-gray-100 shadow-sm rounded-2xl p-4 hover:shadow-md transition-all duration-300 ease-out bg-white"
    >
      <div className="flex items-center gap-4">
        <img
          src={item.image_url}
          alt={item.product_name}
          className="h-12 w-12 rounded object-cover bg-gray-50"
        />
        <div className="flex flex-col">
          <span className="text-[15px] text-gray-700 transition-colors group-hover:text-gray-900">
            {item.product_name}
          </span>
          <span className="mt-0.5 text-[13px] font-light text-gray-400">
            Màu: {item.color}, Size: {item.size}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center rounded-full border border-rose-100 bg-white px-3 py-1.5 shadow-sm">
          <button
            className="px-2 text-gray-400 transition-colors hover:text-rose-400"
            onClick={() =>
              onUpdateQuantity(
                item.variant_id || 0,
                item.quantity - 1,
                item.stock_quantity || 0,
              )
            }
          >
            -
          </button>
          <span className="w-8 text-center text-sm font-light text-gray-600">
            {item.quantity}
          </span>
          <button
            className="px-2 text-gray-400 transition-colors hover:text-rose-400"
            onClick={() =>
              onUpdateQuantity(
                item.variant_id || 0,
                item.quantity + 1,
                item.stock_quantity || 0,
              )
            }
          >
            +
          </button>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-[14px] font-medium transition-colors text-red-600">
        <span>
          {Number(
            item.price || 0 * item.quantity,
          ).toLocaleString("vi-VN")}
          ₫
        </span>
      </div>
    </div>
  );
};

export default CardItemOrder;
