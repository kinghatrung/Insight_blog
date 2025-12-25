import { useRef, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import { Button, Modal, Tag, Image } from 'antd'
import type { ActionType, ProColumns } from '@ant-design/pro-components'

import { blogService } from '~/services/blogService'
import ModalFormBlog from '~/components/ModalFormBlog'
import type { Blog } from '~/types/Blog'

const { confirm } = Modal

function BlogMange() {
  const actionRef = useRef<ActionType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  const columns: ProColumns<Blog>[] = [
    { dataIndex: 'index', valueType: 'indexBorder', width: 48 },
    {
      title: 'Ảnh',
      editable: false,
      dataIndex: 'thumbnail',
      search: false,
      render: (_, record) => (
        <Image
          style={{ objectFit: 'cover' }}
          src={record.thumbnail}
          alt={record.title}
          width={80}
          height={80}
          fallback='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=='
        />
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
        active: { text: 'Hoạt động', status: 'success' },
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
      render: (__, record, _, action) => [
        <a key='edit' onClick={() => action?.startEditable?.(record._id)}>
          Sửa
        </a>,
        <a key='view' href={`/detail/${record.slug}`} target='_blank' rel='noopener noreferrer'>
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
        style={{ paddingTop: 20 }}
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
      <ModalFormBlog isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} actionRef={actionRef} />
    </>
  )
}

export default BlogMange
