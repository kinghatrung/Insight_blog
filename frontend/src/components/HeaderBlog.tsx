import { useState } from 'react'
import { Layout, Button, Typography, Dropdown, Flex, Avatar, Modal, Input } from 'antd'
import { Link, NavLink } from 'react-router-dom'
import { SearchOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { logoutUser, authSelectors } from '~/redux/slices/authSlice'
import { blogService } from '~/services/blogService'
import { useSearchDebounce } from '~/hooks/useSearchDebounce'
import type { AppDispatch } from '~/redux/store'
import type { Blog } from '~/types/Blog'

const { Title, Paragraph } = Typography
const { Header } = Layout

function HeaderBlog() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { currentUser } = useSelector(authSelectors)
  const roleUser = currentUser?.role

  const [showModal, setShowModal] = useState<boolean>(false)
  const [search, setSearch] = useState('')

  const searchDebounce = useSearchDebounce(search)
  const { data } = useQuery({
    queryKey: ['blogs', searchDebounce],
    queryFn: () => blogService.getBlogsActive(searchDebounce)
  })

  const blogs = data?.blogsActive

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap()
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
        <NavLink
          to='/'
          className='nav-header'
          //  className={({ isActive }) => `nav-header ${isActive ? 'nav-header-active' : ''}`}
        >
          <Title style={{ fontSize: '16px', color: '#f8fafc', fontWeight: 600, margin: 0 }} color='white'>
            Trang chủ
          </Title>
        </NavLink>
        <NavLink to='/category' className='nav-header'>
          <Title style={{ fontSize: '16px', color: '#f8fafc', fontWeight: 600, margin: 0 }} color='white'>
            Chủ đề bài viết
          </Title>
        </NavLink>
        <NavLink to='/aboutme' className='nav-header'>
          <Title style={{ fontSize: '16px', color: '#f8fafc', fontWeight: 600, margin: 0 }} color='white'>
            Về tôi
          </Title>
        </NavLink>
        <NavLink to='/contact' className='nav-header'>
          <Title style={{ fontSize: '16px', color: '#f8fafc', fontWeight: 600, margin: 0 }} color='white'>
            Liên hệ
          </Title>
        </NavLink>
      </div>

      <Flex gap={12} align='center'>
        <Button
          onClick={() => setShowModal(!showModal)}
          className='nav-link'
          type='default'
          style={{
            display: 'flex',
            justifyContent: ' center',
            alignItems: 'center',
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
        <Modal
          className='box-search'
          title='Tìm kiếm'
          width={770}
          onCancel={() => setShowModal(!showModal)}
          open={showModal}
          footer={false}
        >
          <p style={{ marginBottom: 12 }}>Tìm kiếm nội dung trên website:</p>
          <Input
            id='search'
            onChange={(e) => setSearch(e.target.value)}
            style={{
              height: 40,
              backgroundColor: 'transparent',
              color: '#f8fafc',
              borderColor: 'rgb(156 163 175 / 1)'
            }}
            placeholder='Tiêu đề blog đang tìm...'
          />
          <div style={{ marginTop: 20, height: 300, width: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {search === '' ? (
                <div className='text-center p-8 text-muted-foreground'>Bắt đầu nhập để xem các kết quả tìm kiếm!</div>
              ) : blogs?.length > 0 ? (
                blogs.map((blog: Blog) => (
                  <Link
                    onClick={() => {
                      setShowModal(!showModal)
                      setSearch('')
                    }}
                    to={`/detail/${blog.slug}`}
                    key={blog._id}
                    className='card-search'
                    style={{ display: 'flex', padding: 16, marginBlock: 16, flexDirection: 'row', gap: 8 }}
                  >
                    <img
                      src={blog.thumbnail}
                      style={{ width: 320, height: 168, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }}
                    />
                    <div style={{ marginLeft: 12 }}>
                      <Title level={4} style={{ fontWeight: 600, color: '#f8fafc' }} ellipsis={{ rows: 2 }}>
                        {blog.title}
                      </Title>
                      <Paragraph style={{ fontWeight: 400, color: '#f8fafc', fontSize: 16 }} ellipsis={{ rows: 2 }}>
                        {blog.description}
                      </Paragraph>
                    </div>
                  </Link>
                ))
              ) : (
                <div className='text-center p-8 text-muted-foreground'>
                  Không tìm thấy Blogs nào khớp với **"{search}"**.
                </div>
              )}
            </div>
          </div>
        </Modal>
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
          {currentUser ? (
            <Avatar size={40} src={currentUser?.avatarUrl} />
          ) : (
            <Button
              className='nav-link'
              type='default'
              style={{
                display: 'flex',
                justifyContent: ' center',
                alignItems: 'center',
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
          )}
        </Dropdown>
      </Flex>
    </Header>
  )
}

export default HeaderBlog
