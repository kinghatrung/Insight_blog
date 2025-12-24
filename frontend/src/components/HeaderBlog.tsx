import { useState, memo } from 'react'
import { Layout, Button, Typography, Dropdown, Flex, Avatar, Modal, Input, Grid, Drawer } from 'antd'
import { Link, NavLink } from 'react-router-dom'
import { SearchOutlined, LogoutOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGithub } from '@fortawesome/free-brands-svg-icons'

import { logoutUser, authSelectors } from '~/redux/slices/authSlice'
import { blogService } from '~/services/blogService'
import { useSearchDebounce } from '~/hooks/useSearchDebounce'
import type { AppDispatch } from '~/redux/store'
import type { Blog } from '~/types/Blog'

const { Title, Paragraph } = Typography
const { Header } = Layout
const { useBreakpoint } = Grid

function HeaderBlog() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const screens = useBreakpoint()

  const { currentUser } = useSelector(authSelectors)
  const roleUser = currentUser?.role

  const [showModal, setShowModal] = useState<boolean>(false)
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false)
  const [search, setSearch] = useState('')

  const searchDebounce = useSearchDebounce(search)
  const { data: blogs } = useQuery({
    queryKey: ['blogs', searchDebounce],
    queryFn: () => blogService.getBlogsActive(searchDebounce)
  })

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
        paddingInline: screens.lg ? 48 : 16,
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
      <div style={{ color: '#f8fafc', fontSize: 20, fontWeight: 700 }}>
        <Link to='/' className='nav-link'>
          Insight
        </Link>
      </div>
      {screens.lg && (
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
              Về chúng tôi
            </Title>
          </NavLink>
          <Dropdown
            className='nav-header'
            placement='bottomRight'
            popupRender={() => (
              <div
                style={{
                  backgroundColor: 'hsl(222.2 84% 4.9%)',
                  border: '1px solid hsl(217.2 32.6% 17.5%)',
                  borderRadius: 8,
                  width: 200
                }}
              >
                <a
                  href='https://www.facebook.com/huyen2706'
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
                  Facebook
                </a>
                <a
                  href='https://www.facebook.com/huyen2706'
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
                  Github
                </a>
              </div>
            )}
          >
            <Title
              style={{ cursor: 'pointer', fontSize: '16px', color: '#f8fafc', fontWeight: 600, margin: 0 }}
              color='white'
            >
              Liên hệ
            </Title>
          </Dropdown>
        </div>
      )}

      <Flex gap={12} align='center'>
        {!screens.lg && (
          <Button
            onClick={() => setIsOpenDrawer(!isOpenDrawer)}
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
            icon={<MenuOutlined />}
          />
        )}
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
        <Dropdown
          placement='bottomRight'
          popupRender={() => (
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
                  to='/admin/dashboard'
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
            <Avatar size={42} src={currentUser?.avatarUrl} alt={currentUser?.displayName} />
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

      {/* Drawer Menu For Mobile  */}
      <Drawer
        size='default'
        title={<div style={{ textAlign: 'right', width: '100%', color: '#f8fafc' }}>Insight Blog</div>}
        closeIcon={<span style={{ color: '#f8fafc', fontSize: '16px' }}>✕</span>}
        placement='left'
        open={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        footer={
          <Flex align='center' gap={8} wrap='wrap'>
            <Paragraph
              style={{
                fontWeight: 700,
                color: '#f8fafc',
                fontSize: 'clamp(14px, 1.5vw, 16px)',
                margin: 0
              }}
            >
              Liên hệ
            </Paragraph>
            <Button
              type='primary'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
              shape='circle'
            >
              <Link to={'https://www.facebook.com/huyen2706'}>
                <FontAwesomeIcon icon={faFacebook} size='lg' />
              </Link>
            </Button>
            <Button
              type='primary'
              shape='circle'
              style={{
                backgroundColor: '#24292f',
                borderColor: '#24292f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Link to={'https://github.com/'}>
                <FontAwesomeIcon icon={faGithub} size='lg' />
              </Link>
            </Button>
          </Flex>
        }
        styles={{
          header: {
            padding: 20,
            color: '#f8fafc',
            backgroundColor: 'hsl(222.2 84% 4.9%)',
            borderBottom: '1px solid #f8fafc'
          },
          body: { display: 'flex', flexDirection: 'column', padding: 20, backgroundColor: 'hsl(222.2 84% 4.9%)' },
          footer: { padding: 20, color: '#f8fafc', backgroundColor: 'hsl(222.2 84% 4.9%)' }
        }}
      >
        <Link to='/' onClick={() => setIsOpenDrawer(false)} style={{ padding: '20px 10px' }} className='nav-header'>
          <Title style={{ fontSize: '18px', color: '#f8fafc', fontWeight: 600, margin: 0 }} color='white'>
            Trang chủ
          </Title>
        </Link>
        <Link
          to='/category'
          onClick={() => setIsOpenDrawer(false)}
          style={{ padding: '20px 10px' }}
          className='nav-header'
        >
          <Title style={{ fontSize: '18px', color: '#f8fafc', fontWeight: 600, margin: 0 }} color='white'>
            Chủ đề bài viết
          </Title>
        </Link>
        <Link
          to='/aboutme'
          onClick={() => setIsOpenDrawer(false)}
          style={{ padding: '20px 10px' }}
          className='nav-header'
        >
          <Title style={{ fontSize: '18px', color: '#f8fafc', fontWeight: 600, margin: 0 }} color='white'>
            Về chúng tôi
          </Title>
        </Link>
      </Drawer>

      {/* Modal search */}
      <Modal
        destroyOnHidden
        className='box-search'
        title='Tìm kiếm'
        width={770}
        onCancel={() => {
          setShowModal(!showModal)
          setSearch('')
        }}
        open={showModal}
        footer={false}
      >
        <p style={{ marginBottom: 12 }}>Tìm kiếm nội dung trên website:</p>
        <Input
          id='search'
          value={search}
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
    </Header>
  )
}

export default memo(HeaderBlog)
