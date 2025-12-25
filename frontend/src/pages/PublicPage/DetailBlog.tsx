import { useCallback, useMemo } from 'react'
import { Badge, Row, Col, Flex, Typography, Avatar, Button, Space, message, Image, Skeleton, Spin } from 'antd'
import dayjs from 'dayjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faHeart, faBookmark } from '@fortawesome/free-solid-svg-icons'
import { UserOutlined, CalendarOutlined, LoadingOutlined } from '@ant-design/icons'
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

  const queryClient = useQueryClient()
  const { currentUser } = useSelector(authSelectors)

  const { data: blog, isLoading: loadingBlog } = useQuery({
    queryKey: ['blog', slug, currentUser?._id],
    queryFn: () => blogService.getBlogBySlug(slug!),
    staleTime: 2 * 60 * 1000, // 2 phút
    enabled: !!slug
  })
  const { data: blogsData, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getBlogsActive()
  })
  const blogData = blog?.blog
  const newBlogs = useMemo(() => {
    if (isLoading) return Array(3).fill(null)
    return blogsData?.filter((blog: Blog) => blog.slug !== slug).slice(0, 3)
  }, [isLoading, blogsData, slug])

  const { headings, progress } = useReadingProgressAndHeadingData({
    element: 'blog-content',
    enabled: !loadingBlog && !!blogData?.content
  })

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

  const blogId = blogData?._id
  const isSaved = blogData?.isSaved
  const isLiked = blogData?.isLiked

  const handleToggleLike = useCallback(() => {
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để thích bài viết')
      return
    }

    if (isLiked) {
      unlikeMutation.mutate(blogId!)
    } else {
      likeMutation.mutate(blogId!)
    }
  }, [currentUser, isLiked, blogId, unlikeMutation, likeMutation])

  const handleToggleSave = useCallback(() => {
    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để lưu bài viết')
      return
    }

    if (isSaved) {
      unsaveMutation.mutate(blogId!)
    } else {
      saveMutation.mutate(blogId!)
    }
  }, [currentUser, isSaved, blogId, unsaveMutation, saveMutation])

  return (
    <section style={{ padding: '0 16px' }}>
      <Flex vertical style={{ marginBottom: 48 }}>
        {loadingBlog ? (
          <Skeleton.Image
            active
            style={{
              display: 'block',
              width: '100%',
              height: 'clamp(250px, 50vw, 550px)',
              maxWidth: 1024,
              margin: '24px auto',
              borderRadius: '12px',
              objectFit: 'cover',
              backgroundColor: '#1f2937'
            }}
          />
        ) : (
          <img
            loading='lazy'
            alt='Ảnh blog'
            style={{
              display: 'block',
              width: '100%',
              maxWidth: 1024,
              height: 'auto',
              maxHeight: 550,
              margin: '24px auto',
              borderRadius: 12,
              objectFit: 'cover'
            }}
            src={blogData?.thumbnail}
            srcSet={`${blogData?.thumbnail}?w=400 400w, ${blogData?.thumbnail}?w=800 800w, ${blogData?.thumbnail}?w=1200 1200w`}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        )}
        <Flex gap={18} style={{ marginTop: 32 }} vertical justify='center' align='center'>
          {loadingBlog ? (
            <>
              <Skeleton.Input
                size='large'
                block
                active
                style={{
                  width: '100%',
                  height: 32,
                  borderRadius: 4,
                  marginBottom: 8,
                  backgroundColor: '#1f2937'
                }}
              />
              <Skeleton.Input
                size='large'
                block
                active
                style={{
                  width: '100%',
                  height: 32,
                  borderRadius: 4,
                  marginBottom: 8,
                  backgroundColor: '#1f2937'
                }}
              />
            </>
          ) : (
            <Title
              level={2}
              style={{
                fontWeight: 600,
                color: '#f8fafc',
                fontSize: 'clamp(20px, 4vw, 32px)',
                textAlign: 'center',
                padding: '0 16px'
              }}
            >
              {blogData?.title}
            </Title>
          )}
          <Flex align='center' gap={18} wrap='wrap' justify='center'>
            {loadingBlog ? (
              <>
                <Skeleton.Avatar active size={52} shape='circle' style={{ backgroundColor: '#1f2937' }} />
                <Skeleton.Input
                  active
                  style={{
                    width: '100%',
                    height: 32,
                    borderRadius: 4,
                    backgroundColor: '#1f2937'
                  }}
                />
              </>
            ) : (
              <>
                <Avatar size={52} icon={<UserOutlined />} src={blogData?.author.avatarUrl} />
                <Paragraph
                  style={{
                    fontWeight: 700,
                    opacity: '.75',
                    color: '#f8fafc',
                    margin: 0,
                    fontSize: 'clamp(14px, 2vw, 18px)'
                  }}
                >
                  <CalendarOutlined /> {dayjs(blogData?.createdAt).format('DD/MM/YYYY')}
                </Paragraph>
              </>
            )}
          </Flex>
          <Link to={`/category/${blogData?.category?.slug}`}>
            <Badge
              count={blogData?.category?.title}
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

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={6} style={{ order: 1 }}>
          <div
            style={{
              position: 'sticky',
              top: 118,
              padding: 'clamp(16px, 2vw, 24px) clamp(16px, 2vw, 24px) clamp(12px, 1.5vw, 18px)',
              backgroundColor: 'hsl(222.2 84% 4.9%)',
              border: '2px solid hsl(217.2 32.6% 17.5%)',
              borderRadius: 12,
              marginBottom: 24
            }}
          >
            <Title
              level={4}
              style={{
                fontWeight: 600,
                color: '#f8fafc',
                marginBottom: 16,
                fontSize: 'clamp(16px, 1.8vw, 20px)'
              }}
            >
              Mục lục
            </Title>
            {loadingBlog ? (
              <Spin
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingBlock: 32
                }}
                indicator={<LoadingOutlined spin />}
                size='large'
              />
            ) : (
              <ProgressBar percent={progress} headings={headings} />
            )}
          </div>
        </Col>

        <Col xs={24} lg={18} style={{ order: 2 }}>
          <Flex vertical>
            {loadingBlog ? (
              <Spin
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingBlock: 400
                }}
                indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />}
              />
            ) : (
              <div
                style={{
                  padding: 'clamp(16px, 3vw, 32px) clamp(12px, 2vw, 24px)',
                  color: '#f8fafc',
                  textAlign: 'justify',
                  fontSize: 'clamp(16px, 1.5vw, 18px)',
                  lineHeight: '2'
                }}
              >
                <Paragraph
                  style={{
                    color: '#f8fafc',
                    fontSize: 'clamp(16px, 1.5vw, 18px)',
                    marginBottom: 20,
                    lineHeight: '2'
                  }}
                >
                  {blogData?.description}
                </Paragraph>
                <div id='blog-content' dangerouslySetInnerHTML={{ __html: blogData?.content }} />
              </div>
            )}

            <Flex
              justify='space-between'
              style={{
                padding: '12px clamp(12px, 2vw, 24px)',
                paddingBottom: 12,
                flexDirection: 'row',
                gap: 16,
                flexWrap: 'wrap'
              }}
            >
              <Flex align='center' gap={8} wrap='wrap'>
                <Paragraph
                  style={{
                    fontWeight: 700,
                    color: '#f8fafc',
                    fontSize: 'clamp(14px, 1.5vw, 16px)',
                    margin: 0
                  }}
                >
                  Chia sẻ lên
                </Paragraph>
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
                      fontSize: 'clamp(14px, 1.5vw, 16px)',
                      fontWeight: 500,
                      color: '#f8fafc',
                      minWidth: 20,
                      textAlign: 'center',
                      paddingInline: 8
                    }}
                  >
                    {loadingBlog ? <Spin indicator={<LoadingOutlined spin />} /> : blogData?.likesCount}
                  </span>
                </Space>
              </Space>
            </Flex>

            <div style={{ padding: 'clamp(24px, 4vw, 40px) clamp(12px, 2vw, 24px)' }}>
              <Paragraph
                style={{
                  fontWeight: 700,
                  color: '#f8fafc',
                  fontSize: 'clamp(14px, 1.5vw, 16px)',
                  marginBottom: 20
                }}
              >
                Tác giả bài viết
              </Paragraph>

              {loadingBlog ? (
                <Flex gap={16}>
                  <Skeleton.Avatar
                    shape='square'
                    active
                    style={{ borderRadius: 8, width: 90, height: 90, backgroundColor: '#1f2937' }}
                  />
                  <Flex vertical gap={4}>
                    <Skeleton.Input
                      active
                      size='small'
                      style={{
                        width: '60%',
                        height: 18,
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
                        height: 18,
                        borderRadius: 4,
                        marginBottom: 8,
                        backgroundColor: '#1f2937'
                      }}
                    />
                  </Flex>
                </Flex>
              ) : (
                <Flex gap={16}>
                  <Image
                    style={{
                      width: 'clamp(60px, 10vw, 90px)',
                      height: 'clamp(60px, 10vw, 90px)',
                      objectFit: 'cover'
                    }}
                    alt='Tác giả'
                    src={blogData?.author?.avatarUrl}
                  />
                  <Flex vertical gap={4}>
                    <Title
                      level={5}
                      style={{
                        fontWeight: 500,
                        color: '#f8fafc',
                        margin: 0,
                        fontSize: 'clamp(14px, 1.5vw, 16px)'
                      }}
                    >
                      {blogData?.author.displayName}
                    </Title>
                    <Paragraph
                      style={{
                        fontWeight: 500,
                        color: '#6b7280',
                        fontSize: 'clamp(12px, 1.2vw, 14px)',
                        margin: 0
                      }}
                    >
                      Web Developer
                    </Paragraph>
                  </Flex>
                </Flex>
              )}
            </div>
          </Flex>
        </Col>
      </Row>

      {newBlogs?.length > 0 && (
        <div style={{ marginTop: 'clamp(40px, 8vw, 80px)' }}>
          <Col span={24}>
            <Title
              level={2}
              style={{
                fontWeight: 600,
                color: '#f8fafc',
                marginBottom: 'clamp(32px, 6vw, 56px)',
                textAlign: 'center',
                fontSize: 'clamp(20px, 3vw, 32px)'
              }}
            >
              Các bài viết mới nhất
            </Title>
          </Col>

          <Row gutter={[24, 24]}>
            {newBlogs?.map((blog: Blog, index: number) => (
              <Col key={blog?._id || `skeleton-${index}`} xs={24} sm={12} md={12} lg={8} style={{ display: 'flex' }}>
                <CardBlog blog={blog} loading={isLoading} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </section>
  )
}

export default DetailBlog
