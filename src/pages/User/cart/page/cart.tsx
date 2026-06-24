
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { getCart } from '../store/cart_thunck';
import { useEffect } from 'react';

const Cart = () => {
   
     const dispatch = useAppDispatch();
    
      const { items: cartItems } = useAppSelector((state) => state.Cart);

      useEffect(() => {
        dispatch(getCart());
        console.log("Cart items:", cartItems);
      }, [dispatch]);

  return (
    <div>
      
    </div>
  )
}

export default Cart
