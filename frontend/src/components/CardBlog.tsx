import { memo } from 'react'
import { Card, Avatar, Flex, Typography, Badge, Skeleton, Space } from 'antd'
import { UserOutlined, EyeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

import type { Blog } from '~/types/Blog'

const { Title, Paragraph } = Typography

interface CardBlogProps {
  direction?: string
  loading: boolean
  blog: Blog
}

function CardBlog({ blog, loading, direction = 'vertical' }: CardBlogProps) {
  if (loading)
    return (
      <Card
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '16px',
          display: 'flex',
          gap: direction === 'horizontal' ? 32 : 0,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          alignItems: direction === 'horizontal' ? 'center' : ''
        }}
        cover={
          <Skeleton.Image
            style={{
              verticalAlign: 'middle',
              width: direction === 'horizontal' ? 624 : '100%',
              aspectRatio: direction === 'horizontal' ? '16 / 9' : '4 / 3',
              height: direction === 'horizontal' ? 'auto' : 200,
              objectFit: 'cover',
              borderRadius: '16px',
              backgroundColor: '#374151'
            }}
            active
          />
        }
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}
        >
          <Skeleton.Input
            style={{ width: 80, height: 24, borderRadius: 4, backgroundColor: '#1f2937' }}
            active
            size='small'
          />
          <Skeleton.Input style={{ width: '100%', height: 24, borderRadius: 4, backgroundColor: '#1f2937' }} active />
          <Skeleton.Input style={{ width: '100%', height: 48, borderRadius: 4, backgroundColor: '#1f2937' }} active />
          <Flex align='center' gap={12}>
            <Skeleton.Avatar size={42} active shape='circle' style={{ backgroundColor: '#1f2937' }} />
            <Skeleton.Input
              style={{ width: 80, height: 20, borderRadius: 4, backgroundColor: '#1f2937' }}
              active
              size='small'
            />
          </Flex>
        </div>
      </Card>
    )

  return (
    <Card
      style={{
        minWidth: direction ? '100%' : 400,
        width: '100%',
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
          count={blog?.category.title}
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
      <Flex align='center' justify='space-between'>
        <Space align='center' size={12}>
          <Avatar
            size={42}
            icon={<UserOutlined />}
            src={blog?.author.avatarUrl || 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'}
          />
          <Paragraph style={{ fontWeight: 500, opacity: '.75', color: '#f8fafc', margin: 0 }}>
            {dayjs(blog?.createdAt).format('DD/MM/YYYY')}
          </Paragraph>
        </Space>
        <span style={{ color: '#f8fafc', fontSize: 14 }}>
          <EyeOutlined style={{ marginRight: 8 }} /> {blog?.viewCount}
        </span>
      </Flex>
    </Card>
  )
}

export default memo(CardBlog)
