import { useRef, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { ProTable, ProForm, ProFormText, ProFormSelect, ProFormUploadDragger } from '@ant-design/pro-components'
import { Button, Modal, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import type { UploadRequestOption } from 'rc-upload/lib/interface'
import type { UploadFile } from 'antd'
import type { ProFormInstance } from '@ant-design/pro-components'

import { authSelectors } from '~/redux/slices/authSlice'
import QuillEditor from '~/components/QuillEditor'
import { blogService } from '~/services/blogService'
import { categoryService } from '~/services/categoryService'
import { uploadService } from '~/services/uploadService'
import type { Blog, BlogFromValues } from '~/types/Blog'
import type { User } from '~/types/User'
import type { CategoryType } from '~/types/Category'

const { confirm } = Modal

interface MyUploadFile extends UploadFile {
  public_id?: string
}

function UserMange() {
  const formRef = useRef<ProFormInstance<BlogFromValues>>(null)
  const actionRef = useRef<ActionType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { currentUser } = useSelector(authSelectors)

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategoriesActive()
  })

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
    const { title, status, content, thumbnail, description, category } = values
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

    await blogService.createBlog(title, content, finalThumbnailUrl, status, userId, description, category)
    setIsModalOpen(false)
    actionRef.current?.reload()
    formRef.current?.resetFields()
  }

  const handleUploadImage = async (options: UploadRequestOption) => {
    const { file, onSuccess, onError } = options
    const fileToUpload = file as File

    try {
      const uploadedFile = await uploadService.upload(fileToUpload)
      const imageUrl = uploadedFile.data
      onSuccess?.(imageUrl)
    } catch (error) {
      onError?.(error as Error)
    }
  }

  const deleteImageOnCloudinary = async (file: MyUploadFile) => {
    const publicId = file.response?.public_id || file.response || file?.public_id
    if (!publicId) return
    await uploadService.deleteImage(publicId)
  }

  const columns: ProColumns<Blog>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48
    },
    {
      title: 'Ảnh',
      editable: false,
      dataIndex: 'thumbnail',
      search: false,
      render: (_, record) => (
        <img src={record.thumbnail} alt={record.title} style={{ width: 60, height: 60, objectFit: 'cover' }} />
      )
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
      title: 'Mô tả',
      dataIndex: 'description',
      copyable: true,
      ellipsis: true,
      fieldProps: { placeholder: 'Mô tả Blog cần tìm' },
      tooltip: 'Mô tả của Blog',
      formItemProps: { rules: [{ required: true, message: 'Vui lòng nhập mô tả' }] }
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
      fieldProps: { placeholder: 'Thể loại Blog cần tìm' },
      tooltip: 'Thể loại của Blog',
      render: (_, record) => {
        const cat = record.category
        if (!cat) return 'Không xác định'
        if (typeof cat === 'string') return 'Không xác định'
        return <Tag color='blue'>{cat.title || 'Không xác định'}</Tag>
      }
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
      editable: false,
      dataIndex: ['displayName'],
      render: (_, record) => record.author?.displayName || 'Không xác định'
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
          const { current, pageSize, ...rest } = params
          try {
            const res = await blogService.getBlogs({
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
          onSave: async (_, record) => {
            const categoryId = typeof record.category === 'string' ? record.category : record.category?._id
            await blogService.editBlog(
              record._id,
              record.title,
              record.content,
              categoryId,
              record.thumbnail,
              record.status,
              record.description
            )
            actionRef.current?.reload()
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
        headerTitle='Quản lý Blog'
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

      <Modal title='Tạo mới Blog' open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)} width={1200}>
        <ProForm
          formRef={formRef}
          initialValues={{ content: '' }}
          onFinish={(values) => handleCreateBlog(values as BlogFromValues)}
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

              <ProFormSelect
                name='category'
                label='Thể loại'
                fieldProps={{ style: { height: 40 } }}
                options={
                  categories?.map((cat: CategoryType) => ({
                    label: cat.title,
                    value: cat._id
                  })) || []
                }
                rules={[{ required: true, message: 'Vui lòng chọn thể loại' }]}
              />

              <ProFormUploadDragger
                max={1}
                name='thumbnail'
                fieldProps={{
                  customRequest: handleUploadImage,
                  onRemove: deleteImageOnCloudinary,
                  listType: 'picture'
                }}
                label='Ảnh'
                title='Hình ảnh Thumbnail của Blog'
                getValueFromEvent={(e) => {
                  const fileList = Array.isArray(e) ? e : e?.fileList || []
                  const lastFile = fileList[fileList.length - 1]
                  if (lastFile && lastFile.status === 'done' && lastFile.response) {
                    return lastFile.response
                  }
                  return fileList
                }}
                normalize={(value) => {
                  if (typeof value === 'string') {
                    return [{ uid: '1', name: 'Thumbnail', status: 'done', url: value }]
                  } else if (value && typeof value === 'object' && value.url) {
                    return [{ uid: '1', name: 'Thumbnail', status: 'done', ...value }]
                  }
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
