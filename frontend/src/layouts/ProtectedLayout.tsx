import { PageContainer, ProCard, ProLayout } from '@ant-design/pro-components'
import {
  InfoCircleFilled,
  LogoutOutlined,
  QuestionCircleFilled,
  SearchOutlined,
  PlusCircleFilled,
  UndoOutlined
} from '@ant-design/icons'
import { Dropdown, Descriptions, Input, theme } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import defaultProps from '~/defaultSettings'
import { logoutUser, authSelectors } from '~/redux/slices/authSlice'
import type { AppDispatch } from '~/redux/store'

const content = (
  <Descriptions size='small' column={2}>
    <Descriptions.Item label='Test'>Test</Descriptions.Item>
    <Descriptions.Item label='Test'>
      <a>Test</a>
    </Descriptions.Item>
    <Descriptions.Item label='Test'>2017-01-10</Descriptions.Item>
    <Descriptions.Item label='Test'>2017-10-10</Descriptions.Item>
    <Descriptions.Item label='Test'>Test</Descriptions.Item>
  </Descriptions>
)

interface DefaultLayoutProps {
  children?: ReactNode
}

const SearchInput = () => {
  const { token } = theme.useToken()
  return (
    <div
      key='SearchOutlined'
      aria-hidden
      style={{
        display: 'flex',
        alignItems: 'center',
        marginInlineEnd: 24
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      <Input
        style={{
          borderRadius: 4,
          marginInlineEnd: 12,
          backgroundColor: token.colorBgTextHover
        }}
        prefix={
          <SearchOutlined
            style={{
              color: token.colorTextLightSolid
            }}
          />
        }
        placeholder='搜索方案'
        variant='borderless'
      />
      <PlusCircleFilled
        style={{
          color: token.colorPrimary,
          fontSize: 24
        }}
      />
    </div>
  )
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
                {dom}
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
        actionsRender={(props) => {
          if (props.isMobile) return []
          if (typeof window === 'undefined') return []
          return [
            props.layout !== 'side' && document.body.clientWidth > 1400 ? <SearchInput /> : undefined,
            <InfoCircleFilled key='InfoCircleFilled' />,
            <QuestionCircleFilled key='QuestionCircleFilled' />
          ]
        }}
        {...defaultProps}
      >
        <PageContainer fixedHeader content={content}>
          <ProCard
            direction='column'
            ghost
            gutter={[0, 16]}
            style={{
              height: '100vh'
            }}
          >
            {children}
          </ProCard>
        </PageContainer>
      </ProLayout>
    </div>
  )
}

export default ProtectedLayout
