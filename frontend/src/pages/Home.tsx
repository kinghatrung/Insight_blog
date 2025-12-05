import { Col, Row } from 'antd'
import { useQuery } from '@tanstack/react-query'

import CardBlog from '~/components/CardBlog'
import { blogService } from '~/services/blogService'
import type { Blog } from '~/types/Blog'

function Home() {
  const { data: blogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getBlogsActive()
  })
  const blogsData = blogs?.blogsActive.slice(1)
  const firstBlog = blogs?.blogsActive?.[0]

  return (
    <Row gutter={[40, 40]}>
      <Row style={{ marginBottom: 80 }}>
        <Col>
          <CardBlog blog={firstBlog} direction='horizontal' />
        </Col>
      </Row>
      {blogsData?.map((blog: Blog) => (
        <Col key={blog._id} xs={24} sm={12} md={12} lg={8} style={{ display: 'flex' }}>
          <CardBlog blog={blog} />
        </Col>
      ))}
    </Row>
  )
}

export default Home
