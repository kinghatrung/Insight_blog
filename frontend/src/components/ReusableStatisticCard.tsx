import { memo } from 'react'
import { Tooltip, Statistic, Flex, Progress } from 'antd'
import { StatisticCard } from '@ant-design/pro-components'
import { InfoCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { Tiny } from '@ant-design/charts'

import type { ReusableStatisticCardProps } from '~/types/StatisticCard'

const ReusableStatisticCard: React.FC<ReusableStatisticCardProps> = ({
  title,
  tooltipText,
  value,
  subTitle,
  footerLabel = 'Lượt truy cập hôm nay',
  footerValue = '2.000',
  contentType = 'statistics',
  areaConfig,
  columnConfig,
  progressPercent = 50,
  increaseValue,
  decreaseValue
}) => {
  const renderContent = (): React.ReactNode => {
    switch (contentType) {
      case 'statistics':
        return (
          <Flex align='center' justify='space-between'>
            <Statistic
              title='Tăng'
              value={increaseValue || 0}
              precision={1}
              suffix='%'
              valueStyle={{ color: '#3f8600', fontSize: 20, fontWeight: 600 }}
              prefix={<ArrowUpOutlined />}
              style={{ flex: 1 }}
            />
            <Statistic
              title='Giảm'
              value={decreaseValue || 0}
              precision={1}
              suffix='%'
              valueStyle={{ color: '#cf1322', fontSize: 20, fontWeight: 600 }}
              prefix={<ArrowDownOutlined />}
              style={{ flex: 1 }}
            />
          </Flex>
        )
      case 'area':
        return (
          <div>
            <Tiny.Area {...areaConfig} />
          </div>
        )
      case 'column':
        return (
          <div>
            <Tiny.Column {...columnConfig} />
          </div>
        )
      case 'progress':
        return (
          <div style={{ padding: '16px 0' }}>
            <Progress
              percent={progressPercent}
              status='active'
              strokeColor={{ from: '#108ee9', to: '#87d068' }}
              strokeWidth={8}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <StatisticCard
      headerBordered
      title={title}
      style={{
        height: '100%',
        borderRadius: 8,
        boxShadow:
          '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
      }}
      statistic={{
        title: (
          <div
            style={{
              fontSize: 14,
              color: 'rgba(0, 0, 0, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8
            }}
          >
            <span style={{ fontWeight: 500 }}>{subTitle}</span>
            <Tooltip title={tooltipText}>
              <InfoCircleOutlined
                style={{
                  cursor: 'pointer',
                  color: 'rgba(0, 0, 0, 0.25)',
                  fontSize: 14
                }}
              />
            </Tooltip>
          </div>
        ),
        value: value,
        valueStyle: {
          fontSize: 30,
          fontWeight: 600,
          color: 'rgba(0, 0, 0, 0.85)'
        },
        formatter: (val) => val.toLocaleString('vi-VN')
      }}
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #f0f0f0',
            paddingTop: 12,
            marginTop: 12,
            fontSize: 14,
            color: 'rgba(0, 0, 0, 0.65)'
          }}
        >
          <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{footerLabel}</span>
          <strong style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.85)' }}>{footerValue}</strong>
        </div>
      }
    >
      {renderContent()}
    </StatisticCard>
  )
}

export default memo(ReusableStatisticCard)
