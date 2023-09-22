// React
import React, { useRef, useEffect, useState } from 'react'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// Database
import { CourseScheduleData, LeftTitle } from '../AppData/AppData.js'
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
import Loader from '../widgets/Loader.jsx'
import EditBtn from '../widgets/editBtn'
import Editer from '../widgets/editer'
import ContentTabs from '../widgets/ContentTabs'
import { Helmet } from 'react-helmet'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

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

function CourseSchedule(props) {
  const [themeColor, setThemeColor] = useState([
    '#5074eb',
    '#fffffff1',
    '#5074eb',
    '#fffffff1',
  ])
  const [user, setUser] = useState()
  const [editPrmsn, setEditPrmsn] = useState(false)
  // 編輯
  const [editView, setEditView] = useState(false)
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

  // 樣式規則
  function courseScheduleMerger(number) {
    if (typeof number !== 'string' || !number) {
      return ''
    }

    if (number.includes('classchange')) {
      if (number.includes('2')) {
        return 'Double classchange'
      } else if (number.includes('3')) {
        return 'Triple classchange'
      } else if (number.includes('AllDay')) {
        return 'AllDay classchange'
      } else {
        return 'classchange'
      }
    } else if (number.includes('AllDay') && !number.includes('classchange')) {
      if (number.includes('Vacances')) {
        return 'AllDay Vacances'
      } else {
        return 'AllDay'
      }
    } else {
      if (number.includes('2')) {
        return 'Double'
      } else if (number.includes('3')) {
        return 'Triple'
      } else if (number.includes('AllDay')) {
        return 'AllDay'
      }
    }

    return ''
  }

  // 課程表狀態
  const [_, forceUpdate] = useState(0)
  const [courseScheduleDataInfoActive, setcourseScheduleDataInfoActive] =
    useState(false)
  const courseScheduleDataInfo = () => {
    setcourseScheduleDataInfoActive((prevActive) => !prevActive)
  }

  const [courSchData, setCourSchData] = useState()
  const [courSchDataBackup, setCourSchDataBackup] = useState()

  const resetCourSchData = [
    {
      type: '資訊科',
      data: [
        {
          Course: [
            {
              info_classroom: '501',
              continuity: '',
              class: '化學',
              info_teacher: '陳永富',
            },
            {
              continuity: '2',
              info_teacher: '黃芳瑩',
              class: '微處理機',
              info_classroom: '531',
            },
            {
              class: '數位音樂',
              info_teacher: '林郁珊',
              continuity: '',
              info_classroom: '353',
            },
            {
              info_classroom: '501',
              class: '數學',
              info_teacher: '成志樵',
              continuity: '',
            },
            {
              info_classroom: '501',
              class: '英語文',
              info_teacher: '徐玉雪',
              continuity: '2',
            },
            {
              info_classroom: '501',
              continuity: '',
              info_teacher: '鄭雅華',
              class: '共學共好',
            },
          ],
          Date: '星期一',
        },
        {
          Date: '星期二',
          Course: [
            {
              info_classroom: '583',
              info_teacher: '周嘉慧',
              class: '地理',
              continuity: '',
              active: 'classroom',
            },
            {
              continuity: '3',
              class: '單晶片微處理機實習',
              info_classroom: '587',
              info_teacher: '葉憲民',
            },
            {
              info_teacher: '黃釧泉',
              info_classroom: '482',
              continuity: '3',
              class: '電腦硬體裝修實習',
            },
            {
              continuity: '',
              class: '共學共好',
              info_teacher: '鄭雅華',
              info_classroom: '501',
            },
          ],
        },
        {
          Date: '星期三',
          Course: [
            {
              continuity: '',
              info_classroom: '586',
              class: '多元選修',
              info_teacher: '林怡欣',
              active: 'classroom',
            },
            {
              info_teacher: '成志樵',
              class: '數學',
              info_classroom: '386',
              continuity: '2',
              active: 'classroom',
            },
            {
              info_classroom: '485',
              class: '微處理機',
              continuity: '',
              info_teacher: '黃芳瑩',
              active: 'classroom',
            },
            {
              class: '體育',
              info_teacher: '林泱妗',
              continuity: '',
              info_classroom: '',
            },
            {
              class: '電路學',
              info_classroom: '485',
              continuity: '2',
              info_teacher: '黃芳瑩',
              active: 'classroom',
            },
            {
              info_classroom: '501',
              class: '共學共好',
              continuity: '',
              info_teacher: '鄭雅華',
            },
          ],
        },
        {
          Course: [
            {
              info_teacher: '成志樵',
              info_classroom: '581',
              continuity: '3',
              class: '電子學實習',
            },
            {
              class: '體育',
              continuity: '',
              info_classroom: '',
              info_teacher: '林泱妗',
            },
            {
              info_teacher: '葉憲民',
              class: '電子學',
              continuity: '',
              info_classroom: '501',
            },
            {
              class: '國語文',
              continuity: '2',
              info_teacher: '鄭雅華',
              info_classroom: '501',
            },
            {
              continuity: '',
              info_classroom: '501',
              class: '共學共好',
              info_teacher: '鄭雅華',
            },
          ],
          Date: '星期四',
        },
        {
          Date: '星期五',
          Course: [
            {
              continuity: '',
              info_teacher: '',
              info_classroom: '',
              class: '班/週會',
            },
            {
              info_teacher: '',
              class: '聯課活動',
              info_classroom: '',
              continuity: '2',
            },
            {
              class: '彈性課程',
              info_classroom: '501',
              info_teacher: '鄭雅華',
              continuity: '1',
            },
            {
              class: '國語文',
              info_classroom: '501',
              continuity: '',
              info_teacher: '鄭雅華',
            },
            {
              info_classroom: '501',
              class: '電子學',
              continuity: '2',
              info_teacher: '葉憲民',
            },
            {
              info_classroom: '501',
              info_teacher: '鄭雅華',
              continuity: '',
              class: '共學共好',
            },
          ],
        },
      ],
    },
    {
      type: '電子科',
      data: [
        {
          Course: [
            {
              class: '化學',
              info_teacher: '陳永富',
              info_classroom: '501',
            },
            {
              info_teacher: '黃芳瑩',
              class: '微處理機',
              continuity: '2',
              info_classroom: '531',
            },
            {
              class: '數位音樂',
              info_teacher: '林郁珊',
              info_classroom: '353',
            },
            {
              class: '數學',
              info_teacher: '成志樵',
              info_classroom: '501',
            },
            {
              info_classroom: '501',
              info_teacher: '徐玉雪',
              continuity: '2',
              class: '英語文',
            },
            {
              class: '共學共好',
              info_classroom: '501',
              info_teacher: '鄭雅華',
            },
          ],
          Date: '星期一',
        },
        {
          Date: '星期二',
          Course: [
            {
              info_classroom: '583',
              info_teacher: '周嘉慧',
              class: '地理',
              active: 'classroom',
            },
            {
              continuity: '3',
              class: '單晶片微處理機實習',
              info_classroom: '587',
              info_teacher: '葉憲民',
            },
            {
              info_classroom: '482',
              info_teacher: '黃釧泉',
              continuity: '3',
              class: '感測器實習',
            },
            {
              info_teacher: '鄭雅華',
              class: '共學共好',
              info_classroom: '501',
            },
          ],
        },
        {
          Course: [
            {
              class: '多元選修',
              info_classroom: '486/488',
              info_teacher: '林怡欣/徐玉雪',
              active: 'classroom',
            },
            {
              class: '數學',
              info_classroom: '386',
              continuity: '2',
              info_teacher: '成志樵',
              active: 'classroom',
            },
            {
              info_classroom: '485',
              info_teacher: '黃芳瑩',
              class: '微處理機',
              active: 'classroom',
            },
            {
              continuity: '',
              info_teacher: '林泱妗',
              class: '體育',
              info_classroom: '',
            },
            {
              info_classroom: '485',
              continuity: '2',
              class: '電路學',
              info_teacher: '黃芳瑩',
              active: 'classroom',
            },
            {
              class: '共學共好',
              info_classroom: '501',
              info_teacher: '鄭雅華',
            },
          ],
          Date: '星期三',
        },
        {
          Date: '星期四',
          Course: [
            {
              info_teacher: '成志樵',
              class: '電子學實習',
              continuity: '3',
              info_classroom: '581',
            },
            {
              continuity: '',
              info_classroom: '',
              class: '體育',
              info_teacher: '林泱妗',
            },
            {
              info_teacher: '葉憲民',
              class: '電子學',
              info_classroom: '501',
              continuity: '',
            },
            {
              info_teacher: '鄭雅華',
              class: '國語文',
              continuity: '2',
              info_classroom: '501',
            },
            {
              info_teacher: '鄭雅華',
              class: '共學共好',
              info_classroom: '501',
              continuity: '',
            },
          ],
        },
        {
          Course: [
            {
              info_classroom: '',
              continuity: '',
              class: '班/週會',
              info_teacher: '',
            },
            {
              info_classroom: '',
              class: '聯課活動',
              continuity: '2',
              info_teacher: '',
            },
            {
              info_teacher: '鄭雅華',
              continuity: '1',
              info_classroom: '501',
              class: '彈性課程',
            },
            {
              continuity: '',
              info_classroom: '501',
              class: '國語文',
              info_teacher: '鄭雅華',
            },
            {
              info_teacher: '葉憲民',
              continuity: '2',
              info_classroom: '501',
              class: '電子學',
            },
            {
              continuity: '',
              info_classroom: '501',
              class: '共學共好',
              info_teacher: '鄭雅華',
            },
          ],
          Date: '星期五',
        },
      ],
    },
    {
      type: '電機科',
      data: [
        {
          Course: [
            {
              class: '化學',
              info_teacher: '陳永富',
              info_classroom: '501',
            },
            {
              info_classroom: '501',
              class: '電工機械',
              continuity: '2',
              info_teacher: '江明德',
            },
            {
              info_classroom: '353',
              info_teacher: '林郁珊',
              class: '數位音樂',
            },
            {
              class: '數學',
              info_teacher: '成志樵',
              info_classroom: '501',
            },
            {
              info_classroom: '501',
              continuity: '2',
              info_teacher: '徐玉雪',
              class: '英語文',
            },
            {
              info_teacher: '鄭雅華',
              info_classroom: '501',
              class: '共學共好',
            },
          ],
          Date: '星期一',
        },
        {
          Date: '星期二',
          Course: [
            {
              info_classroom: '583',
              class: '地理',
              info_teacher: '周嘉慧',
              active: 'classroom',
            },
            {
              continuity: '3',
              class: '機電整合實習',
              info_classroom: '583',
              info_teacher: '施茗鈜',
            },
            {
              info_classroom: '484',
              info_teacher: '施茗鈜',
              continuity: '3',
              class: '智慧居家監控實習',
            },
            {
              info_classroom: '501',
              info_teacher: '鄭雅華',
              class: '共學共好',
            },
          ],
        },
        {
          Date: '星期三',
          Course: [
            {
              info_classroom: '486/488',
              info_teacher: '林怡欣/徐玉雪',
              class: '多元選修',
              active: 'classroom',
            },
            {
              info_teacher: '成志樵',
              info_classroom: '386',
              continuity: '2',
              class: '數學',
              active: 'classroom',
            },
            {
              info_classroom: '383',
              class: '電工機械',
              info_teacher: '江明德',
              active: 'classroom',
            },
            {
              continuity: '',
              class: '體育',
              info_teacher: '林泱妗',
              info_classroom: '',
            },
            {
              info_teacher: '江明德',
              info_classroom: '383',
              class: '工業配線',
              continuity: '2',
            },
            {
              class: '共學共好',
              info_classroom: '501',
              info_teacher: '鄭雅華',
            },
          ],
        },
        {
          Course: [
            {
              info_classroom: '581',
              class: '電子學實習',
              continuity: '3',
              info_teacher: '成志樵',
            },
            {
              info_classroom: '',
              class: '體育',
              info_teacher: '林泱妗',
              continuity: '',
            },
            {
              info_classroom: '501',
              continuity: '',
              info_teacher: '葉憲民',
              class: '電子學',
            },
            {
              info_teacher: '鄭雅華',
              info_classroom: '501',
              class: '國語文',
              continuity: '2',
            },
            {
              continuity: '',
              class: '共學共好',
              info_teacher: '鄭雅華',
              info_classroom: '501',
            },
          ],
          Date: '星期四',
        },
        {
          Course: [
            {
              info_teacher: '',
              info_classroom: '',
              continuity: '',
              class: '班/週會',
            },
            {
              info_classroom: '',
              continuity: '2',
              info_teacher: '',
              class: '聯課活動',
            },
            {
              info_teacher: '鄭雅華',
              continuity: '1',
              info_classroom: '501',
              class: '彈性課程',
            },
            {
              class: '國語文',
              info_classroom: '501',
              info_teacher: '鄭雅華',
              continuity: '',
            },
            {
              class: '電子學',
              info_classroom: '501',
              continuity: '2',
              info_teacher: '葉憲民',
            },
            {
              info_teacher: '鄭雅華',
              class: '共學共好',
              info_classroom: '501',
              continuity: '',
            },
          ],
          Date: '星期五',
        },
      ],
    },
  ]

  // 取得考程表內容，填充到輸入框
  const [getCourseSch, setGetCourseSch] = useState(false)
  const [editedActv, setEditedActv] = useState(false)
  useEffect(() => {
    if (!getCourseSch) {
      const courSchDocRef = doc(db, 'courseSchedule', 'courseSchedule')
      onSnapshot(courSchDocRef, (doc) => {
        const data = doc.data()
        setCourSchData(data.courSchData)
        setCourSchDataBackup(data.courSchData)
        console.log(data.courSchData)
      })
      setGetCourseSch(true)
    }
  }, [getCourseSch])
  useEffect(() => {
    if (courSchData && courSchDataBackup) {
      if (courSchData === courSchDataBackup) {
        setEditedActv(false)
      } else {
        setEditedActv(true)
        console.log(courSchData === courSchDataBackup)
        // console.log(courSchDataBackup)
      }
      console.log(courSchData[0].type)
    }
  }, [courSchData, courSchDataBackup, getCourseSch])

  // 更新課程表
  const updateCourSch = async (event) => {
    event.preventDefault()

    // 資訊科
    const courseSchDocRef = doc(db, 'courseSchedule', 'courseSchedule')
    const courSchDataObject = { courSchData: courSchData }
    await setDoc(courseSchDocRef, courSchDataObject, { merge: true })
    // setGetCourSchCount(false)
  }

  const updateValue = (subjectIndex, dayIndex, courseIndex, field, value) => {
    setCourSchData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData))
      const courseData =
        newData[subjectIndex].data[dayIndex].Course[courseIndex]
      courseData[field] = value
      return newData
    })
  }

  const resetCourSch = () => {
    setCourSchData(resetCourSchData)
  }

  const moveUp = (subjectIndex, dayIndex, courseIndex) => {
    setCourSchData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData))
      const dayData = newData[subjectIndex].data[dayIndex]
      if (courseIndex === 0) return prevData // 如果課程已經在頂部，則不執行任何操作
      const courseData = dayData.Course.splice(courseIndex, 1)[0]
      dayData.Course.splice(courseIndex - 1, 0, courseData)
      return newData
    })
  }

  const moveDown = (subjectIndex, dayIndex, courseIndex) => {
    setCourSchData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData))
      const dayData = newData[subjectIndex].data[dayIndex]
      if (courseIndex === dayData.Course.length - 1) return prevData // 如果課程已經在底部，則不執行任何操作
      const courseData = dayData.Course.splice(courseIndex, 1)[0]
      dayData.Course.splice(courseIndex + 1, 0, courseData)
      return newData
    })
  }
  const addCourse = (subjectIndex, dayIndex) => {
    setCourSchData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData))
      const dayData = newData[subjectIndex].data[dayIndex]
      dayData.Course.push({
        // 在這裡添加新課程的初始值
        class: '',
        info_classroom: '',
        info_teacher: '',
        continuity: '',
      })
      return newData
    })
  }
  const deleteCourse = (subjectIndex, dayIndex, courseIndex) => {
    setCourSchData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData))
      const dayData = newData[subjectIndex].data[dayIndex]
      dayData.Course.splice(courseIndex, 1)
      return newData
    })
  }

  // 資訊科
  // const courseSchDocRef1 = doc(db, 'courseSchedule', 'courseSchedule1')
  // const resetCourSchData1 = {
  //   data: [
  //     {
  //       Course: [
  //         {
  //           info_classroom: '501',
  //           continuity: '',
  //           class: '化學',
  //           info_teacher: '陳永富',
  //         },
  //         {
  //           continuity: '2',
  //           info_teacher: '黃芳瑩',
  //           class: '微處理機',
  //           info_classroom: '531',
  //         },
  //         {
  //           class: '數位音樂',
  //           info_teacher: '林郁珊',
  //           continuity: '',
  //           info_classroom: '353',
  //         },
  //         {
  //           info_classroom: '501',
  //           class: '數學',
  //           info_teacher: '成志樵',
  //           continuity: '',
  //         },
  //         {
  //           info_classroom: '501',
  //           class: '英語文',
  //           info_teacher: '徐玉雪',
  //           continuity: '2',
  //         },
  //         {
  //           info_classroom: '501',
  //           continuity: '',
  //           info_teacher: '鄭雅華',
  //           class: '共學共好',
  //         },
  //       ],
  //       Date: '星期一',
  //     },
  //     {
  //       Date: '星期二',
  //       Course: [
  //         {
  //           info_classroom: '583',
  //           info_teacher: '周嘉慧',
  //           class: '地理',
  //           continuity: '',
  //           active: 'classroom',
  //         },
  //         {
  //           continuity: '3',
  //           class: '單晶片微處理機實習',
  //           info_classroom: '587',
  //           info_teacher: '葉憲民',
  //         },
  //         {
  //           info_teacher: '黃釧泉',
  //           info_classroom: '482',
  //           continuity: '3',
  //           class: '電腦硬體裝修實習',
  //         },
  //         {
  //           continuity: '',
  //           class: '共學共好',
  //           info_teacher: '鄭雅華',
  //           info_classroom: '501',
  //         },
  //       ],
  //     },
  //     {
  //       Date: '星期三',
  //       Course: [
  //         {
  //           continuity: '',
  //           info_classroom: '586',
  //           class: '多元選修',
  //           info_teacher: '林怡欣',
  //           active: 'classroom',
  //         },
  //         {
  //           info_teacher: '成志樵',
  //           class: '數學',
  //           info_classroom: '386',
  //           continuity: '2',
  //           active: 'classroom',
  //         },
  //         {
  //           info_classroom: '485',
  //           class: '微處理機',
  //           continuity: '',
  //           info_teacher: '黃芳瑩',
  //           active: 'classroom',
  //         },
  //         {
  //           class: '體育',
  //           info_teacher: '林泱妗',
  //           continuity: '',
  //           info_classroom: '',
  //         },
  //         {
  //           class: '電路學',
  //           info_classroom: '485',
  //           continuity: '2',
  //           info_teacher: '黃芳瑩',
  //           active: 'classroom',
  //         },
  //         {
  //           info_classroom: '501',
  //           class: '共學共好',
  //           continuity: '',
  //           info_teacher: '鄭雅華',
  //         },
  //       ],
  //     },
  //     {
  //       Course: [
  //         {
  //           info_teacher: '成志樵',
  //           info_classroom: '581',
  //           continuity: '3',
  //           class: '電子學實習',
  //         },
  //         {
  //           class: '體育',
  //           continuity: '',
  //           info_classroom: '',
  //           info_teacher: '林泱妗',
  //         },
  //         {
  //           info_teacher: '葉憲民',
  //           class: '電子學',
  //           continuity: '',
  //           info_classroom: '501',
  //         },
  //         {
  //           class: '國語文',
  //           continuity: '2',
  //           info_teacher: '鄭雅華',
  //           info_classroom: '501',
  //         },
  //         {
  //           continuity: '',
  //           info_classroom: '501',
  //           class: '共學共好',
  //           info_teacher: '鄭雅華',
  //         },
  //       ],
  //       Date: '星期四',
  //     },
  //     {
  //       Date: '星期五',
  //       Course: [
  //         {
  //           continuity: '',
  //           info_teacher: '',
  //           info_classroom: '',
  //           class: '班/週會',
  //         },
  //         {
  //           info_teacher: '',
  //           class: '聯課活動',
  //           info_classroom: '',
  //           continuity: '2',
  //         },
  //         {
  //           class: '彈性課程',
  //           info_classroom: '501',
  //           info_teacher: '鄭雅華',
  //           continuity: '1',
  //         },
  //         {
  //           class: '國語文',
  //           info_classroom: '501',
  //           continuity: '',
  //           info_teacher: '鄭雅華',
  //         },
  //         {
  //           info_classroom: '501',
  //           class: '電子學',
  //           continuity: '2',
  //           info_teacher: '葉憲民',
  //         },
  //         {
  //           info_classroom: '501',
  //           info_teacher: '鄭雅華',
  //           continuity: '',
  //           class: '共學共好',
  //         },
  //       ],
  //     },
  //   ],
  //   type: '資訊科',
  // }
  // 電子科
  // const courseSchDocRef2 = doc(db, 'courseSchedule', 'courseSchedule2')
  // const resetCourSchData2 = {
  //   type: '電子科',
  //   data: [
  //     {
  //       Course: [
  //         {
  //           class: '化學',
  //           info_teacher: '陳永富',
  //           info_classroom: '501',
  //         },
  //         {
  //           info_teacher: '黃芳瑩',
  //           class: '微處理機',
  //           continuity: '2',
  //           info_classroom: '531',
  //         },
  //         {
  //           class: '數位音樂',
  //           info_teacher: '林郁珊',
  //           info_classroom: '353',
  //         },
  //         {
  //           class: '數學',
  //           info_teacher: '成志樵',
  //           info_classroom: '501',
  //         },
  //         {
  //           info_classroom: '501',
  //           info_teacher: '徐玉雪',
  //           continuity: '2',
  //           class: '英語文',
  //         },
  //         {
  //           class: '共學共好',
  //           info_classroom: '501',
  //           info_teacher: '鄭雅華',
  //         },
  //       ],
  //       Date: '星期一',
  //     },
  //     {
  //       Date: '星期二',
  //       Course: [
  //         {
  //           info_classroom: '583',
  //           info_teacher: '周嘉慧',
  //           class: '地理',
  //           active: 'classroom',
  //         },
  //         {
  //           continuity: '3',
  //           class: '單晶片微處理機實習',
  //           info_classroom: '587',
  //           info_teacher: '葉憲民',
  //         },
  //         {
  //           info_classroom: '482',
  //           info_teacher: '黃釧泉',
  //           continuity: '3',
  //           class: '感測器實習',
  //         },
  //         {
  //           info_teacher: '鄭雅華',
  //           class: '共學共好',
  //           info_classroom: '501',
  //         },
  //       ],
  //     },
  //     {
  //       Course: [
  //         {
  //           class: '多元選修',
  //           info_classroom: '486/488',
  //           info_teacher: '林怡欣/徐玉雪',
  //           active: 'classroom',
  //         },
  //         {
  //           class: '數學',
  //           info_classroom: '386',
  //           continuity: '2',
  //           info_teacher: '成志樵',
  //           active: 'classroom',
  //         },
  //         {
  //           info_classroom: '485',
  //           info_teacher: '黃芳瑩',
  //           class: '微處理機',
  //           active: 'classroom',
  //         },
  //         {
  //           continuity: '',
  //           info_teacher: '林泱妗',
  //           class: '體育',
  //           info_classroom: '',
  //         },
  //         {
  //           info_classroom: '485',
  //           continuity: '2',
  //           class: '電路學',
  //           info_teacher: '黃芳瑩',
  //           active: 'classroom',
  //         },
  //         {
  //           class: '共學共好',
  //           info_classroom: '501',
  //           info_teacher: '鄭雅華',
  //         },
  //       ],
  //       Date: '星期三',
  //     },
  //     {
  //       Date: '星期四',
  //       Course: [
  //         {
  //           info_teacher: '成志樵',
  //           class: '電子學實習',
  //           continuity: '3',
  //           info_classroom: '581',
  //         },
  //         {
  //           continuity: '',
  //           info_classroom: '',
  //           class: '體育',
  //           info_teacher: '林泱妗',
  //         },
  //         {
  //           info_teacher: '葉憲民',
  //           class: '電子學',
  //           info_classroom: '501',
  //           continuity: '',
  //         },
  //         {
  //           info_teacher: '鄭雅華',
  //           class: '國語文',
  //           continuity: '2',
  //           info_classroom: '501',
  //         },
  //         {
  //           info_teacher: '鄭雅華',
  //           class: '共學共好',
  //           info_classroom: '501',
  //           continuity: '',
  //         },
  //       ],
  //     },
  //     {
  //       Course: [
  //         {
  //           info_classroom: '',
  //           continuity: '',
  //           class: '班/週會',
  //           info_teacher: '',
  //         },
  //         {
  //           info_classroom: '',
  //           class: '聯課活動',
  //           continuity: '2',
  //           info_teacher: '',
  //         },
  //         {
  //           info_teacher: '鄭雅華',
  //           continuity: '1',
  //           info_classroom: '501',
  //           class: '彈性課程',
  //         },
  //         {
  //           continuity: '',
  //           info_classroom: '501',
  //           class: '國語文',
  //           info_teacher: '鄭雅華',
  //         },
  //         {
  //           info_teacher: '葉憲民',
  //           continuity: '2',
  //           info_classroom: '501',
  //           class: '電子學',
  //         },
  //         {
  //           continuity: '',
  //           info_classroom: '501',
  //           class: '共學共好',
  //           info_teacher: '鄭雅華',
  //         },
  //       ],
  //       Date: '星期五',
  //     },
  //   ],
  // }
  // 電機科
  // const courseSchDocRef3 = doc(db, 'courseSchedule', 'courseSchedule3')
  // const resetCourSchData3 = {
  //   type: '電機科',
  //   data: [
  //     {
  //       Course: [
  //         {
  //           class: '化學',
  //           info_teacher: '陳永富',
  //           info_classroom: '501',
  //         },
  //         {
  //           info_classroom: '501',
  //           class: '電工機械',
  //           continuity: '2',
  //           info_teacher: '江明德',
  //         },
  //         {
  //           info_classroom: '353',
  //           info_teacher: '林郁珊',
  //           class: '數位音樂',
  //         },
  //         {
  //           class: '數學',
  //           info_teacher: '成志樵',
  //           info_classroom: '501',
  //         },
  //         {
  //           info_classroom: '501',
  //           continuity: '2',
  //           info_teacher: '徐玉雪',
  //           class: '英語文',
  //         },
  //         {
  //           info_teacher: '鄭雅華',
  //           info_classroom: '501',
  //           class: '共學共好',
  //         },
  //       ],
  //       Date: '星期一',
  //     },
  //     {
  //       Date: '星期二',
  //       Course: [
  //         {
  //           info_classroom: '583',
  //           class: '地理',
  //           info_teacher: '周嘉慧',
  //           active: 'classroom',
  //         },
  //         {
  //           continuity: '3',
  //           class: '機電整合實習',
  //           info_classroom: '583',
  //           info_teacher: '施茗鈜',
  //         },
  //         {
  //           info_classroom: '484',
  //           info_teacher: '施茗鈜',
  //           continuity: '3',
  //           class: '智慧居家監控實習',
  //         },
  //         {
  //           info_classroom: '501',
  //           info_teacher: '鄭雅華',
  //           class: '共學共好',
  //         },
  //       ],
  //     },
  //     {
  //       Date: '星期三',
  //       Course: [
  //         {
  //           info_classroom: '486/488',
  //           info_teacher: '林怡欣/徐玉雪',
  //           class: '多元選修',
  //           active: 'classroom',
  //         },
  //         {
  //           info_teacher: '成志樵',
  //           info_classroom: '386',
  //           continuity: '2',
  //           class: '數學',
  //           active: 'classroom',
  //         },
  //         {
  //           info_classroom: '383',
  //           class: '電工機械',
  //           info_teacher: '江明德',
  //           active: 'classroom',
  //         },
  //         {
  //           continuity: '',
  //           class: '體育',
  //           info_teacher: '林泱妗',
  //           info_classroom: '',
  //         },
  //         {
  //           info_teacher: '江明德',
  //           info_classroom: '383',
  //           class: '工業配線',
  //           continuity: '2',
  //         },
  //         {
  //           class: '共學共好',
  //           info_classroom: '501',
  //           info_teacher: '鄭雅華',
  //         },
  //       ],
  //     },
  //     {
  //       Course: [
  //         {
  //           info_classroom: '581',
  //           class: '電子學實習',
  //           continuity: '3',
  //           info_teacher: '成志樵',
  //         },
  //         {
  //           info_classroom: '',
  //           class: '體育',
  //           info_teacher: '林泱妗',
  //           continuity: '',
  //         },
  //         {
  //           info_classroom: '501',
  //           continuity: '',
  //           info_teacher: '葉憲民',
  //           class: '電子學',
  //         },
  //         {
  //           info_teacher: '鄭雅華',
  //           info_classroom: '501',
  //           class: '國語文',
  //           continuity: '2',
  //         },
  //         {
  //           continuity: '',
  //           class: '共學共好',
  //           info_teacher: '鄭雅華',
  //           info_classroom: '501',
  //         },
  //       ],
  //       Date: '星期四',
  //     },
  //     {
  //       Course: [
  //         {
  //           info_teacher: '',
  //           info_classroom: '',
  //           continuity: '',
  //           class: '班/週會',
  //         },
  //         {
  //           info_classroom: '',
  //           continuity: '2',
  //           info_teacher: '',
  //           class: '聯課活動',
  //         },
  //         {
  //           info_teacher: '鄭雅華',
  //           continuity: '1',
  //           info_classroom: '501',
  //           class: '彈性課程',
  //         },
  //         {
  //           class: '國語文',
  //           info_classroom: '501',
  //           info_teacher: '鄭雅華',
  //           continuity: '',
  //         },
  //         {
  //           class: '電子學',
  //           info_classroom: '501',
  //           continuity: '2',
  //           info_teacher: '葉憲民',
  //         },
  //         {
  //           info_teacher: '鄭雅華',
  //           class: '共學共好',
  //           info_classroom: '501',
  //           continuity: '',
  //         },
  //       ],
  //       Date: '星期五',
  //     },
  //   ],
  // }
  const [courSchData1, setCourSchData1] = useState('')
  const [courSchData2, setCourSchData2] = useState('')
  const [courSchData3, setCourSchData3] = useState('')

  // useEffect(() => {
  //   // 資訊科
  //   const lastVersionDocRef = doc(db, 'courseSchedule', 'courseSchedule1')
  //   const courSchDataOutput = onSnapshot(lastVersionDocRef, (doc) => {
  //     const data = doc.data()
  //     setCourSchData1(data)
  //   })
  //   return () => courSchDataOutput()
  // }, [])
  // useEffect(() => {
  //   // 獲取資料
  //   const lastVersionDocRef = doc(db, 'courseSchedule', 'courseSchedule2')
  //   const courSchDataOutput = onSnapshot(lastVersionDocRef, (doc) => {
  //     const data = doc.data()
  //     setCourSchData2(data)
  //   })
  //   return () => courSchDataOutput()
  // }, [])
  // useEffect(() => {
  //   // 獲取資料
  //   const lastVersionDocRef = doc(db, 'courseSchedule', 'courseSchedule3')
  //   const courSchDataOutput = onSnapshot(lastVersionDocRef, (doc) => {
  //     const data = doc.data()
  //     setCourSchData3(data)
  //   })
  //   return () => courSchDataOutput()
  // }, [])

  // const [courSchDisplay, setCourSchDisplay] = useState()
  const courSchTypeChange = (type) => {
    props.setCourSchType(type)
    localStorage.setItem('courSchType', type)
  }
  useEffect(() => {
    const storedValue = localStorage.getItem('courSchType')
    if (storedValue) {
      props.setCourSchType(storedValue)
    } else {
      localStorage.setItem('courSchType', '資訊科')
    }
  }, [props.courSchType, courSchData])

  const [expDays, setExpDays] = useState(false)
  useEffect(() => {
    if (courSchData1 && courSchData2 && courSchData3) {
      setTimeout(() => {
        let daysCount = document.querySelector('#TableDiv').childElementCount
        if (daysCount > 6) {
          setExpDays(true)
        } else setExpDays(false)
        console.log('test')
      }, 250)
    }
  }, [props.courSchType, courSchData])

  const tableDivRef = useRef()
  const [csViewWidth, setCsViewWidth] = useState('600')
  useEffect(() => {
    setTimeout(() => {
      if (tableDivRef.current) {
        const width = tableDivRef.current.scrollWidth
        setCsViewWidth(width + 24)
      }
    }, 150)
  }, [courSchData, props.courSchType, courseScheduleDataInfoActive])

  // 頁面動畫
  const [pageTitleAni, setPageTitleAni] = useState(true)
  useEffect(() => {
    setPageTitleAni(false)
  }, [])

  const closePage = () => {
    setPageTitleAni(true)
    setTimeout(() => {
      props.navigateClick('/service')
    }, 500)
  }
  return (
    <>
      <Helmet>
        <title>班級資訊平台｜課程表</title>
        <meta name="description" content="班級的即時課程表" />
        <meta property="og:title" content="班級資訊平台｜課程表" />
        <meta property="og:description" content="班級的即時課程表" />
      </Helmet>
      <main
        id="courseSchedule"
        className={`${props.theme}${props.settingPage ? ' settingOpen' : ''}${
          pageTitleAni ? ' PTAni' : ''
        }`}>
        <div
          id="ctrlCourseScheduleInfo"
          className={`${courseScheduleDataInfoActive ? 'open' : ''}`}
          onClick={courseScheduleDataInfo}>
          {courseScheduleDataInfoActive ? (
            <FontAwesomeIcon
              icon="fa-solid fa-circle-xmark"
              style={{ marginRight: '6px' }}
            />
          ) : (
            <FontAwesomeIcon
              icon="fa-solid fa-circle-info"
              style={{ marginRight: '6px' }}
            />
          )}

          <span>詳細資訊</span>
        </div>
        <div className={`view tabs${pageTitleAni ? ' PTAni' : ''}`}>
          {courSchData ? (
            <>
              {/* 合併 */}
              <section
                id="CSView"
                style={{
                  maxWidth: csViewWidth,
                }}>
                {/* <h1>{courSchDisplay ? courSchDisplay.type : ''}</h1> */}
                {/* <div className="leftMask"></div> */}
                <div id="TableDiv" ref={tableDivRef}>
                  <div className="Table_Rows">
                    <div className="Table_TopTitle">　</div>
                    {LeftTitle.map((LeftTitle, k) => (
                      <div
                        className={`Table_LeftTitle ${
                          courseScheduleDataInfoActive ? 'open' : ''
                        }`}
                        key={k}>
                        {LeftTitle.LeftTitle}
                      </div>
                    ))}
                  </div>
                  {courSchData
                    .filter((subject) => subject.type === props.courSchType)
                    .map((subject) =>
                      subject.data.map((item) => (
                        <div
                          className={`Table_Rows ${
                            courseScheduleDataInfoActive ? 'open' : ''
                          }`}
                          key={item.Date}>
                          <div className="Table_TopTitle">{item.Date}</div>
                          {item.Course.map((course, courseIndex) => (
                            <div
                              className={`Table_Data${
                                courseScheduleDataInfoActive ? ' open' : ''
                              }${` ctnty${course.continuity}`}`}
                              key={`${course.class}${courseIndex}`}
                              onClick={
                                course.class.includes('段考')
                                  ? () => [
                                      props.navigateClick(
                                        '/service/examSchedule'
                                      ),
                                    ]
                                  : () => {}
                              }>
                              {course.class}
                              <span
                                className={`${
                                  courseScheduleDataInfoActive ? 'open' : ''
                                }`}>
                                {course.info_classroom}
                              </span>
                              <span
                                className={`${
                                  courseScheduleDataInfoActive ? 'open' : ''
                                }`}>
                                {course.info_teacher}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))
                    )}
                </div>
                {/* <div className="rightMask"></div> */}
              </section>
            </>
          ) : (
            <Loader />
            // <span className="loader"></span>
          )}
          <div
            id="Tips"
            style={{ display: props.TipsActive ? 'flex' : 'none' }}>
            <div>
              <span>課程表現已升級為雲端即時資訊！</span>
            </div>
            <div id="closeBtnView" onClick={props.Tips}>
              <div id="closeBtn">
                <div className="BtnLineL"></div>
                <div className="BtnLineR"></div>
              </div>
            </div>
          </div>
          {editPrmsn && (
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
          {editPrmsn && (
            <Editer
              title="課程表"
              content={
                <div className="editerView">
                  <div className="editTips">
                    <div className="tips">
                      <p>課程連續：2/3/AllDay</p>
                    </div>
                    <div className="tips">
                      <p>
                        調課：<span className="code"> classchange</span>
                      </p>
                    </div>
                    <div className="tips">
                      <p>
                        教室變動：<span className="code"> classroom</span>
                      </p>
                    </div>
                    <div className="tips">
                      <p>
                        假期：<span className="code"> Vacances</span>
                      </p>
                    </div>
                  </div>
                  {courSchData &&
                    courSchData.map((subject, subjectIndex) => (
                      <>
                        <h3>{subject.type}</h3>
                        <div key={subjectIndex}>
                          {subject.data.map((day, dayIndex) => (
                            <div key={dayIndex} className="daysView">
                              <h5>{day.Date}</h5>
                              <div>
                                {day.Course.map((course, courseIndex) => (
                                  <div
                                    // id={`${dayIndex}${courseIndex}`}
                                    className="editInputView"
                                    key={`${dayIndex}${courseIndex}`}>
                                    <div className="classCtrl">
                                      <div>
                                        <button
                                          title="向上移動一節"
                                          onClick={() =>
                                            moveUp(
                                              subjectIndex,
                                              dayIndex,
                                              courseIndex
                                            )
                                          }>
                                          <FontAwesomeIcon icon="fa-solid fa-angle-up" />
                                        </button>
                                        <button
                                          title="向下移動一節"
                                          onClick={() =>
                                            moveDown(
                                              subjectIndex,
                                              dayIndex,
                                              courseIndex
                                            )
                                          }>
                                          <FontAwesomeIcon icon="fa-solid fa-angle-down" />
                                        </button>
                                      </div>
                                      <button
                                        className="deleteBtn"
                                        title="刪除本節課"
                                        onClick={() =>
                                          deleteCourse(
                                            subjectIndex,
                                            dayIndex,
                                            courseIndex
                                          )
                                        }>
                                        <FontAwesomeIcon icon="fa-solid fa-circle-xmark" />
                                      </button>
                                    </div>
                                    <div className="editInput">
                                      <input
                                        type="text"
                                        value={course.class}
                                        onChange={(e) =>
                                          updateValue(
                                            subjectIndex,
                                            dayIndex,
                                            courseIndex,
                                            'class',
                                            e.target.value
                                          )
                                        }
                                        placeholder="課程名稱"
                                      />
                                      <input
                                        type="text"
                                        value={course.info_classroom}
                                        onChange={(e) =>
                                          updateValue(
                                            subjectIndex,
                                            dayIndex,
                                            courseIndex,
                                            'info_classroom',
                                            e.target.value
                                          )
                                        }
                                        placeholder="教室代號"
                                      />
                                      <input
                                        type="text"
                                        value={course.info_teacher}
                                        onChange={(e) =>
                                          updateValue(
                                            subjectIndex,
                                            dayIndex,
                                            courseIndex,
                                            'info_teacher',
                                            e.target.value
                                          )
                                        }
                                        placeholder="授課老師"
                                      />
                                      <input
                                        type="text"
                                        value={course.continuity}
                                        onChange={(e) =>
                                          updateValue(
                                            subjectIndex,
                                            dayIndex,
                                            courseIndex,
                                            'continuity',
                                            e.target.value
                                          )
                                        }
                                        placeholder="參數"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <button
                                className="addClassBtn"
                                onClick={() =>
                                  addCourse(subjectIndex, dayIndex)
                                }>
                                新增課程
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    ))}
                </div>
              }
              theme={props.theme}
              editView={editView}
              submitFunc={updateCourSch}
              btnContent="更新"
              btnColor="#16bb53a1"
              btnContentColor="#ffffffd5"
              resetBtn={
                <>
                  {editedActv && (
                    <button
                      className="resetSchData"
                      onClick={() => setGetCourseSch(false)}>
                      還原更改
                    </button>
                  )}
                  <button className="resetSchData" onClick={resetCourSch}>
                    週重置
                  </button>
                </>
              }
            />
          )}
        </div>
      </main>
    </>
  )
}

export default CourseSchedule
