import { Card, Flex, Typography, Divider, Skeleton } from 'antd'
import { RightOutlined, FireOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

import type { CategoryType } from '~/types/Category'

const { Title, Paragraph } = Typography

const TEXT_COLOR = '#ffffff'
const ICON_COLOR = '#ffd700'
const BACKGROUND_COLOR = 'rgba(255, 255, 255, 0.05)'
const BORDER_COLOR = 'rgba(255, 255, 255, 0.15)'
const DIVIDER_COLOR = 'rgba(255, 255, 255, 0.2)'

const CARD_STYLE = {
  backgroundColor: BACKGROUND_COLOR,
  border: `1px solid ${BORDER_COLOR}`,
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
  width: '100%',
  minHeight: '260px',
  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
}

const LINK_STYLE = {
  textDecoration: 'none',
  display: 'block'
}

interface CardCategoryProps {
  category: CategoryType
  loading?: boolean
}

function CardCategory({ category, loading }: CardCategoryProps) {
  if (loading) {
    return (
      <Card className='modern-category-card zoom-on-hover' style={CARD_STYLE}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Skeleton.Avatar active size={48} shape='circle' style={{ marginBottom: 16, backgroundColor: '#1f2937' }} />
          <Skeleton.Input
            active
            size='small'
            style={{
              width: '60%',
              height: 32,
              borderRadius: 4,
              marginBottom: 8,
              backgroundColor: '#1f2937'
            }}
          />
          <Skeleton.Input
            active
            size='small'
            style={{
              width: '100%',
              height: 24,
              borderRadius: 4,
              marginBottom: 8,
              backgroundColor: '#1f2937'
            }}
          />
          <Skeleton.Input
            active
            size='small'
            style={{
              width: '100%',
              height: 24,
              borderRadius: 4,
              marginBottom: 8,
              backgroundColor: '#1f2937'
            }}
          />
          <Skeleton.Input
            active
            size='small'
            style={{
              width: '100%',
              height: 24,
              borderRadius: 4,
              marginBottom: 8,
              backgroundColor: '#1f2937'
            }}
          />
          <Skeleton.Input
            active
            size='small'
            style={{
              width: '100%',
              height: 24,
              borderRadius: 4,
              marginBottom: 24,
              backgroundColor: '#1f2937'
            }}
          />
          <Divider style={{ backgroundColor: DIVIDER_COLOR, margin: '16px 0' }} />
          <Flex justify='space-between' align='center'>
            <Skeleton.Input
              active
              size='small'
              style={{ width: 80, height: 20, borderRadius: 4, backgroundColor: '#1f2937' }}
            />
            <RightOutlined className='card-arrow' style={{ color: TEXT_COLOR, opacity: 0.8 }} />
          </Flex>
        </div>
      </Card>
    )
  }

  return (
    <Card className='modern-category-card zoom-on-hover' style={CARD_STYLE}>
      <Link to={`/category/${category.slug}`} style={LINK_STYLE}>
        <FireOutlined
          className='card-icon'
          style={{
            marginBottom: 16,
            fontSize: 48,
            color: ICON_COLOR,
            transition: '0.3s'
          }}
        />
        <Title
          level={3}
          style={{
            fontWeight: 800,
            color: TEXT_COLOR,
            margin: 0,
            letterSpacing: '-0.5px'
          }}
        >
          {category.title}
        </Title>
        <Paragraph
          style={{
            fontWeight: 500,
            opacity: 0.8,
            color: TEXT_COLOR,
            marginBottom: 24,
            fontSize: 15
          }}
        >
          {category.description}
        </Paragraph>
        <Divider style={{ backgroundColor: DIVIDER_COLOR, margin: '16px 0' }} />
        <Flex justify='space-between' align='center'>
          <Paragraph style={{ fontWeight: 600, opacity: 0.8, color: TEXT_COLOR, margin: 0 }}>
            {category.blogs.length} bài viết
          </Paragraph>
          <RightOutlined className='card-arrow' style={{ color: TEXT_COLOR, opacity: 0.8, transition: '0.3s' }} />
        </Flex>
      </Link>
    </Card>
  )
}

export default CardCategory
