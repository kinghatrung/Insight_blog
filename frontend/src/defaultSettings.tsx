import { CrownFilled, SmileFilled } from '@ant-design/icons'
import Dashboard from '~/pages/Dashboard'
import Home from '~/pages/Home'

export default {
  route: {
    path: '/dashboard',
    routes: [
      {
        path: '/dashboard',
        name: 'Dash Board',
        icon: <SmileFilled />,
        component: <Dashboard />
      },
      {
        path: '/blogs',
        name: 'Bài viết',
        icon: <CrownFilled />,
        component: <Home />
      }
    ]
  }
}
