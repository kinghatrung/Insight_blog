import { Col, Row } from 'antd'
import { useQuery } from '@tanstack/react-query'

import CardBlog from '~/components/CardBlog'
import { blogService } from '~/services/blogService'
import type { Blog } from '~/types/Blog'

function Home() {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getBlogsActive(),
    staleTime: 60 * 1000
  })
  const safeBlogs = Array.isArray(blogs) ? blogs : []
  const blogsData = isLoading ? Array(6).fill(null) : (safeBlogs.slice(1) ?? [])
  const firstBlog = blogs?.[0]

  return (
    <Row gutter={[32, 32]}>
      <Col span={24} style={{ marginBottom: 50 }}>
        <CardBlog blog={firstBlog} direction='horizontal' loading={isLoading} />
      </Col>

      {blogsData?.map((blog: Blog, index: number) => (
        <Col key={blog?._id || `skeleton-${index}`} xs={24} sm={12} md={12} lg={8} style={{ display: 'flex' }}>
          <CardBlog blog={blog} loading={isLoading} />
        </Col>
      ))}
    </Row>
  )
}

export default Home
