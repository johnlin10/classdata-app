// React
import React, { useEffect, useState } from 'react'
// import SubscribeCourseSch from './SubscribeCourseSch'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// CSS
import '../App.css'

// 設定頁面組件
function Setting(props) {
  const [secretKey, setSecretKey] = useState('')
  function secretPassage(event) {
    event.preventDefault()
    console.log(secretKey)
    props.navigateClick(`/secretPage/${secretKey}`)
  }
  function handleInputChange(event) {
    setSecretKey(event.target.value)
  }
  function openRepProb() {
    props.setReportProblemActive(true)
  }

  const [setupPage, setSetupPage] = useState()
  const setupPageChange = (page) => {
    setSetupPage(page)
    props.setupPageChange(page)
  }
  useEffect(() => {
    const setupPageValue = localStorage.getItem('setupPage')
    if (setupPageValue) {
      setSetupPage(setupPageValue)
    } else {
      setSetupPage('home')
    }
  }, [])

  return (
    <div
      id="Setting"
      className={`${props.theme}${props.settingPage ? ' open' : ''}`}>
      <div
        id="closeSetting"
        className={`${props.settingPage ? 'open' : ''}`}
        onClick={() => props.setSettingPage(false)}>
        <FontAwesomeIcon icon="fa-solid fa-xmark" />
      </div>
      <div
        id="openRepProb"
        className={`${props.settingPage ? 'open' : ''}`}
        onClick={() => props.setReportProblemActive(true)}>
        建議與問題回報
      </div>
      <div
        id="settingBottomMask"
        className={props.settingPage ? 'open' : ''}></div>
      <div id="settingHeader">
        <h1>設定</h1>
      </div>
      <div id="secretPassage">
        <form id="secretPassageForm" onSubmit={secretPassage}>
          <input
            type="text"
            pattern="[A-Za-z0-9]+"
            placeholder="秘密入口"
            value={secretKey}
            onChange={handleInputChange}
          />
          <br />
          <button className="" type="submit" title="進入">
            <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
          </button>
        </form>
      </div>
      <div className={`settingView ${props.settingPage ? 'open' : ''}`}>
        {/* <p>通知</p>
        <div className="setBlock">
          <div className="setName">
            <h3>課程表通知</h3>
          </div>
          <div className="set">
            <SubscribeCourseSch />
          </div>
        </div> */}
        <p>系統</p>
        <div className="setBlock">
          <div className="setName">
            <h3>主題模式</h3>
          </div>
          <div className="set">
            <div
              id="prefersMode"
              className={`${props.menuActive} ${
                props.settingPage ? '' : 'close'
              }`}
              onClick={props.handleThemeChange}>
              <div className="slider">
                <span>{props.modeValue}</span>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="setBlock">
          <div className="setName">
            <h3>預設開啟頁面</h3>
          </div>
          <div className="set">
            <div
              id="prefersMode"
              className={`${props.menuActive} ${
                props.settingPage ? '' : 'close'
              }`}>
              <div className="slider">
                <select
                  name="setupPageSelect"
                  id="setupPageSelect"
                  value={setupPage}
                  onChange={(e) => setupPageChange(e.target.value)}>
                  <optgroup label="預設">
                    <option value="home">首頁</option>
                  </optgroup>
                  <optgroup label="主要">
                    <option value="post">公告</option>
                    <option value="service">服務</option>
                    <option value="me">我的</option>
                    <option value="development">開發</option>
                  </optgroup>
                  <optgroup label="服務">
                    <option value="service/courseSchedule">課程表</option>
                    <option value="service/examSchedule">考程表</option>
                  </optgroup>
                  <optgroup label="Beta">
                    <option value="chatGroup">討論</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
        </div> */}
        <p>開發選項</p>
        <div
          className="setBlock"
          onClick={() => [
            props.navigateClick('/development'),
            props.setSettingPage(false),
          ]}>
          <div className="setName">
            <h3>開發日誌</h3>
          </div>
          <div className="target">
            <FontAwesomeIcon icon="fa-solid fa-caret-right" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Setting
