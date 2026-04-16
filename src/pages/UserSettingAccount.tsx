
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_CONFIG, getApiUrl } from '../config/api';

const UserSettingAccount = () => {
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
    <section className='space-y-6'>

      <div className='grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]'>
        <div className='rounded-2xl border border-amber-100 bg-[#fffaf4] p-5'>
          <h3 className='text-lg font-semibold text-[#2d2642]'>Trạng thái tài khoản</h3>
          <p className='mt-2 text-sm leading-6 text-[#675f80]'>Tài khoản đã sẵn sàng để theo dõi đơn hàng, xem lịch sử mua hàng và tham gia workshop.</p>
        </div>

        <button
          onClick={handleLogout}
          className='inline-flex items-center justify-center rounded-2xl bg-[#ff6b3d] px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f95d2d]'
        >
          Logout
        </button>
        <button onClick={() => navigate("/profile/change-password")} className='inline-flex items-center justify-center rounded-2xl bg-[#ff6b3d] px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f95d2d]'>
            Đổi mật khẩu
        </button>

      </div>
      
    </section>
    
  )
}

export default UserSettingAccount
