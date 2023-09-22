import React, { useEffect, useState, useRef } from 'react'
import './css/reportProblem.css'
import emailjs from 'emailjs-com'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function ReportProblem(props) {
  const [btnTxt, setBtnTxt] = useState('傳送')
  const formRef = useRef(null)
  emailjs.init('o7c3uHOnTzU9CMyHy')

  useEffect(() => {
    formRef.current.addEventListener('submit', function (event) {
      event.preventDefault()

      setBtnTxt('傳送中...')

      const serviceID = 'default_service'
      const templateID = 'template_j81x4hm'

      emailjs.sendForm(serviceID, templateID, this).then(
        () => {
          setBtnTxt('已傳送')
          formRef.current.reset()
          alert('我們已收到你的訊息！')
        },
        (err) => {
          setBtnTxt('重新傳送')
          alert(JSON.stringify(err))
        }
      )
    })
  }, [])

  function problemAgan() {
    setBtnTxt('傳送')
  }
  function closeReport() {}

  return (
    <div id="repProbPage" className={`${props.theme}`}>
      <div
        id="closeRepProb"
        className={`${props.reportProblemActive ? 'open' : ''}`}
        onClick={() => props.setReportProblemActive(false)}>
        <FontAwesomeIcon icon="fa-solid fa-xmark" />
      </div>
      <div
        id="reportProblemPage"
        className={props.reportProblemActive ? 'open' : ''}>
        <form ref={formRef} className="repProbForm">
          <div id="repProbModeView">
            <label htmlFor="repProbMode"></label>
            <select name="repProbMode" id="repProbMode" onChange={problemAgan}>
              <optgroup label="類型">
                <option>問題回報</option>
                <option>建議</option>
              </optgroup>
            </select>
          </div>
          <div className="problemtext">
            <span>類型</span>
          </div>
          <div>
            <label htmlFor="repProbType"></label>
            <select
              name="repProbType"
              id="repProbSelect"
              onChange={problemAgan}>
              <optgroup label="">
                <option></option>
              </optgroup>
              <optgroup label="問題">
                <option>資訊錯誤</option>
                <option>介面顯示</option>
                <option>動畫顯示</option>
                <option>版面佈局</option>
                <option>畫面卡頓</option>
                <option>頁面黑屏</option>
                <option>其他</option>
              </optgroup>
              <optgroup label="建議">
                <option>增加功能</option>
                <option>介面設計</option>
                <option>動畫設計</option>
                <option>其他</option>
              </optgroup>
            </select>
          </div>
          <div className="problemtext">
            <span>具體版塊</span>
          </div>
          <div>
            <label htmlFor="repProbArea"></label>
            <select
              name="repProbArea"
              id="repProbSelect"
              onChange={problemAgan}>
              <optgroup label="">
                <option></option>
                <option>不適用</option>
              </optgroup>
              <optgroup label="主要版塊">
                <option>首頁</option>
                <option>校務公告</option>
                <option>服務</option>
                <option>個人</option>
              </optgroup>
              <optgroup label="服務">
                <option>課程表</option>
                <option>考程表</option>
                <option>文章閱讀頁面</option>
                <option>其他</option>
              </optgroup>
            </select>
          </div>
          <div className="problemtext">
            <span>描述</span>
          </div>
          <div id="messgeView">
            <label htmlFor="message"></label>
            <textarea
              name="message"
              id="message"
              placeholder="請描述你問題或建議..."
              onFocus={problemAgan}></textarea>
          </div>
          <div className="repProbBtnView">
            <button
              className={`repProbBtn${
                btnTxt === '傳送中...' ? ' loading' : ''
              }${btnTxt === '已傳送' ? ' submited' : ''}`}
              type="submit">
              <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
              <span>{btnTxt}</span>
            </button>
          </div>
        </form>
      </div>
      <div
        id="repProbBackMask"
        className={props.reportProblemActive ? 'open' : ''}
        onClick={() => props.setReportProblemActive(false)}></div>
    </div>
  )
}

export default ReportProblem
