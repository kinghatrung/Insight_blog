import { useRef, memo } from 'react'
import { useSelector } from 'react-redux'
import { ProForm, ProFormText, ProFormSelect, ProFormUploadDragger } from '@ant-design/pro-components'
import { Modal, Row, Col } from 'antd'
import { useQuery } from '@tanstack/react-query'
import type { ActionType } from '@ant-design/pro-components'
import type { UploadRequestOption } from 'rc-upload/lib/interface'
import type { UploadFile } from 'antd'
import type { ProFormInstance } from '@ant-design/pro-components'
import type { RefObject } from 'react'

import { authSelectors } from '~/redux/slices/authSlice'
import QuillEditor from '~/components/QuillEditor'
import { blogService } from '~/services/blogService'
import { categoryService } from '~/services/categoryService'
import { uploadService } from '~/services/uploadService'
import type { BlogFromValues } from '~/types/Blog'
import type { User } from '~/types/User'
import type { CategoryType } from '~/types/Category'

interface MyUploadFile extends UploadFile {
  public_id?: string
}

interface ModalFormBlogProps {
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  actionRef?: RefObject<ActionType | null>
}

function ModalFormBlog({ isModalOpen, setIsModalOpen, actionRef }: ModalFormBlogProps) {
  const formRef = useRef<ProFormInstance<BlogFromValues>>(null)
  const { currentUser } = useSelector(authSelectors)

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategoriesActive()
  })

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
    actionRef?.current?.reload()
    formRef.current?.resetFields()
  }

  return (
    <Modal
      destroyOnHidden
      title='Tạo mới Blog'
      open={isModalOpen}
      footer={null}
      onCancel={() => setIsModalOpen(false)}
      width={1200}
    >
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
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} md={24} lg={8}>
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
                { label: 'Đang xử lý', value: 'processing' },
                ...(currentUser?.role === 'admin'
                  ? [
                      { label: 'Hoạt động', value: 'active' },
                      { label: 'Tạm ngưng', value: 'error' }
                    ]
                  : [])
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
          </Col>

          <Col xs={24} sm={24} md={24} lg={16}>
            <ProForm.Item
              name='content'
              label='Nội dung'
              rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
              valuePropName='value'
              getValueFromEvent={(value: string) => value}
            >
              <QuillEditor />
            </ProForm.Item>
          </Col>
        </Row>
      </ProForm>
    </Modal>
  )
}

export default memo(ModalFormBlog)
