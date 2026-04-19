import { API_CONFIG, getApiUrl } from '../config/api';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";
type ProfileFormState = {
  username: string
  email: string
  phone_number: string
  address: string
}


const ProfileUser = () => {
  const { accessToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    username: '',
    email: '',
    phone_number: '',
    address: '',
  })
  // const [updateProfile, setUpdateProfile] = useState(false)

  const handleUpdateProfile = async () => {
    //call api sua doi thong tin nguoi dung
    // setUpdateProfile(false)
  }

  useEffect(() => {
    const fetchDataUser = async () => {
      if (!accessToken) {
        setErrorMessage('Không tìm thấy token đăng nhập. Vui lòng đăng nhập lại.')
        return
      }

      const profileUrl = getApiUrl(API_CONFIG.ENDPOINTS.PROFILE);
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await axios.get(profileUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const rawUser = response.data
          setProfileForm({
            username: rawUser.username,
            email: rawUser.email,
            phone_number: rawUser.phone_number,
            address: rawUser.address,
          })
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(error.response?.data?.message || 'Lấy thông tin người dùng thất bại')
          console.error("Profile fetch failed:", error.response?.data || error.message);
          return;
        }

        setErrorMessage('Lấy thông tin người dùng thất bại')
        console.error("Profile fetch failed:", error);
      } finally {
        setIsLoading(false)
      }
    };

    fetchDataUser();
  }, [accessToken]);



  return (
    <section className='space-y-6'>
      <div>
        <p className='text-sm font-semibold uppercase tracking-[0.22em] text-[#b95b2d]'>Thông tin người dùng</p>
        <h2 className='mt-2 text-3xl font-semibold text-[#1f1935]'>Hồ sơ cá nhân</h2>
      </div>

      <div className=' p-5'>
        <div className='rounded-2xl border border-amber-100 bg-[#8fbbbb55] p-5'>

          {isLoading ? (
            <p className='mt-3 text-sm text-[#675f80]'>Đang tải dữ liệu người dùng...</p>
          ) : null}

          {errorMessage ? (
            <p className='mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
              {errorMessage}
            </p>
          ) : null}

          <div className='mt-4 grid gap-3'>
              <div className='space-y-3'>
                <label className='text-sm text-[#4b4464]'>
                  Tên người dùng
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
                  Địa chỉ
                  <input
                    type='text'
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                    className='mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm outline-none'
                  />
                </label>
              </div>
            
          </div>
          <div>
            <button onClick={() => handleUpdateProfile()} className='mt-5 rounded-xl bg-[#ffb488] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9a5c]'>
              Cập nhật thông tin
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfileUser
