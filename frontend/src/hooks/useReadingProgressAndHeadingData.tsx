/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useLayoutEffect } from 'react'
import { stringSlug } from '~/utils/stringSlug'

interface ElementProps {
  element: string
  enabled: boolean
}

interface Heading {
  id: string
  text: string
  level: number
  paddingLeft: number
}

export function useReadingProgressAndHeadingData({ element, enabled = true }: ElementProps) {
  const [progress, setProgress] = useState<number>(0)
  const [headings, setHeadings] = useState<Heading[]>([])

  useLayoutEffect(() => {
    if (!enabled) return
    const elementContent = document.getElementById(element)
    if (!elementContent) return

    const handleHeadings = () => {
      const headings = Array.from(elementContent.querySelectorAll<HTMLHeadingElement>('h1, h2, h3'))
      const minLevel = Math.min(...headings.map((h) => parseInt(h.tagName.replace('H', ''), 10)))
      const headingsContent = Array.from(elementContent.querySelectorAll<HTMLHeadingElement>('h1, h2, h3')).map(
        (el) => {
          const level = parseInt(el.tagName.replace('H', ''), 10)
          const id = stringSlug(el.innerText)
          if (!el.id) el.setAttribute('id', id)
          return {
            id,
            text: el.innerText,
            level,
            paddingLeft: (level - minLevel) * 18
          }
        }
      )
      setHeadings(headingsContent)
    }

    handleHeadings()
    const observer = new MutationObserver(handleHeadings)
    observer.observe(elementContent, { childList: true, subtree: true })
    const handleScroll = () => {
      const elementTop = elementContent.getBoundingClientRect().top + window.scrollY
      const elementHeight = elementContent.offsetHeight
      const windowScroll = window.scrollY
      const windowHeight = window.innerHeight

      const totalScroll = elementHeight - windowHeight
      const scrollPassed = windowScroll - elementTop
      const percent = totalScroll > 0 ? Math.min(Math.max((scrollPassed / totalScroll) * 100, 0), 100) : 0

      setProgress(percent)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [element, enabled])

  return { progress, headings }
}
