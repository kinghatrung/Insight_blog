import { Typography, Flex, Divider, Row, Col, Skeleton } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import type { Blog } from '~/types/Blog'

import CardBlog from '~/components/CardBlog'
import { categoryService } from '~/services/categoryService'

const { Title, Paragraph } = Typography

function DetailCategory() {
  const { slug } = useParams<{ slug: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoryService.getCategoryBySlug(slug!),
    refetchOnMount: true
  })
  const category = data?.category
  const blogs = isLoading ? Array(6).fill(null) : category?.blogs

  return (
    <section style={{ padding: '0 16px' }}>
      <Row gutter={[24, 32]} align='middle'>
        <Col xs={24} lg={12} order={2} style={{ order: 2 }}>
          {isLoading ? (
            <Flex vertical flex={1}>
              <Skeleton.Input
                active
                size='small'
                style={{
                  width: 80,
                  height: 24,
                  borderRadius: 4,
                  marginBottom: 8,
                  backgroundColor: '#1f2937'
                }}
              />
              <Skeleton.Input
                active
                size='large'
                style={{
                  width: '100%',
                  maxWidth: 200,
                  height: 48,
                  borderRadius: 4,
                  marginBottom: 8,
                  backgroundColor: '#1f2937'
                }}
              />
              <Skeleton.Input
                active
                block
                size='large'
                style={{ width: '100%', height: 20, borderRadius: 4, marginBottom: 8, backgroundColor: '#1f2937' }}
              />
              <Skeleton.Input
                active
                block
                size='large'
                style={{ width: '100%', height: 20, borderRadius: 4, marginBottom: 8, backgroundColor: '#1f2937' }}
              />
              <Skeleton.Input
                active
                block
                size='large'
                style={{ width: '100%', height: 20, borderRadius: 4, marginBottom: 8, backgroundColor: '#1f2937' }}
              />
              <Skeleton.Input
                active
                block
                size='large'
                style={{ width: '60%', height: 20, borderRadius: 4, marginBottom: 8, backgroundColor: '#1f2937' }}
              />
            </Flex>
          ) : (
            <Flex vertical flex={1}>
              <Paragraph
                style={{
                  margin: 0,
                  color: '#94a3b8',
                  fontSize: 'clamp(14px, 1.8vw, 18px)'
                }}
              >
                Chủ đề
              </Paragraph>
              <Title
                style={{
                  color: '#f8fafc',
                  margin: 0,
                  fontSize: 'clamp(28px, 5vw, 48px)',
                  marginTop: 8,
                  marginBottom: 16
                }}
              >
                {category?.title}
              </Title>
              <Paragraph
                style={{
                  margin: 0,
                  color: '#f8fafc',
                  fontSize: 'clamp(14px, 1.5vw, 16px)',
                  textAlign: 'justify',
                  lineHeight: 1.8
                }}
              >
                {category?.description}
              </Paragraph>
            </Flex>
          )}
        </Col>

        <Col xs={24} lg={12} order={1} style={{ order: 1 }}>
          <div
            style={{
              width: '100%',
              maxWidth: '100%',
              margin: '0 auto'
            }}
          >
            <img
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: 'clamp(250px, 40vw, 400px)',
                borderRadius: 18,
                objectFit: 'cover',
                display: 'block'
              }}
              src='/images/anhnen1.jpg'
              alt='Category banner'
            />
          </div>
        </Col>
      </Row>

      <Divider
        style={{
          color: '#f8fafc',
          borderColor: 'hsl(217.2 32.6% 17.5%)',
          marginBlock: 'clamp(32px, 5vw, 48px)'
        }}
      >
        <p
          style={{
            fontSize: 'clamp(14px, 1.8vw, 18px)',
            fontWeight: 600,
            paddingBlock: 'clamp(4px, 0.8vw, 6px)',
            paddingInline: 'clamp(12px, 1.5vw, 16px)',
            borderRadius: 8,
            backgroundColor: 'rgb(15 23 42 / 1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          Các bài viết trong chủ đề này
        </p>
      </Divider>

      <Row gutter={[24, 24]}>
        {blogs?.length === 0 ? (
          <Col span={24}>
            <Title
              level={4}
              style={{
                color: '#f8fafc',
                marginBottom: 0,
                marginTop: 32,
                textAlign: 'center',
                fontSize: 'clamp(16px, 2vw, 20px)'
              }}
            >
              Không có bài viết nào...
            </Title>
          </Col>
        ) : (
          blogs?.map((blog: Blog, index: number) => (
            <Col key={blog?._id || `skeleton-${index}`} xs={24} sm={12} md={12} lg={8} style={{ display: 'flex' }}>
              <CardBlog blog={blog} loading={isLoading} />
            </Col>
          ))
        )}
      </Row>
    </section>
  )
}

export default DetailCategory
