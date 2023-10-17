import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// CSS
import "../App.scss"
// DataBase
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import {
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore"
// Widget
import PopupPage from "./PopupPage"
import PageTitle from "../widgets/PageTitle"
import Loader from "../widgets/Loader"
import PageCtrlModule from "../widgets/PageCtrlModule"
// firebase
import { AllowUserAuth } from "../firebase"

// 初始化
const firebaseConfig = {
  apiKey: "AIzaSyAevwFPxRd5Fi-UbeTHko_Uradt-hAeBSg",
  authDomain: "classdata-app.firebaseapp.com",
  projectId: "classdata-app",
  storageBucket: "classdata-app.appspot.com",
  messagingSenderId: "219989250207",
  appId: "1:219989250207:web:5cef212dc7e1496c6952aa",
}
const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore(app)

function Post(props) {
  // console.log(process.env.REACT_APP_ADMIN_ACCOUNT)

  const pubArticleAllowedUsers = [
    process.env.REACT_APP_19_POST,
    // process.env.REACT_APP_SCHOOL_USER1,
    process.env.REACT_APP_SCHOOL_USER2,
  ]
  const pubArticleLocalAdres = [
    process.env.REACT_APP_SCHOOL_EMAIL,
    process.env.REACT_APP_ADMIN_ADRES,
  ]

  const [user, setUser] = useState(null)
  const [userUID, setUserUID] = useState("")
  // 發佈公告權限
  const pubArticle = AllowUserAuth(
    pubArticleAllowedUsers,
    pubArticleLocalAdres,
    "發布公告權限"
  )
  const [pubArticleForm, setPubArticleForm] = useState(false)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return unsubscribe
  }, [])
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       // User is signed in
  //       setUserUID(user.uid)
  //       if (
  //         userUID === process.env.REACT_APP_ADMIN_ACCOUNT ||
  //         userUID === process.env.REACT_APP_19_POST
  //       ) {
  //         setPubArticle(true)
  //       } else setPubArticle(false)
  //     } else {
  //       // User is signed out
  //       setUserUID(false)
  //       setPubArticle(false)
  //     }
  //   })
  //   return unsubscribe
  // }, [user])

  const [articleTitle, setArticleTitle] = useState("")
  const [articleTime, setArticleTime] = useState("")
  const [articleContent, setArticleContent] = useState("")
  const [expiryDate, setExpiryDate] = useState("")

  // 發布公告
  const updatePubArticle = async (event) => {
    event.preventDefault()

    if (!expiryDate || !articleTitle || !articleContent) {
      alert("請將內容填寫完整")
      return
    }
    // 發布時間設定
    const date = new Date()
    // 統整發布內容
    const postData = {
      title: articleTitle,
      content: articleContent,
      time: date,
      expiryDate: expiryDate,
    }
    const postDatabaseRef = doc(db, "post", "postData")
    await updateDoc(postDatabaseRef, {
      data: arrayUnion(postData),
    })

    setArticleTitle("")
    setArticleTime("")
    setArticleContent("")
    setExpiryDate("")
    setPubArticleForm(false)
  }

  // 刪除公告
  const deleteArticle = async (title) => {
    if (window.confirm(`確定要刪除 "${title}" 公告嗎？\n此操作無法復原！`)) {
      const postDatabaseRef = doc(db, "post", "postData")
      const postData = await getDoc(postDatabaseRef)
      const postToDelete = postData
        .data()
        .data.find((post) => post.title === title)
      await updateDoc(postDatabaseRef, {
        data: arrayRemove(postToDelete),
      })
      console.log(`確認刪除 “${title}” 公告`)
    }
  }

  // 公告刪除示例
  const testDeleteArticle = async (title) => {
    if (
      window.confirm(
        `[這是一個示例]\n按下確定後就會立即刪除該公告！\n且此操作無法復原！`
      )
    ) {
      console.log(`模擬確認刪除 “該公告標題” 公告`)
    }
  }

  // 編輯公告內容
  const [editActive, setEditActive] = useState(false)
  const [postToEdit, setPostToEdit] = useState()
  const editArticle = async (title) => {
    const postDatabaseRef = doc(db, "post", "postData")
    const postData = await getDoc(postDatabaseRef)
    const post = postData.data().data.find((post) => post.title === title)
    setPostToEdit(post)

    // 將文章內容顯示在輸入框中
    setArticleTitle(post.title)
    setArticleContent(post.content)
    setExpiryDate(post.expiryDate)
    setArticleTime(post.time)
    setEditActive(true)
    setPubArticleForm(true)
  }

  // 更新文章
  const updateArticle = async () => {
    const postRef = doc(db, "post", "postData")
    const postData = await getDoc(postRef)
    const updatedPosts = postData.data().data.map((post) => {
      if (post.title === postToEdit.title) {
        return {
          ...post,
          title: articleTitle,
          content: articleContent,
          expiryDate: expiryDate,
          time: articleTime,
        }
      }
      return post
    })
    await updateDoc(postRef, { data: updatedPosts })
    setArticleTitle("")
    setArticleTime("")
    setArticleContent("")
    setExpiryDate("")
    setPubArticleForm(false)
    setEditActive(false)
  }

  // 關閉編輯器
  const closeEditer = () => {
    setArticleTitle("")
    setArticleTime("")
    setArticleContent("")
    setExpiryDate("")
    setEditActive(false)
    setPubArticleForm(false)
  }

  // 內容獲取
  const [getPostData, setGetPostData] = useState(null)
  useEffect(() => {
    // 獲取資料
    const postDatabaseRef = doc(db, "post", "postData")
    const unsubscribe = onSnapshot(postDatabaseRef, (doc) => {
      const data = doc.data()
      setGetPostData(data)
      props.setPostNoti(Object.keys(data.data).length)
      localStorage.setItem("postNoti", Object.keys(data.data).length)
    })

    return () => unsubscribe()
  }, [props])

  // 時間格式化
  const setDate = (date) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    }
    let formattedDate = date
      .toLocaleDateString("zh-TW", options)
      .replaceAll("/", ".")
    formattedDate = formattedDate.replace("（", " ").replace("）", "")
    return formattedDate
  }

  // 頁面動畫
  const [pageTitleAni, setPageTitleAni] = useState(true)
  useEffect(() => {
    setPageTitleAni(false)
  }, [])
  return (
    <>
      <main
        id="post"
        className={`${props.theme}${props.settingPage ? " settingOpen" : ""}`}>
        <Helmet>
          <title>班級資訊平台｜公告</title>
          <meta name="description" content="學校、班級的公告事項" />
          <meta property="og:title" content="班級資訊平台｜公告" />
          <meta property="og:description" content="學校、班級的公告事項" />
        </Helmet>
        <div className={`view${pageTitleAni ? " PTAni" : ""}`}>
          <div id="post-view">
            <div id="post-view-content">
              {getPostData ? (
                <>
                  <h1>校務公告</h1>
                  <section className="post-block">
                    {getPostData &&
                      [...getPostData.data].reverse().map((item, index) => {
                        const isExpired =
                          new Date(item.expiryDate) <=
                          new Date(new Date().setHours(0, 0, 0, 0))
                        return (
                          <div
                            key={index}
                            className={`post-post ${isExpired ? "exp" : ""}`}>
                            <h5>
                              {setDate(new Date(item.time.seconds * 1000))}
                            </h5>
                            <h1>{item.title}</h1>
                            {item.content.split("\n").map((line, index) => (
                              <p key={index}>{line}</p>
                            ))}
                            {pubArticle ? (
                              <>
                                <button
                                  className="deleteArticleBtn"
                                  onClick={() => deleteArticle(item.title)}
                                  title="刪除">
                                  <FontAwesomeIcon icon="fa-solid fa-trash" />
                                </button>
                                <button
                                  className="editArticleBtn"
                                  onClick={() => editArticle(item.title)}
                                  title="編輯">
                                  <FontAwesomeIcon
                                    icon="fa-solid fa-pen"
                                    style={{
                                      marginLeft: "-3px",
                                      marginRight: "6px",
                                    }}
                                  />
                                  編輯
                                </button>
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                        )
                      })}
                  </section>
                </>
              ) : (
                <Loader />
              )}
            </div>
          </div>

          {/* {pubArticle && (
            <PubArticle
              pubArticleForm={pubArticleForm}
              setPubArticleForm={setPubArticleForm}
              closeEditer={closeEditer}
              articleTitle={articleTitle}
              setArticleTitle={setArticleTitle}
              articleTime={articleTime}
              setArticleTime={setArticleTime}
              articleContent={articleContent}
              setArticleContent={setArticleContent}
              updatePubArticle={updatePubArticle}
              setExpiryDate={setExpiryDate}
              expiryDate={expiryDate}
              theme={props.theme}
              editActive={editActive}
              editArticle={editArticle}
              updateArticle={updateArticle}
            />
          )} */}
        </div>
        <PageCtrlModule
          Btns={[
            {
              type: "button",
              prmsn: pubArticle,
              content: "發佈公告",
              click: () => setPubArticleForm(true),
              icon: (
                <FontAwesomeIcon
                  icon="fa-solid fa-pen-to-square"
                  style={{ marginRight: "6px" }}
                />
              ),
            },
          ]}
        />
        {pubArticleForm && (
          <PopupPage
            title="發佈公告"
            closeClick={() => closeEditer()}
            element={
              <PubArticle
                pubArticleForm={pubArticleForm}
                setPubArticleForm={setPubArticleForm}
                articleTitle={articleTitle}
                setArticleTitle={setArticleTitle}
                articleTime={articleTime}
                setArticleTime={setArticleTime}
                articleContent={articleContent}
                setArticleContent={setArticleContent}
                updatePubArticle={updatePubArticle}
                setExpiryDate={setExpiryDate}
                expiryDate={expiryDate}
                theme={props.theme}
                editActive={editActive}
                editArticle={editArticle}
                updateArticle={updateArticle}
              />
            }
          />
        )}
      </main>
    </>
  )
}

function PubArticle(props) {
  return (
    <>
      <div
        id="pubArticle"
        className={`${props.theme} ${props.pubArticleForm ? "open" : ""}`}>
        {/* <div
          id="closePubArticle"
          className={`${props.pubArticleForm ? "open" : ""}`}
          onClick={props.closeEditer}>
          <FontAwesomeIcon icon="fa-solid fa-xmark" />
        </div> */}
        <div
          id="submitPost"
          className={`${props.pubArticleForm ? "open" : ""}`}
          onClick={
            props.editActive ? props.updateArticle : props.updatePubArticle
          }>
          {props.editActive ? (
            <FontAwesomeIcon
              icon="fa-solid fa-pen"
              style={{ marginRight: "9px" }}
            />
          ) : (
            <FontAwesomeIcon
              icon="fa-solid fa-paper-plane"
              style={{ marginRight: "9px" }}
            />
          )}
          <span>{props.editActive ? "修改" : "發布"}</span>
        </div>
        <div className="pubArticleView">
          <div className="title">
            <input
              type="text"
              placeholder="標題"
              value={props.articleTitle}
              onChange={(e) => props.setArticleTitle(e.target.value)}
            />
          </div>
          <div className="expiryDate">
            <span>公告期限</span>
            <input
              type="date"
              value={props.expiryDate}
              onChange={(e) => props.setExpiryDate(e.target.value)}
            />
          </div>
          <div className="content">
            <textarea
              name="articleContent"
              id=""
              placeholder="請說明公告的詳細內容"
              value={props.articleContent}
              onChange={(e) =>
                props.setArticleContent(e.target.value)
              }></textarea>
          </div>
        </div>
      </div>
    </>
  )
}

export default Post
