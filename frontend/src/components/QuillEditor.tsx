import React, { memo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export interface QuillEditorProps {
  value?: string
  onChange?: (value: string) => void
}

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['link', 'image'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean']
  ]
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  return (
    <div className='ant-input' style={{ marginBottom: '44px' }}>
      <ReactQuill value={value} onChange={onChange} theme='snow' modules={modules} style={{ height: 600 }} />
    </div>
  )
}

export default memo(QuillEditor)
