// React
import React, { useEffect, useState } from 'react'
// CSS
import '../App.scss'
// DataBase
import { NewUpdatePost, UpdatePost } from '../AppData/UpdateData.js'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'

// 初始化
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
const auth = getAuth()

function Development(props) {
  const [user, setUser] = useState(null)
  const [userUID, setUserUID] = useState('')
  const [updateVersion, setUpdateVersion] = useState(false)
  const [updateVrsnPermission, setUpdateVrsnPermission] = useState(false)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return unsubscribe
  }, [])
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        setUserUID(user.uid)
        console.log(`User signed in with uid: ${userUID}`)
        if (userUID === process.env.REACT_APP_ADMIN_ACCOUNT) {
          setUpdateVrsnPermission(true)
        }
      } else {
        // User is signed out
        setUserUID('')
        console.log('User signed out')
      }
    })
    return unsubscribe
  }, [user])

  const [version, setVersion] = useState('')
  const [content, setContent] = useState('')
  // 數據
  const handleVersionChange = (event) => {
    const value = event.target.value
    const isValid = /^[\d.]*$/.test(value)
    if (isValid) {
      setVersion(value)
    }
  }
  const handleDateChange = (event) => {
    let value = event.target.value
    if (value.length === 1) {
      value = '2023' + value
    }
    const isValid = /^2023[\d.]*$/.test(value)
    if (isValid && value.length <= 8) {
      setDate(value)
    }
  }

  const handleContentChange = (event) => {
    let value = event.target.value
    const selectionStart = event.target.selectionStart
    const lines = value.split('\n')
    let newCursorPos = selectionStart
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].startsWith('・')) {
        lines[i] = '・' + lines[i]
        if (
          selectionStart > value.indexOf('\n', newCursorPos) &&
          value.indexOf('\n', newCursorPos) !== -1
        ) {
          newCursorPos += 1
        }
      }
    }
    value = lines.join('\n')
    setContent(value)
    event.target.selectionStart = event.target.selectionEnd = newCursorPos
  }

  // const updateVrsn = async (event) => {
  //   event.preventDefault()

  //   if (!version || !content) {
  //     alert('請將內容填寫完整')
  //     return
  //   }
  //   const updateVersion = version.replace('.', '-')
  //   const newVersionDocRef = doc(db, 'newVersion', 'newVersion')
  //   const lastVersionDocRef = doc(db, 'lastVersion', 'lastVersion')
  //   const date = new Date()
  //   const updateNewVersion = {
  //     [updateVersion]: {
  //       version: version,
  //       date: date,
  //       content: content,
  //     },
  //   }
  //   const newVersionDocSnap = await getDoc(newVersionDocRef)
  //   if (newVersionDocSnap.exists()) {
  //     await setDoc(lastVersionDocRef, newVersionDocSnap.data(), { merge: true })
  //   }
  //   // 更新數據庫
  //   await setDoc(newVersionDocRef, updateNewVersion)

  //   // 清空表單
  //   setVersion('')
  //   setContent('')
  //   setUpdateVersion(false)
  // }
  const updateVrsn = async () => {
    // 建立新版本物件
    const date = new Date()
    const newVersion = {
      version: version,
      date: date,
      content: content,
    }

    try {
      const webVersionRef = doc(db, 'webVersion', 'webVersion')

      // 從資料庫獲取當前版本資料
      const webVersionDoc = await getDoc(webVersionRef)
      const webVersionData = webVersionDoc.data()

      // 更新版本資料
      webVersionData.versions.unshift(newVersion) // 新版本插入到最前面
      // 上傳更新後的版本資料到資料庫
      await setDoc(webVersionRef, webVersionData)
      // 清空表單
      setVersion('')
      setContent('')
      setUpdateVersion(false)
    } catch (error) {
      console.error('發布新版本時發生錯誤：', error)
    }
  }

  // 資料處理 \n 自動換行
  const formatContent = (content) => {
    return content
      .split('\n')
      .map((line, index) => <span key={index}>{line}</span>)
  }

  const [newVersion, setNewVersion] = useState(null)
  const [lastVersion, setLastVersion] = useState(null)

  useEffect(() => {
    // 獲取資料
    const lastVersionDocRef = doc(db, 'lastVersion', 'lastVersion')
    const unsubscribe = onSnapshot(lastVersionDocRef, (doc) => {
      const data = doc.data()
      setLastVersion(data)
    })

    return () => unsubscribe()
  }, [])
  useEffect(() => {
    // 獲取資料
    const newVersionDocRef = doc(db, 'newVersion', 'newVersion')
    const unsubscribe = onSnapshot(newVersionDocRef, (doc) => {
      const data = doc.data()
      setNewVersion(data)
    })

    return () => unsubscribe()
  }, [])

  // 時間格式化
  const setDate = (date) => {
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

  // 展開收合
  const [expandCount, setExpandCount] = useState(1)
  const expandMore = () => {
    setExpandCount(expandCount + 5)
    console.log(lastVersion.length)
  }

  return (
    <>
      <main
        id="development"
        className={`${props.theme}${
          props.theme && props.settingPage ? ' ' : ''
        }${props.settingPage ? 'settingOpen' : ''}`}>
        {/* <div id="development-view">
          <div id="development-view-content">
            <h1>最新版本</h1>
            <section className="development-block">
              {newVersion &&
                Object.keys(newVersion)
                  .sort((a, b) =>
                    newVersion[b].version.localeCompare(
                      newVersion[a].version,
                      undefined,
                      {
                        numeric: true,
                        sensitivity: 'base',
                      }
                    )
                  )
                  .map((key) => (
                    <div key={key} className="development-post bg-purple-blue">
                      <h1>{newVersion[key].version}</h1>
                      <h5>
                        {setDate(new Date(newVersion[key].date.seconds * 1000))}
                      </h5>
                      {formatContent(newVersion[key].content)}
                    </div>
                  ))}
              {NewUpdatePost.map((NewUpdatePost, index) => (
                <div
                  className={`${
                    NewUpdatePost.title === 'Beta'
                      ? 'bg-beta'
                      : 'bg-purple-blue'
                  } development-post`}
                  key={index}>
                  <h1>{NewUpdatePost.title}</h1>
                  <h5>{NewUpdatePost.time}</h5>
                  {formatContent(NewUpdatePost.content)}
                </div>
              ))}
            </section>
            <h1>歷史版本</h1>
            <section className="development-block">
              {lastVersion ? (
                <>
                  {Object.keys(lastVersion)
                    .sort((a, b) =>
                      lastVersion[b].version.localeCompare(
                        lastVersion[a].version,
                        undefined,
                        {
                          numeric: true,
                          sensitivity: 'base',
                        }
                      )
                    )
                    .slice(0, expandCount)
                    .map((key) => (
                      <div key={key} className="development-post bg-history">
                        <h3>{lastVersion[key].version}</h3>
                        <h5>
                          {setDate(
                            new Date(lastVersion[key].date.seconds * 1000)
                          )}
                        </h5>
                        {formatContent(lastVersion[key].content)}
                      </div>
                    ))}
                  {expandCount >= Object.keys(lastVersion).length ? (
                    ''
                  ) : (
                    <button className="expandBtn" onClick={expandMore}>
                      <FontAwesomeIcon icon="fa-solid fa-caret-down" />
                      更多
                    </button>
                  )}
                  {expandCount > 1 ? (
                    <button
                      className="closeExpandBtn"
                      onClick={() => setExpandCount(1)}>
                      <FontAwesomeIcon icon="fa-solid fa-caret-up" />
                      收合
                    </button>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                ''
              )}
            </section>
            <h1>開發資訊</h1>
            <section className="development-block">
              <div className="development-post bg-em">
                <h5>User-Agent</h5>
                <span
                  style={{
                    wordBreak: 'break-all',
                  }}>
                  {navigator.userAgent}
                </span>
              </div>
            </section>
            <section className="development-block">
              <div className="developer">
                <div>
                  <FontAwesomeIcon icon="fa-brands fa-github" />
                  　敬請期待...
                </div>
              </div>
            </section>
          </div>
        </div> */}
        <h1>施工中</h1>
      </main>
      {updateVrsnPermission && (
        <UpdateVersion
          theme={props.theme}
          updateVersion={updateVersion}
          setUpdateVersion={setUpdateVersion}
          handleVersionChange={handleVersionChange}
          handleContentChange={handleContentChange}
          version={version}
          content={content}
          updateVrsn={updateVrsn}
        />
      )}
    </>
  )
}

function UpdateVersion(props) {
  return (
    <>
      <div
        id="updateVrsnBackMask"
        className={props.updateVersion ? 'open' : ''}
        onClick={() => props.setUpdateVersion(false)}></div>
      <div
        id="updateVersion"
        className={`${props.theme} ${props.updateVersion ? 'open' : ''}`}>
        <div
          id="closeUpdateVersion"
          className={`${props.updateVersion ? 'open' : ''}`}
          onClick={() => props.setUpdateVersion(false)}>
          <FontAwesomeIcon icon="fa-solid fa-xmark" />
        </div>
        <div
          id="submitNewVersion"
          className={`${props.updateVersion ? 'open' : ''}`}
          onClick={props.updateVrsn}>
          <FontAwesomeIcon
            icon="fa-solid fa-paper-plane"
            style={{ marginLeft: '-3px', marginRight: '6px' }}
          />{' '}
          發布
        </div>
        <div className="updateVersionView">
          <div className="version">
            <input
              type="text"
              placeholder="版本"
              value={props.version}
              onChange={(e) => props.handleVersionChange(e)}
            />
          </div>
          <div className="content">
            <textarea
              name="updateVersionContent"
              id=""
              placeholder="更新內容"
              value={props.content}
              onChange={props.handleContentChange}
              onFocus={props.handleContentChange}></textarea>
          </div>
        </div>
      </div>
      <div id="updateVersionBtn" onClick={() => props.setUpdateVersion(true)}>
        <FontAwesomeIcon
          icon="fa-solid fa-circle-up"
          style={{ marginRight: '6px' }}
        />
        發佈新版本
      </div>
    </>
  )
}

export default Development
