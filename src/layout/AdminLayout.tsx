import { Outlet } from 'react-router-dom'
import Sildebar from '../component/Sildebar'

const AdminLayout = () => {
	return (
		<div className='flex h-full min-h-screen '>
			<Sildebar />
			<main className='p-4 flex-1'>
				<Outlet />
			</main>
		</div>
	)
}

export default AdminLayout
