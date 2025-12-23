import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { usePermission } from '~/hooks/usePermission'
import { roles } from '~/config/rbacConfig'
import { authSelectors } from '~/redux/slices/authSlice'

interface RbacRouterProps {
  requiredPermission: string
  redirectTo?: string
}

function RbacRouter({ requiredPermission, redirectTo = '/access-denied' }: RbacRouterProps) {
  const { currentUser } = useSelector(authSelectors)
  const userRole = currentUser?.role || roles.CUSTOMER
  const { hasPermission } = usePermission(userRole)

  if (!hasPermission(requiredPermission)) return <Navigate to={redirectTo} replace />

  return <Outlet />
}

export default RbacRouter
