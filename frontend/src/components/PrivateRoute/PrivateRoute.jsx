import React from 'react'
import useUserStore from '../../store/useStore';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {

    const {user} = useUserStore();

  return (
    <div>
      {user.username ? <Outlet/> : <Navigate to={'/login'}/>}
    </div>
  )
}

export default PrivateRoute
