import { Typography, Flex, Divider, Row, Col } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import type { Blog } from '~/types/Blog'

import CardBlog from '~/components/CardBlog'
import { categoryService } from '~/services/categoryService'

const { Title, Paragraph } = Typography

function DetailCategory() {
  const { slug } = useParams<{ slug: string }>()

  const { data } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoryService.getCategoryBySlug(slug!),
    refetchOnMount: true
  })
  const category = data?.category
  const blogs = category?.blogs

  return (
    <section>
      <Flex gap={32}>
        <Flex vertical>
          <Paragraph style={{ margin: 0, color: '#94a3b8', fontSize: 18 }}>Chủ đề</Paragraph>
          <Title style={{ color: '#f8fafc', margin: 0, fontSize: 48 }}>{category?.title}</Title>
          <Paragraph style={{ margin: 0, color: '#f8fafc', fontSize: 16, textAlign: 'justify', marginRight: 32 }}>
            {category?.description}
          </Paragraph>
        </Flex>
        <div style={{ width: '100%', maxWidth: 600, flexShrink: 0 }}>
          <img
            style={{ width: '100%', height: 'auto', borderRadius: 18, objectFit: 'cover' }}
            src='/images/anhnen1.jpg'
          />
        </div>
      </Flex>
      <Divider style={{ color: '#f8fafc', borderColor: 'hsl(217.2 32.6% 17.5%)', marginBlock: 48 }}>
        <p
          style={{
            fontSize: 18,
            fontWeight: 600,
            paddingBlock: 6,
            paddingInline: 16,
            borderRadius: 8,
            backgroundColor: 'rgb(15 23 42 / 1)'
          }}
        >
          Các bài viết trong chủ đề này
        </p>
      </Divider>
      <Row gutter={[40, 40]}>
        {blogs?.length === 0 ? (
          <Col span={24}>
            <Title level={4} style={{ color: '#f8fafc', marginBottom: 0, marginTop: 32, textAlign: 'center' }}>
              Không có bài viết nào...
            </Title>
          </Col>
        ) : (
          blogs?.map((blog: Blog) => (
            <Col key={blog._id} xs={24} sm={12} md={12} lg={8} style={{ display: 'flex' }}>
              <CardBlog blog={blog} />
            </Col>
          ))
        )}
      </Row>
    </section>
  )
}

export default DetailCategory
