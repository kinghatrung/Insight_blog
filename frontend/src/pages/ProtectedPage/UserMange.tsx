import { useRef, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { ProTable, ProForm, ProFormText, ProFormUploadDragger } from '@ant-design/pro-components'
import { Button, Modal, Flex, Image } from 'antd'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'
import type { UploadRequestOption } from 'rc-upload/lib/interface'
import type { UploadFile } from 'antd'

import { uploadService } from '~/services/uploadService'
import { userService } from '~/services/userService'
import type { User, UserFromValues } from '~/types/User'

const { confirm } = Modal

interface MyUploadFile extends UploadFile {
  public_id?: string
}

function UserMange() {
  const formRef = useRef<ProFormInstance<UserFromValues>>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const actionRef = useRef<ActionType | null>(null)

  const handleCreateUser = async (values: UserFromValues) => {
    const { username, email, firstName, lastName, password, avatarUrl } = values
    let finalAvatarUrl: string | undefined = undefined
    let finalAvatarId
    if (Array.isArray(avatarUrl)) {
      const fileObject = avatarUrl[0]
      if (fileObject && typeof fileObject === 'object') {
        finalAvatarUrl = fileObject.url || fileObject.response
        finalAvatarId = fileObject.public_id
      }
    } else if (typeof avatarUrl === 'string') {
      finalAvatarUrl = avatarUrl
    }
    if (!finalAvatarUrl) {
      console.error('Lỗi: Không tìm thấy URL AvatarUrl hợp lệ.')
      return
    }
    await userService.createUser(username, password, email, firstName, lastName, finalAvatarUrl, finalAvatarId)
    setIsModalOpen(false)
    actionRef.current?.reload()
    formRef.current?.resetFields()
  }

  const handleDeleteUser = async (idUser: string, nameUser: string) => {
    confirm({
      title: `Bạn có chắc muốn xóa người dùng ${nameUser}?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        await userService.deleteUsers(idUser)
        actionRef.current?.reload()
      }
    })
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

  const columns: ProColumns<User>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48
    },
    {
      title: 'Ảnh',
      editable: false,
      dataIndex: 'avatarUrl',
      search: false,
      render: (_, record) => (
        <Image
          src={record.avatarUrl}
          alt={record.displayName}
          width={80}
          height={80}
          fallback='data:image/png;base64,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'
        />
      )
    },
    {
      title: 'Tên',
      dataIndex: 'displayName',
      copyable: true,
      ellipsis: true,
      fieldProps: { placeholder: 'Tên người dùng cần tìm' },
      tooltip: 'Tên người dùng',
      formItemProps: { rules: [{ required: true, message: 'Vui lòng nhập tên người dùng' }] }
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      copyable: true,
      ellipsis: true,
      fieldProps: { placeholder: 'Tên đăng nhập cần tìm', id: 'search-username' },
      tooltip: 'Tên đăng nhập',
      formItemProps: { rules: [{ required: true, message: 'Vui lòng nhập tên đăng nhập' }] }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      copyable: true,
      ellipsis: true,
      fieldProps: { placeholder: 'Email người dùng cần tìm', id: 'search-email' },
      tooltip: 'Email của người dùng',
      formItemProps: { rules: [{ required: true, message: 'Vui lòng nhập email' }] }
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      hideInSearch: true,
      filters: true,
      editable: false,
      valueEnum: {
        admin: { text: 'Quản trị viên', status: 'success' },
        custom: { text: 'Người dùng', status: 'success' }
      }
    },
    // {
    //   disable: true,
    //   title: 'Trạng thái',
    //   onFilter: true,
    //   ellipsis: true,
    //   dataIndex: 'status',
    //   valueType: 'select',
    //   fieldProps: {
    //     placeholder: 'Trạng thái Thể loại cần tìm'
    //   },
    //   valueEnum: {
    //     active: { text: 'Hoạt động', status: 'success' },
    //     processing: { text: 'Đang xử lý', status: 'processing' },
    //     error: { text: 'Tạm ngưng', status: 'error' }
    //   }
    // },
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
        <a key='delete' style={{ color: 'red' }} onClick={() => handleDeleteUser(record._id, record.displayName)}>
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
            const res = await userService.getUsers({
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
        // editable={{
        //   type: 'multiple',
        //   onSave: async (_, record) => (
        //     await categoryService.editCategory(record._id, record.title, record.status, record.description),
        //     actionRef.current?.reload()
        //   )
        // }}
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
        headerTitle='Quản lý Người dùng'
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
        title='Tạo mới người dùng'
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        width={1000}
      >
        <ProForm
          formRef={formRef}
          initialValues={{ content: '' }}
          onFinish={(values) => handleCreateUser(values as UserFromValues)}
          submitter={{
            searchConfig: {
              submitText: 'Tạo Người dùng',
              resetText: 'Hủy'
            },
            render: (_, doms) => doms
          }}
        >
          <Flex gap={18}>
            <Flex vertical flex={1}>
              <Flex gap={12} justify='space-between'>
                <ProFormText
                  name='lastName'
                  label='Họ'
                  fieldProps={{ style: { height: 40 } }}
                  placeholder='Nhập họ người dùng'
                  rules={[{ required: true, message: 'Vui lòng nhập họ người dùng' }]}
                />

                <ProFormText
                  name='firstName'
                  label='Tên'
                  fieldProps={{ style: { height: 40 } }}
                  placeholder='Nhập tên người dùng'
                  rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
                />
              </Flex>
              <ProFormText
                name='username'
                label='Tên người dùng'
                fieldProps={{ style: { height: 40 } }}
                placeholder='Nhập Tên người dùng'
                rules={[{ required: true, message: 'Vui lòng nhập Tên người dùng' }]}
              />
              <ProFormText
                name='email'
                label='Email'
                fieldProps={{ style: { height: 40 } }}
                placeholder='Nhập Email người dùng'
                rules={[
                  { required: true, message: 'Vui lòng nhập Email người dùng' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              />
              <ProFormText.Password
                name='password'
                label='Mật khẩu'
                fieldProps={{ style: { height: 40 } }}
                placeholder='Nhập Mật khẩu người dùng'
                rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu người dùng' }]}
              />
            </Flex>

            <div style={{ flex: 1, alignItems: 'center' }}>
              <ProFormUploadDragger
                max={1}
                name='avatarUrl'
                fieldProps={{
                  customRequest: handleUploadImage,
                  onRemove: deleteImageOnCloudinary,
                  listType: 'picture'
                }}
                label='Ảnh đại diện'
                title='Hình ảnh đại diện của người dùng'
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
                    return [{ uid: '1', name: 'AvatarUrl', status: 'done', url: value }]
                  } else if (value && typeof value === 'object' && value.url) {
                    return [{ uid: '1', name: 'AvatarUrl', status: 'done', ...value }]
                  }
                  return value
                }}
                description='Chọn hoặc kéo thả ảnh vào đây'
                rules={[{ required: true, message: 'Vui lòng chọn ảnh đại diện' }]}
              />
            </div>
          </Flex>
        </ProForm>
      </Modal>
    </>
  )
}

export default UserMange
