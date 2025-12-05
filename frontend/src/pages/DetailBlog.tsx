import { Badge, Row, Col, Flex, Typography, Avatar, Button } from 'antd'
import { UserOutlined, SearchOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'

import CardBlog from '~/components/CardBlog'
import { blogService } from '~/services/blogService'
import type { Blog } from '~/types/Blog'

const { Title, Paragraph } = Typography

function DetailBlog() {
  const { slug } = useParams<{ slug: string }>()

  const { data: blog } = useQuery({
    queryKey: ['blog'],
    queryFn: () => blogService.getBlogBySlug(slug!)
  })
  const { data: blogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getBlogsActive()
  })

  const blogData = blog?.blog
  const blogsData = blogs?.blogsActive
  const newBlogs = blogsData?.filter((blog: Blog) => blog.slug !== slug).slice(0, 3)

  return (
    <div>
      <Flex vertical style={{ marginBottom: 48 }}>
        <img
          style={{
            width: '100%',
            maxHeight: 550,
            maxWidth: 1024,
            margin: 'auto',
            borderRadius: '12px',
            objectFit: 'cover'
          }}
          src={blogData?.thumbnail}
        />
        <Flex gap={18} style={{ marginTop: 32 }} vertical justify='center' align='center'>
          <Title level={2} style={{ fontWeight: 600, color: '#f8fafc' }}>
            {blogData?.title}
          </Title>
          <Flex align='center' gap={12}>
            <Avatar
              size={52}
              icon={<UserOutlined />}
              src={blogData?.author.avatarUrl || 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'}
            />
            <Paragraph style={{ fontWeight: 700, opacity: '.75', color: '#f8fafc', margin: 0, fontSize: 18 }}>
              05/12/2025
            </Paragraph>
          </Flex>
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
        </Flex>
      </Flex>
      <Flex>
        <Flex style={{ flex: 3.5 }} vertical>
          <div
            style={{
              padding: '32px 24px',
              color: '#f8fafc',
              textAlign: 'justify',
              fontSize: '18px',
              lineHeight: '2'
            }}
          >
            <div id='blog-content'>
              <div dangerouslySetInnerHTML={{ __html: blogData?.content }} />
            </div>
          </div>
          <Flex align='center' gap={12} style={{ padding: '12px 24px', paddingBottom: 12 }}>
            <Paragraph style={{ fontWeight: 700, color: '#f8fafc', fontSize: 16, margin: 0 }}>Chia sẻ lên</Paragraph>
            <Button type='primary' shape='circle' icon={<SearchOutlined />} />
          </Flex>
          <div style={{ padding: '40px 24px' }}>
            <Paragraph style={{ fontWeight: 700, color: '#f8fafc', fontSize: 16, marginBottom: 20 }}>
              Tác giả bài viết
            </Paragraph>

            <Flex gap={16}>
              <img
                style={{ width: 90, height: 90, objectFit: 'cover' }}
                alt='Tác giả'
                src={
                  blogData?.author?.avatarUrl || 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
                }
              />
              <Flex vertical gap={4}>
                <Title level={5} style={{ fontWeight: 500, color: '#f8fafc', margin: 0 }}>
                  {blogData?.author.displayName}
                </Title>
                <Paragraph style={{ fontWeight: 500, color: '#6b7280', fontSize: 14, margin: 0 }}>
                  Web Developer
                </Paragraph>
              </Flex>
            </Flex>
          </div>
        </Flex>
        <div style={{ color: '#f8fafc', flex: 1 }}>asdasdadada</div>
      </Flex>
      <Row style={{ marginTop: 80 }}>
        <Col span={24}>
          <Title level={2} style={{ fontWeight: 600, color: '#f8fafc', marginBottom: 56, textAlign: 'center' }}>
            Các bài viết mới nhất
          </Title>
        </Col>

        <Row gutter={[40, 40]}>
          {newBlogs?.map((blog: Blog) => (
            <Col key={blog._id} xs={24} sm={12} md={12} lg={8} style={{ display: 'flex' }}>
              <CardBlog blog={blog} />
            </Col>
          ))}
        </Row>
      </Row>
    </div>
  )
}

export default DetailBlog
