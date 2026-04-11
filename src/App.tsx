
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './layout/AdminLayout'
import UserLayout from './layout/UserLayout'
import HomePage from './pages/HomePage'
import { Account } from './pages/Admin/Account'
import LoginRegister from './pages/LoginAndRegister'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path='login' element={<LoginRegister />} />
        </Route>

        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Navigate to='account' replace />} />
          <Route path='account' element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
