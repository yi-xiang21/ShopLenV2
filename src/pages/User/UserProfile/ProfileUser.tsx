import { useState, useEffect, useRef, useCallback } from 'react';
import type { user } from '@/pages/User/UserProfile/types/user-type';
import { userApi } from '@/pages/User/UserProfile/api/user-api';
import { useAppSelector } from '@/app/redux/hooks';
import type { NotificationType } from '@/share/ComponentCustom/Notification/Notification';
import Notification from '@/share/ComponentCustom/Notification/Notification';

// Import thư viện Crop ảnh
import Cropper from 'react-easy-crop';
import { Modal, Slider } from 'antd';
import { getCroppedImg } from '@/share/ComponentCustom/CropIMG/cropimg';

const ProfileUser = () => {
  const { error, loading, user } = useAppSelector((state) => state.auth);
  
  const [notifyData, setNotifyData] = useState<{
    key: string;
    type: NotificationType;
    title: string;
    message: string;
  } | null>(null);

  const [profileForm, setProfileForm] = useState<user>(user || {
    avatar: '',
    user_id: '',
    username: '',
    email: '',
    phone_number: '',
    role: '',
    first_name: '',
    last_name: '',
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // ========== STATE CHO CROP ẢNH ==========
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  useEffect(() => {
    if (!user?.user_id) return;
    const fetchProfile = async () => {
      try {
        const response = await userApi.getProfile();
        setProfileForm(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchProfile();
  }, [user?.user_id, user]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
        setIsCropModalOpen(true); // Mở Modal crop khi chọn xong ảnh
      });
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset input để có thể chọn lại
    }
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirmCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      // Gọi hàm cắt ảnh và nhận về đối tượng File
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      // Chuyển File thành chuỗi Base64 để lưu vào state và gửi JSON
      const reader = new FileReader();
      reader.readAsDataURL(croppedFile);
      reader.onloadend = () => {
        const base64String = reader.result as string;
        
        // Lưu chuỗi base64 thẳng vào trường avatar của state
        setProfileForm((prev) => ({ ...prev, avatar: base64String }));
        
        // Đóng modal
        setIsCropModalOpen(false);
        setImageSrc(null);
      };
    } catch (e) {
      console.error(e);
      setNotifyData({
        key: Date.now().toString(),
        type: 'error',
        title: 'Lỗi cắt ảnh',
        message: 'Có lỗi xảy ra khi xử lý hình ảnh.',
      });
    }
  };

  // ========== GỬI DATA TRỰC TIẾP TỪ STATE ==========
  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      
      // Gửi thẳng Object (JSON) profileForm lên API
      console.log('Dữ liệu chuẩn bị gửi:', profileForm);
      await userApi.updateProfile(profileForm);
      
      setNotifyData({
        key: Date.now().toString(),
        type: 'success',
        title: 'Thành công',
        message: 'Cập nhật thông tin thành công!',
      });
      
    } catch (error) {
      setNotifyData({
        key: Date.now().toString(),
        type: 'error',
        title: 'Cập nhật thất bại',
        message: 'Cập nhật thông tin thất bại. Vui lòng thử lại.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Hàm huỷ preview nếu đổi ý
  const handleCancelCrop = () => {
    setIsCropModalOpen(false);
    setImageSrc(null);
  };

  return (
    <section className='space-y-6 relative'>
      {notifyData && (
        <Notification
          key={notifyData.key}
          type={notifyData.type}
          title={notifyData.title}
          message={notifyData.message}
        />
      )}

      {/* Input File ẩn đi */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={onFileChange} 
      />

      {/* Modal Crop Ảnh */}
      <Modal
        title="Chỉnh sửa ảnh đại diện"
        open={isCropModalOpen}
        onOk={handleConfirmCrop}
        onCancel={handleCancelCrop}
        okText="Xác nhận ảnh"
        cancelText="Hủy"
        destroyOnClose
      >
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1} 
              cropShape="round" 
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          )}
        </div>
        <div className="mt-4 px-4">
          <p className="text-sm text-gray-500 mb-2">Thu phóng:</p>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(value) => setZoom(value)}
          />
        </div>
      </Modal>
      
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.22em] text-[#b95b2d]'>Thông tin người dùng</p>
          <h2 className='mt-2 text-3xl font-semibold text-[#1f1935]'>Hồ sơ cá nhân</h2>
        </div>
        <div className='flex items-center gap-3'> 
          <div 
            className='relative group cursor-pointer'
            onClick={() => fileInputRef.current?.click()}
          >
            <img 
              src={profileForm.avatar || '/images/avatar-default.png'} 
              alt="Avatar" 
              className='h-16 w-16 rounded-full object-cover bg-amber-950 border-2 border-transparent group-hover:border-amber-400 transition-all' 
            />
            {/* Lớp phủ mờ hiển thị dòng chữ khi hover */}
            <div className="absolute inset-0 bg-black/40 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-white font-bold text-center">Đổi ảnh</span>
            </div>
          </div>
        </div>
      </div>

      <div className='p-5'>
        <div className='rounded-2xl border border-amber-100 bg-[#8fbbbb55] p-5'>

          {loading ? (
            <p className='mt-3 text-sm text-[#675f80]'>Đang tải dữ liệu người dùng...</p>
          ) : null}

          {error ? (
            <p className='mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
              {error}
            </p>
          ) : null}

          <div className='mt-4 grid gap-3'>
            <div className='space-y-3'>
              <label className='text-sm text-[#4b4464]'>
                Tên đăng nhập
                <input
                  type='text'
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                  className='mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm outline-none'
                />
              </label>

              <label className='text-sm text-[#4b4464]'>
                Email
                <input
                  type='email'
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className='mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm outline-none'
                />
              </label>

              <label className='text-sm text-[#4b4464]'>
                Số điện thoại
                <input
                  type='text'
                  value={profileForm.phone_number}
                  onChange={(e) => setProfileForm({...profileForm, phone_number: e.target.value})}
                  className='mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm outline-none'
                />
              </label>

              <label className='text-sm text-[#4b4464]'>
                Họ và tên đệm
                <input
                  type='text'
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm({...profileForm, first_name: e.target.value})}
                  className='mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm outline-none'
                />
              </label>
              
              <label className='text-sm text-[#4b4464]'>
                Tên
                <input
                  type='text'
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm({...profileForm, last_name: e.target.value})}
                  className='mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm outline-none'
                />
              </label>    
            </div>
          </div>
          
          <div className='flex justify-end mt-5'>
            <button 
              onClick={handleUpdateProfile} 
              disabled={isUpdating}
              className={`mt-5 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors
                ${isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ffb488] hover:bg-[#ff9a5c]'}`}
            >
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileUser;