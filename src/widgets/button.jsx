// react
import { useEffect, useState } from 'react'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import css from './css/button.module.css'

export default function EditBtn(props) {
  return (
    <div
      className={`${props.theme}${props.theme ? ' ' : ''}${css.btn}${
        props.openActv ? ' actv' : ''
      }`}
      onClick={props.btnClick}
      style={{ background: props.btnColor, color: props.btnContentColor }}>
      {props.btnIcon}
      <p>{props.btnContent}</p>
    </div>
  )
}
