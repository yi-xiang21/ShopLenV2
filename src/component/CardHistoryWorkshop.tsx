import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";
import type { historyWorkshop } from "@/pages/User/UserProfile/types/history_workshop";

interface Props {
  workshop: historyWorkshop;
  isPast?: boolean;
  handleCancel?: (orderId: string) => void;
}

const CardHistoryWorkshop = ({ workshop, isPast = false, handleCancel }: Props) => {
  const navigate = useNavigate();
  
  return (
    <div
      onClick={() => navigate(`/workshop-detail/${workshop.workshop_id}`)}
      className={`flex flex-col sm:flex-row gap-4 w-full border ${isPast ? 'border-gray-100 opacity-80' : 'border-amber-100'} bg-white rounded-2xl p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
    >
      <img
        src={workshop.image_url}
        alt={workshop.title}
        className={`w-full sm:w-48 h-40 sm:h-32 object-cover rounded-xl bg-gray-50 shrink-0 ${isPast ? 'grayscale-[30%]' : ''}`}
      />
      <div className="flex flex-col w-full justify-between">
        <div className="flex justify-between items-start">
          <div>
          <h3 className="font-semibold text-lg text-[#1f1935] line-clamp-2" title={workshop.title}>
            {workshop.title}
          </h3>
          <p className="text-sm font-medium text-rose-500 mt-1 line-clamp-1">{workshop.session_name}</p>
          </div>
          <div>
            {handleCancel && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleCancel(workshop.order_id);
                }}
                className="px-3 py-1 bg-rose-500 text-white text-sm font-semibold rounded-lg hover:bg-rose-600 transition-colors"
              >
                Hủy đơn
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-[#675f80]">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            <span>{new Date(workshop.start_date).toLocaleDateString("vi-VN")}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-gray-400" />
            <span>
              {workshop.start_time} - {workshop.end_time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-400 shrink-0" />
            <span className="line-clamp-1" title={workshop.location}>
              {workshop.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaTicketAlt className="text-gray-400" />
            <span>Số vé đã đặt: {workshop.ticket_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardHistoryWorkshop;
