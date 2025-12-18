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

const salesData = [
  { month: 'T1', value: 680 },
  { month: 'T2', value: 490 },
  { month: 'T3', value: 950 },
  { month: 'T4', value: 1180 },
  { month: 'T5', value: 430 },
  { month: 'T6', value: 1130 },
  { month: 'T7', value: 1090 },
  { month: 'T8', value: 1000 },
  { month: 'T9', value: 1100 },
  { month: 'T10', value: 760 },
  { month: 'T11', value: 530 },
  { month: 'T12', value: 1090 }
]

const configData = {
  data: salesData,
  xField: 'month',
  yField: 'value',
  columnStyle: {
    radius: [4, 4, 0, 0]
  },
  marginRatio: 0.5,
  color: '#1890ff',
  columnWidthRatio: 0.5,
  label: false,
  yAxis: {
    label: {
      formatter: (v: string) => `${v}`
    },
    grid: {
      line: {
        style: {
          stroke: '#f0f0f0',
          lineWidth: 1
        }
      }
    }
  },
  xAxis: {
    label: {
      style: {
        fill: '#999'
      }
    }
  },
  tooltip: {
    formatter: (datum: { month: string; value: number }) => {
      return { name: 'aa', value: datum.value }
    }
  }
}

const tabItems = [
  {
    key: 'sales',
    label: 'Lượt xem'
  },
  {
    key: 'visits',
    label: 'Người mới'
  }
]

function Dashboard() {
  const [activeTab, setActiveTab] = useState('sales')

  const { data: blogsStats } = useQuery({
    queryKey: ['blogsStats'],
    queryFn: () => blogService.getBlogsStats()
  })

  const { data: viewsStats } = useQuery({
    queryKey: ['views-stats'],
    queryFn: () => blogService.getViewsStats()
  })

  const { data: blogsActive } = useQuery({
    queryKey: ['blogsActive'],
    queryFn: () => blogService.getBlogsActive()
  })

  const blogs: Blog[] = blogsActive
    ?.slice()
    .sort((a: Blog, b: Blog) => b.viewCount - a.viewCount)
    .slice(0, 10)

  const data = [
    264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539, 243, 226, 192
  ].map((value, index) => ({ value, index }))

  const viewsChartConfig = {
    data: viewsStats?.chartData || [],
    autoFit: true,
    height: 60,
    padding: 8,
    shapeField: 'smooth',
    xField: 'index',
    yField: 'value',
    tooltip: {
      title: (d: { date: string; value: number; index: number }) => {
        const [year, month, day] = d.date.split('-')
        return `${day}/${month}/${year}`
      },
      items: [
        {
          name: 'Lượt xem',
          field: 'value'
        }
      ]
    },
    style: {
      fill: 'linear-gradient(-90deg, white 0%, darkgreen 100%)',
      fillOpacity: 0.6
    }
  }

  const columnConfig = {
    data,
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
          tooltipText='Tổng số views của tất cả blogs (30 ngày qua)'
          value={viewsStats?.total}
          contentType='area'
          areaConfig={viewsChartConfig}
          footerLabel='Lượt xem hôm nay'
          footerValue={viewsStats?.todayCount}
        />
      </Col>

      <Col xs={24} sm={24} md={12} lg={6}>
        <ReusableStatisticCard
          title='Bình luận'
          subTitle='Tổng số comments'
          tooltipText='Tổng số comments'
          value={1102893}
          contentType='column'
          columnConfig={columnConfig}
        />
      </Col>

      <Col xs={24} sm={24} md={12} lg={6}>
        <ReusableStatisticCard
          title='Tương tác'
          subTitle='Likes và search'
          tooltipText='Likes và search'
          value={1102893}
          contentType='progress'
          progressPercent={50}
        />
      </Col>

      <Col span={24}>
        <Card className='statistic-card' style={{ marginBottom: 0 }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} style={{ marginBottom: 0 }} />

          <div style={{ display: 'flex', gap: 24, paddingTop: 24 }}>
            <div style={{ flex: 1, padding: '0 0 0 32px' }}>
              <Column {...configData} />
            </div>

            <div style={{ width: 400, borderLeft: '1px solid #f0f0f0', paddingLeft: 24 }}>
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
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default Dashboard
