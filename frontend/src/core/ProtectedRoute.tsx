import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { memo } from 'react'

import { authSelectors } from '~/redux/slices/authSlice'
import Loading from '~/components/Loading'

function ProtectedRoute() {
  const { currentUser, loading } = useSelector(authSelectors)

  if (loading && !currentUser) {
    return (
      <div className='bg-white flex items-center justify-center min-h-svh'>
        <Loading />
      </div>
    )
  }

  if (!currentUser) return <Navigate to='/auth' replace />

  return <Outlet />
}

export default memo(ProtectedRoute)
