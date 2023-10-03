import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// firestore
import { db } from '../firebase'
import {
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'
import { WebVersion } from '../AppData/AppData'
import css from './css/WebUpdate.module.css'
// Widget
import PageTitle from '../widgets/PageTitle'

// CSS
import '../App.scss'

export default function WebUpdate(props) {
  const [themeColor, setThemeColor] = useState([
    'var(--main-light)',
    '#000000f1',
    'var(--main-dark)',
    '#fffffff1',
  ])
  // 頁面動畫
  const [pageTitleAni, setPageTitleAni] = useState(true)
  useEffect(() => {
    setPageTitleAni(false)
  }, [])

  // 資料處理 \n 自動換行
  const formatContent = (content) => {
    return content.split('\n').map((line, index) => <p key={index}>{line}</p>)
  }

  // 獲取資料
  const [webVersionData, setWebVersionData] = useState()
  useEffect(() => {
    const webVersionRef = doc(db, 'webVersion', 'webVersion')
    const unsubscribe = onSnapshot(webVersionRef, async (doc) => {
      const data = doc.data()
      // 對版本號進行排序
      data.versions.sort((a, b) =>
        b.version.localeCompare(a.version, undefined, { numeric: true })
      )
      setWebVersionData(data)
      // console.log(data)
    })
    return () => unsubscribe()
  }, [])
  const [currentVersionIndex, setCurrentVersionIndex] = useState()
  useEffect(() => {
    if (webVersionData) {
      setCurrentVersionIndex(
        webVersionData.versions.findIndex(
          (item) => item.version === WebVersion[0].version
        )
      )
    }
  }, [webVersionData])

  const [currentVersion, setCurrentVersion] = useState()
  useEffect(() => {
    if (webVersionData) {
      setCurrentVersion(
        webVersionData.versions.find(
          (item) => item.version === WebVersion[0].version
        )
      )
    }
  }, [webVersionData])

  // 時間格式化
  const setDate = (timestamp) => {
    // 將 Firestore 的時間戳轉換為 JavaScript 的日期物件
    let date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    )

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    }
    let formattedDate = date
      .toLocaleDateString('zh-TW', options)
      .replaceAll('/', '.')
    formattedDate = formattedDate.replace('（', ' ').replace('）', '')
    return formattedDate
  }

  return (
    <>
      <Helmet>
        <title>班級資訊平台｜網站更新・{WebVersion[0].version}</title>
        <meta name="description" content="在此獲得本網站的更新資訊" />
        <meta
          property="og:title"
          content={`班級資訊平台｜網站更新・${WebVersion[0].version}`}
        />
        <meta property="og:description" content="在此獲得本網站的更新資訊" />
      </Helmet>
      <main
        id="webUpdate"
        className={`${css.webUpdate} ${props.theme}${
          props.theme && props.settingPage ? ' ' : ''
        }${props.settingPage ? 'settingOpen' : ''}`}>
        <div className={`view ${css.view}${pageTitleAni ? ' PTAni' : ''}`}>
          <div>
            <div
              className={`${css.newVersion_view}${
                webVersionData &&
                WebVersion[0].version === webVersionData.versions[0].version
                  ? ''
                  : ' newV'
              }`}>
              {webVersionData && (
                <>
                  {WebVersion[0].version ===
                  webVersionData.versions[0].version ? (
                    <p className={css.newVersionCheck}>目前為最新版本</p>
                  ) : (
                    <div className={css.newVersion_block}>
                      <span>
                        <FontAwesomeIcon
                          icon="fa-solid fa-circle-up"
                          style={{ marginRight: '3px' }}
                        />
                        新版本
                      </span>
                      <h1>{webVersionData.versions[0].version}</h1>
                      {formatContent(webVersionData.versions[0].content)}
                      <button
                        className={props.updateAvailable ? '' : `${css.load}`}
                        onClick={
                          props.updateAvailable ? props.handleUpdate : () => {}
                        }>
                        {props.updateAvailable ? (
                          '立即更新'
                        ) : (
                          <>
                            <FontAwesomeIcon
                              icon="fa-solid fa-spinner"
                              spinPulse
                              style={{ marginRight: '6px' }}
                            />
                            獲取更新中...
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div
              className={`${css.currentVersion_view}${
                webVersionData &&
                WebVersion[0].version === webVersionData.versions[0].version
                  ? ''
                  : ' newV'
              }`}>
              <div className={css.currentVersion_block}>
                <span>
                  <FontAwesomeIcon
                    icon="fa-solid fa-check"
                    style={{ marginRight: '3px' }}
                  />
                  當前版本
                </span>
                <h1>{WebVersion[0].version}</h1>
                {currentVersion && <>{formatContent(currentVersion.content)}</>}
              </div>
            </div>
          </div>
          <div>
            <div className={css.lastVersion_view}>
              {webVersionData && (
                <div className={css.lastVersion_block}>
                  <h1>歷史版本</h1>
                  {webVersionData.versions
                    .slice(currentVersionIndex + 1)
                    .map((item) => (
                      <div key={item.version} className={css.versions}>
                        <h3>{item.version}</h3>
                        <span className={css.date}>{setDate(item.date)}</span>
                        {formatContent(item.content)}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
