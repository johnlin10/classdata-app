// React
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Navigate, Route, Routes, Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
// CSS
import "../App.scss";
import css from "./css/Chats.module.scss";

// Widget
import PageTitle from "../widgets/PageTitle";

// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
} from "firebase/firestore";
import { db, auth } from "../firebase";

export default function Chats(props) {
  const [themeColor, setThemeColor] = useState([
    "#50c477",
    "#fffffff1",
    "#50c477",
    "#fffffff1",
  ]);

  // 頁面動畫
  const [pageTitleAni, setPageTitleAni] = useState(true);
  useEffect(() => {
    setPageTitleAni(false);
  }, []);

  const schoolUsers = [
    process.env.REACT_APP_SCHOOL_USER1,
    process.env.REACT_APP_SCHOOL_USER2,
    process.env.REACT_APP_SCHOOL_USER3,
  ];
  const adminUsers = [process.env.REACT_APP_ADMIN, process.env.REACT_APP_SYSEM];
  const otherUsers = [process.env.REACT_APP_CHAT_01];
  // 用戶登入資訊
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const [isSchoolUser, setIsSchoolUser] = useState(false);
  useEffect(() => {
    setIsSchoolUser();
  }, [user]);

  //
  const [schoolUserList, setSchoolUserList] = useState([]);
  useEffect(() => {
    // 获取数据
    const chatGroupDataRef = collection(db, "user");
    const unsubscribe = onSnapshot(chatGroupDataRef, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (
          (schoolUsers.some((user) => data.email.startsWith(user)) &&
            data.email.endsWith(process.env.REACT_APP_SCHOOL_EMAIL)) ||
          adminUsers.some((user) => data.email.startsWith(user))
        ) {
          users.push(data);
        }
      });
      setSchoolUserList(users);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Helmet>
        <title>班級資訊平台｜聊天</title>
        <meta name="description" content="提供學校內部交流的管道" />
        <meta property="og:title" content="班級資訊平台｜聊天" />
        <meta property="og:description" content="提供學校內部交流的管道" />
      </Helmet>
      <main
        className={`${css.main}${` ${props.theme}`}${
          props.theme && props.settingPage ? " " : ""
        }${props.settingPage ? "settingOpen" : ""}`}>
        <div className={`view${pageTitleAni ? " PTAni" : ""}`}>
          <h3>群組</h3>
          <section>
            <div className={css.chatlist_block}>
              <div>
                <p onClick={() => props.navigateClick("/chats/chat-group")}>
                  公共討論區
                </p>
              </div>
            </div>
          </section>
          <h3>學校</h3>
          {/* <section>
            {schoolUserList.map((list) => (
              <div className={css.chatlist_block}>
                <div>
                  <p>{list.name}</p>
                </div>
              </div>
            ))}
          </section> */}
          <h3>私人</h3>
          {/* <section>
            <div className={css.chatlist_block}>
              <div>
                <p>私人用戶</p>
              </div>
            </div>
            <div className={css.chatlist_block}>
              <div>
                <p>私人用戶</p>
              </div>
            </div>
            <div className={css.chatlist_block}>
              <div>
                <p>私人用戶</p>
              </div>
            </div>
            <div className={css.chatlist_block}>
              <div>
                <p>私人用戶</p>
              </div>
            </div>
            <div className={css.chatlist_block}>
              <div>
                <p>私人用戶</p>
              </div>
            </div>
          </section> */}
        </div>
      </main>
      <Outlet />
    </>
  );
}
