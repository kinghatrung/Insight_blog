import { Typography } from 'antd'

const { Title, Paragraph } = Typography

function About() {
  return (
    <section>
      <div style={{ width: '100%' }}>
        <img
          style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 16 }}
          src='/images/anhnen1.jpg'
        />
      </div>
      <div style={{ paddingTop: 32 }}>
        <div>
          <Title level={3} style={{ color: '#f8fafc', fontWeight: 600, marginBottom: 24 }}>
            Giới thiệu chung
          </Title>
          <Paragraph style={{ color: '#f8fafc', fontWeight: 500, fontSize: 16, lineHeight: 2 }}>
            Chào mừng bạn đến với Insight Blog – không gian nơi mình chia sẻ những kiến thức, kinh nghiệm và góc nhìn
            sâu sắc về công nghệ, lập trình và cuộc sống hiện đại. Mỗi bài viết tại đây đều được nghiên cứu kỹ lưỡng,
            được viết với mục tiêu không chỉ cung cấp thông tin mà còn truyền cảm hứng, giúp bạn nhìn nhận vấn đề theo
            nhiều chiều, nâng cao kỹ năng, và phát triển tư duy sáng tạo trong công việc lẫn cuộc sống hàng ngày.
          </Paragraph>
        </div>

        <div>
          <Title level={3} style={{ color: '#f8fafc', fontWeight: 600, marginBottom: 24, marginTop: 40 }}>
            Điểm nổi bật
          </Title>
          <Paragraph style={{ color: '#f8fafc', fontWeight: 500, fontSize: 16, lineHeight: 2 }}>
            Insight Blog hướng đến việc mang lại giá trị thực tiễn cho độc giả:
          </Paragraph>
          <ul style={{ color: '#f8fafc', fontSize: 16, lineHeight: 2, fontWeight: 500 }}>
            <li style={{ marginLeft: 40 }}>
              Các bài viết chuyên sâu về lập trình web, công nghệ mới, và các xu hướng hiện đại, luôn được cập nhật
              thường xuyên.
            </li>
            <li style={{ marginLeft: 40 }}>
              Hướng dẫn chi tiết, dễ áp dụng, giúp bạn nắm vững kiến thức và triển khai vào thực tế một cách hiệu quả.
            </li>
            <li style={{ marginLeft: 40 }}>
              Góc nhìn cá nhân và phân tích từ kinh nghiệm thực tiễn, giúp bạn mở rộng tầm nhìn và phát triển tư duy
              chiến lược trong công việc lẫn học tập.
            </li>
            <li style={{ marginLeft: 40 }}>
              Một cộng đồng thân thiện, nơi bạn có thể chia sẻ, học hỏi và cùng phát triển.
            </li>
          </ul>
        </div>

        <div>
          <Title level={3} style={{ color: '#f8fafc', fontWeight: 600, marginBottom: 24, marginTop: 40 }}>
            Lời mời hành động
          </Title>
          <Paragraph style={{ color: '#f8fafc', fontWeight: 500, fontSize: 16, lineHeight: 2 }}>
            Hãy cùng Insight Blog khám phá, học hỏi và phát triển kỹ năng mỗi ngày. Đăng ký nhận bản tin để không bỏ lỡ
            những bài viết mới nhất, tham gia thảo luận và chia sẻ trải nghiệm của bạn với cộng đồng. Dù bạn là lập
            trình viên, người yêu công nghệ, hay chỉ đơn giản là một người muốn học hỏi và mở rộng kiến thức, Insight
            Blog luôn sẵn sàng đồng hành cùng bạn trên mỗi bước đường.
          </Paragraph>
        </div>
      </div>
    </section>
  )
}

export default About
