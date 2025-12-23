import type { ReactNode } from 'react'
import { Layout, Grid } from 'antd'

import FooterBlog from '~/components/FooterBlog'
import HeaderBlog from '~/components/HeaderBlog'

const { Content } = Layout
const { useBreakpoint } = Grid

interface DefaultLayoutProps {
  children?: ReactNode
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  const screens = useBreakpoint()

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
          padding: screens.lg ? '112px 24px' : '30px 16px',
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
