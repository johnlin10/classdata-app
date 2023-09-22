import { useState, useEffect } from 'react'

export default function useUrlParams () {
  const [urlParams, setUrlParams] = useState({})
  const [hashParams, setHashParams] = useState()

  useEffect(() => {
    const updateParams = () => {
      const searchParams = new URLSearchParams(window.location.search)
      const params = {}
      for (const [key, value] of searchParams.entries()) {
        params[key] = value
      }
      setUrlParams(params)

      // 解析并存储哈希路由中的参数
      const hash = window.location.hash
      const hashParamsIndex = hash.indexOf('?')
      if (hashParamsIndex !== -1) {
        const hashQuery = hash.substring(hashParamsIndex + 1)
        setHashParams(hashQuery)
      } else {
        setHashParams('')
      }
    }

    updateParams()

    const onPopState = () => {
      updateParams()
    }
    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  // 添加多个参数的方法
  const addUrlParams = (paramsToAdd) => {
    const updatedParams = { ...urlParams, ...paramsToAdd }
    updateUrl(updatedParams)
  }

  // 移除参数的方法
  const removeUrlParam = (key) => {
    const updatedParams = { ...urlParams }
    delete updatedParams[key]
    updateUrl(updatedParams)

    // 检查是否还有其他参数
    if (Object.keys(updatedParams).length === 0) {
      // 如果没有其他参数，移除 '?' 符号
      const newUrl = window.location.pathname
      window.history.pushState({}, '', newUrl)
    }
  }

  const updateUrl = (newParams) => {
    const queryString = Object.entries(newParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const newUrl = `${window.location.pathname}${hashParams}?${queryString}`
    window.history.pushState({}, '', newUrl)

    setUrlParams(newParams)
  }

  return {
    urlParams,
    addUrlParams,
    removeUrlParam,
  }
}
