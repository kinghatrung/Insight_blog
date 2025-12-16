import { Badge, Row, Col, Flex, Typography, Avatar, Button, Space, message } from 'antd'
import dayjs from 'dayjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faHeart, faBookmark } from '@fortawesome/free-solid-svg-icons'
import { UserOutlined, CalendarOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { authSelectors } from '~/redux/slices/authSlice'
import { useSelector } from 'react-redux'

import CardBlog from '~/components/CardBlog'
import { blogService } from '~/services/blogService'
import ProgressBar from '~/components/ProgressBar'
import { useReadingProgressAndHeadingData } from '~/hooks/useReadingProgressAndHeadingData'
import type { Blog } from '~/types/Blog'

const { Title, Paragraph } = Typography

function DetailBlog() {
  const { slug } = useParams<{ slug: string }>()
  const { headings, progress } = useReadingProgressAndHeadingData({ element: 'blog-content' })
  const queryClient = useQueryClient()
  const { currentUser } = useSelector(authSelectors)

  const { data: blog } = useQuery({
    queryKey: ['blog', slug, currentUser?._id],
    queryFn: () => blogService.getBlogBySlug(slug!),
    enabled: !!slug
  })
  const { data: blogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getBlogsActive()
  })
  const blogData = blog?.blog
  const blogsData = blogs?.blogsActive
  const newBlogs = blogsData?.filter((blog: Blog) => blog.slug !== slug).slice(0, 3)

  const likeMutation = useMutation({
    mutationFn: (blogId: string) => blogService.likeBlog(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['blog', slug]
      })
    }
  })

  const unlikeMutation = useMutation({
    mutationFn: (blogId: string) => blogService.unlikeBlog(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['blog', slug]
      })
    }
  })

  const saveMutation = useMutation({
    mutationFn: (blogId: string) => blogService.saveBlog(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['blog', slug]
      })
    }
  })

  const unsaveMutation = useMutation({
    mutationFn: (blogId: string) => blogService.unsaveBlog(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['blog', slug]
      })
    }
  })

  const handleToggleLike = () => {
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để thích bài viết')
      return
    }

    if (blogData?.isLiked) {
      unlikeMutation.mutate(blogData._id)
    } else {
      likeMutation.mutate(blogData._id)
    }
  }

  const handleToggleSave = () => {
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để lưu bài viết')
      return
    }

    if (blogData?.isSaved) {
      unsaveMutation.mutate(blogData._id)
    } else {
      saveMutation.mutate(blogData._id)
    }
  }

  return (
    <section>
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
          <Flex align='center' gap={18}>
            <Avatar
              size={52}
              icon={<UserOutlined />}
              src={blogData?.author.avatarUrl || 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'}
            />
            <Paragraph style={{ fontWeight: 700, opacity: '.75', color: '#f8fafc', margin: 0, fontSize: 18 }}>
              <CalendarOutlined /> {dayjs(blogData?.createdAt).format('DD/MM/YYYY')}
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
        <Flex style={{ flex: 3 }} vertical>
          <div
            style={{
              padding: '32px 24px',
              color: '#f8fafc',
              textAlign: 'justify',
              fontSize: '18px',
              lineHeight: '2'
            }}
          >
            <Paragraph style={{ color: '#f8fafc', fontSize: 18, marginBottom: 20, lineHeight: '2' }}>
              {blogData?.description}
            </Paragraph>
            <div id='blog-content' dangerouslySetInnerHTML={{ __html: blogData?.content }} />
          </div>
          <Flex justify='space-between' style={{ padding: '12px 24px', paddingBottom: 12 }}>
            <Flex align='center' gap={8}>
              <Paragraph style={{ fontWeight: 700, color: '#f8fafc', fontSize: 16, margin: 0 }}>Chia sẻ lên</Paragraph>
              <Button type='primary' shape='circle' icon={<FontAwesomeIcon icon={faFacebook} size='lg' />} />
              <Button
                style={{ background: 'linear-gradient(45deg, #833AB4, #E4405F, #FCAF45)', color: '#f8fafc' }}
                type='primary'
                shape='circle'
                icon={<FontAwesomeIcon icon={faInstagram} size='lg' />}
              />
            </Flex>
            <Space align='center' size={12}>
              <Button
                onClick={handleToggleSave}
                disabled={saveMutation.isPending || unsaveMutation.isPending}
                shape='circle'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  backgroundColor: blogData?.isSaved ? '#2563EB' : '#93C5FD',
                  border: 'none',
                  color: '#f8fafc',
                  textAlign: 'center'
                }}
                icon={
                  <FontAwesomeIcon
                    icon={faBookmark}
                    style={{ fontSize: 16, color: blogData?.isSaved ? '#ffffff' : '#7f1d1d' }}
                  />
                }
              />
              <Space align='center' size={6}>
                <Button
                  onClick={handleToggleLike}
                  disabled={likeMutation.isPending || unlikeMutation.isPending}
                  shape='circle'
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    backgroundColor: blogData?.isLiked ? '#EF4444' : '#FCA5A5',
                    display: 'flex',
                    border: 'none',
                    color: '#f8fafc',
                    textAlign: 'center'
                  }}
                  icon={
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{ fontSize: 16, color: blogData?.isLiked ? '#ffffff' : '#7f1d1d' }}
                    />
                  }
                />
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: '#f8fafc',
                    minWidth: 20,
                    textAlign: 'center',
                    paddingInline: 8
                  }}
                >
                  {blogData?.likesCount}
                </span>
              </Space>
            </Space>
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
        <div style={{ position: 'relative', color: '#f8fafc', flex: 1, flexDirection: 'column' }}>
          <div
            style={{
              position: 'sticky',
              top: 118,
              padding: '24px 24px 18px',
              backgroundColor: 'hsl(222.2 84% 4.9%)',
              border: '2px solid hsl(217.2 32.6% 17.5%)',
              borderRadius: 12
            }}
          >
            <Title level={4} style={{ fontWeight: 600, color: '#f8fafc', marginBottom: 16 }}>
              Mục lục
            </Title>
            <ProgressBar percent={progress} headings={headings} />
          </div>
        </div>
      </Flex>
      {newBlogs?.length > 0 && (
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
      )}
    </section>
  )
}

export default DetailBlog
