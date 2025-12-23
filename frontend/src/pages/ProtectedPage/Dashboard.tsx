import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Tabs, Typography, Card } from 'antd'
import { Column } from '@ant-design/charts'
import { useQuery } from '@tanstack/react-query'
import { EyeOutlined } from '@ant-design/icons'

import { blogService } from '~/services/blogService'
import ReusableStatisticCard from '~/components/ReusableStatisticCard'
import type { Blog } from '~/types/Blog'

const { Title, Text } = Typography

type ViewsChartItem = {
  date?: string
  month?: string
  value: number
}

const tabItems = [
  { key: 'sales', label: 'Lượt xem' },
  { key: 'visits', label: 'Người mới' }
]

function Dashboard() {
  const [activeTab, setActiveTab] = useState('sales')

  const { data: blogsStats } = useQuery({
    queryKey: ['blogsStats'],
    queryFn: () => blogService.getBlogsStats()
  })

  const { data: blogsActive } = useQuery({
    queryKey: ['blogsActive'],
    queryFn: () => blogService.getBlogsActive()
  })

  const blogs: Blog[] = blogsActive
    ?.slice()
    .sort((a: Blog, b: Blog) => b.viewCount - a.viewCount)
    .slice(0, 10)

  const dataLikeChart = blogsStats?.likesChartData?.map((item: ViewsChartItem, index: number) => ({
    date: item.date,
    value: item.value,
    index
  }))

  const dataViewsChart = blogsStats?.viewsChartData?.map((item: ViewsChartItem, index: number) => ({
    date: item.date,
    value: item.value,
    index
  }))

  const dataViewsChartYear = blogsStats?.yearlyViewsChartData?.map((item: ViewsChartItem, index: number) => ({
    index,
    month: item.month,
    value: item.value
  }))

  const configData = {
    data: dataViewsChartYear,
    xField: 'month',
    yField: 'value',
    columnStyle: { radius: [4, 4, 0, 0] },
    marginRatio: 0.5,
    color: '#1890ff',
    columnWidthRatio: 0.5,
    label: false,
    yAxis: {
      label: { formatter: (v: string) => `${v}` },
      grid: { line: { style: { stroke: '#f0f0f0', lineWidth: 1 } } }
    },
    xAxis: { label: { style: { fill: '#999' } } },
    tooltip: {
      items: [{ name: 'Lượt xem', field: 'value' }],
      title: (datum: { month: string; value: number }) => {
        return datum.month
      }
    }
  }

  const viewsChartConfig = {
    data: dataViewsChart,
    autoFit: true,
    height: 60,
    padding: 8,
    shapeField: 'smooth',
    xField: 'index',
    yField: 'value',
    tooltip: {
      title: (d: { date: string; value: number; index: number }) => d.date,
      items: [{ name: 'Lượt xem', field: 'value' }]
    },
    style: {
      fill: 'linear-gradient(-90deg, white 0%, darkgreen 100%)',
      fillOpacity: 0.6
    }
  }

  const columnConfig = {
    data: dataLikeChart,
    autoFit: true,
    height: 60,
    padding: 8,
    xField: 'index',
    yField: 'value',
    tooltip: {
      title: 'Thời điểm',
      items: [{ name: 'Số lượng', field: 'value' }],
      showCrosshairs: true
    },
    interaction: {
      tooltip: { marker: true }
    },
    style: { fill: '#1677ff' }
  }

  return (
    <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
      <Col xs={24} sm={24} md={12} lg={6}>
        <ReusableStatisticCard
          title='Blogs'
          subTitle='Số lượng blogs đã đăng'
          tooltipText={`Hoạt động: ${blogsStats?.stats?.active || 0} | Đang xử lý: ${blogsStats?.stats?.processing || 0} | Tạm ngưng: ${blogsStats?.stats?.error || 0}`}
          value={blogsStats?.total}
          contentType='statistics'
          increaseValue={blogsStats?.isIncrease ? blogsStats?.growthPercent : null}
          decreaseValue={!blogsStats?.isIncrease ? blogsStats?.growthPercent : null}
          footerLabel='Blogs đã đăng hôm nay'
          footerValue={blogsStats?.todayCount}
        />
      </Col>

      <Col xs={24} sm={24} md={12} lg={6}>
        <ReusableStatisticCard
          title='Lượt xem'
          subTitle='Tổng số views của tất cả blogs'
          tooltipText='Tổng số views của tất cả blogs (7 ngày qua)'
          value={blogsStats?.totalViews}
          contentType='area'
          areaConfig={viewsChartConfig}
          footerLabel='Lượt xem hôm nay'
          footerValue={blogsStats?.todayViews}
        />
      </Col>

      <Col xs={24} sm={24} md={12} lg={6}>
        <ReusableStatisticCard
          title='Tương tác'
          subTitle='Likes'
          tooltipText='Tổng số likes của tất cả blogs (7 ngày qua)'
          value={blogsStats?.totalLikes}
          columnConfig={columnConfig}
          contentType='column'
          footerLabel='Lượt like hôm nay'
          footerValue={blogsStats?.todayLikes}
        />
      </Col>

      <Col xs={24} sm={24} md={12} lg={6}>
        <ReusableStatisticCard
          title='Người dùng'
          subTitle='Số người dùng mới'
          tooltipText='Số người dùng mới (7 ngày qua)'
          value={blogsStats?.registeredThisMonth}
          contentType='progress'
          progressPercent={blogsStats?.progressPercent}
          footerLabel='Mục tiêu tháng này'
          footerValue='1.200/mon'
        />
      </Col>

      <Col span={24}>
        <Card className='statistic-card' style={{ marginBottom: 0 }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} style={{ marginBottom: 0 }} />

          <Row gutter={[24, 24]} style={{ paddingTop: 24 }}>
            <Col xs={24} sm={24} md={24} lg={16}>
              <Column {...configData} />
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: 24 }}>
              <Title level={5} style={{ marginBottom: 16 }}>
                Top Blogs Nổi Bật
              </Title>
              {blogs?.map((blog, index) => (
                <Link
                  className='top-blog-item'
                  to={`/detail/${blog.slug}`}
                  key={index + 1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 12,
                    fontSize: 14
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: index + 1 <= 3 ? '#314659' : '#f0f0f0',
                      color: index + 1 <= 3 ? '#fff' : '#666',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 500,
                      marginRight: 12,
                      flexShrink: 0
                    }}
                  >
                    {index + 1}
                  </span>
                  <Text style={{ flex: 1 }} ellipsis>
                    {blog.title}
                  </Text>
                  <Text strong style={{ marginLeft: 12 }}>
                    {blog.viewCount} <EyeOutlined />
                  </Text>
                </Link>
              ))}
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default Dashboard
