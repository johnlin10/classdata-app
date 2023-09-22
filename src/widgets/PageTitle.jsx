// React
import React, { useEffect, useState } from 'react'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// css
import css from './css/PageTitle.module.css'

export default function PageTitle(props) {
  const [pageTitleAni, setPageTitleAni] = useState(true)
  useEffect(() => {
    setPageTitleAni(false)
  }, [])
  return (
    <div
      className={`${css.view} ${props.theme} ${pageTitleAni ? 'PTAni' : ''}`}
      style={{
        background:
          props.theme === 'dark' ? props.themeColor[2] : props.themeColor[0],
      }}>
      <div className={css.view_content}>
        <div className={css.content_title}>
          <button className={css.title_backBtn} onClick={props.backTo}>
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
          </button>
          <p
            className={css.title_pageTitle}
            style={{
              color:
                props.theme === 'dark'
                  ? props.themeColor[3]
                  : props.themeColor[1],
            }}>
            {props.title}
          </p>
        </div>
      </div>
      {props.tabs && props.tabs}
    </div>
  )
}
