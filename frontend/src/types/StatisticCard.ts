export type ContentType = 'statistics' | 'area' | 'column' | 'progress'

interface ChartDataPoint {
  date: string
  value: number
  index: number
}

interface ExtendedTinyAreaConfig extends Omit<TinyAreaConfig, 'tooltip'> {
  tooltip?: {
    title?: string | ((d: ChartDataPoint) => string)
    items?: Array<{
      name: string
      field: string
    }>
  }
}

export interface TinyAreaConfig {
  data?: number[] | Record<string, unknown>[]
  height?: number
  autoFit?: boolean
  smooth?: boolean
  padding?: number
  shapeField?: string
  xField?: string
  yField?: string
  tooltip?: {
    title?: string
    items?: Array<{ name?: string; field?: string; [key: string]: unknown }>
    [key: string]: unknown
  }
  style?: Record<string, unknown>
  [key: string]: unknown
}

export interface TinyColumnConfig {
  data?: number[] | Record<string, unknown>[]
  height?: number
  autoFit?: boolean
  padding?: number
  shapeField?: string
  xField?: string
  yField?: string
  tooltip?: {
    title?: string
    items?: Array<{ name?: string; field?: string; [key: string]: unknown }>
    [key: string]: unknown
  }
  style?: Record<string, unknown>
  [key: string]: unknown
}

export interface ReusableStatisticCardProps {
  title: string
  tooltipText: string
  subTitle: string
  value: number
  footerLabel?: string
  footerValue?: string
  contentType?: ContentType
  areaConfig?: ExtendedTinyAreaConfig
  columnConfig?: TinyColumnConfig
  progressPercent?: number
  increaseValue?: number
  decreaseValue?: number
}

// interface DashboardStatsProps {
//   config?: TinyAreaConfig
//   columnConfig?: TinyColumnConfig
// }
