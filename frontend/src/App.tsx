import { Fragment, lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes, Outlet } from 'react-router'
import Snowfall from 'react-snowfall'

const Home = lazy(() => import('~/pages/PublicPage/Home'))
const Auth = lazy(() => import('~/pages/PublicPage/Auth'))
const DetailBlog = lazy(() => import('~/pages/PublicPage/DetailBlog'))
const Category = lazy(() => import('~/pages/PublicPage/Category'))
const About = lazy(() => import('~/pages/PublicPage/About'))
const DetailCategory = lazy(() => import('~/pages/PublicPage/DetailCategory'))

const Dashboard = lazy(() => import('~/pages/ProtectedPage/Dashboard'))
const BlogMange = lazy(() => import('~/pages/ProtectedPage/BlogMange'))
const CategoryMange = lazy(() => import('~/pages/ProtectedPage/CategoryMange'))
const UserMange = lazy(() => import('~/pages/ProtectedPage/UserMange'))
const Profile = lazy(() => import('~/pages/ProtectedPage/Profile'))

import RbacRoute from '~/core/RbacRouter'
import ProtectedRoute from '~/components/ProtectedRoute'
import ScrollTop from '~/components/ScrollTop'
import Loading from '~/components/Loading'

import DefaultLayout from '~/layouts/DefaultLayout'
import ProtectedLayout from '~/layouts/ProtectedLayout'
import { permissions } from '~/config/rbacConfig'

interface WrapperProps {
  layout?: React.ComponentType<{ children?: React.ReactNode }>
}

const Wrapper: React.FC<WrapperProps> = ({ layout }) => {
  const Component = layout || Fragment
  return (
    <Component>
      <Outlet />
    </Component>
  )
}

function App() {
  return (
    <BrowserRouter basename='/'>
      <ScrollTop />
      <Snowfall style={{ position: 'fixed', width: '100vw', height: '100vh' }} snowflakeCount={200} color='#82C3D9' />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Wrapper layout={DefaultLayout} />}>
            <Route path='/' element={<Home />} />
            <Route path='/category' element={<Category />} />
            <Route path='/aboutme' element={<About />} />
            <Route path='/detail/:slug' element={<DetailBlog />} />
            <Route path='/category/:slug' element={<DetailCategory />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<RbacRoute requiredPermission={permissions.VIEW_PROFILE} />}>
                <Route path='/profile' element={<Profile />} />
              </Route>
            </Route>
          </Route>
          <Route path='/admin' element={<ProtectedRoute />}>
            <Route element={<RbacRoute requiredPermission={permissions.VIEW_DASHBOARD} />}>
              <Route element={<Wrapper layout={ProtectedLayout} />}>
                <Route index path='dashboard' element={<Dashboard />} />
                <Route path='blogs' element={<BlogMange />} />
                <Route path='categories' element={<CategoryMange />} />
                <Route path='users' element={<UserMange />} />
              </Route>
            </Route>
          </Route>
          <Route path='/auth' element={<Auth />} />
          <Route path='/not-found' element={<Auth />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
