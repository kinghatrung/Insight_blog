import type { ReactNode } from 'react'
import { Layout } from 'antd'

import FooterBlog from '~/components/FooterBlog'
import HeaderBlog from '~/components/HeaderBlog'

const { Content } = Layout

interface DefaultLayoutProps {
  children?: ReactNode
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: 'hsl(222.2 84% 4.9%)'
      }}
    >
      <HeaderBlog />
      <Content
        style={{
          padding: '112px 24px',
          backgroundImage: 'url("/images/noise.webp")',
          backgroundSize: '200px 200px',
          backgroundPosition: '0 0'
        }}
      >
        <section
          style={{
            width: '100%',
            marginInline: 'auto',
            maxWidth: '1280px'
          }}
        >
          {children}
        </section>
      </Content>
      <FooterBlog />
    </Layout>
  )
}

export default DefaultLayout
