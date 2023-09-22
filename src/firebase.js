import React, { useEffect, useState } from 'react'
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

const firebaseConfig = {
  apiKey: "AIzaSyAevwFPxRd5Fi-UbeTHko_Uradt-hAeBSg",
  authDomain: "classdata-app.firebaseapp.com",
  projectId: "classdata-app",
  storageBucket: "classdata-app.appspot.com",
  messagingSenderId: "219989250207",
  appId: "1:219989250207:web:5cef212dc7e1496c6952aa"
}
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth()

export function AllowUserAuth (allowedUsers, localAdres, certificationType) {
  const [userPermit, setUserPermit] = useState(false)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(`已登入。`)
        const emailParts = user.email.split('@')
        const emailStart = emailParts[0]
        const emailDomain = emailParts[1]
        // console.log(allowedUsers.some(allowedUsers => emailStart.startsWith(allowedUsers)))
        // console.log(localAdres.includes(emailDomain))
        if ((emailStart === (process.env.REACT_APP_ADMIN || REACT_APP_SYSEM) && emailDomain === process.env.REACT_APP_ADMIN_ADRES) || allowedUsers.some(allowedUsers => emailStart.startsWith(allowedUsers)) && localAdres.includes(emailDomain)) {
          setUserPermit(true)
          console.log(`【${certificationType}】\n` + `此為認證帳號 [${user.email}]\n\n` + `> 管理員認證：${(emailStart === (process.env.REACT_APP_ADMIN || REACT_APP_SYSEM) && emailDomain === process.env.REACT_APP_ADMIN_ADRES) ? '已認證' : '未認證'}\n` + `> Email網域認證：${localAdres.includes(emailDomain) ? '已認證' : '未認證'}`)
        } else {
          console.log(`未認證帳號: ${user.email}`)
          if (!localAdres.includes(emailDomain)) {
            console.log('已授權的電子郵件網域' + emailDomain)
          }
        }
      } else {
        console.log('未登入')
        setUserPermit(false)
      }
    })
    return unsubscribe
  }, [])
  return userPermit
}