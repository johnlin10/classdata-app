/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { debounce } from "lodash";

import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAevwFPxRd5Fi-UbeTHko_Uradt-hAeBSg",
  authDomain: "classdata-app.firebaseapp.com",
  projectId: "classdata-app",
  storageBucket: "classdata-app.appspot.com",
  messagingSenderId: "219989250207",
  appId: "1:219989250207:web:5cef212dc7e1496c6952aa",
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();

export function AllowUserAuth(allowedUsers, localAdres, certificationType) {
  const [userPermit, setUserPermit] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(`已登入。`);
        const emailParts = user.email.split("@");
        const emailStart = emailParts[0];
        const emailDomain = emailParts[1];
        // console.log(allowedUsers.some(allowedUsers => emailStart.startsWith(allowedUsers)))
        // console.log(localAdres.includes(emailDomain))
        if (
          (emailStart ===
            (process.env.REACT_APP_ADMIN || process.env.REACT_APP_SYSEM) &&
            emailDomain === process.env.REACT_APP_ADMIN_ADRES) ||
          (allowedUsers.some((allowedUsers) =>
            emailStart.startsWith(allowedUsers)
          ) &&
            localAdres.includes(emailDomain))
        ) {
          setUserPermit(true);
        }
      } else {
        console.log("未登入");
        setUserPermit(false);
      }
    });
    return unsubscribe;
  }, [allowedUsers, localAdres]);

  return userPermit;
}

/**
 * 獲取Firestore文檔或集合的內容
 * @param {string} path - 合集或文檔的路徑
 * @returns {Array} - 合集中的文檔 或 文檔中的內容
 * @example
 * await getFirestoreData('my-doc-path')
 */
export const getFirestoreData = async (path) => {
  // 嘗試作為文檔路徑獲取數據
  const docRef = doc(db, path);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // 如果是文檔，返回文檔的內容
    return docSnap.data();
  } else {
    // 如果不是文檔，嘗試作為集合路徑獲取數據
    const colRef = collection(db, path);
    const querySnapshot = await getDocs(colRef);

    // 返回集合中所有文檔的內容
    return querySnapshot.docs.map((doc) => doc.data());
  }
};

/**
 * 將內容存入或更新某個文檔中
 * @param {string} path - 文檔路徑
 * @param {Array} data - 欲存入的內容
 * @param {boolean} [overwrite] - 是否覆蓋
 * @example
 * // 覆蓋文檔的內容
 * await writeFirestoreDoc('my-doc', { name: 'John', age: 30 }, true);
 * // 更新文檔的部分內容
 * await writeFirestoreDoc('my-doc', { age: 31 }, false);
 */
export const writeFirestoreDoc = debounce(
  async (path, data, overwrite = false) => {
    const docRef = doc(db, path);
    // 使用 getDoc 檢查文檔是否存在
    const docSnapshot = await getDoc(docRef);
    if (overwrite || !docSnapshot.exists()) {
      // 如果overwrite為true，覆蓋文檔的內容
      await setDoc(docRef, data);
    } else {
      // 如果overwrite為false，更新文檔的部分內容
      await updateDoc(docRef, data);
    }
  },
  500
); // 在這裡設定節流的時間，例如 1000 毫秒 (1 秒)
