import { memo } from 'react'
import { Layout, Button } from 'antd'
import { Link } from 'react-router-dom'

const { Footer } = Layout

function FooterBlog() {
  return (
    <Footer
      style={{
        textAlign: 'center',
        backgroundImage: 'url("/images/noise.webp")',
        backgroundSize: '200px 200px',
        backgroundPosition: '0 0',
        paddingBlock: '40px',
        color: '#f8fafc',
        fontSize: '16px',
        backgroundColor: 'rgb(15 23 42 / 1)'
      }}
    >
      <div style={{ display: 'flex', gap: '20px', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '32px' }}>Insight Blog</h1>
        <ul style={{ display: 'flex', justifyContent: 'center', gap: '20px', listStyleType: 'none' }}>
          <li>
            <a href='https://www.facebook.com/huyen2706'>
              <img
                style={{ width: 30, height: 30, objectFit: 'cover' }}
                alt='Facebook'
                src='https://images.prismic.io/blogweb01/Z1ViwpbqstJ98M8H_facebook.png?auto=format%2Ccompress&rect=0%2C0%2C512%2C512&w=32&fit=max 1x, https://images.prismic.io/blogweb01/Z1ViwpbqstJ98M8H_facebook.png?auto=format%2Ccompress&rect=0%2C0%2C512%2C512&w=64&fit=max 2x'
              />
            </a>
          </li>
          <li>
            <a href='nguyenred2003@gmail.com'>
              <img
                style={{ width: 30, height: 30, objectFit: 'cover' }}
                alt='Gmail'
                src='https://images.prismic.io/blogweb01/Z1VixpbqstJ98M8L_gmail.png?auto=format%2Ccompress&rect=0%2C0%2C512%2C512&w=32&fit=max 1x, https://images.prismic.io/blogweb01/Z1VixpbqstJ98M8L_gmail.png?auto=format%2Ccompress&rect=0%2C0%2C512%2C512&w=64&fit=max 2x'
              />
            </a>
          </li>
          <li>
            <a href='https://github.com/kinghatrung'>
              <img
                style={{ width: 30, height: 30, objectFit: 'cover' }}
                alt='Github'
                src='https://images.prismic.io/blogweb01/Z1ViwZbqstJ98M8G_github.png?auto=format%2Ccompress&rect=0%2C0%2C512%2C512&w=32&fit=max 1x, https://images.prismic.io/blogweb01/Z1ViwZbqstJ98M8G_github.png?auto=format%2Ccompress&rect=0%2C0%2C512%2C512&w=64&fit=max 2x'
              />
            </a>
          </li>
        </ul>
        <p style={{ fontSize: '16px', color: '#f8fafc', width: 600 }}>
          Website blog cho phép bạn viết và chia sẻ bài viết một cách dễ dàng, với giao diện đơn giản và hiện đại.
        </p>
        <ul style={{ display: 'flex', justifyContent: 'center', listStyleType: 'none' }}>
          <li>
            <Link to='/'>
              <Button className='nav-link' style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc' }} type='link'>
                Trang chủ
              </Button>
            </Link>
          </li>
          <li>
            <Link to='/category'>
              <Button className='nav-link' style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc' }} type='link'>
                Thể loại
              </Button>
            </Link>
          </li>
          <li>
            <Link to='/aboutme'>
              <Button className='nav-link' style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc' }} type='link'>
                Về tôi
              </Button>
            </Link>
          </li>
          <li>
            <Link to='/contact'>
              <Button className='nav-link' style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc' }} type='link'>
                Liên hệ
              </Button>
            </Link>
          </li>
        </ul>
        <p style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 600 }}>
          Insight - Công nghệ © Blog Web - Thiết kế bởi Huyn
        </p>
      </div>
    </Footer>
  )
}

export default memo(FooterBlog)
