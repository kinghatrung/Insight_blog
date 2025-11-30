import { Layout } from 'antd'
import type { ReactNode } from 'react'

const { Content } = Layout

interface DefaultLayoutProps {
  children?: ReactNode
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          maxWidth: '1130px',
          paddingInline: '16px',
          marginInline: 'auto'
        }}
      >
        {children}
      </Content>
    </Layout>
  )
}

export default DefaultLayout
