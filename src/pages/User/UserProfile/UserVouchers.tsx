import { useAppSelector } from '@/app/redux/hooks';
import React from 'react'

const UserVouchers = () => {
      const { user } = useAppSelector((state) => state.auth);
      console.log(user)
  return (
    <div>
      a
    </div>
  )
}

export default UserVouchers
