import { useLayoutEffect, memo } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default memo(ScrollTop)
