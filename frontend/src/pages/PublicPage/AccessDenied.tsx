import { Result, Button, Space, Card, Typography } from 'antd'
import { LockOutlined, HomeOutlined, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import type { FC } from 'react'

const { Title, Paragraph, Text } = Typography

const AccessDenied: FC = () => {
  const handleGoBack = (): void => {
    window.history.back()
  }

  const handleGoHome = (): void => {
    window.location.href = '/'
  }

  const handleContactSupport = (): void => {
    window.location.href = 'mailto:support@example.com'
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 50%, #fff7ed 100%)',
        padding: '24px'
      }}
    >
      <Card
        style={{
          maxWidth: 600,
          width: '100%',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
          borderRadius: 12
        }}
        variant='borderless'
      >
        <Result
          status='403'
          icon={<LockOutlined style={{ fontSize: 72, color: '#ff4d4f' }} />}
          title={
            <Title level={2} style={{ marginTop: 16 }}>
              Truy cập bị từ chối
            </Title>
          }
          subTitle={
            <Space direction='vertical' size={8} style={{ width: '100%' }}>
              <Paragraph style={{ fontSize: 16, marginBottom: 0 }}>Bạn không có quyền truy cập vào trang này</Paragraph>
              <Text type='secondary'>Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi</Text>
            </Space>
          }
          extra={[
            <Space key='actions' size='middle' wrap>
              <Button type='default' icon={<ArrowLeftOutlined />} onClick={handleGoBack} size='large'>
                Quay lại
              </Button>
              <Button type='primary' icon={<HomeOutlined />} onClick={handleGoHome} size='large'>
                Trang chủ
              </Button>
              <Button type='default' icon={<MailOutlined />} onClick={handleContactSupport} size='large'>
                Liên hệ hỗ trợ
              </Button>
            </Space>
          ]}
        />

        <Card
          styles={{
            header: { marginTop: 24, backgroundColor: '#fafafa', border: '1px solid #f0f0f0' },
            body: { padding: 16 }
          }}
        >
          <Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>
            Nguyên nhân có thể:
          </Title>
          <Space direction='vertical' size={12} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Text type='danger' style={{ marginRight: 8 }}>
                •
              </Text>
              <Text type='secondary'>Tài khoản của bạn chưa được cấp quyền truy cập</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Text type='danger' style={{ marginRight: 8 }}>
                •
              </Text>
              <Text type='secondary'>Phiên đăng nhập đã hết hạn hoặc không hợp lệ</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Text type='danger' style={{ marginRight: 8 }}>
                •
              </Text>
              <Text type='secondary'>Bạn đang cố truy cập vào chức năng bị hạn chế</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Text type='danger' style={{ marginRight: 8 }}>
                •
              </Text>
              <Text type='secondary'>Tài khoản của bạn đã bị tạm khóa hoặc vô hiệu hóa</Text>
            </div>
          </Space>
        </Card>
      </Card>
    </div>
  )
}

export default AccessDenied
