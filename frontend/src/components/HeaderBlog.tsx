import { Layout, Button, Typography, Dropdown, Flex } from 'antd'
import { Link } from 'react-router-dom'
import { SearchOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { logoutUser, authSelectors } from '~/redux/slices/authSlice'
import type { AppDispatch } from '~/redux/store'

const { Title } = Typography
const { Header } = Layout

function HeaderBlog() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { currentUser } = useSelector(authSelectors)
  const roleUser = currentUser?.role

  const handleLogout = async () => {
    dispatch(logoutUser())
    navigate('/auth')
  }

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        height: 75,
        gap: 20,
        justifyContent: 'space-between',
        backgroundImage: 'url("/images/noise.webp")',
        backgroundSize: '200px 200px',
        backgroundPosition: '0 0',
        borderColor: 'rgb(31 41 55 / 1)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(17, 25, 40, 0.3)'
      }}
    >
      <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginLeft: 32 }}>
        <Link to='/' className='nav-link'>
          Insight Blog
        </Link>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 20,
          justifyContent: 'flex-end',
          flexGrow: 1
        }}
      >
        <Link to='/' className='nav-header'>
          <Title style={{ fontSize: '16px', color: '#f8fafc', fontWeight: 600, margin: 0 }} color='white'>
            Trang chủ
          </Title>
        </Link>
        <Link to='/category' className='nav-header'>
          <Title style={{ fontSize: '16px', color: '#f8fafc', fontWeight: 600, margin: 0 }} color='white'>
            Chủ đề bài viết
          </Title>
        </Link>
        <Link to='/aboutme' className='nav-header'>
          <Title style={{ fontSize: '16px', color: '#f8fafc', fontWeight: 600, margin: 0 }} color='white'>
            Về tôi
          </Title>
        </Link>
        <Link to='/contact' className='nav-header'>
          <Title style={{ fontSize: '16px', color: '#f8fafc', fontWeight: 600, margin: 0 }} color='white'>
            Liên hệ
          </Title>
        </Link>
      </div>

      <Flex gap={12}>
        <Button
          className='nav-link'
          type='default'
          style={{
            width: 38,
            height: 38,
            textAlign: 'center',
            backgroundColor: 'hsl(222.2 84% 4.9%)',
            color: '#f8fafc',
            borderColor: 'hsl(217.2 32.6% 17.5%)',
            borderRadius: 6
          }}
          icon={<SearchOutlined />}
        />
        <Dropdown
          placement='bottomRight'
          dropdownRender={() => (
            <div
              style={{
                backgroundColor: 'hsl(222.2 84% 4.9%)',
                border: '1px solid hsl(217.2 32.6% 17.5%)',
                borderRadius: 8,
                width: 200
              }}
            >
              {roleUser === 'admin' && (
                <Link
                  to='/dashboard'
                  className='nav-user'
                  style={{
                    display: 'block',
                    width: '100%',
                    fontWeight: 500,
                    padding: '12px 16px',
                    color: '#f8fafc',
                    borderRadius: 6,
                    backgroundColor: 'transparent',
                    borderColor: 'hsl(217.2 32.6% 17.5%)'
                  }}
                >
                  Quản lý
                </Link>
              )}
              {!currentUser && (
                <Link
                  to='/auth'
                  className='nav-user'
                  style={{
                    display: 'block',
                    fontWeight: 500,
                    width: '100%',
                    padding: '12px 16px',
                    color: '#f8fafc',
                    borderRadius: 6,
                    backgroundColor: 'transparent',
                    borderColor: 'hsl(217.2 32.6% 17.5%)'
                  }}
                >
                  Đăng nhập/Đăng ký
                </Link>
              )}
              {currentUser && (
                <>
                  <Link
                    to='/profile'
                    className='nav-user'
                    style={{
                      display: 'block',
                      fontWeight: 500,
                      width: '100%',
                      padding: '12px 16px',
                      color: '#f8fafc',
                      borderRadius: 6,
                      backgroundColor: 'transparent',
                      borderColor: 'hsl(217.2 32.6% 17.5%)'
                    }}
                  >
                    Trang cá nhân
                  </Link>
                  <a
                    className='nav-user'
                    onClick={handleLogout}
                    style={{
                      display: 'block',
                      width: '100%',
                      fontWeight: 500,
                      padding: '12px 16px',
                      color: '#f8fafc',
                      borderRadius: 6,
                      backgroundColor: 'transparent',
                      borderColor: 'hsl(217.2 32.6% 17.5%)'
                    }}
                  >
                    <LogoutOutlined style={{ marginRight: 4, verticalAlign: 'center' }} /> Đăng xuất
                  </a>
                </>
              )}
            </div>
          )}
        >
          <Button
            className='nav-link'
            type='default'
            style={{
              width: 38,
              height: 38,
              textAlign: 'center',
              backgroundColor: 'hsl(222.2 84% 4.9%)',
              color: '#f8fafc',
              borderColor: 'hsl(217.2 32.6% 17.5%)',
              borderRadius: 6
            }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </Flex>
    </Header>
  )
}

export default HeaderBlog
