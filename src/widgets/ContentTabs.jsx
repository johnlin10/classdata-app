// React
import React from 'react'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import css from './css/ContentTabs.module.scss'

export default function ContentTabs({
  isDark,
  onTop,
  options,
  onChange,
  selected,
}) {
  return (
    <div
      className={`${css.contentTabs} ${isDark && css.dark}${
        onTop ? ' top' : ''
      }`}>
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
