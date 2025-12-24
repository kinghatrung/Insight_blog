import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}
    >
      <Result
        status='404'
        title={<span style={{ fontSize: 48, fontWeight: 700, color: '#f8fafc' }}>404</span>}
        subTitle={<span style={{ fontSize: 18, color: '#e2e8f0' }}>Xin lỗi, trang bạn tìm kiếm không tồn tại.</span>}
        extra={
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              type='primary'
              size='large'
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
              style={{
                background: '#3b82f6',
                borderColor: '#3b82f6',
                height: 48,
                padding: '0 32px',
                fontSize: 16,
                fontWeight: 600
              }}
            >
              Về trang chủ
            </Button>
            <Button
              size='large'
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: '#f8fafc',
                height: 48,
                padding: '0 32px',
                fontSize: 16,
                fontWeight: 600
              }}
            >
              Quay lại
            </Button>
          </div>
        }
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          padding: '60px 40px',
          maxWidth: 600,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      />
    </div>
  )
}

export default NotFound
