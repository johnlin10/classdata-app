// react
import { useRef, useEffect, useState } from 'react'

import Button from './button'

// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import css from './css/editer.module.css'

export default function Editer(props) {
  const scrollTop = useRef(null)

  const [topTitleActv, setTopTitleActv] = useState(false)
  useEffect(() => {
    const currentScrollTop = scrollTop.current
    const handleScroll = () => {
      if (currentScrollTop.scrollTop > 0) {
        setTopTitleActv(true)
      } else {
        setTopTitleActv(false)
      }
    }
    if (currentScrollTop) {
      currentScrollTop.addEventListener('scroll', handleScroll)
      return () => {
        currentScrollTop.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <div
      ref={scrollTop}
      className={`${props.theme}${props.theme ? ' ' : ''}${css.editerView}${
        props.editView ? ' open' : ''
      }`}>
      <div className={`${css.topTitleView}${topTitleActv ? ' actv' : ''}`}>
        <div>
          <h5>{props.title} 編輯器</h5>
        </div>
        <div>{props.resetBtn}</div>
      </div>
      <div className={`${css.editerContentView}`}>
        {/* <h1>
          {props.title} <span>編輯器</span>
        </h1> */}
        {props.content}
      </div>
      <Button
        theme={props.theme}
        btnClick={props.submitFunc}
        btnContent={props.btnContent}
        btnColor={props.btnColor}
        btnContentColor={props.btnContentColor}
      />
    </div>
  )
}
