
import {useNavigate} from 'react-router-dom';
export const Account = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h3 className='text-2xl font-semibold mb-4'>Quản lý tài khoản</h3>
      <p className='mb-6 text-gray-700'>Chào mừng đến với trang quản lý tài khoản của bạn. Tại đây, bạn có thể xem và chỉnh sửa thông tin cá nhân, quản lý đơn hàng và thiết lập bảo mật cho tài khoản của mình.</p>
      <button>
        <button onClick={() => navigate("/")} className='inline-flex items-center justify-center rounded-2xl bg-[#ff6b3d] px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f95d2d]'>
          Quay lại trang chủ
        </button>
      </button>
    </section>
  )
}
