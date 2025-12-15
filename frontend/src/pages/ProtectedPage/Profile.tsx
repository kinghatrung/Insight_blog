import { useState, useRef } from 'react'
import { ProForm, ProFormText, ProFormUploadDragger } from '@ant-design/pro-components'
import { Flex, Avatar, Button, Typography, Tabs, Col, Row, Modal } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { HeartOutlined, ProductOutlined, RetweetOutlined } from '@ant-design/icons'
import type { UploadFile, TabsProps } from 'antd'
import type { ProFormInstance } from '@ant-design/pro-components'
import type { UploadRequestOption } from 'rc-upload/lib/interface'

import { uploadService } from '~/services/uploadService'
import { authSelectors, editUser } from '~/redux/slices/authSlice'
import { blogService } from '~/services/blogService'
import CardBlog from '~/components/CardBlog'
import type { Blog } from '~/types/Blog'
import type { UserFromValues } from '~/types/User'
import type { AppDispatch } from '~/redux/store'

const { Title, Paragraph } = Typography

interface MyUploadFile extends UploadFile {
  public_id?: string
}

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const formRef = useRef<ProFormInstance<UserFromValues>>(null)
  const dispatch = useDispatch<AppDispatch>()
  const { currentUser } = useSelector(authSelectors)
  const { data: blogsAuthor } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getBlogsActiveForAuthor(currentUser?._id)
  })
  const blogs = blogsAuthor?.blogs

  const handleEditUser = async (values: UserFromValues) => {
    const { displayName, password, avatarUrl } = values
    const payload: {
      displayName?: string
      password?: string
      avatarUrl?: string
      avatarId?: string
    } = {}
    if (displayName && displayName !== currentUser?.displayName) {
      payload.displayName = displayName
    }
    if (avatarUrl && avatarUrl.length > 0) {
      const { url, public_id } = avatarUrl[0]
      payload.avatarUrl = url
      payload.avatarId = public_id
    }
    if (password && password.trim() !== '') {
      payload.password = password
    }
    if (Object.keys(payload).length === 0) {
      setIsModalOpen(false)
      return
    }

    await dispatch(editUser({ idUser: currentUser!._id, data: payload })).unwrap()
    setIsModalOpen(false)
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

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <Title level={4} style={{ color: 'rgba(248, 250, 252, 0.5)', fontWeight: 600, margin: 0, padding: '0 32px' }}>
          <ProductOutlined style={{ marginRight: 6 }} /> Blogs đã đăng
        </Title>
      ),
      children: (
        <Row gutter={[40, 40]} style={{ marginTop: 32 }}>
          {blogs?.length === 0 ? (
            <Col span={24}>
              <Title level={4} style={{ color: '#f8fafc', margin: 0, textAlign: 'center' }}>
                Chưa có Blogs nào...
              </Title>
            </Col>
          ) : (
            blogs?.map((blog: Blog) => (
              <Col key={blog._id} xs={24} sm={12} md={12} lg={8} style={{ display: 'flex' }}>
                <CardBlog blog={blog} />
              </Col>
            ))
          )}
        </Row>
      )
    },
    {
      key: '2',
      label: (
        <Title level={4} style={{ color: 'rgba(248, 250, 252, 0.5)', fontWeight: 600, margin: 0, padding: '0 32px' }}>
          <HeartOutlined style={{ marginRight: 6 }} /> Yêu thích
        </Title>
      ),
      children: <p>tab 2</p>
    },
    {
      key: '3',
      label: (
        <Title level={4} style={{ color: 'rgba(248, 250, 252, 0.5)', fontWeight: 600, margin: 0, padding: '0 32px' }}>
          <RetweetOutlined style={{ marginRight: 6 }} /> Đã lưu
        </Title>
      ),
      children: <p>tab 3</p>
    }
  ]

  return (
    <div>
      <Flex gap={24} align='center'>
        <Avatar size={228} style={{ marginBottom: 32 }} src={currentUser?.avatarUrl} alt={currentUser?.displayName} />
        <Flex gap={12} vertical>
          <Flex gap={12} align='center'>
            <Title level={3} style={{ color: '#f8fafc', margin: 0 }}>
              {currentUser?.displayName}
            </Title>
            <Paragraph style={{ fontSize: 18, color: '#f8fafc', margin: 0 }}>{currentUser?.username}</Paragraph>
          </Flex>
          <Flex gap={12}>
            <Button
              onClick={() => setIsModalOpen(!isModalOpen)}
              style={{
                fontSize: 16,
                color: '#f8fafc',
                fontWeight: 600,
                backgroundColor: '#fe2c55',
                borderRadius: 8,
                height: 42,
                padding: '1px 16px',
                borderColor: '#fe2c55'
              }}
            >
              Sửa hồ sơ
            </Button>
            <Modal
              className='box-search'
              title={`Sửa thông tin cá nhân - ${currentUser?.displayName}`}
              width={1000}
              open={isModalOpen}
              footer={false}
              onCancel={() => setIsModalOpen(!isModalOpen)}
            >
              <ProForm
                formRef={formRef}
                initialValues={{ content: '' }}
                onFinish={(values) => handleEditUser(values as UserFromValues)}
                submitter={{
                  searchConfig: {
                    submitText: 'Cập nhập',
                    resetText: 'Hủy'
                  },
                  render: (_, doms) => doms
                }}
              >
                <Flex gap={18}>
                  <Flex vertical flex={1}>
                    <ProFormText
                      name='displayName'
                      className='dark-input'
                      label={<span style={{ color: '#f8fafc' }}>Họ và tên</span>}
                      fieldProps={{
                        style: {
                          height: 40,
                          backgroundColor: 'hsl(222.2 84% 4.9%)',
                          color: '#f8fafc',
                          borderColor: 'hsl(217.2 32.6% 17.5%)'
                        }
                      }}
                      placeholder='Nhập họ người dùng'
                    />

                    <ProFormText.Password
                      name='password'
                      className='dark-input'
                      label={<span style={{ color: '#f8fafc' }}>Mật khẩu</span>}
                      fieldProps={{
                        style: {
                          height: 40,
                          backgroundColor: 'hsl(222.2 84% 4.9%)',
                          color: '#f8fafc',
                          borderColor: 'hsl(217.2 32.6% 17.5%)'
                        }
                      }}
                      placeholder='Nhập Mật khẩu người dùng'
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
                      label={<span style={{ color: '#f8fafc' }}>Ảnh đại diện</span>}
                      title={<span style={{ color: '#f8fafc' }}>Hình ảnh đại diện của người dùng</span>}
                      description={<span style={{ color: '#f8fafc' }}>Chọn hoặc kéo thả ảnh vào đây</span>}
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
                    />
                  </div>
                </Flex>
              </ProForm>
            </Modal>
            <Button
              style={{
                fontSize: 16,
                color: '#f8fafc',
                fontWeight: 600,
                backgroundColor: 'hsla(0,0%,100%,.13)',
                borderRadius: 8,
                height: 42,
                padding: '1px 16px',
                borderColor: 'hsla(0,0%,100%,.13)'
              }}
            >
              Viết Blog
            </Button>
          </Flex>

          <Flex gap={12} vertical>
            <Flex gap={18}>
              <Paragraph style={{ fontSize: 18, color: '#f8fafc', margin: 0, fontWeight: 600 }}>
                10 <span style={{ color: 'rgb(107, 114, 128)', fontSize: 16, fontWeight: 500 }}>Blogs</span>
              </Paragraph>
              <Paragraph style={{ fontSize: 18, color: '#f8fafc', margin: 0, fontWeight: 600 }}>
                1k2 <span style={{ color: 'rgb(107, 114, 128)', fontSize: 16, fontWeight: 500 }}>Lượt thích</span>
              </Paragraph>
            </Flex>
            <Paragraph style={{ fontSize: 16, color: '#f8fafc', margin: 0, fontWeight: 500 }}>
              Chưa có tiểu sử...
            </Paragraph>
          </Flex>
        </Flex>
      </Flex>
      <Tabs defaultActiveKey='1' items={items} />
    </div>
  )
}

export default Profile
