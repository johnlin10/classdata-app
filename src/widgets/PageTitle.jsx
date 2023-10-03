// React
import React, { useEffect, useState } from 'react'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
// css
import css from './css/PageTitle.module.css'
import ContentTabs from './ContentTabs'

export default function PageTitle(props) {
  const [pageTitleAni, setPageTitleAni] = useState(true)
  useEffect(() => {
    setPageTitleAni(false)
  }, [])
  return (
    <>
      <li className={`${css.pageli}${` ${props.isDark && css.dark}`}`}>
        <div className={`${css.block}`}>
          <button onClick={() => window.history.back()}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
        <div className={`${css.block} ${css.title}`}>
          <p>{props.checkPageName(props.location.pathname)}</p>
        </div>
      </li>
      {props.tabs && (
        <ContentTabs
          isDark={props.isDark}
          onTop={props.tabs.onTop}
          options={props.tabs.options}
          onChange={props.tabs.onChange}
          selected={props.tabs.selected}
        />
      )}
    </>
  )
}
