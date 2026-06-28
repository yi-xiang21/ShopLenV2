import { useAppDispatch } from '@/app/redux/hooks';
import { useEffect } from 'react'
import { clearCart } from '../../cart/store/cart_slice';

const BillingSuccess = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(clearCart());
      }, [dispatch]);

  return (
    <div>
      Cam on ban da dat hang thanh cong. Don hang cua ban se duoc xu ly trong thoi gian som nhat.
    </div>
  )
}

export default BillingSuccess
