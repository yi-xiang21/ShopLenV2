
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLayout from './layout/AdminLayout'
import UserLayout from './layout/UserLayout'
import UserProfileLayout from './layout/UserProfileLayout'
import HomePage from './pages/HomePage'
import { Account } from './pages/Admin/Account'
import LoginRegister from './pages/LoginAndRegister'
import ProfileUser from './pages/ProfileUser'
import { AuthProvider } from './context/AuthContext'
import ResetPassword from './pages/ResetPassword'
import UserOrderTracking from './pages/UserOrderTracking'
import PurchaseHistoryPage from './pages/PurchaseHistory'
import WorkshopPage from './pages/UserWorkshop'
import AccountSettingsPage from './pages/UserSettingAccount'
import ChangePassword from './pages/ChangePassword'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<UserLayout />}>
            <Route index element={<HomePage />} />
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
            <Route index element ={<Account />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
