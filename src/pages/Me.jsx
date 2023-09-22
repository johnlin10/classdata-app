import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import firebase from 'firebase/app'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import './css/signInUp.css'

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
const provider = new GoogleAuthProvider()
// const user = auth.currentUser

function Me(props) {
  const [pageTitleAni, setPageTitleAni] = useState(true)
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  // 頁面動畫
  useEffect(() => {
    setPageTitleAni(false)
  }, [])

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // 用戶唯一值
      const uid = user.uid
      // 用戶名
      const displayName = user.displayName
      // Email
      const email = user.email
      // 用戶頭像
      const photoURL = user.photoURL
    }
  })

  // 監聽器
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // 暫存用戶資料
      setUser(user)
    })
    return unsubscribe
  }, [])

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken
        const user = result.user
        // 將用戶資料寫入 Firestore 中
        setDoc(
          doc(db, 'user', user.email),
          {
            email: user.email,
            name: user.displayName,
            headSticker: user.photoURL,
            uid: user.uid,
          },
          { merge: true }
        )
        // 暫存用戶資料
        setUser(user)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        const email = error.email
        const credential = GoogleAuthProvider.credentialFromError(error)
      })
  }

  //updateDoc

  // 上傳用戶基本資料
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDataRef = doc(db, 'user', user.email)
        const userDataSnapshot = await getDoc(userDataRef)
        if (userDataSnapshot.exists()) {
          await updateDoc(userDataRef, {
            email: user.email,
            name: user.displayName,
            headSticker: user.photoURL,
            uid: user.uid,
          })
        } else {
          await setDoc(userDataRef, {
            email: user.email,
            name: user.displayName,
            headSticker: user.photoURL,
            uid: user.uid,
          })
        }
      }
    })
    return unsubscribe
  }, [user])

  const handleSignIn = async (event) => {
    event.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      setUser(user)
    } catch (error) {
      // Handle error
    }
  }

  const handleSignUp = async (event) => {
    event.preventDefault()
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      setUser(user)
    } catch (error) {
      // Handle error
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main
      id="User"
      className={`${props.theme}${props.theme && props.settingPage ? ' ' : ''}${
        props.settingPage ? 'settingOpen' : ''
      }`}>
      <Helmet>
        <title>班級資訊平台｜用戶{user ? `・${user.displayName}` : ''}</title>
        <meta name="description" content="本網站的用戶管理頁面" />
        <meta
          property="og:title"
          content={`班級資訊平台｜用戶${user ? `・${user.displayName}` : ''}`}
        />
        <meta property="og:description" content="本網站的用戶管理頁面" />
      </Helmet>

      <div className={`view${pageTitleAni ? ' PTAni' : ''}`}>
        <div id="meView">
          <div id="meContent">
            {error && <p>{error}</p>}
            <div className="user">
              {user ? (
                <>
                  <div className="userInfo">
                    <img className="userIMG" src={user.photoURL}></img>
                    <p className="userName">{user.displayName}</p>
                    <p className="userEmail">{user.email}</p>
                  </div>
                  <button id="SignOutBtn" onClick={handleSignOut}>
                    登出
                  </button>
                </>
              ) : (
                <>
                  <div className="userInfo">
                    <img
                      className="userIMG"
                      src={`${process.env.PUBLIC_URL}/images/icons/user.png`}></img>
                    <p className="userName not">尚未登入</p>
                  </div>
                  <button id="googleSignBtn" onClick={handleGoogleSignIn}>
                    <FontAwesomeIcon icon="fa-brands fa-google" />
                    使用 Google 登入
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Me
