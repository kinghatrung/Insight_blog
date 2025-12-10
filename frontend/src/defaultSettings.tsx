import { ContainerFilled, DashboardFilled, OrderedListOutlined, UserOutlined } from '@ant-design/icons'

export default {
  route: {
    routes: [
      {
        path: '/admin/dashboard',
        name: 'Dash Board',
        icon: <DashboardFilled />
      },
      {
        path: '/admin/users',
        name: 'Người dùng',
        icon: <UserOutlined />
      },
      {
        path: '/admin/blogs',
        name: 'Bài viết',
        icon: <ContainerFilled />
      },
      {
        path: '/admin/categories',
        name: 'Thể loại',
        icon: <OrderedListOutlined />
      }
    ]
  }
}
