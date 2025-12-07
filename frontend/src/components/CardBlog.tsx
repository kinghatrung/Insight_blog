import { Card, Avatar, Flex, Typography, Badge } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

import type { Blog } from '~/types/Blog'

const { Title, Paragraph } = Typography

interface CardBlogProps {
  direction?: string
  blog: Blog
}

function CardBlog({ blog, direction = 'vertical' }: CardBlogProps) {
  return (
    <Card
      style={{
        width: direction ? '100%' : 400,
        background: 'transparent',
        border: 'none',
        padding: '16px',
        display: 'flex',
        gap: direction === 'horizontal' ? 32 : 0,
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        alignItems: direction === 'horizontal' ? 'center' : ''
      }}
      cover={
        <Link to={`/detail/${blog?.slug}`}>
          <img
            className='zoom-on-hover'
            style={{
              verticalAlign: 'middle',
              width: direction === 'horizontal' ? 624 : '100%',
              aspectRatio: direction === 'horizontal' ? '16 / 9' : '4 / 3',
              height: direction === 'horizontal' ? 'auto' : 200,
              objectFit: 'cover',
              borderRadius: '16px'
            }}
            alt='Ảnh blog'
            src={blog?.thumbnail}
          />
        </Link>
      }
    >
      <Link to='/category'>
        <Badge
          count='Công nghệ'
          style={{
            backgroundColor: '#2c3e50',
            color: '#7dd3fc',
            borderRadius: 4,
            padding: '0 8px',
            height: 24,
            lineHeight: '24px',
            fontSize: 12,
            fontWeight: 600,
            borderColor: 'hsl(217.2 32.6% 17.5%)'
          }}
        />
      </Link>
      <Link to={`/detail/${blog?.slug}`}>
        <Title
          className='nav-link'
          style={{ fontWeight: 700, color: '#f8fafc', marginTop: 12 }}
          ellipsis={{ rows: 2 }}
          level={4}
        >
          {blog?.title}
        </Title>
      </Link>
      <Paragraph style={{ fontWeight: 500, opacity: '.75', color: '#f8fafc', marginBlock: 12 }} ellipsis={{ rows: 2 }}>
        {blog?.description}
      </Paragraph>
      <Flex align='center' gap={12}>
        <Avatar
          size={42}
          icon={<UserOutlined />}
          src={blog?.author.avatarUrl || 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'}
        />
        <Paragraph style={{ fontWeight: 500, opacity: '.75', color: '#f8fafc', margin: 0 }}>
          {dayjs(blog?.createdAt).format('DD-MM-YYYY')}
        </Paragraph>
      </Flex>
    </Card>
  )
}

export default CardBlog
