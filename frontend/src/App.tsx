import { Fragment } from 'react'
import { BrowserRouter, Route, Routes, Outlet } from 'react-router'

import Home from '~/pages/PublicPage/Home'
import Auth from '~/pages/PublicPage/Auth'
import DetailBlog from '~/pages/PublicPage/DetailBlog'
import Category from '~/pages/PublicPage/Category'
import About from '~/pages/PublicPage/About'
import DetailCategory from '~/pages/PublicPage/DetailCategory'

import Dashboard from '~/pages/ProtectedPage/Dashboard'
import BlogMange from '~/pages/ProtectedPage/BlogMange'
import CategoryMange from '~/pages/ProtectedPage/CategoryMange'
import UserMange from '~/pages/ProtectedPage/UserMange'
import Profile from '~/pages/ProtectedPage/Profile'

import ProtectedRoute from '~/components/ProtectedRoute'
import ScrollTop from '~/components/ScrollTop'

import DefaultLayout from '~/layouts/DefaultLayout'
import ProtectedLayout from '~/layouts/ProtectedLayout'

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
      <Routes>
        <Route element={<Wrapper layout={DefaultLayout} />}>
          <Route path='/' element={<Home />} />
          <Route path='/category' element={<Category />} />
          <Route path='/aboutme' element={<About />} />
          <Route path='/detail/:slug' element={<DetailBlog />} />
          <Route path='/category/:slug' element={<DetailCategory />} />
          <Route path='/contact' element={<div>contact</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Route>
        <Route path='/admin' element={<ProtectedRoute />}>
          <Route element={<Wrapper layout={ProtectedLayout} />}>
            <Route index path='dashboard' element={<Dashboard />} />
            <Route path='blogs' element={<BlogMange />} />
            <Route path='categories' element={<CategoryMange />} />
            <Route path='users' element={<UserMange />} />
          </Route>
        </Route>
        <Route path='/auth' element={<Auth />} />
        <Route path='/not-found' element={<Auth />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
