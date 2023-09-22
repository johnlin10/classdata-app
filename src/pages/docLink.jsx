import React, { useEffect, useState } from 'react'
import './css/docLink.css'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'

function DocLink(props) {
  const [markdown, setMarkdown] = useState('')

  useEffect(() => {
    if (props.docUrl) {
      fetch(`${process.env.PUBLIC_URL}/docs/${props.docUrl}.md`)
        .then((res) => res.text())
        .then((text) => setMarkdown(text))
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
      props.navigateClick('/service')
    }, 250)
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
