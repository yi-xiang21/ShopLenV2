import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '@/layout/AdminLayout';
import LoginAndRegister from '@/pages/Login&Register/pages/LoginAndRegister';
import UserLayout from '@/layout/UserLayout';
import HomePage from '@/pages/Home';
import UserProfileLayout from '@/layout/UserProfileLayout';
import ProfileUser from '@/pages/User/UserProfile/ProfileUser';
import UserOrderTracking from '@/pages/User/UserProfile/UserOrderTracking';
import ChangePassword from '@/pages/Login&Register/pages/ChangePassword';
import ResetPassword from '@/pages/Login&Register/pages/ResetPassword';
import PurchaseHistoryPage from '@/pages/User/UserProfile/PurchaseHistory';
import WorkshopHistory from '@/pages/User/UserProfile/UserWorkshop';
import AccountSettingsPage from '@/pages/User/UserProfile/UserSettingAccount';
import AboutUs from '@/pages/About';
import AdminManagerAccount from '@/pages/Admin/managerAccount/pages/AdminManagerAccount';
import AdminManagerCategory from '@/pages/Admin/managerCatelogy/pages/AdminManagerCatelogries';
import AdminManagerProducts from '@/pages/Admin/managerProducts/pages/AdminManagerProduct';
import AdminManagerVouchers from '@/pages/Admin/managerVoucher/pages/AdminManagerVoucher';
import AdminManagerPromotion from '@/pages/Admin/managerPromotion/pages/AdminManagerPromotion';
import AdminManagerStock from '@/pages/Admin/managerStock/pages/AdminManagerStock';
import ShopPage from '@/pages/User/Shop/pages/Shop';
import WhistlistPage from '@/pages/User/whistlist/pages/wishlist';
import Detail from '@/pages/User/Shop/pages/Detail';
import  {AdminSetting } from '@/pages/Admin/AdminSetting';
import CartPage from '@/pages/User/Cart/page/cart';
import AdminManagerOrder from '@/pages/Admin/managerOrder/pages/AdminManagerOrder';
import Order from '@/pages/User/Billing/pages/Billing';
import BillingSuccess from '@/pages/User/Billing/pages/BillingSucces';
import AdminManagerWorkshop from '@/pages/Admin/managerWorkshop/pages/AdminManagerWorkshop';
import PageNotFound from '@/pages/page404';
import WorkshopPages from '@/pages/User/Workshop/pages/WorkshopPages';
import WorkshopDetail from '@/pages/User/Workshop/pages/DetailWorkshop';
import BillingWorkShopPage from '@/pages/User/Workshop/pages/OrderWorkshop';


export const routes = createBrowserRouter([
    {
        element: <UserLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/about',
                element: <AboutUs />,
            },
            {
                path: '/reset-password',
                element: <ResetPassword />,
            },
            {
                path: '/shop/:categoryId?',
                element: <ShopPage />,

            },
            {
                path: '/detail/:id',
                element: <Detail />,
            },
            {
                path: '/workshop-detail/:id',
                element: <WorkshopDetail />,
            },
            {
                path: '/cart',
                element: <CartPage />,
            },
            {
                path: '/workshop',
                element: <WorkshopPages />,
            }
            
        ],  
    },
    {
        element: <ProtectedRoute requireAuth={false} />,
        children: [
            {
                path: '/auth',
                element: <UserLayout />,
                children: [
                    {
                        path: 'login',
                        element: <LoginAndRegister />,
                    }
                ],
            }
        ]
    }
    ,
    {
        element: <ProtectedRoute requireAuth={true} />,
        children: [
            {
                path: '/',
                element: <UserLayout />,
                children: [
                    
                    {
                        path: 'profile',
                        element: <UserProfileLayout />,
                        children: [
                            {
                                index: true,
                                element: <ProfileUser />,
                            },
                            {
                                path: 'order-tracking',
                                element: <UserOrderTracking />,
                            },
                            {
                                path: 'purchase-history',
                                element: <PurchaseHistoryPage />,
                            },
                            {
                                path: 'workshop',
                                element: <WorkshopHistory />,
                            },
                            {
                                path: 'account',
                                element: <AccountSettingsPage />,
                            },
                            {
                                path: 'change-password',
                                element: <ChangePassword />,
                            },
                        ],
                    },
                    {
                        path: 'wishlist',
                        element: <WhistlistPage />,
                    },
                    {
                        path: 'billing',
                        element: <Order />,
                    },
                    {
                        path: 'billing-success',
                        element: <BillingSuccess />,
                    },
                    {
                        path: 'workshop-billing/:id?/:quantity?',
                        element: <BillingWorkShopPage />,
                    }
                ],
            },
        ]
    },
    {
        element: <ProtectedRoute requireAuth={true} requireAdmin={true} />,
        children: [
            {
                path: '/admin',
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        path: 'Manager-Account',
                        element: <AdminManagerAccount />,
                    },
                    {
                        path: 'Manager-Category',
                        element: <AdminManagerCategory />,
                    },
                    {
                        path: 'Manager-Products',
                        element: <AdminManagerProducts />,
                    },
                    {
                        path: 'Manager-Vouchers',
                        element: <AdminManagerVouchers />,
                    },
                    {
                        path: 'Manager-Promotions',
                        element: <AdminManagerPromotion />,
                    },
                    {
                        path: 'Manager-Stock',
                        element: <AdminManagerStock />,
                    },
                    {
                        path: 'Manager-Orders',
                        element: <AdminManagerOrder />,
                    },
                    {
                        path: 'Manager-Workshops',
                        element: <AdminManagerWorkshop />,
                    },
                    {
                        path: 'setting',
                        element: <AdminSetting />,
                    }
                ],
            },
        ]
    },
    {
        path: '*',
        element: <PageNotFound />,
    }
])