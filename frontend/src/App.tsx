import { BrowserRouter, Route, Routes, Outlet } from 'react-router'
import { Fragment } from 'react'

import Home from '~/pages/Home'
import Auth from '~/pages/Auth'
import DefaultLayout from '~/layouts/DefaultLayout'

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
          <Route element={<Wrapper layout={DefaultLayout} />}>
            <Route path='/' element={<Home />} />
          </Route>
          <Route path='/auth' element={<Auth />} />
          <Route path='/not-found' element={<Auth />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
