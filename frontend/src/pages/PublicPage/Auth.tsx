import { useState } from 'react'
import { LockOutlined, UserOutlined, MailOutlined, IdcardOutlined, FormOutlined } from '@ant-design/icons'
import { FaFacebookF, FaGoogle } from 'react-icons/fa'
import { LoginFormPage, ProConfigProvider, ProFormCheckbox, ProFormText } from '@ant-design/pro-components'
import { Divider, Space, Tabs, theme } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Navigate } from 'react-router-dom'
import type { CSSProperties } from 'react'
import type { AppDispatch } from '~/redux/store'

import { loginUser } from '~/redux/slices/authSlice'
import { authService } from '~/services/authService'
import { authSelectors } from '~/redux/slices/authSlice'

type LoginType = 'Đăng ký' | 'Đăng nhập'

interface FormData {
  username: string
  password: string
  lastName: string
  firstName: string
  email: string
}

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer'
}

const Page = () => {
  const [loginType, setLoginType] = useState<LoginType>('Đăng nhập')
  const { token } = theme.useToken()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleAuth = async (data: FormData) => {
    const { email, firstName, lastName, password, username } = data

    if (loginType === 'Đăng ký') {
      await authService.register(email, username, password, lastName, firstName)
      setLoginType('Đăng nhập')
    }
    if (loginType === 'Đăng nhập') {
      await dispatch(loginUser({ username, password })).unwrap()
      navigate('/')
    }
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh'
      }}
    >
      <LoginFormPage
        style={{ fontFamily: "'Montserrat Alternates', sans-serif" }}
        backgroundVideoUrl='https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr'
        title='Insight'
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0,0.65)',
          backdropFilter: 'blur(4px)'
        }}
        onFinish={handleAuth}
        subTitle='Tiếp tục hành trình khám phá tri thức của bạn.'
        submitter={{
          searchConfig: {
            submitText: loginType === 'Đăng nhập' ? 'Đăng nhập ngay' : 'Đăng ký ngay'
          }
        }}
        actions={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <Divider plain>
              <span
                style={{
                  color: token.colorTextPlaceholder,
                  fontWeight: 'normal',
                  fontSize: 14
                }}
              >
                Hoặc
              </span>
            </Divider>
            <Space align='center' size={12}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  height: 40,
                  width: 40,
                  border: '1px solid ' + token.colorPrimaryBorder,
                  borderRadius: '50%'
                }}
              >
                <FaFacebookF style={{ ...iconStyles, color: '#1677FF' }} />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  height: 40,
                  width: 40,
                  border: '1px solid ' + token.colorPrimaryBorder,
                  borderRadius: '50%'
                }}
              >
                <FaGoogle style={{ ...iconStyles, color: '#FF6A10' }} />
              </div>
            </Space>
          </div>
        }
      >
        <Tabs
          items={[
            { key: 'Đăng nhập', label: 'Đăng nhập' },
            { key: 'Đăng ký', label: 'Đăng ký' }
          ]}
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        />
        {loginType === 'Đăng nhập' && (
          <>
            <ProFormText
              name='username'
              fieldProps={{
                size: 'large',
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorText
                    }}
                    className={'prefixIcon'}
                  />
                )
              }}
              placeholder={'Tên đăng nhập'}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên đăng nhập!'
                }
              ]}
            />
            <ProFormText.Password
              name='password'
              fieldProps={{
                size: 'large',
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText
                    }}
                    className={'prefixIcon'}
                  />
                )
              }}
              placeholder={'Mật khẩu'}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!'
                }
              ]}
            />

            <div
              style={{
                marginBlockEnd: 24
              }}
            >
              <ProFormCheckbox noStyle name='autoLogin'>
                Ghi nhớ
              </ProFormCheckbox>
              <a
                onClick={() => setLoginType('Đăng ký')}
                style={{
                  float: 'right'
                }}
              >
                Đăng ký tài khoản
              </a>
            </div>
          </>
        )}
        {loginType === 'Đăng ký' && (
          <>
            <div style={{ display: 'flex', gap: '8px' }}>
              <ProFormText
                name='lastName'
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <IdcardOutlined
                      style={{
                        color: token.colorText
                      }}
                      className={'prefixIcon'}
                    />
                  )
                }}
                placeholder={'Họ'}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập họ!'
                  }
                ]}
              />
              <ProFormText
                name='firstName'
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <FormOutlined
                      style={{
                        color: token.colorText
                      }}
                      className={'prefixIcon'}
                    />
                  )
                }}
                placeholder={'Tên'}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên!'
                  }
                ]}
              />
            </div>
            <ProFormText
              name='email'
              fieldProps={{
                size: 'large',
                prefix: (
                  <MailOutlined
                    style={{
                      color: token.colorText
                    }}
                    className={'prefixIcon'}
                  />
                )
              }}
              placeholder={'Email'}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập email!'
                },
                {
                  type: 'email',
                  message: 'Email không hợp lệ!'
                }
              ]}
            />
            <ProFormText
              name='username'
              fieldProps={{
                size: 'large',
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorText
                    }}
                    className={'prefixIcon'}
                  />
                )
              }}
              placeholder={'Tên đăng nhập'}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên đăng nhập!'
                }
              ]}
            />
            <ProFormText.Password
              name='password'
              fieldProps={{
                size: 'large',
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText
                    }}
                    className={'prefixIcon'}
                  />
                )
              }}
              placeholder={'Mật khẩu'}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!'
                }
              ]}
            />

            <div
              style={{
                marginBlockEnd: 24
              }}
            >
              <a
                onClick={() => setLoginType('Đăng nhập')}
                style={{
                  float: 'right',
                  marginBottom: 24
                }}
              >
                Đăng nhập tài khoản
              </a>
            </div>
          </>
        )}
      </LoginFormPage>
    </div>
  )
}

export default function Auth() {
  const { currentUser } = useSelector(authSelectors)
  if (currentUser) return <Navigate to='/' replace />
  return (
    <ProConfigProvider dark>
      <Page />
    </ProConfigProvider>
  )
}
