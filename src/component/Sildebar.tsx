import { useNavigate, useLocation } from 'react-router-dom'
import { 
    LayoutDashboard, 
    Users, 
    Package, 
    ShoppingCart, 
    Warehouse, 
    Ticket, 
    FolderOpen, 
    Zap, 
    BookOpen, 
    Home, 
    Settings, 
    Menu, 
    X, 
    Star
} from 'lucide-react'

interface SidebarProps {
    isOpen?: boolean;
    toggleSidebar?: () => void;
}

const menuItems = [
    { name: 'Dashboard', link: '/admin', icon: LayoutDashboard },
    { name: 'Quản lý người dùng', link: '/admin/Manager-Account', icon: Users },
    { name: 'Quản lý shipper', link: '/admin/Manager-Shipper', icon: Users },
    { name: 'Quản lý đơn hàng', link: '/admin/Manager-Orders', icon: ShoppingCart },
    { name: 'Quản lý sản phẩm', link: '/admin/Manager-Products', icon: Package },
    { name: 'Quản lý Kho', link: '/admin/Manager-Stock', icon: Warehouse },
    { name: 'Quản lý vouchers', link: '/admin/Manager-Vouchers', icon: Ticket },
    { name: 'Quản lý đổi thưởng',link: '/admin/Manager-Rewards', icon: Star },
    { name: 'Quản lý danh mục', link: '/admin/Manager-Category', icon: FolderOpen },
    { name: 'Quản lý khuyến mãi', link: '/admin/Manager-Promotions', icon: Zap },
    { name: 'Quản lý workshop', link: '/admin/Manager-Workshops', icon: BookOpen },
    { name: 'Cài đặt', link: '/admin/setting', icon: Settings },
]

const bottomMenuItems = [
    { name: 'Quay về trang chủ', link: '/', icon: Home },
]

const Sildebar = ({ isOpen = false, toggleSidebar }: SidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (rawLink: string) => {
        const link = rawLink && rawLink.startsWith('/') ? rawLink : `/${rawLink}`;
        navigate(link);
        toggleSidebar?.();
    }

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className={`fixed top-4 left-4 z-60 md:hidden p-2.5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${isOpen ? 'hidden' : 'flex'} items-center justify-center`}
                onClick={() => toggleSidebar?.()}
            >
                <Menu size={24} className='text-slate-700' />
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className='fixed inset-0 bg-black/50 z-40 md:hidden' 
                    onClick={() => toggleSidebar?.()}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-orange-200 shadow-sm transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto flex flex-col`}>
                
                {/* Header */}
                <div className='flex justify-between items-center px-6 py-5 border-b border-slate-700'>
                    <div className='flex items-center gap-2'>
                        <h1 className='text-lg font-bold text-white'>Admin</h1>
                    </div>
                    <button 
                        className='md:hidden p-1.5 hover:bg-slate-700 rounded transition-colors hover:cursor-pointer' 
                        onClick={() => toggleSidebar?.()}
                    >
                        <X size={18} className='text-slate-400' />
                    </button>
                </div>

                {/* Main Menu */}
                <nav className='flex-1 overflow-y-auto py-4 px-3'>
                    <ul className='space-y-1'>
                        {menuItems.map((item, index) => {
                            const isActive = location.pathname === item.link;
                            const IconComponent = item.icon;
                            
                            return (
                                <li key={index}>
                                    <button
                                        onClick={() => handleNavigate(item.link)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-colors duration-150 hover:cursor-pointer ${
                                            isActive 
                                                ? 'bg-pink-400 text-white' 
                                                : 'text-slate-300 hover:bg-pink-50 hover:text-white'
                                        }`}
                                    >
                                        <IconComponent size={18} className='shrink-0' />
                                        <span className='font-medium text-sm'>{item.name}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Bottom Menu */}
                <div className='border-t border-slate-700 p-3'>
                    {bottomMenuItems.map((item, index) => {
                        const isActive = location.pathname === item.link;
                        const IconComponent = item.icon;
                        
                        return (
                            <button
                                key={index}
                                onClick={() => handleNavigate(item.link)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-colors duration-150 ${
                                    isActive 
                                        ? 'bg-green-500 text-white' 
                                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                            >
                                <IconComponent size={18} className='shrink-0' />
                                <span className='font-medium text-sm'>{item.name}</span>
                            </button>
                        );
                    })}
                </div>
            </aside>
        </>
    )
}

export default Sildebar
