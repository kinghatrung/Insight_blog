import { rolePermissions } from '~/config/rbacConfig'

interface UsePermissionReturn {
  hasPermission: (permission: string) => boolean
}

function usePermission(useRole: string): UsePermissionReturn {
  const hasPermission = (permission: string): boolean => {
    const allowedPermissions = rolePermissions[useRole] || []
    return allowedPermissions.includes(permission)
  }
  return { hasPermission }
}

export { usePermission }
