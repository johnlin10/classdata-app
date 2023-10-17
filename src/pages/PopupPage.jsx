import { useEffect, useState } from "react"
import style from "./css/PopupPage.module.scss"
// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

/**
 * 彈出窗口組件，用於顯示一個彈出窗口，此組件通常用於彈出小型互動頁面，而非提示框。
 * @param {object} props - 組件的屬性對象
 * @param {string} props.title
 * @param {function} props.closeClick
 * @param {ReactNode} props.element
 *
 * @param {string} title - 彈出窗口的標題.
 * @param {function} closeClick - 當關閉按鈕被點即時觸發的回調函數，用於關閉彈出窗口
 * @param {ReactNode} element - 要在彈出窗口中顯示的 React 元素或組件
 * @returns {ReactNode} - 彈出窗口組件的選染結果
 * @example
 * <PopupPage
 *   title="示例標題"
 *   closeClick={() => handleClose()}
 *   element={<SomeComponent />}
 * />
 */
export default function PopupPage({ title, closeClick, element }) {
  const [pageAni, setPageAni] = useState(true)
  useEffect(() => {
    setPageAni(false)
  }, [])
  const pageClose = () => {
    setPageAni(true)
    setTimeout(() => {
      closeClick()
    }, 500)
  }
  return (
    <>
      <div
        className={`${style.container}${pageAni ? ` ${style.animation}` : ""}`}>
        <div className={style.page_title}>
          <button onClick={() => pageClose()}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <p>{title}</p>
        </div>
        <div className={style.view}>{element}</div>
      </div>
      <div
        className={`${style.blur}${
          pageAni ? ` ${style.animation}` : ""
        }`}></div>
    </>
  )
}
