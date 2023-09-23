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
  console.log(RBtn)
  return (
    <div className={`${css.view}${widgetTitleAni ? ` ${css.animation}` : ''}`}>
      <div className={css.right}>
        {LBtn?.map((item, index) => (
          <button onClick={item.click} key={index}>
            {item.icon}
            <span>{item.content}</span>
          </button>
        ))}
        {/* {props.RBtns} */}
      </div>
      {RBtn && (
        <div className={css.right}>
          {RBtn.map((item, index) => (
            <button onClick={item.click} key={index}>
              {item.icon}
              <span>{item.content}</span>
            </button>
          ))}
          {/* {props.RBtns} */}
        </div>
      )}
    </div>
  )
}
