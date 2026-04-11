import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
	return (
		<div>
			<h2 className='bg-slate-800 p-4 text-white'>Trang quan tri</h2>
			<main className='p-4'>
				<Outlet />
			</main>
		</div>
	)
}

export default AdminLayout
