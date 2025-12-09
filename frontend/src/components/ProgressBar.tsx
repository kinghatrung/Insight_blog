interface Heading {
  id: string
  text: string
  level: number
  paddingLeft: number
}

interface ProgressBarProps {
  percent: number
  headings: Heading[]
}

function ProgressBar({ percent, headings }: ProgressBarProps) {
  const handleScrollView = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
      <div
        style={{
          position: 'relative',
          width: 4,
          height: 288,
          borderRadius: 8,
          backgroundColor: 'rgb(245 230 255 / 1)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '100%',
            height: `${percent}%`,
            backgroundColor: 'rgb(142 68 236 / 1)',
            borderRadius: 8,
            transition: 'height 0.2s linear'
          }}
        />
      </div>
      <ul
        style={{
          listStyleType: 'none',
          fontSize: 14,
          fontWeight: 600,
          lineHeight: '20px',
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto'
        }}
      >
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingBlock: 6, paddingInline: 12 }}>
            <a
              onClick={() => handleScrollView(heading.id)}
              className='text-index'
              style={{ color: 'hsl(210 40% 98% / .85)', paddingLeft: heading.paddingLeft }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
      {/* <div>{}</div> */}
    </div>
  )
}

export default ProgressBar
