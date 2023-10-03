// React
import React, { useRef, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
// DataBase
import { examSchedule, examLeftTitle } from '../AppData/AppData'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// CSS
import './css/examSchedule.css'
// Firebase
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore'
// Widget
import PageTitle from '../widgets/PageTitle'
import Loader from '../widgets/Loader'
import PageCtrlModule from '../widgets/PageCtrlModule'
import EditBtn from '../widgets/editBtn'
import Editer from '../widgets/editer'

// 雲端資料庫
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

function exSch(props) {
  const [themeColor, setThemeColor] = useState([
    '#825fea',
    '#fffffff1',
    '#825fea',
    '#fffffff1',
  ])
  const [user, setUser] = useState()
  const [editPrmsn, setEditPrmsn] = useState(false)
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
        if (user.uid === process.env.REACT_APP_ADMIN_ACCOUNT) {
          setEditPrmsn(true)
        } else setEditPrmsn(false)
      } else {
        // User is signed out
        setEditPrmsn(false)
      }
    })
    return unsubscribe
  }, [user])

  // 編輯
  const [editView, setEditView] = useState(false)

  // 雲端數據
  const [examSchData, setExamSchData] = useState([
    {
      date: '第一天',
      fullDate: '',
      week: '',
      data: [
        {
          type: '資訊科',
          id: '1',
          data: [
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
          ],
        },
        {
          type: '電子科',
          id: '2',
          data: [
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
          ],
        },
        {
          type: '電機科',
          id: '3',
          data: [
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
          ],
        },
      ],
    },
    {
      date: '第二天',
      fullDate: '',
      week: '',
      data: [
        {
          type: '資訊科',
          id: '1',
          data: [
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
          ],
        },
        {
          type: '電子科',
          id: '2',
          data: [
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
          ],
        },
        {
          type: '電機科',
          id: '3',
          data: [
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
          ],
        },
      ],
    },
    {
      date: '第三天',
      fullDate: '',
      week: '',
      data: [
        {
          type: '資訊科',
          id: '1',
          data: [
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
          ],
        },
        {
          type: '電子科',
          id: '2',
          data: [
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
          ],
        },
        {
          type: '電機科',
          id: '3',
          data: [
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
          ],
        },
      ],
    },
  ])
  const updateValue = (dayIndex, typeIndex, dataIndex, field, value) => {
    const updatedData = [...examSchData]
    if (typeIndex === undefined) {
      updatedData[dayIndex][field] = value
    } else if (dataIndex === undefined) {
      updatedData[dayIndex].data[typeIndex][field] = value
    } else {
      updatedData[dayIndex].data[typeIndex].data[dataIndex][field] = value
    }
    setExamSchData(updatedData)
  }
  const dayCount = ['零', '一', '二', '三', '四', '五', '六', '七']
  const addDay = () => {
    const nextDayIndex = examSchData.length
    const nextDayDate = `第${dayCount[nextDayIndex + 1]}天`
    // 創建一個新的元素來表示下一天的考試安排
    const newDay = {
      date: nextDayDate,
      fullDate: '＊/＊',
      week: '＊',
      data: [
        {
          type: '資訊科',
          id: '1',
          data: [
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
          ],
        },
        {
          type: '電子科',
          id: '2',
          data: [
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
          ],
        },
        {
          type: '電機科',
          id: '3',
          data: [
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
            {
              exam: '',
              mode: 'notEx',
            },
          ],
        },
      ],
    }

    // 更新狀態變數
    if (examSchData.length < 7) {
      setExamSchData([...examSchData, newDay])
    }
    console.log(examSchData.length)
  }
  const deleteDay = () => {
    const updatedData = [...examSchData]
    const deleteDayIndex = examSchData.length
    updatedData.splice(deleteDayIndex - 1, 1)
    if (examSchData.length > 3) {
      setExamSchData(updatedData)
    }
    console.log(examSchData.length)
  }

  // 取得考程表內容，填充到輸入框
  const [getExamSch, setGetExamSch] = useState(false)
  if (!getExamSch) {
    const examSchDocRef = doc(db, 'examSchedule', 'examSchedule')
    onSnapshot(examSchDocRef, (doc) => {
      const data = doc.data()
      setExamSchData(data.examSchData)
    })
    setGetExamSch(true)
  }

  // 更新考程表
  const updateExamSch = async (event) => {
    event.preventDefault()
    console.log('updateExamSch')

    // 資訊科
    const examSchDocRef = doc(db, 'examSchedule', 'examSchedule')
    const examSchDataObject = { examSchData: examSchData }
    await setDoc(examSchDocRef, examSchDataObject, { merge: true })
  }

  // 表格合併規則
  function exSchType(type) {
    if (type.includes('Double')) {
      if (type.includes('2')) {
        return 'V2 Double'
      } else if (type.includes('3')) {
        return 'V3 Double'
      } else if (type.includes('4')) {
        return 'V4 Double'
      } else return 'Double'
    } else if (type.includes('Triple')) {
      if (type.includes('2')) {
        return 'V2 Triple'
      } else if (type.includes('3')) {
        return 'V3 Triple'
      } else if (type.includes('4')) {
        return 'V4 Triple'
      } else return 'Triple'
    } else if (type.includes('Empty')) {
      return 'Empty'
    } else {
      if (type.includes('2')) {
        return 'V2'
      } else if (type.includes('3')) {
        return 'V3'
      } else if (type.includes('Double')) {
        return 'Double'
      } else if (type.includes('Triple')) {
        return 'Triple'
      }
    }
  }
  // 樣式規則
  function exSchStyle(style) {
    if (style.includes('notEx')) {
      return 'notEx'
    } else {
      return
    }
  }

  const [bgColorPosition, setBgColorPosition] = useState('left')
  // Date
  const currentDate = new Date()
  const todayDate = currentDate.getMonth() + 1 + '/' + currentDate.getDate()
  const [backToday, setBackToday] = useState(false)
  useEffect(() => {
    const theme = props.theme

    const scrollContainer = document.querySelector('#exSch .view')

    // 計算points數組
    const points = []
    document.querySelectorAll('#exSchView').forEach((el, index) => {
      points[index] = el.offsetLeft
    })

    // 計算背景大小
    const bgSize = `${points.length * 100}% 100%`
    scrollContainer.style.backgroundSize = bgSize

    if (theme === '') {
      // Light
      scrollContainer.style.backgroundImage =
        'linear-gradient(115deg, #9c84e2, #8f9edf, #8fceee)'
    } else if (theme === 'dark') {
      // Dark
      scrollContainer.style.backgroundImage =
        'linear-gradient(115deg, #7b69b2, #707caf, #6895ac)'
    }

    // Triggered when rolling
    const handleScroll = () => {
      const scrollPosition = scrollContainer.scrollLeft
      let positionIndex = 0
      for (let i = 0; i < points.length; i++) {
        if (scrollPosition < points[i]) {
          positionIndex = i
          break
        }
      }
      const bgPosition = `${positionIndex * (100 / (points.length - 1))}%`
      scrollContainer.style.backgroundPosition = bgPosition
    }
    scrollContainer.addEventListener('scroll', handleScroll)

    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [props.theme, examSchData])

  useEffect(() => {
    const exSchRefs = document.querySelectorAll('#exSchView')
    setTimeout(() => {
      const index = examSchData.findIndex((item) => item.fullDate === todayDate)
      if (index !== -1 && exSchRefs[index]) {
        exSchRefs[index].scrollIntoView({ behavior: 'smooth' })
      }
    }, 250)
    setBackToday(false)
  }, [examSchData, backToday])

  // 頁面動畫
  const [pageTitleAni, setPageTitleAni] = useState(true)
  useEffect(() => {
    setPageTitleAni(false)
  }, [])

  const closePage = () => {
    setPageTitleAni(true)
    setTimeout(() => {
      props.navigateClick('/service')
    }, 250)
  }
  return (
    <>
      <Helmet>
        <title>班級資訊平台｜考程表</title>
        <meta name="description" content="班級的即時考程表" />
        <meta property="og:title" content="班級資訊平台｜考程表" />
        <meta property="og:description" content="班級的即時考程表" />
      </Helmet>
      <main
        id="exSch"
        className={`${props.theme}${props.settingPage ? ' settingOpen' : ''}${
          pageTitleAni ? ' PTAni' : ''
        }`}>
        <div id="todtyDate" onClick={() => setBackToday(true)}>
          <span title={`今天是 ${todayDate}`}>{todayDate}</span>
        </div>
        <div className={`view${pageTitleAni ? ' PTAni' : ''}`}>
          {examSchData[0].fullDate ? (
            examSchData.map((exSch, index) => (
              <section id="exSchView" key={index}>
                <span>
                  {exSch.fullDate} {exSch.week}
                </span>
                <div>
                  <h5>{exSch.date}</h5>
                  <div id="exTable">
                    <div className="exTableRows top">
                      <div className="exTableTopTitle">　</div>
                      {examLeftTitle.map((leftTitle, index) => (
                        <div className="exTableLeftTitle" key={index}>
                          {leftTitle.LeftTitle}
                        </div>
                      ))}
                    </div>
                    {exSch.data.map((data, index) => (
                      <div className="exTableRows" key={index}>
                        <div className="exTableTopTitle">{data.type}</div>
                        {data.data.map((exdata, index) => (
                          <div
                            className={`exTableData ${exSchType(
                              exdata.mode
                            )} ${exSchStyle(exdata.mode)}`}>
                            <span key={index}>{exdata.exam}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))
          ) : (
            <Loader />
          )}
        </div>
        {/* <div
          id="sourceFile"
          onClick={() =>
            window.open(
              `${process.env.PUBLIC_URL}/files/三段考程表.pdf`,
              '_blank'
            )
          }>
          <FontAwesomeIcon
            icon="fa-solid fa-file-pdf"
            style={{ marginRight: '6px' }}
          />
          <span>資料來源</span>
        </div> */}
        {editPrmsn && (
          <Editer
            title="考程表"
            content={
              <div className="examEditView">
                <div className="examEditTips">
                  <p>空：Empty</p>
                  <p>無考試：notEx</p>
                  <p>橫向兩格合併：Double</p>
                  <p>橫向三格合併：Triple</p>
                </div>
                {examSchData?.map((day, dayIndex) => (
                  <div key={dayIndex}>
                    <h3>{day.date}</h3>
                    <input
                      className="fullDate"
                      type="text"
                      value={day.fullDate}
                      onChange={(e) =>
                        updateValue(
                          dayIndex,
                          undefined,
                          undefined,
                          'fullDate',
                          e.target.value
                        )
                      }
                    />
                    <input
                      className="week"
                      type="text"
                      value={day.week}
                      onChange={(e) =>
                        updateValue(
                          dayIndex,
                          undefined,
                          undefined,
                          'week',
                          e.target.value
                        )
                      }
                    />
                    <div className="editExamSchTable">
                      {day.data.map((type, typeIndex) => (
                        <React.Fragment key={typeIndex}>
                          <div className={`typeBlock`}>
                            <p>{type.type}</p>
                            {type.data.map((item, dataIndex) => (
                              <div className={`editBlock`} key={dataIndex}>
                                <input
                                  className="exam"
                                  type="text"
                                  value={item.exam}
                                  onChange={(e) =>
                                    updateValue(
                                      dayIndex,
                                      typeIndex,
                                      dataIndex,
                                      'exam',
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  className="mode"
                                  type="text"
                                  value={item.mode}
                                  onChange={(e) =>
                                    updateValue(
                                      dayIndex,
                                      typeIndex,
                                      dataIndex,
                                      'mode',
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="ctrlSchBtn">
                  <button className="deleteDay" onClick={() => deleteDay()}>
                    <FontAwesomeIcon
                      icon="fa-solid fa-square-minus"
                      style={{ marginRight: '3px' }}
                    />
                    刪除一天
                  </button>
                  <button className="addDay" onClick={addDay}>
                    新增一天
                    <FontAwesomeIcon
                      icon="fa-solid fa-square-plus"
                      style={{ marginLeft: '3px' }}
                    />
                  </button>
                </div>
              </div>
            }
            theme={props.theme}
            editView={editView}
            submitFunc={updateExamSch}
            btnContent="更新"
            btnColor="#16bb53a1"
            btnContentColor="#ffffffd5"
          />
        )}
        <PageCtrlModule
          LBtn={[
            {
              type: 'link',
              prmsn: editPrmsn,
              content: '資料來源',
              icon: [
                <FontAwesomeIcon
                  icon="fa-solid fa-file-pdf"
                  style={{ marginRight: '6px' }}
                />,
              ],
              click: () =>
                window.open(
                  `${process.env.PUBLIC_URL}/files/三段考程表.pdf`,
                  '_blank'
                ),
            },
          ]}
          RBtn={[
            {
              type: 'button',
              prmsn: editPrmsn,
              content: '編輯',
              icon: [
                <FontAwesomeIcon
                  icon="fa-solid fa-xmark"
                  style={{ marginRight: '6px' }}
                />,
                <FontAwesomeIcon
                  icon="fa-solid fa-pen"
                  style={{ marginRight: '6px' }}
                />,
              ],
              click: () => setEditView(!editView),
              actv: editView,
            },
          ]}
        />
      </main>

      {editPrmsn && false && (
        <EditBtn
          theme={props.theme}
          btnIcon={
            <FontAwesomeIcon
              icon="fa-solid fa-pen"
              style={{ marginRight: '6px' }}
            />
          }
          btnContent="編輯"
          btnClick={() => setEditView(!editView)}
          openActv={editView}
        />
      )}
    </>
  )
}

export default exSch
