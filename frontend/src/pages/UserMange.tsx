import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable, TableDropdown } from '@ant-design/pro-components'
import { Button, Dropdown, Space, Tag } from 'antd'
import { useRef } from 'react'
// import request from 'umi-request'
// export const waitTimePromise = async (time: number = 100) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(true)
//     }, time)
//   })
// }

// export const waitTime = async (time: number = 100) => {
//   await waitTimePromise(time)
// }

type GithubIssueItem = {
  url: string
  id: number
  number: number
  title: string
  labels: {
    name: string
    color: string
  }[]
  state: string
  comments: number
  created_at: string
  updated_at: string
  closed_at?: string
}

const columns: ProColumns<GithubIssueItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48
  },
  {
    title: 'Tiêu đề',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    fieldProps: {
      placeholder: 'Tiêu đề Blog cần tìm'
    },
    tooltip: 'Tiêu đề Blog cần tìm',
    formItemProps: {
      rules: [
        {
          required: true,
          message: 'Tiêu đề Blog cần tìm'
        }
      ]
    }
  },
  {
    disable: true,
    title: 'Trạng thái',
    dataIndex: 'state',
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: 'select',
    fieldProps: {
      placeholder: 'Trạng thái Blog cần tìm'
    },
    valueEnum: {
      all: { text: '超长'.repeat(50) },
      open: {
        text: '未解决',
        status: 'Error'
      },
      closed: {
        text: '已解决',
        status: 'Success',
        disabled: true
      },
      processing: {
        text: '解决中',
        status: 'Processing'
      }
    }
  },
  {
    disable: true,
    title: 'Nhãn',
    dataIndex: 'labels',
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_)
    },
    render: (_, record) => (
      <Space>
        {record.labels.map(({ name, color }) => (
          <Tag color={color} key={name}>
            {name}
          </Tag>
        ))}
      </Space>
    )
  },
  {
    title: 'Ngày tạo',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'date',
    sorter: true,
    hideInSearch: true
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'created_at',
    valueType: 'dateRange',
    hideInTable: true,
    fieldProps: {
      placeholder: ['Ngày bắt đầu', 'Ngày kết thúc']
    },
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1]
        }
      }
    }
  },
  {
    title: 'Lựa chọn',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key='editable'
        onClick={() => {
          action?.startEditable?.(record.id)
        }}
      >
        Sửa
      </a>,
      <a href={record.url} target='_blank' rel='noopener noreferrer' key='view'>
        Xem
      </a>,
      <TableDropdown
        key='actionGroup'
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: 'Sao chép' },
          { key: 'delete', name: 'Xóa' }
        ]}
      />
    ]
  }
]

function UserMange() {
  const actionRef = useRef<ActionType>()

  return (
    <ProTable<GithubIssueItem>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      // request={async (params, sort, filter) => {
      //   console.log(sort, filter)
      //   await waitTime(2000)
      //   return request<{
      //     data: GithubIssueItem[]
      //   }>('https://proapi.azurewebsites.net/github/issues', {
      //     params
      //   })
      // }}
      editable={{
        type: 'multiple'
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'right', disable: true }
        },
        onChange(value) {
          console.log('value: ', value)
        }
      }}
      rowKey='id'
      search={{
        labelWidth: 'auto'
      }}
      options={{
        setting: {
          listsHeight: 400
        }
      }}
      form={{
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime]
            }
          }
          return values
        }
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page)
      }}
      dateFormatter='string'
      headerTitle='Quản lý Người dùng'
      toolBarRender={() => [
        <Button
          key='button'
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload()
          }}
          type='primary'
        >
          Thêm mới
        </Button>,
        <Dropdown
          key='menu'
          menu={{
            items: [
              {
                label: '1st item',
                key: '1'
              },
              {
                label: '2nd item',
                key: '2'
              },
              {
                label: '3rd item',
                key: '3'
              }
            ]
          }}
        >
          <Button>
            <EllipsisOutlined />
          </Button>
        </Dropdown>
      ]}
    />
  )
}

export default UserMange
