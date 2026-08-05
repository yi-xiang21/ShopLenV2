
import failPage from '@/assets/FailPage.png'
const BillingFail = () => {
  return (
    <div>
      <div className='relative mt-5 mb-5'>
        <img src={failPage} alt="Success" className='w-full' />
        <button className='absolute left-160 top-260 bg-rose-400 text-white px-4 py-2 rounded-md mt-4 hover:bg-rose-500 transition-colors hover:cursor-pointer' onClick={() => window.location.href = '/'}>
          Tiếp tục mua sắm
        </button>
    </div>
    </div>
  )
}

export default BillingFail
