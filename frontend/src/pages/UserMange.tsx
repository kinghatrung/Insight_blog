import { useRef, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { ProTable, ProForm, ProFormText, ProFormSelect, ProFormUploadDragger } from '@ant-design/pro-components'
import { Button, Modal } from 'antd'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import type { UploadRequestOption } from 'rc-upload/lib/interface'

import { authSelectors } from '~/redux/slices/authSlice'
import QuillEditor from '~/components/QuillEditor'
import { blogService } from '~/services/blogService'
import { uploadService } from '~/services/uploadService'
import type { Blog, BlogFromValues } from '~/types/Blog'
import type { User } from '~/types/User'

const { confirm } = Modal

function UserMange() {
  const actionRef = useRef<ActionType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { currentUser } = useSelector(authSelectors)

  const handleDeleteBlog = async (idBlog: string) => {
    confirm({
      title: 'Bạn có chắc muốn xóa blog này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        await blogService.deleteBlog(idBlog)
        actionRef.current?.reload()
      }
    })
  }

  const handleCreateBlog = async (values: BlogFromValues) => {
    const { title, status, content, thumbnail } = values
    const userId = (currentUser as User)._id
    let finalThumbnailUrl: string | undefined = undefined
    if (Array.isArray(thumbnail)) {
      const fileObject = thumbnail[0]

      if (fileObject && typeof fileObject === 'object') {
        finalThumbnailUrl = fileObject.url || fileObject.response
      }
    } else if (typeof thumbnail === 'string') {
      finalThumbnailUrl = thumbnail
    }
    if (!finalThumbnailUrl) {
      console.error('Lỗi: Không tìm thấy URL Thumbnail hợp lệ.')
      return
    }

    await blogService.createBlog(title, content, finalThumbnailUrl, status, userId)
    setIsModalOpen(false)
    actionRef.current?.reload()
  }

  const handleUploadImage = async (options: UploadRequestOption) => {
    const { file, onSuccess, onError } = options
    const fileToUpload = file as File
    try {
      const uploadedFile = await uploadService.upload(fileToUpload)
      const imageUrl = uploadedFile.data
      if (onSuccess) {
        onSuccess(imageUrl)
      }
    } catch (error) {
      if (onError) {
        onError(error as Error)
      }
    }
  }

  const columns: ProColumns<Blog>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48
    },
    {
      title: 'Ảnh',
      dataIndex: 'thumbnail',
      search: false,
      render: (_, record) => <img src={record.thumbnail} alt={record.title} style={{ width: 60 }} />
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      copyable: true,
      ellipsis: true,
      fieldProps: { placeholder: 'Tiêu đề Blog cần tìm' },
      tooltip: 'Tiêu đề Blog',
      formItemProps: { rules: [{ required: true, message: 'Vui lòng nhập tiêu đề' }] }
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
        placeholder: 'Trạng thái Blog cần tìm'
      },
      valueEnum: {
        active: { text: 'Hoạt động', status: 'active' },
        processing: { text: 'Đang xử lý', status: 'processing' },
        error: { text: 'Tạm ngưng', status: 'error' }
      }
    },
    {
      title: 'Tác giả',
      dataIndex: ['author', 'displayName'],
      render: (_, record) => record.author?.displayName || 'Không xác định'
    },
    {
      title: 'Ngày tạo',
      key: 'showTime',
      dataIndex: 'createdAt',
      valueType: 'date',
      fieldProps: {
        format: 'DD/MM/YYYY HH:mm:ss'
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
        <a key='view' href={`/blogs/${record.slug}`} target='_blank' rel='noopener noreferrer'>
          Xem
        </a>,
        <a key='delete' style={{ color: 'red' }} onClick={() => handleDeleteBlog(record._id)}>
          Xóa
        </a>
      ]
    }
  ]

  return (
    <>
      <ProTable<Blog>
        columns={columns}
        actionRef={actionRef}
        dateFormatter='string'
        cardBordered
        rowKey='_id'
        request={async (params) => {
          const { current = 1, pageSize = 5 } = params
          try {
            const res = await blogService.getBlogs(current, pageSize)
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
          onSave: async (_, record) => {
            await blogService.editBlog(record._id, record.title, record.content, record.thumbnail, record.status)
            actionRef.current?.reload()
          }
        }}
        headerTitle='Quản lý Blog'
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true }
          }
          // onChange(value) {
          //   console.log('value: ', value)
          // }
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

      <Modal title='Tạo mới Blog' open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)} width={1200}>
        <ProForm
          initialValues={{ content: '' }}
          onFinish={(values) => handleCreateBlog(values)}
          submitter={{
            searchConfig: {
              submitText: 'Tạo Blog',
              resetText: 'Hủy'
            },
            render: (_, doms) => doms
          }}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <ProFormText
                name='title'
                label='Tiêu đề'
                fieldProps={{ style: { height: 40 } }}
                placeholder='Nhập tiêu đề blog'
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
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
              <ProFormUploadDragger
                max={1}
                name='thumbnail'
                fieldProps={{
                  customRequest: handleUploadImage
                }}
                label='Ảnh'
                title='Hình ảnh Thumbnail của Blog'
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e
                  const fileList = e?.fileList || []
                  const lastFile = fileList[fileList.length - 1]
                  if (lastFile && lastFile.status === 'done' && lastFile.response) return lastFile.response
                  return fileList
                }}
                normalize={(value) => {
                  if (typeof value === 'string') return [{ uid: '1', name: 'Thumbnail', status: 'done', url: value }]
                  return value
                }}
                description='Chọn hoặc kéo thả file vào đây'
                rules={[{ required: true, message: 'Vui lòng chọn ảnh thumbnail' }]}
              />
            </div>

            <div style={{ flex: 2 }}>
              <ProForm.Item
                name='content'
                label='Nội dung'
                rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                valuePropName='value'
                getValueFromEvent={(value: string) => value}
              >
                <QuillEditor />
              </ProForm.Item>
            </div>
          </div>
        </ProForm>
      </Modal>
    </>
  )
}

export default UserMange
