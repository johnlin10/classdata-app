import { useEffect, useState } from 'react'
import css from './css/PageCtrlModule.module.css'

export default function PageCtrlModule(props) {
  const RBtn = props.RBtn
  const LBtn = props.LBtn
  // 組件動畫
  const [widgetTitleAni, setWidgetTitleAni] = useState(true)
  useEffect(() => {
    setWidgetTitleAni(false)
  }, [])
  return (
    <div className={`${css.view}${widgetTitleAni ? ` ${css.animation}` : ''}`}>
      {LBtn && (
        <div className={css.left}>
          {LBtn?.map((item, index) => {
            return (
              <>
                {item.prmsn && item.type === 'button' && (
                  <button
                    className={item.actv ? css.actv : ''}
                    onClick={item.click}
                    key={index}>
                    {item.icon[1]
                      ? item.actv
                        ? item.icon[0]
                        : item.icon[1]
                      : ''}
                    <span>{item.content}</span>
                  </button>
                )}{' '}
                {item.prmsn && item.type === 'link' && (
                  <div className={css.link} onClick={item.click} key={index}>
                    {item.icon[1]
                      ? item.actv
                        ? item.icon[0]
                        : item.icon[1]
                      : ''}
                    <span>{item.content}</span>
                  </div>
                )}
              </>
            )
          })}
        </div>
      )}
      <div></div>
      {RBtn && (
        <div className={css.right}>
          {RBtn?.map((item, index) => {
            return (
              item.prmsn &&
              item.type === 'button' && (
                <button
                  className={item.actv ? css.actv : ''}
                  onClick={item.click}
                  key={index}>
                  {item.icon[1]
                    ? item.actv
                      ? item.icon[0]
                      : item.icon[1]
                    : ''}
                  <span>{item.content}</span>
                </button>
              )
            )
          })}
        </div>
      )}
    </div>
  )
}
