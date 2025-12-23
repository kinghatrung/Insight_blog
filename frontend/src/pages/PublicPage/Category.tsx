import { Col, Row, Typography, Divider } from 'antd'
import { useQuery } from '@tanstack/react-query'

import CardCategory from '~/components/CardCategory'
import { categoryService } from '~/services/categoryService'
import type { CategoryType } from '~/types/Category'

const { Title, Paragraph } = Typography

function Category() {
  const PAGE_TEXT_COLOR = '#f8fafc'
  const PAGE_DIVIDER_COLOR = 'rgba(255, 255, 255, 0.1)'

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategoriesActive()
  })

  const categoriesData = isLoading ? Array(6).fill(null) : categories

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <Title level={1} style={{ color: PAGE_TEXT_COLOR, fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>
          Khám phá các thể loại Blog
        </Title>
        <Paragraph
          style={{
            color: PAGE_TEXT_COLOR,
            opacity: 0.7,
            textAlign: 'center',
            fontSize: 18,
            maxWidth: 700,
            margin: '0 auto 24px auto'
          }}
        >
          Chọn một thể loại bên dưới để bắt đầu hành trình chuyên sâu của bạn. Chúng tôi có hơn rất nhiều blog chất
          lượng.
        </Paragraph>
        <Divider style={{ backgroundColor: PAGE_DIVIDER_COLOR, margin: '0 auto', width: '50%' }} />
      </div>

      <Row gutter={[40, 40]}>
        {categoriesData?.map((category: CategoryType, index: number) => (
          <Col key={category?._id || `skeleton-${index}`} xs={24} sm={12} md={12} lg={8} style={{ display: 'flex' }}>
            <CardCategory category={category} loading={isLoading} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Category
