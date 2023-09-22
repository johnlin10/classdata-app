// react
import { useEffect, useState } from 'react'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import './firebaseTest.css'

function FireStore() {
  // 資料處理 \n 自動換行
  const formatContent = (content) => {
    return content.split('\n').map((line, index) => <p key={index}>{line}</p>)
  }

  const [newVersion, setNewVersion] = useState(null)
  const [lastVersion, setLastVersion] = useState(null)

  useEffect(() => {
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

    // 測試
    const lastVersionDocRef = doc(db, 'lastVersion', 'lastVersion')
    const unsubscribe = onSnapshot(lastVersionDocRef, (doc) => {
      const data = doc.data()
      setLastVersion(data)
    })

    return () => unsubscribe()
  }, [])

  return (
    <>
      {/* <div className="firebaseTest">
        {lastVersion &&
          Object.keys(lastVersion)
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
            .map((key) => (
              <div className="lastUpdateView" key={key}>
                <h1>{lastVersion[key].version}</h1>
                <p>{lastVersion[key].date}</p>
                {formatContent(lastVersion[key].content)}
              </div>
            ))}
      </div> */}
    </>
  )
}

export default FireStore
