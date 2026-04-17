
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_CONFIG, getApiUrl } from '../../config/api';
export const Account = () => {
  const navigate = useNavigate();
   const { logout } = useAuth();

  const handleLogout = async () => {
    const logoutUrl = getApiUrl(API_CONFIG.ENDPOINTS.LOGOUT);
    try {
      const response = await axios.post(logoutUrl);
      logout();
      console.log("Logout success:", response.data);
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Logout failed:", error.response?.data || error.message);
        return;
      }
      console.error("Logout failed:", error);
    }
  };

  return (
    <section>
      <h3 className='text-2xl font-semibold mb-4'>Quản lý tài khoản</h3>
      <p className='mb-6 text-gray-700'>Chào mừng đến với trang quản lý tài khoản của bạn. Tại đây, bạn có thể xem và chỉnh sửa thông tin cá nhân, quản lý đơn hàng và thiết lập bảo mật cho tài khoản của mình.</p>
      <button>
        <button onClick={() => navigate("/")} className='inline-flex items-center justify-center rounded-2xl bg-[#ff6b3d] px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f95d2d]'>
          Quay lại trang chủ
        </button>
        <button
          onClick={handleLogout}
          className='inline-flex items-center justify-center rounded-2xl bg-[#ff6b3d] px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f95d2d]'
        >
          Logout
        </button>
      </button>
    </section>
  )
}
