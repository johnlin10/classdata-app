// React
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate, Navigate, Route, Routes, Outlet } from 'react-router-dom'
// CSS
import './App.css'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// Service Worker
import { serviceWorkerRegistration } from './serviceWorkerRegistration'
import { getRegistration } from './serviceWorkerRegistration'
// Pages
import Home from './pages/Home'
import Post from './pages/Post'
import Service from './pages/Service'
import Development from './pages/Development'
import ExSch from './pages/examSchedule'
import CourseSchedule from './pages/CourseSchedule'
import EnglishAbbreviations from './pages/englishAbbreviations'
import OOXXGame from './pages/ooxx'
import ReportProblem from './pages/reportProblem'
import Updater from './pages/Updeter'
import Music from './pages/music'
import ChatGroup from './pages/ChatGroup'
import YouTubePlayer from './pages/YouTubePlayer'
import DocLink from './pages/docLink'
import WebUpdate from './pages/WebUpdate'
// Tools
import Articles from './tools/Articles'
import Setting from './tools/Setting'
import Installation from './tools/Installation'
import Chat from './tools/Chat'
import Me from './pages/Me'
import PhotoPreview from './tools/photoPreview'
// Database
import { NewUpdatePost } from './AppData/UpdateData.js'
import { MenuServiceData, MenuFastLinkData } from './AppData/AppData.js'
import { WebVersion } from './AppData/AppData'
// firebase
import firebase from 'firebase/app'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import {
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { timeout } from 'workbox-core/_private'

const deployArea = [''] // /classdata-app

const firebaseConfig = {
  apiKey: 'AIzaSyAevwFPxRd5Fi-UbeTHko_Uradt-hAeBSg',
  authDomain: 'classdata-app.firebaseapp.com',
  projectId: 'classdata-app',
  storageBucket: 'classdata-app.appspot.com',
  messagingSenderId: '219989250207',
  appId: '1:219989250207:web:5cef212dc7e1496c6952aa',
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

// 頁面架構組件
function App() {
  // 獲取用戶身份
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return unsubscribe
  }, [])

  // Service Worker 自動檢查更新
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [cancelUpdateBtn, setCancelUpdateBtn] = useState(false)
  useEffect(() => {
    const intervalId = setInterval(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register(`${deployArea}/service-worker.js`)
          .then((registration) => {
            registration.update()
            console.log(
              'ServiceWorker 註冊成功！ 管轄範圍：',
              registration.scope
            )
            // 檢查是否有新版本可用
            if (registration.waiting) {
              setUpdateAvailable(true)
            }
            registration.addEventListener('updatefound', () => {
              const installingWorker = registration.installing
              if (installingWorker) {
                installingWorker.addEventListener('statechange', () => {
                  if (
                    installingWorker.state === 'installed' &&
                    navigator.serviceWorker.controller
                  ) {
                    // 提示用戶更新
                    setUpdateAvailable(true)
                  }
                })
              }
            })
            // 當新版本可用時觸發
            serviceWorkerRegistration.register({
              onUpdate: () => {
                // 提示用戶更新
                setUpdateAvailable(true)
              },
            })
          })
          .catch((error) => {
            console.log('ServiceWorker 註冊失敗：', error)
          })
      }
    }, 2500)

    return () => clearInterval(intervalId)
  }, [])
  // 檢查到新版本後，用戶需手動更新新版本
  const handleUpdate = async () => {
    const registration = await getRegistration()
    if (registration && registration.waiting) {
      // 強制激活新版本
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      setUpdateAvailable(false)
      window.location.reload(true)
    }
  }

  // 公告通知提醒
  const [getPostData, setGetPostData] = useState(null)
  const [postCount, setPostCount] = useState()
  const [postNoti, setPostNoti] = useState(
    localStorage.getItem('postNoti')
      ? Number(localStorage.getItem('postNoti'))
      : 0
  )

  useEffect(() => {
    const postNotiCount = localStorage.getItem('postNoti')
    if (postNotiCount) {
      setPostNoti(Number(postNotiCount))
    }
  }, [])
  // useEffect(() => {
  //   if (postNoti) {
  //     localStorage.setItem('postNoti', postNoti)
  //   }
  // }, [postNoti])
  useEffect(() => {
    // 獲取資料
    const postDatabaseRef = doc(db, 'post', 'postData')
    const unsubscribe = onSnapshot(postDatabaseRef, (doc) => {
      const data = doc.data()
      const dataCount = Object.keys(data.data).length
      setGetPostData(data)
      setPostCount(dataCount)
      if (postNoti > dataCount) {
        console.log(postNoti)
        setPostNoti(dataCount)
        localStorage.setItem('postNoti', dataCount)
      }
      console.log(dataCount)
      console.log(postNoti)
    })

    return () => unsubscribe()
  }, [])

  // 設備狀態
  const [OperationalStatus, setOperationalStatus] = useState('No Status')

  // 頁面狀態
  const [pageState, setPageState] = useState({
    user: false, // 用戶介面
    webUpdate: false,
    chatGroup: false,

    homeSelect: false, // 首頁 (預設)
    postSelect: false, // 公告
    folderSelect: false, // 服務
    developmentSelect: false, // 開發
    courseScheduleSelect: false, // 課程表
    ExSchSelect: false, // 考程表
    music: false, // 音樂
    youTubePlayer: false,

    docLink: false,
    updater: false, // 更新頁面
    articles: false, // 文章頁面

    englishAbbreviations: false,
    ooxx: false,
  })
  // 特殊狀態
  const [settingPage, setSettingPage] = useState(false)
  const [menuActive, setMenuActive] = useState(false)
  const [reportProblemActive, setReportProblemActive] = useState(false)

  // 新頁面跳轉邏輯
  const navigate = useNavigate()
  const navigateClick = (page) => {
    navigate(page)
    setMenuActive(false)
    setSettingPage(false)
    // const newUrl = window.location.pathname + window.location.hash
    // window.history.pushState({}, '', newUrl)
  }

  const setPageStateTrue = (key) => {
    setPageState((prevState) =>
      Object.keys(prevState).reduce((acc, cur) => {
        acc[cur] = cur === key
        return acc
      }, {})
    )
  }
  // 頁面追蹤
  const location = useLocation()
  useEffect(() => {
    let page = location.pathname
    console.log(page)

    switch (page) {
      case '/':
        setPageStateTrue('homeSelect')
        break

      case '/post':
        setPageStateTrue('postSelect')
        break

      case '/service':
        setPageStateTrue('folderSelect')
        break

      case '/development':
        setPageStateTrue('developmentSelect')
        break

      case '/service/courseSchedule':
        setPageStateTrue('courseScheduleSelect')
        break

      case '/service/examSchedule':
        setPageStateTrue('ExSchSelect')
        break

      case '/chat-group':
        setPageStateTrue('chatGroup')
        break

      case '/user':
        setPageStateTrue('user')
        break

      case '/service/docLink':
        setPageStateTrue('folderSelect')
        break

      case '/service/youtube-player':
        setPageStateTrue('youTubePlayer')
        break

      case '/webUpdate':
        setPageStateTrue('webUpdate')
        break

      default:
        setPageStateTrue('')
        break
    }
  }, [location])

  // 文章內容導向
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const post = urlParams.get('post')
    if (post) {
      setReadArticle(post)
      setPostActive(true)
    } else {
      setReadArticle('')
      setPostActive(false)
    }

    // // 監聽 popstate 事件
    // window.addEventListener('popstate', handlePopState)

    // // 在useEffect的回傳函數中移除事件監聽器
    // return () => {
    //   window.removeEventListener('popstate', handlePopState)
    // }
  }, [])

  // 菜單欄切換狀態
  const menuBtnClick = () => {
    setMenuActive((prevActive) => !prevActive)
  }

  // 提示彈窗狀態
  const [TipsActive, setTipsActive] = useState(false)
  const Tips = () => {
    setTipsActive((prevActive) => !prevActive)
  }

  // 刷新
  function reload() {
    window.location.reload(true)
  }

  // 外觀模式切換

  const [theme, setTheme] = useState()
  const [themeMode, setThemeMode] = useState(() => {
    const savedThemeMode = localStorage.getItem('themeMode')
    return savedThemeMode !== null ? parseInt(savedThemeMode) : 1 // 預設為「根據系統」
  })
  const [modeValue, setModeValue] = useState()
  const [themeInfo, setThemeInfo] = useState('Error')
  // 監測系統外觀模式變化
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
  // 變更狀態，並且在檢測到系統狀態變化後執行
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
    if (themeMode === 1) {
      if (prefersDarkMode.matches) {
        setTheme('dark')
        setThemeInfo('Dark')
        setModeValue('根據系統')
      } else if (!prefersDarkMode.matches) {
        setTheme('')
        setThemeInfo('Light')
        setModeValue('根據系統')
      }
    } else if (themeMode === 2) {
      setTheme('dark')
      setThemeInfo('Dark')
      setModeValue('深色模式')
    } else if (themeMode === 0) {
      setTheme('')
      setModeValue('淺色模式')
    }
    prefersDarkMode.addEventListener('change', systemThemeChange)
    return () => {
      prefersDarkMode.removeEventListener('change', systemThemeChange)
    }
  }, [themeMode, prefersDarkMode])
  // 監測並使用 localStorage 儲存狀態
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode.toString())
  }, [themeMode])
  //「根據系統」選項，檢測系統主題並切換狀態
  const systemThemeChange = () => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
    if (themeMode === 1) {
      if (prefersDarkMode.matches) {
        setTheme('dark')
        setModeValue('根據系統')
      } else if (!prefersDarkMode.matches) {
        setTheme('')
        setModeValue('根據系統')
      }
    }
  }
  // 狀態切換輪迴
  const handleThemeChange = (event) => {
    if (pageState.youTubePlayer) {
      return
    }
    if (themeMode === 1) {
      setTheme('dark')
      setThemeMode(2)
      setSpecialTheme(2)
      setModeValue('深色模式')
      setThemeInfo('Dark Mode')
    } else if (themeMode === 2) {
      setTheme('')
      setThemeMode(0)
      setSpecialTheme(0)
      setModeValue('淺色模式')
      setThemeInfo('Light Mode')
    } else if (themeMode === 0) {
      setThemeMode(1)
      setSpecialTheme(1)
      setModeValue('根據系統')
    }
  }

  const [specialTheme, setSpecialTheme] = useState(themeMode)
  useEffect(() => {
    if (pageState.youTubePlayer) {
      setThemeMode(2)
    } else {
      setThemeMode(specialTheme)
    }
  }, [pageState, themeMode])

  // 偵測是否在頁面頂部
  const [isTop, setIsTop] = useState(true)
  let lastIsTop = true
  useEffect(() => {
    setTimeout(() => {
      const container = document.querySelector('main')
      const handleScroll = () => {
        const scrollTop = container.scrollTop
        const newIsTop = scrollTop === 0
        if (newIsTop !== lastIsTop) {
          setIsTop(newIsTop)
          lastIsTop = newIsTop
        }
      }
      container.addEventListener('scroll', handleScroll)
      return () => {
        container.removeEventListener('scroll', handleScroll)
      }
    }, 100)
  }, [pageState])
  useEffect(() => {
    setTimeout(() => {
      const container = document.querySelector('.view')
      if (container) {
        const handleScroll = () => {
          const scrollTop = container.scrollTop
          const newIsTop = scrollTop === 0
          if (newIsTop !== lastIsTop) {
            setIsTop(newIsTop)
            lastIsTop = newIsTop
          }
        }
        container.addEventListener('scroll', handleScroll)
        return () => {
          container.removeEventListener('scroll', handleScroll)
        }
      }
    }, 100)
  }, [pageState])

  // 文章閱讀模式傳喚
  const [postActive, setPostActive] = useState(false)
  const [readArticle, setReadArticle] = useState('')
  function openPost(postLink) {
    setReadArticle(`${postLink}`)
    setPostActive(true)
    // 更新URL參數
    const params = new URLSearchParams(window.location.search)
    params.set('post', postLink)
    const newUrl = window.location.pathname + '?' + params.toString()
    window.history.pushState({ post: postLink }, '', newUrl)
  }

  // 用戶自訂義啟動頁面
  const [setupPage, setSetupPage] = useState('home')
  const setupPageChange = (page) => {
    localStorage.setItem('setupPage', page)
  }
  // useEffect(() => {
  //   const setupPageValue = localStorage.getItem('setupPage')
  //   setSetupPage(setupPageValue)
  //   if (setupPageValue) {
  //     setTimeout(() => {
  //       pagelink(setupPageValue)
  //       console.log('setupPage')
  //     }, 100)
  //   } else localStorage.setItem('setupPage', setupPage)
  // }, [])

  // 文檔檢視傳喚
  const [docUrl, setDocUrl] = useState('')
  const [docActive, setDocActive] = useState(false)
  const [readDoc, setReadDoc] = useState('')
  function openDocUrl(docLink) {
    navigateClick('/service/docLink')
    console.log(docLink)
    setDocUrl(docLink)
    setReadDoc(`${docLink}`)
    setDocActive(true)
    // 更新URL參數
    const params = new URLSearchParams(window.location.search)
    params.set('docUrl', docLink)
    const newUrl =
      window.location.pathname + window.location.hash + '?' + params.toString()
    window.history.pushState({ doc: docLink }, '', newUrl)
  }
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const docUrlValue = searchParams.get('docUrl')
    setDocUrl(docUrlValue)
  }, [location])

  // 影片url傳喚
  const [youtubeUrl, setYoutubeUrl] = useState('')
  // const [youtubeActive, setYoutubeActive] = useState(false)
  // const [readDoc, setReadDoc] = useState('')
  function openYoutubeUrl(url) {
    navigateClick('/service/youtube-player')
    // 更新URL參數
    const params = new URLSearchParams(window.location.search)
    params.set('youtubeUrl', url)
    const newUrl =
      window.location.pathname + window.location.hash + '?' + params.toString()
    window.history.pushState({ doc: url }, '', newUrl)
  }
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const youtubeUrlValue = params.get('youtubeUrl')
    setYoutubeUrl(youtubeUrlValue)
    console.log(youtubeUrlValue)
  }, [youtubeUrl, location])

  // 全局提示彈窗
  const [globalError, setGlobalError] = useState('')
  const [globalErrorIcon, setGlobalErrorIcon] = useState()
  useEffect(() => {
    if (globalError) {
      setTimeout(() => {
        setGlobalError('')
        setGlobalErrorIcon()
      }, 4000)
    }
  }, [globalError])

  // 圖片預覽器
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState('')

  return (
    <>
      <nav
        className={`${theme}${theme && settingPage ? ' ' : ''}${
          settingPage ? 'settingOpen' : ''
        }${theme && isTop ? ' ' : ''}${settingPage && isTop ? ' ' : ''}${
          isTop && !menuActive ? 'scrollTop' : ''
        }`}
        style={{
          background:
            pageState.ExSchSelect ||
            (pageState.homeSelect && isTop && !menuActive)
              ? '#ffffff00'
              : '',
          top:
            (pageState.chatGroup ||
              pageState.ExSchSelect ||
              pageState.youTubePlayer ||
              pageState.webUpdate ||
              pageState.courseScheduleSelect) &&
            !menuActive
              ? '-72px'
              : '',
        }}>
        <div
          id="header"
          className={`${menuActive ? 'open' : ''}`}
          style={{
            boxShadow: menuActive ? '0 1px 1px 0px #f1f1f100' : '',
          }}>
          <ul id="header-ul">
            <li id="header-li" className="version">
              <span
                title={`當前版本：${WebVersion[0].version}`}
                onClick={() => [navigateClick('/webUpdate')]}>
                {WebVersion[0].version}
              </span>
            </li>
            <li id="header-li">
              <FontAwesomeIcon
                icon="fa-solid fa-school"
                className="icon"
                onClick={reload}
                alt="班級資訊平台icon"
                title="[重新整理] 班級資訊平台icon"
              />
            </li>
            <li id="header-li" className="more">
              <div
                className="li-block"
                onClick={() => [navigateClick('/post')]}>
                <FontAwesomeIcon icon="fa-solid fa-bell" />
                {postCount && postCount - postNoti > 0 ? (
                  <span className={`postNoti`}>{postCount - postNoti}</span>
                ) : (
                  ''
                )}
              </div>
              <div className="li-block" onClick={() => setSettingPage(true)}>
                <FontAwesomeIcon icon="fa-solid fa-gear" />
              </div>
            </li>
          </ul>
        </div>

        <menu
          id="menu"
          className={`${theme}${theme && settingPage ? ' ' : ''}${
            settingPage ? 'settingOpen' : ''
          } ${menuActive ? 'open' : ''}`}>
          <div id="menu-view" className={`${menuActive ? 'show' : ''}`}>
            <div id="menu-block" className="menu-block">
              <span className={`${menuActive ? '' : 'opacity-0'}`}>捷徑</span>
              <ul id="menu-linkView">
                {MenuFastLinkData.map((MenuFastLinkData, index) => (
                  <li
                    className={`menu-link ${MenuFastLinkData.class} ${
                      menuActive ? '' : 'close'
                    }`}
                    style={{ backgroundImage: MenuFastLinkData.style }}
                    onClick={() => {
                      window.open(`${MenuFastLinkData.link}`)
                    }}
                    key={index}>
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icons/${MenuFastLinkData.icon}`}
                      alt={MenuFastLinkData.name}></img>
                    <h1>{MenuFastLinkData.name}</h1>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </menu>
      </nav>
      <footer
        className={`${theme}${theme && settingPage ? ' ' : ''}${
          settingPage ? 'settingOpen' : ''
        }`}
        style={{
          boxShadow:
            menuActive || pageState.chatGroup || pageState.homeSelect
              ? '0 -1px 1px 0px #f1f1f100'
              : '',
          bottom: pageState.chatGroup ? '-80px' : '',
          background:
            (pageState.homeSelect || pageState.chatGroup) && !menuActive
              ? '#ffffff00'
              : '',
        }}>
        <div
          id="footer"
          className={`${
            (pageState.homeSelect || pageState.chatGroup) &&
            !menuActive &&
            'homePage'
          }`}>
          <ul id="footer-ul">
            <li
              id="footer-li"
              className=""
              onClick={() => [navigateClick('/')]}>
              <div
                className={`li-view home ${
                  pageState.homeSelect ? 'active' : ''
                }`}>
                {pageState.homeSelect ? (
                  <FontAwesomeIcon icon="fa-solid fa-house" className="icon" />
                ) : (
                  <FontAwesomeIcon icon="fa-solid fa-house" className="icon" />
                )}
                <span>首頁</span>
              </div>
            </li>
            {/* <li id="footer-li" className="" onClick={() => [pagelink('post')]}>
              <div
                className={`li-view post ${
                  pageState.postSelect ? 'active' : ''
                }`}>
                {pageState.postSelect ? (
                  <FontAwesomeIcon icon="fa-solid fa-bell" className="icon" />
                ) : (
                  <FontAwesomeIcon icon="fa-solid fa-bell" className="icon" />
                )}
                <span>公告</span>
              </div>
            </li> */}
            <li
              id="footer-li"
              className=""
              onClick={() => [navigateClick('/service')]}
              style={{ background: pageState.homeSelect ? '#ffffff00' : '' }}>
              <div
                className={`li-view folder ${
                  pageState.folderSelect ||
                  pageState.courseScheduleSelect ||
                  pageState.ExSchSelect ||
                  pageState.youTubePlayer
                    ? 'active'
                    : ''
                }`}>
                {pageState.folderSelect ? (
                  <FontAwesomeIcon icon="fa-solid fa-shapes" className="icon" />
                ) : (
                  <FontAwesomeIcon icon="fa-solid fa-shapes" className="icon" />
                )}
                <span>服務</span>
              </div>
            </li>
            <li
              id="footer-li"
              className=""
              onClick={() => [navigateClick('/chat-group')]}
              style={{ background: pageState.homeSelect ? '#ffffff00' : '' }}>
              <div
                className={`li-view development ${
                  pageState.chatGroup ? 'active' : ''
                }`}>
                {pageState.user ? (
                  <FontAwesomeIcon icon="fa-solid fa-comments" />
                ) : (
                  <FontAwesomeIcon icon="fa-solid fa-comments" />
                )}
                <span>我的</span>
              </div>
            </li>
            <li
              id="footer-li"
              className=""
              onClick={() => [navigateClick('/user')]}
              style={{ background: pageState.homeSelect ? '#ffffff00' : '' }}>
              <div
                className={`li-view development ${
                  pageState.user ? 'active' : ''
                }`}>
                {pageState.user ? (
                  <FontAwesomeIcon icon="fa-solid fa-user" />
                ) : (
                  <FontAwesomeIcon icon="fa-solid fa-user" />
                )}
                <span>我的</span>
              </div>
            </li>
            <li
              id="footer-li"
              className="menuicon"
              onClick={menuBtnClick}
              style={{ background: pageState.homeSelect ? '#ffffff00' : '' }}>
              <div className={`li-view menuicon ${menuActive ? 'active' : ''}`}>
                <FontAwesomeIcon icon="fa-solid fa-bars" />
              </div>
            </li>
          </ul>
        </div>
      </footer>
      <div id="RNav" className={theme}>
        <div>
          <div id="RNavHeader">
            <FontAwesomeIcon
              icon="fa-solid fa-school"
              className="icon"
              onClick={reload}
              alt="班級資訊平台icon"
              title="[重新整理] 班級資訊平台icon"
            />
            <span
              title={`當前版本：${WebVersion[0].version}`}
              onClick={() => [navigateClick('/webUpdate')]}>
              {WebVersion[0].version ? (
                WebVersion[0].version
              ) : (
                <FontAwesomeIcon icon="fa-solid fa-spinner" spinPulse />
              )}
            </span>
          </div>
          <div id="RNavTarget">
            <ul id="RNav-ul">
              <li id="RNav-li" onClick={() => [navigateClick('/')]}>
                <div
                  className={`RNav-li-block ${
                    pageState.homeSelect ? 'active' : ''
                  }`}>
                  {pageState.homeSelect ? (
                    <FontAwesomeIcon
                      icon="fa-solid fa-house"
                      className="icon"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon="fa-solid fa-house"
                      className="icon"
                    />
                  )}
                  <span>首頁</span>
                </div>
              </li>
              <li id="RNav-li" onClick={() => [navigateClick('/post')]}>
                <div
                  className={`RNav-li-block ${
                    pageState.postSelect ? 'active' : ''
                  }`}>
                  {pageState.postSelect ? (
                    <FontAwesomeIcon icon="fa-solid fa-bell" className="icon" />
                  ) : (
                    <FontAwesomeIcon icon="fa-solid fa-bell" className="icon" />
                  )}
                  <span>公告</span>
                </div>
                {postCount && postCount - postNoti > 0 ? (
                  <span className={`postNoti`}>{postCount - postNoti}</span>
                ) : (
                  ''
                )}
              </li>
              <li id="RNav-li" onClick={() => [navigateClick('/service')]}>
                <div
                  className={`RNav-li-block ${
                    pageState.folderSelect ||
                    pageState.courseScheduleSelect ||
                    pageState.ExSchSelect ||
                    pageState.youTubePlayer
                      ? 'active'
                      : ''
                  }`}>
                  {pageState.folderSelect ? (
                    <FontAwesomeIcon
                      icon="fa-solid fa-shapes"
                      className="icon"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon="fa-solid fa-shapes"
                      className="icon"
                    />
                  )}
                  <span>服務</span>
                </div>
              </li>
              <li
                id="RNav-li"
                className="chatGroup"
                onClick={() => [navigateClick('/chat-group')]}>
                <div
                  className={`RNav-li-block ${
                    pageState.chatGroup ? 'active' : ''
                  }`}>
                  {pageState.chatGroup ? (
                    <FontAwesomeIcon
                      icon="fa-solid fa-comments"
                      className="icon"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon="fa-solid fa-comments"
                      className="icon"
                    />
                  )}
                  <span>討論</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div id="RNavBottom">
          <div
            id="RNav-li"
            className={`RNav-li-block userPage ${
              pageState.user ? 'active' : ''
            }`}
            onClick={() => [navigateClick('/user')]}>
            <img
              className="userIMG"
              src={
                user
                  ? user.photoURL
                  : `${process.env.PUBLIC_URL}/images/icons/user.png`
              }
              title={user ? user.displayName : '未登入'}></img>
          </div>
          <div
            id="RNav-li"
            className={`RNav-li-block ${menuActive ? 'active' : ''}`}
            onClick={
              !menuActive && settingPage
                ? () => {
                    setSettingPage(!settingPage)
                    menuBtnClick()
                  }
                : menuBtnClick
            }>
            <FontAwesomeIcon icon="fa-solid fa-bars" />
          </div>
          <div
            id="RNav-li"
            className={`settingIcon ${settingPage ? 'active' : ''}`}
            onClick={
              menuActive && !settingPage
                ? () => {
                    setSettingPage(!settingPage)
                    menuBtnClick()
                  }
                : () => setSettingPage(!settingPage)
            }>
            <FontAwesomeIcon icon="fa-solid fa-gear" />
          </div>
        </div>
      </div>
      {/* {!pageState.chatGroup &&
        !pageState.youTubePlayer &&
        !pageState.courseScheduleSelect &&
        !pageState.ExSchSelect && (
          <div id="chatGroupEntrance" onClick={() => [pagelink('chatGroup')]}>
            <FontAwesomeIcon icon="fa-solid fa-comments" />
          </div>
        )} */}

      <Routes>
        {/* home */}
        <Route
          path="/"
          element={
            <Home
              theme={theme}
              settingPage={settingPage}
              isTop={isTop}
              openPost={openPost}
            />
          }
        />

        {/* post */}
        <Route
          path="/post"
          element={
            <Post
              theme={theme}
              settingPage={settingPage}
              setPostNoti={setPostNoti}
            />
          }></Route>

        {/* service */}
        <Route
          path="/service"
          element={
            <Service
              theme={theme}
              settingPage={settingPage}
              setDocUrl={setDocUrl}
              openDocUrl={openDocUrl}
              navigateClick={navigateClick}
            />
          }>
          <Route
            path="courseSchedule"
            element={
              <CourseSchedule
                navigateClick={navigateClick}
                TipsActive={TipsActive}
                Tips={Tips}
                theme={theme}
                settingPage={settingPage}
              />
            }></Route>
          <Route
            path="examSchedule"
            element={
              <ExSch
                theme={theme}
                settingPage={settingPage}
                navigateClick={navigateClick}
              />
            }></Route>
          <Route
            path="youtube-player"
            element={
              <YouTubePlayer
                theme={theme}
                setTheme={setTheme}
                themeMode={themeMode}
                navigateClick={navigateClick}
                setThemeMode={setThemeMode}
                setSpecialTheme={setSpecialTheme}
                settingPage={settingPage}
                setGlobalError={setGlobalError}
                setGlobalErrorIcon={setGlobalErrorIcon}
                youtubeUrl={youtubeUrl}
                setYoutubeUrl={setYoutubeUrl}
                openYoutubeUrl={openYoutubeUrl}
              />
            }></Route>
          <Route
            path="docLink"
            element={
              <DocLink
                theme={theme}
                settingPage={settingPage}
                docUrl={docUrl}
                navigateClick={navigateClick}></DocLink>
            }></Route>
        </Route>

        {/* chatGroup */}
        <Route
          path="/chat-group"
          element={
            <ChatGroup
              theme={theme}
              settingPage={settingPage}
              setPhotoPreviewUrl={setPhotoPreviewUrl}
              navigateClick={navigateClick}
              setGlobalError={setGlobalError}
              setGlobalErrorIcon={setGlobalErrorIcon}
            />
          }></Route>
        <Route
          path="/development"
          element={
            <Development
              OperationalStatus={OperationalStatus}
              theme={theme}
              themeInfo={themeInfo}
              settingPage={settingPage}
              readArticle={readArticle}
            />
          }></Route>

        {/* user */}
        <Route
          path="/user"
          element={<Me theme={theme} settingPage={settingPage} />}></Route>

        <Route
          path="/webUpdate"
          element={
            <WebUpdate
              navigateClick={navigateClick}
              theme={theme}
              settingPage={settingPage}
              handleUpdate={handleUpdate}
              updateAvailable={updateAvailable}
            />
          }></Route>
        <Route path="/secretPage" element={<Outlet />}>
          <Route
            path="updater"
            element={<Updater theme={theme} settingPage={settingPage} />}
          />
          <Route
            path="ox"
            element={<OOXXGame theme={theme} settingPage={settingPage} />}
          />
          <Route
            path="english"
            element={
              <EnglishAbbreviations theme={theme} settingPage={settingPage} />
            }
          />
        </Route>
      </Routes>

      <Setting
        navigateClick={navigateClick}
        settingPage={settingPage}
        setSettingPage={setSettingPage}
        menuActive={menuActive}
        modeValue={modeValue}
        theme={theme}
        handleThemeChange={handleThemeChange}
        setReportProblemActive={setReportProblemActive}
        setupPageChange={setupPageChange}
      />

      <ReportProblem
        theme={theme}
        reportProblemActive={reportProblemActive}
        setReportProblemActive={setReportProblemActive}
      />

      {/* Other Pages */}
      <Installation setOperationalStatus={setOperationalStatus} />
      {pageState.music && <Music theme={theme} settingPage={settingPage} />}
      {updateAvailable && (
        <div
          id="update"
          className={`${cancelUpdateBtn ? 'small' : ''}`}
          onClick={
            cancelUpdateBtn ? () => setCancelUpdateBtn(false) : () => {}
          }>
          <div className="updateContent">
            <div>
              <FontAwesomeIcon icon="fa-solid fa-circle-up" />
            </div>
            <p>檢測到更新！</p>
          </div>
          <div>
            <button
              className="updateContentBtn"
              onClick={() => navigateClick('/webUpdate')}>
              <p>更新內容</p>
            </button>
            <button
              className="cancelUpdateBtn"
              onClick={() => setCancelUpdateBtn(true)}>
              <p>稍後</p>
            </button>
            <button className="updateBtn" onClick={handleUpdate}>
              <p>更新</p>
            </button>
          </div>
        </div>
      )}
      {/* <Chat /> */}
      {pageState.englishAbbreviations && (
        <EnglishAbbreviations theme={theme} settingPage={settingPage} />
      )}
      {pageState.ooxx && <OOXXGame theme={theme} settingPage={settingPage} />}
      {postActive && (
        <Articles
          theme={theme}
          openPost={openPost}
          readArticle={readArticle}
          postActive={postActive}
          setPostActive={setPostActive}
          setReadArticle={setReadArticle}
        />
      )}
      <PhotoPreview
        theme={theme}
        photoPreviewUrl={photoPreviewUrl}
        setPhotoPreviewUrl={setPhotoPreviewUrl}
      />
      {globalError && (
        <div id="globalError">
          {globalErrorIcon}
          <p>{globalError}</p>
        </div>
      )}
    </>
  )
}

export default App
