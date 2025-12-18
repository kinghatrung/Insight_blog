import { PageContainer, ProCard, ProLayout } from '@ant-design/pro-components'
import { LogoutOutlined, UndoOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import defaultProps from '~/defaultSettings'
import { logoutUser, authSelectors } from '~/redux/slices/authSlice'
import type { AppDispatch } from '~/redux/store'

interface DefaultLayoutProps {
  children?: ReactNode
}

function ProtectedLayout({ children }: DefaultLayoutProps) {
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useSelector(authSelectors)

  const handleLogout = async () => {
    dispatch(logoutUser())
  }

  return (
    <div
      style={{
        height: '100vh',
        overflow: 'auto'
      }}
    >
      <ProLayout
        logo={false}
        title='Insight Blog'
        location={{
          pathname: location.pathname
        }}
        menuItemRender={(item, dom) => (
          <div
            onClick={() => {
              if (item.path) {
                navigate(item.path)
              }
            }}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            {dom}
          </div>
        )}
        avatarProps={{
          src: currentUser?.avatarUrl,
          size: 30,
          title: currentUser?.displayName,
          render: (props, dom) => {
            return (
              <Dropdown
                placement='top'
                menu={{
                  items: [
                    { onClick: handleLogout, key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất' },
                    { onClick: () => navigate('/'), key: 'return', icon: <UndoOutlined />, label: 'Quay lại' }
                  ]
                }}
              >
                <div style={{ width: '100%' }}>{dom}</div>
              </Dropdown>
            )
          }
        }}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined
          return (
            <div
              style={{
                textAlign: 'center',
                paddingBlockStart: 12
              }}
            >
              <div>© 2025 Insight Blog</div>
              <div>by Huyn</div>
            </div>
          )
        }}
        {...defaultProps}
      >
        <PageContainer fixedHeader>
          <ProCard direction='column' ghost gutter={[0, 16]}>
            {children}
          </ProCard>
        </PageContainer>
      </ProLayout>
    </div>
  )
}

export default ProtectedLayout
