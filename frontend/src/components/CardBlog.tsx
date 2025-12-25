import { memo } from 'react'
import { Card, Avatar, Flex, Typography, Badge, Skeleton, Space, Grid } from 'antd'
import { UserOutlined, EyeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

import type { Blog } from '~/types/Blog'

const { Title, Paragraph } = Typography
const { useBreakpoint } = Grid

interface CardBlogProps {
  direction?: string
  loading: boolean
  blog: Blog
}

function CardBlog({ blog, loading, direction = 'vertical' }: CardBlogProps) {
  const screens = useBreakpoint()

  const isHorizontal = direction === 'horizontal'
  const isColumnLayout = isHorizontal && screens.lg

  if (loading)
    return (
      <Card
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '16px',
          display: 'flex',
          gap: isHorizontal ? 32 : 0,
          flexDirection: isHorizontal ? (screens.md ? 'row' : 'column') : 'column',
          alignItems: isHorizontal ? 'center' : ''
        }}
        cover={
          <Skeleton.Image
            style={{
              verticalAlign: 'middle',
              width: isColumnLayout ? 624 : '100%',
              height: isHorizontal && isColumnLayout ? 351 : isHorizontal ? 'auto' : 200,
              aspectRatio: isHorizontal && !isColumnLayout ? '16 / 9' : !isHorizontal ? '4 / 3' : undefined,
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
        gap: isHorizontal ? 32 : 0,
        flexDirection: isHorizontal ? (screens.md ? 'row' : 'column') : 'column',
        alignItems: isHorizontal ? 'center' : ''
      }}
      cover={
        <Link to={`/detail/${blog?.slug}`} style={{ width: '100%' }}>
          <div
            style={{
              width: isColumnLayout ? 624 : '100%',
              flexShrink: 0,
              flexBasis: isHorizontal && !isColumnLayout ? (screens.lg ? 560 : 420) : 'auto',
              borderRadius: '16px',
              height: isHorizontal && isColumnLayout ? 351 : isHorizontal ? 'auto' : 200,
              aspectRatio: isHorizontal && !isColumnLayout ? '16 / 9' : !isHorizontal ? '4 / 3' : undefined,
              overflow: 'hidden'
            }}
          >
            <img
              loading='lazy'
              className='zoom-on-hover'
              style={{
                width: '100%',
                height: '100%',
                verticalAlign: 'middle',
                objectFit: 'cover'
              }}
              alt='Ảnh blog'
              src={blog?.thumbnail}
              srcSet={`${blog?.thumbnail}?w=400 400w, ${blog?.thumbnail}?w=800 800w, ${blog?.thumbnail}?w=1200 1200w`}
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
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
