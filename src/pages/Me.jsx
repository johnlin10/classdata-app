import React, { useEffect, useState } from 'react'
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
const auth = getAuth(app)
const db = getFirestore(app)
const provider = new GoogleAuthProvider()
// const user = auth.currentUser

function Me(props) {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      const uid = user.uid
      const displayName = user.displayName
      const email = user.email
      const photoURL = user.photoURL
      const emailVerified = user.emailVerified
    } else {
      // User is signed out
      // ...
    }
  })

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
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
        // 將用戶資料寫入 Firestore 中，並使用 'merge' 選項避免覆蓋
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
        setUser(user)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        const email = error.email
        const credential = GoogleAuthProvider.credentialFromError(error)
        // ...
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
      // alert('登出成功')
    } catch (error) {
      // Handle error
      console.log(error)
    }
  }

  return (
    <main
      id="User"
      className={`${props.theme}${props.theme && props.settingPage ? ' ' : ''}${
        props.settingPage ? 'settingOpen' : ''
      }`}>
      <div id="meView">
        <div id="meContent">
          {error && <p>{error}</p>}
          {/* <h2>登入</h2>
          <form onSubmit={handleSignIn}>
            <label>
              電子郵件地址：
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <br />
            <label>
              密碼：
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">登入</button>
          </form>
          <h2>註冊新帳戶</h2>
          <form onSubmit={handleSignUp}>
            <label>
              電子郵件地址：
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <br />
            <label>
              密碼：
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">註冊</button>
          </form> */}
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
    </main>
  )
}

export default Me
