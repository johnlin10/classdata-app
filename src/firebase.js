
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

export default function AdminUserAuth (props) {
  const [user, setUser] = useState(null)
  const [updateVersion, setUserPrmsn] = useState(false)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return unsubscribe
  }, [])
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(`User signed in with uid: ${userUID}`)
        if (user.uid === process.env.REACT_APP_ADMIN_ACCOUNT) {
          setUserPrmsn(true)
        }
      } else {
        console.log('User signed out')
        setUserPrmsn(false)
      }
    })
    return unsubscribe
  }, [user])
  return updateVersion
}