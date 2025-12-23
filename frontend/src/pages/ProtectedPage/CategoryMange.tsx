import { useRef, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { ProTable, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components'
import { Button, Modal, Flex } from 'antd'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'

import { categoryService } from '~/services/categoryService'
import type { CategoryType, CategoryFromValues } from '~/types/Category'

const { confirm } = Modal

function CategoryMange() {
  const formRef = useRef<ProFormInstance<CategoryFromValues>>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const actionRef = useRef<ActionType | null>(null)

  const handleCreateCategory = async (values: CategoryFromValues) => {
    const { title, status, description } = values
    await categoryService.createCategory(title, status, description)
    setIsModalOpen(false)
    actionRef.current?.reload()
    formRef.current?.resetFields()
  }

  const handleDeleteCategory = async (idCategory: string, titleCategory: string) => {
    confirm({
      title: `Bạn có chắc muốn xóa Thể loại ${titleCategory}?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        await categoryService.deleteCategory(idCategory)
        actionRef.current?.reload()
      }
    })
  }

  const columns: ProColumns<CategoryType>[] = [
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
      fieldProps: { placeholder: 'Tiêu đề Thể loại cần tìm' },
      tooltip: 'Tiêu đề thể loại',
      formItemProps: { rules: [{ required: true, message: 'Vui lòng nhập tiêu đề' }] }
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      copyable: true,
      ellipsis: true,
      fieldProps: { placeholder: 'Mô tả Thể loại cần tìm' },
      tooltip: 'Mô tả của Thể loại',
      formItemProps: { rules: [{ required: true, message: 'Vui lòng nhập mô tả' }] }
    },
    {
      title: 'Blogs',
      dataIndex: 'blogs',
      hideInSearch: true,
      editable: false,
      tooltip: 'Số Blogs của Thể loại',
      render: (_, record) => record.blogs.length
    },
    {
      disable: true,
      title: 'Trạng thái',
      filters: true,
      onFilter: true,
      ellipsis: true,
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: {
        placeholder: 'Trạng thái Thể loại cần tìm'
      },
      valueEnum: {
        active: { text: 'Hoạt động', status: 'success' },
        processing: { text: 'Đang xử lý', status: 'processing' },
        error: { text: 'Tạm ngưng', status: 'error' }
      }
    },
    {
      title: 'Ngày tạo',
      key: 'showTime',
      editable: false,
      dataIndex: 'createdAt',
      valueType: 'date',
      fieldProps: {
        format: 'DD/MM/YYYY HH:mm'
      },
      hideInSearch: true
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: {
        placeholder: ['Ngày bắt đầu', 'Ngày kết thúc'],
        format: 'DD/MM/YYYY'
      },
      search: {
        transform: (value) => {
          if (!value || !Array.isArray(value)) {
            return {}
          }
          return {
            startTime: value[0],
            endTime: value[1]
          }
        }
      }
    },
    {
      title: 'Hành động',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a key='edit' onClick={() => action?.startEditable?.(record._id)}>
          Sửa
        </a>,
        <a key='delete' style={{ color: 'red' }} onClick={() => handleDeleteCategory(record._id, record.title)}>
          Xóa
        </a>
      ]
    }
  ]

  return (
    <>
      <ProTable
        style={{ paddingTop: 20 }}
        columns={columns}
        actionRef={actionRef}
        dateFormatter='string'
        cardBordered
        rowKey='_id'
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          try {
            const res = await categoryService.getCategories({
              page: current!,
              pageSize: pageSize!,
              ...rest
            })
            return {
              data: res.data,
              total: res.total,
              success: true
            }
          } catch (error) {
            console.error(error)
            return { data: [], success: false, total: 0 }
          }
        }}
        editable={{
          type: 'multiple',
          onSave: async (_, record) => (
            await categoryService.editCategory(record._id, record.title, record.status, record.description),
            actionRef.current?.reload()
          )
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
        headerTitle='Quản lý Thể loại'
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true }
          }
        }}
        search={{ labelWidth: 'auto' }}
        options={{ setting: { listsHeight: 400 } }}
        pagination={{
          pageSize: 5
        }}
        toolBarRender={() => [
          <Button key='button' icon={<PlusOutlined />} type='primary' onClick={() => setIsModalOpen(true)}>
            Thêm mới
          </Button>
        ]}
      />

      <Modal
        title='Tạo mới Thể loại'
        open={isModalOpen}
        destroyOnHidden
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <ProForm
          formRef={formRef}
          initialValues={{ content: '' }}
          onFinish={(values) => handleCreateCategory(values as CategoryFromValues)}
          submitter={{
            searchConfig: {
              submitText: 'Tạo Thể loại',
              resetText: 'Hủy'
            },
            render: (_, doms) => doms
          }}
        >
          <Flex vertical>
            <ProFormText
              name='title'
              label='Tiêu đề'
              fieldProps={{ style: { height: 40 } }}
              placeholder='Nhập tiêu đề blog'
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            />
            <ProFormText
              name='description'
              label='Mô tả'
              fieldProps={{ style: { height: 40 } }}
              placeholder='Nhập mô tả của blog'
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            />
            <ProFormSelect
              name='status'
              label='Trạng thái'
              fieldProps={{ style: { height: 40 } }}
              options={[
                { label: 'Hoạt động', value: 'active' },
                { label: 'Đang xử lý', value: 'processing' },
                { label: 'Tạm ngưng', value: 'error' }
              ]}
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            />
          </Flex>
        </ProForm>
      </Modal>
    </>
  )
}

export default CategoryMange
