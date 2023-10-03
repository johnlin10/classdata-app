import React, { useEffect, useState } from 'react'
import './css/docLink.css'

// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// 自定義函式庫
import useUrlParams from '../js/UpdateUrlParams'

import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'

function DocLink(props) {
  const [markdown, setMarkdown] = useState('')
  const { urlParams, removeUrlParam, addUrlParams } = useUrlParams()

  useEffect(() => {
    if (props.docUrl) {
      fetch(`/docs/${props.docUrl}.md`)
        .then((res) => res.text())
        .then((text) => setMarkdown(text))
      console.log(props.docUrl)
    }
  }, [props.docUrl])

  // 頁面動畫
  const [pageTitleAni, setPageTitleAni] = useState(true)
  useEffect(() => {
    setPageTitleAni(false)
  }, [])

  const closeDoc = () => {
    setPageTitleAni(true)
    setTimeout(() => {
      removeUrlParam('doc')
      props.navigateClick('/service')
    }, 500)
  }

  return (
    <main
      id="markdownDoc"
      className={`${props.theme}${props.settingPage ? ' settingOpen' : ''}${
        pageTitleAni ? ' PTAni' : ''
      }`}>
      <div id="docView" className={`${pageTitleAni ? ' PTAni' : ''}`}>
        <div className="docContent">
          <button className="closeDoc" onClick={closeDoc}>
            <FontAwesomeIcon icon="fa-solid fa-xmark" />
          </button>
          <ReactMarkdown
            remarkPlugins={[gfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}>
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </main>
  )
}

export default DocLink
