import { BrowserRouter, Route, Routes, Outlet } from 'react-router'
import { Fragment } from 'react'

import Home from '~/pages/Home'
import Auth from '~/pages/Auth'
import Dashboard from '~/pages/Dashboard'
import ProtectedRoute from '~/components/ProtectedRoute'
// import DefaultLayout from '~/layouts/DefaultLayout'
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
      <div className='App'>
        <Routes>
          <Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<Wrapper layout={ProtectedLayout} />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/blogs' element={<Home />} />
              </Route>
            </Route>
            <Route path='/auth' element={<Auth />} />
          </Route>
          <Route path='/not-found' element={<Auth />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
