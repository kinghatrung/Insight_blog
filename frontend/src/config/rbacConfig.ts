export const roles = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
}

export const permissions = {
  // Customer
  VIEW_HOME: 'view_home',
  VIEW_PROFILE: 'profile',
  // Admin
  VIEW_DASHBOARD: 'view_dashboard'
}

export const rolePermissions = {
  [roles.CUSTOMER]: [permissions.VIEW_HOME, permissions.VIEW_PROFILE],
  [roles.ADMIN]: Object.values(permissions)
}
