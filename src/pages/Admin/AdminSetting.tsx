
import axios from 'axios';
import { authApi } from '@/pages/Login&Register/api/auth-api';
import { useAppDispatch } from '@/app/redux/hooks';
import { logout } from '@/pages/Login&Register/store/auth-slice';

export const AdminSetting = () => {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Logout failed:", error.response?.data || error.message);
      } else {
        console.error("Logout failed:", error);
      }
    } finally {
      dispatch(logout());
    }
  };

  return (
    <section>
      <h3 className='text-2xl font-semibold mb-4'>Quản lý tài khoản</h3>
      <p className='mb-6 text-gray-700'>Chào mừng đến với trang quản lý tài khoản của bạn. Tại đây, bạn có thể xem và chỉnh sửa thông tin cá nhân, quản lý đơn hàng và thiết lập bảo mật cho tài khoản của mình.</p>
      <button
        type='button'
        onClick={handleLogout}
        className='inline-flex items-center justify-center rounded-2xl bg-[#ff6b3d] px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f95d2d]'
      >
        Logout
      </button>
    </section>
  )
}
