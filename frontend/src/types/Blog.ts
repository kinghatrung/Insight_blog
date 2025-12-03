export interface Author {
  _id: string
  username: string
  displayName: string
}

interface FileListItem {
  url?: string
  response?: string
}

export interface Blog {
  _id: string
  title: string
  content: string
  thumbnail: string
  slug: string
  status: string
  author: Author
  createdAt: string
  updatedAt: string
}

export interface BlogFromValues {
  title: string
  content: string
  thumbnail: string | FileListItem[]
  status: string
  
}
