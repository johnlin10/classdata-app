// React
import React from 'react'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import css from './css/ContentTabs.module.css'

export default function ContentTabs({
  theme,
  onTop,
  options,
  onChange,
  selected,
}) {
  return (
    <div className={`${css.contentTabs} ${theme}${onTop ? ' top' : ''}`}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`${css.contentTabsOptn} ${
            option === selected ? 'selected' : ''
          }`}>
          {option}
        </button>
      ))}
    </div>
  )
}
