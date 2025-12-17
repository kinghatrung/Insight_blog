import { useState, useRef } from 'react'
import { ProForm, ProFormText, ProFormUploadDragger } from '@ant-design/pro-components'
import { Flex, Avatar, Button, Typography, Tabs, Col, Row, Modal, Skeleton } from 'antd'
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
import ModalFormBlog from '~/components/ModalFormBlog'
import type { Blog } from '~/types/Blog'
import type { UserFromValues } from '~/types/User'
import type { AppDispatch } from '~/redux/store'

const { Title, Paragraph } = Typography

interface MyUploadFile extends UploadFile {
  public_id?: string
}

function Profile() {
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false)
  const formRef = useRef<ProFormInstance<UserFromValues>>(null)
  const dispatch = useDispatch<AppDispatch>()
  const { currentUser } = useSelector(authSelectors)
  const { data: blogsAuthor, isLoading: loadingAuthor } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getBlogsActiveForAuthor(currentUser?._id)
  })
  const { data: blogsLiked, isLoading: loadingLiked } = useQuery({
    queryKey: ['blogsLiked'],
    queryFn: () => blogService.getBlogsLiked(currentUser?._id)
  })
  const { data: blogsSaved, isLoading: loadingSaved } = useQuery({
    queryKey: ['blogsSaved'],
    queryFn: () => blogService.getBlogsSave(currentUser?._id)
  })

  const blogs = loadingAuthor ? Array(6).fill(null) : blogsAuthor?.blogs
  const blogsLike = loadingLiked ? Array(6).fill(null) : blogsLiked?.blogs
  const blogsSave = loadingSaved ? Array(6).fill(null) : blogsSaved?.blogs

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
      setIsModalEditOpen(false)
      return
    }

    await dispatch(editUser({ idUser: currentUser!._id, data: payload })).unwrap()
    setIsModalEditOpen(false)
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
                Chưa có Blogs nào được tạo...
              </Title>
            </Col>
          ) : (
            blogs?.map((blog: Blog, index: number) => (
              <Col key={blog?._id || `skeleton-${index}`} xs={24} sm={12} md={12} lg={8} style={{ display: 'flex' }}>
                <CardBlog blog={blog} loading={loadingAuthor} />
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
      children: (
        <Row gutter={[40, 40]} style={{ marginTop: 32 }}>
          {blogsLike?.length === 0 ? (
            <Col span={24}>
              <Title level={4} style={{ color: '#f8fafc', margin: 0, textAlign: 'center' }}>
                Chưa có Blogs nào được thích...
              </Title>
            </Col>
          ) : (
            blogsLike?.map((blog: Blog, index: number) => (
              <Col key={blog?._id || `skeleton-${index}`} xs={24} sm={12} md={12} lg={8} style={{ display: 'flex' }}>
                <CardBlog blog={blog} loading={loadingLiked} />
              </Col>
            ))
          )}
        </Row>
      )
    },
    {
      key: '3',
      label: (
        <Title level={4} style={{ color: 'rgba(248, 250, 252, 0.5)', fontWeight: 600, margin: 0, padding: '0 32px' }}>
          <RetweetOutlined style={{ marginRight: 6 }} /> Đã lưu
        </Title>
      ),
      children: (
        <Row gutter={[40, 40]} style={{ marginTop: 32 }}>
          {blogsSave?.length === 0 ? (
            <Col span={24}>
              <Title level={4} style={{ color: '#f8fafc', margin: 0, textAlign: 'center' }}>
                Chưa có Blogs nào được lưu...
              </Title>
            </Col>
          ) : (
            blogsSave?.map((blog: Blog, index: number) => (
              <Col key={blog?._id || `skeleton-${index}`} xs={24} sm={12} md={12} lg={8} style={{ display: 'flex' }}>
                <CardBlog blog={blog} loading={loadingSaved} />
              </Col>
            ))
          )}
        </Row>
      )
    }
  ]

  return (
    <div>
      <Flex gap={24} align='center'>
        {loadingAuthor ? (
          <Skeleton.Avatar shape='circle' size={228} style={{ marginBottom: 32, backgroundColor: '#1f2937' }} active />
        ) : (
          <Avatar size={228} style={{ marginBottom: 32 }} src={currentUser?.avatarUrl} alt={currentUser?.displayName} />
        )}
        <Flex gap={12} vertical>
          <Flex gap={12} align='center'>
            {loadingAuthor ? (
              <>
                <Skeleton.Input
                  style={{ width: '100%', height: 24, borderRadius: 4, backgroundColor: '#1f2937' }}
                  active
                />
                <Skeleton.Input
                  style={{ width: '100%', height: 24, borderRadius: 4, backgroundColor: '#1f2937' }}
                  active
                />
              </>
            ) : (
              <>
                <Title level={3} style={{ color: '#f8fafc', margin: 0 }}>
                  {currentUser?.displayName}
                </Title>
                <Paragraph style={{ fontSize: 18, color: '#f8fafc', margin: 0 }}>{currentUser?.username}</Paragraph>
              </>
            )}
          </Flex>
          <Flex gap={12}>
            <Button
              onClick={() => setIsModalEditOpen(!isModalEditOpen)}
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
              open={isModalEditOpen}
              footer={false}
              onCancel={() => setIsModalEditOpen(!isModalEditOpen)}
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
              onClick={() => setIsModalCreateOpen(!isModalCreateOpen)}
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
            <ModalFormBlog isModalOpen={isModalCreateOpen} setIsModalOpen={setIsModalCreateOpen} />
          </Flex>

          {loadingAuthor ? (
            <Flex gap={12} vertical>
              <Flex gap={18}>
                <Skeleton.Input
                  style={{ width: '100%', height: 24, borderRadius: 4, backgroundColor: '#1f2937' }}
                  active
                />
                <Skeleton.Input
                  style={{ width: '100%', height: 24, borderRadius: 4, backgroundColor: '#1f2937' }}
                  active
                />
              </Flex>
              <Skeleton.Input
                style={{ width: '80%', height: 24, borderRadius: 4, backgroundColor: '#1f2937' }}
                active
              />
            </Flex>
          ) : (
            <Flex gap={12} vertical>
              <Flex gap={18}>
                <Paragraph style={{ fontSize: 18, color: '#f8fafc', margin: 0, fontWeight: 600 }}>
                  {blogs?.length}{' '}
                  <span style={{ color: 'rgb(107, 114, 128)', fontSize: 16, fontWeight: 500 }}>Blogs đã đăng</span>
                </Paragraph>
                <Paragraph style={{ fontSize: 18, color: '#f8fafc', margin: 0, fontWeight: 600 }}>
                  1k2 <span style={{ color: 'rgb(107, 114, 128)', fontSize: 16, fontWeight: 500 }}>Lượt thích</span>
                </Paragraph>
              </Flex>
              <Paragraph style={{ fontSize: 16, color: '#f8fafc', margin: 0, fontWeight: 500 }}>
                Chưa có tiểu sử...
              </Paragraph>
            </Flex>
          )}
        </Flex>
      </Flex>
      <Tabs defaultActiveKey='1' items={items} />
    </div>
  )
}

export default Profile
