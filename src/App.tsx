
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLayout from './layout/AdminLayout'
import UserLayout from './layout/UserLayout'
import UserProfileLayout from './layout/UserProfileLayout'
import HomePage from './pages/Home'
import { AdminSetting } from './pages/Admin/AdminSetting'
import LoginRegister from './pages/Login&Register/LoginAndRegister'
import ProfileUser from './pages/UserProfile/ProfileUser'
import { AuthProvider } from './context/AuthContext'
import ResetPassword from './pages/Login&Register/ResetPassword'
import UserOrderTracking from './pages/UserProfile/UserOrderTracking'
import PurchaseHistoryPage from './pages/UserProfile/PurchaseHistory'
import WorkshopPage from './pages/UserProfile/UserWorkshop'
import AccountSettingsPage from './pages/UserProfile/UserSettingAccount'
import ChangePassword from './pages/Login&Register/ChangePassword'
import AdminManagerAccount from './pages/Admin/AdminManagerAccount'
import AdminManagerCategory from './pages/Admin/managerCatelogy/AdminManagerCatelogries'
import AboutUs from './pages/About'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<UserLayout />}>
            <Route index element={<HomePage />} />
            <Route path='about' element={<AboutUs />} />
            <Route path='login' element={<LoginRegister />} />
            <Route path='profile' element={<UserProfileLayout />}>
              <Route index element={<ProfileUser />} />
              <Route path='order-tracking' element={<UserOrderTracking />} />
              <Route path='purchase-history' element={<PurchaseHistoryPage />} />
              <Route path='workshop' element={<WorkshopPage />} />
              <Route path='account' element={<AccountSettingsPage />} />
              <Route path='change-password' element={<ChangePassword />} />
            </Route>
            
            <Route path='reset-password' element={<ResetPassword />} />

          </Route>

          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<AdminManagerAccount />} />
            <Route path='Manager-Category' element={<AdminManagerCategory />} />
            <Route path='Manager-Setting' element ={<AdminSetting />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
