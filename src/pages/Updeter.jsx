// react
import { useEffect, useState } from "react";
// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import "./css/updater.scss";

const firebaseConfig = {
  apiKey: "AIzaSyAevwFPxRd5Fi-UbeTHko_Uradt-hAeBSg",
  authDomain: "classdata-app.firebaseapp.com",
  projectId: "classdata-app",
  storageBucket: "classdata-app.appspot.com",
  messagingSenderId: "219989250207",
  appId: "1:219989250207:web:5cef212dc7e1496c6952aa",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Updater(props) {
  const [version, setVersion] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  // 數據
  const handleVersionChange = (event) => {
    const value = event.target.value;
    const isValid = /^[\d.]*$/.test(value);
    if (isValid) {
      setVersion(value);
    }
  };
  const handleDateChange = (event) => {
    let value = event.target.value;
    if (value.length === 1) {
      value = "2023" + value;
    }
    const isValid = /^2023[\d.]*$/.test(value);
    if (isValid && value.length <= 8) {
      setDate(value);
    }
  };
  const handleContentChange = (event) => {
    let value = event.target.value;
    const selectionStart = event.target.selectionStart;
    const lines = value.split("\n");
    let newCursorPos = selectionStart;
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].startsWith("・")) {
        lines[i] = "・" + lines[i];
        if (
          selectionStart > value.indexOf("\n", newCursorPos) &&
          value.indexOf("\n", newCursorPos) !== -1
        ) {
          newCursorPos += 1;
        }
      }
    }
    value = lines.join("\n");
    setContent(value);
    event.target.selectionStart = event.target.selectionEnd = newCursorPos;

    // let value = event.target.value
    // const lines = value.split('\n')
    // for (let i = 0; i < lines.length; i++) {
    //   if (!lines[i].startsWith('・')) {
    //     lines[i] = '・' + lines[i]
    //   }
    // }
    // value = lines.join('\n')
    // setContent(value)
  };

  const updateVrsn = async (event) => {
    event.preventDefault();
    const updateVersion = version.replace(".", "-");

    const newVersionDocRef = doc(db, "newVersion", "newVersion");
    const lastVersionDocRef = doc(db, "lastVersion", "lastVersion");
    const updateNewVersion = {
      [updateVersion]: {
        version: version,
        date: date,
        content: content,
      },
    };
    const newVersionDocSnap = await getDoc(newVersionDocRef);
    if (newVersionDocSnap.exists()) {
      await setDoc(lastVersionDocRef, newVersionDocSnap.data(), {
        merge: true,
      });
    }
    // 更新數據庫
    await setDoc(newVersionDocRef, updateNewVersion);

    // 清空表單
    setVersion("");
    setDate("");
    setContent("");
  };

  const updateLstVrsn = async (event) => {
    event.preventDefault();
    const updateVersion = version.replace(".", "-");
    const lastVersionDocRef = doc(db, "lastVersion", "lastVersion");
    const updateLastVersion = {
      [updateVersion]: {
        version: version,
        date: date,
        content: content,
      },
    };

    // 更新數據庫
    await setDoc(lastVersionDocRef, updateLastVersion, { merge: true });
    console.log("handleBtn");

    // 清空表單
    setVersion("");
    setDate("");
    setContent("");
  };

  // [資訊科] 輸入框更新
  const [courSchData1, setCourSchData1] = useState([]);
  const handleCourSchChange1 = (event) => {
    let value = event.target.value;
    setCourSchData1(value);
  };
  // [電子科] 輸入框更新
  const [courSchData2, setCourSchData2] = useState([]);
  const handleCourSchChange2 = (event) => {
    let value = event.target.value;
    setCourSchData2(value);
  };
  // [資訊科] 輸入框更新
  const [courSchData3, setCourSchData3] = useState([]);
  const handleCourSchChange3 = (event) => {
    let value = event.target.value;
    setCourSchData3(value);
  };

  // [資訊科] 取得課程表內容，填充到輸入框
  const [getCourSchCount1, setGetCourSchCount1] = useState(false);
  if (!getCourSchCount1) {
    const courSchDocRef = doc(db, "courseSchedule", "courseSchedule1"); // 資訊科
    onSnapshot(courSchDocRef, (doc) => {
      const data = doc.data();
      setCourSchData1(JSON.stringify(data, null, 1));
    });
    setGetCourSchCount1(true);
  }
  // [電子科] 取得課程表內容，填充到輸入框
  const [getCourSchCount2, setGetCourSchCount2] = useState(false);
  if (!getCourSchCount2) {
    const courSchDocRef = doc(db, "courseSchedule", "courseSchedule2"); // 電子科
    onSnapshot(courSchDocRef, (doc) => {
      const data = doc.data();
      setCourSchData2(JSON.stringify(data, null, 1));
    });
    setGetCourSchCount2(true);
  }
  // [電機科] 取得課程表內容，填充到輸入框
  const [getCourSchCount3, setGetCourSchCount3] = useState(false);
  if (!getCourSchCount3) {
    const courSchDocRef = doc(db, "courseSchedule", "courseSchedule3"); // 電機科
    onSnapshot(courSchDocRef, (doc) => {
      const data = doc.data();
      setCourSchData3(JSON.stringify(data, null, 1));
    });
    setGetCourSchCount3(true);
  }

  // 更新課程表
  const updateCourSch = async (event) => {
    event.preventDefault();

    // 資訊科
    const courseSchDocRef1 = doc(db, "courseSchedule", "courseSchedule1");
    await setDoc(courseSchDocRef1, JSON.parse(courSchData1), { merge: true });
    setGetCourSchCount1(false);
    // 電子科
    const courseSchDocRef2 = doc(db, "courseSchedule", "courseSchedule2");
    await setDoc(courseSchDocRef2, JSON.parse(courSchData2), { merge: true });
    setGetCourSchCount2(false);
    // 電機科
    const courseSchDocRef3 = doc(db, "courseSchedule", "courseSchedule3");
    await setDoc(courseSchDocRef3, JSON.parse(courSchData3), { merge: true });
    setGetCourSchCount3(false);
  };

  // 課程表一鍵重置
  const resetCourSchDefault = async (event) => {
    event.preventDefault();

    // 資訊科
    const courseSchDocRef1 = doc(db, "courseSchedule", "courseSchedule1");
    const resetCourSchData1 = {
      data: [
        {
          Course: [
            {
              info_classroom: "501",
              continuity: "",
              class: "化學",
              info_teacher: "陳永富",
            },
            {
              continuity: "2",
              info_teacher: "黃芳瑩",
              class: "微處理機",
              info_classroom: "531",
            },
            {
              class: "數位音樂",
              info_teacher: "林郁珊",
              continuity: "",
              info_classroom: "353",
            },
            {
              info_classroom: "501",
              class: "數學",
              info_teacher: "成志樵",
              continuity: "",
            },
            {
              info_classroom: "501",
              class: "英語文",
              info_teacher: "徐玉雪",
              continuity: "2",
            },
            {
              info_classroom: "501",
              continuity: "",
              info_teacher: "鄭雅華",
              class: "共學共好",
            },
          ],
          Date: "星期一",
        },
        {
          Date: "星期二",
          Course: [
            {
              info_classroom: "583",
              info_teacher: "周嘉慧",
              class: "地理",
              continuity: "",
              active: "classroom",
            },
            {
              continuity: "3",
              class: "單晶片微處理機實習",
              info_classroom: "587",
              info_teacher: "葉憲民",
            },
            {
              info_teacher: "黃釧泉",
              info_classroom: "482",
              continuity: "3",
              class: "電腦硬體裝修實習",
            },
            {
              continuity: "",
              class: "共學共好",
              info_teacher: "鄭雅華",
              info_classroom: "501",
            },
          ],
        },
        {
          Date: "星期三",
          Course: [
            {
              continuity: "",
              info_classroom: "586",
              class: "多元選修",
              info_teacher: "林怡欣",
              active: "classroom",
            },
            {
              info_teacher: "成志樵",
              class: "數學",
              info_classroom: "386",
              continuity: "2",
              active: "classroom",
            },
            {
              info_classroom: "485",
              class: "微處理機",
              continuity: "",
              info_teacher: "黃芳瑩",
              active: "classroom",
            },
            {
              class: "體育",
              info_teacher: "林泱妗",
              continuity: "",
              info_classroom: "",
            },
            {
              class: "電路學",
              info_classroom: "485",
              continuity: "2",
              info_teacher: "黃芳瑩",
              active: "classroom",
            },
            {
              info_classroom: "501",
              class: "共學共好",
              continuity: "",
              info_teacher: "鄭雅華",
            },
          ],
        },
        {
          Course: [
            {
              info_teacher: "成志樵",
              info_classroom: "581",
              continuity: "3",
              class: "電子學實習",
            },
            {
              class: "體育",
              continuity: "",
              info_classroom: "",
              info_teacher: "林泱妗",
            },
            {
              info_teacher: "葉憲民",
              class: "電子學",
              continuity: "",
              info_classroom: "501",
            },
            {
              class: "國語文",
              continuity: "2",
              info_teacher: "鄭雅華",
              info_classroom: "501",
            },
            {
              continuity: "",
              info_classroom: "501",
              class: "共學共好",
              info_teacher: "鄭雅華",
            },
          ],
          Date: "星期四",
        },
        {
          Date: "星期五",
          Course: [
            {
              continuity: "",
              info_teacher: "",
              info_classroom: "",
              class: "班/週會",
            },
            {
              info_teacher: "",
              class: "聯課活動",
              info_classroom: "",
              continuity: "2",
            },
            {
              class: "彈性課程",
              info_classroom: "501",
              info_teacher: "鄭雅華",
              continuity: "1",
            },
            {
              class: "國語文",
              info_classroom: "501",
              continuity: "",
              info_teacher: "鄭雅華",
            },
            {
              info_classroom: "501",
              class: "電子學",
              continuity: "2",
              info_teacher: "葉憲民",
            },
            {
              info_classroom: "501",
              info_teacher: "鄭雅華",
              continuity: "",
              class: "共學共好",
            },
          ],
        },
      ],
      type: "資訊科",
    };
    // 電子科
    const courseSchDocRef2 = doc(db, "courseSchedule", "courseSchedule2");
    const resetCourSchData2 = {
      type: "電子科",
      data: [
        {
          Course: [
            {
              class: "化學",
              info_teacher: "陳永富",
              info_classroom: "501",
            },
            {
              info_teacher: "黃芳瑩",
              class: "微處理機",
              continuity: "2",
              info_classroom: "531",
            },
            {
              class: "數位音樂",
              info_teacher: "林郁珊",
              info_classroom: "353",
            },
            {
              class: "數學",
              info_teacher: "成志樵",
              info_classroom: "501",
            },
            {
              info_classroom: "501",
              info_teacher: "徐玉雪",
              continuity: "2",
              class: "英語文",
            },
            {
              class: "共學共好",
              info_classroom: "501",
              info_teacher: "鄭雅華",
            },
          ],
          Date: "星期一",
        },
        {
          Date: "星期二",
          Course: [
            {
              info_classroom: "583",
              info_teacher: "周嘉慧",
              class: "地理",
              active: "classroom",
            },
            {
              continuity: "3",
              class: "單晶片微處理機實習",
              info_classroom: "587",
              info_teacher: "葉憲民",
            },
            {
              info_classroom: "482",
              info_teacher: "黃釧泉",
              continuity: "3",
              class: "感測器實習",
            },
            {
              info_teacher: "鄭雅華",
              class: "共學共好",
              info_classroom: "501",
            },
          ],
        },
        {
          Course: [
            {
              class: "多元選修",
              info_classroom: "486/488",
              info_teacher: "林怡欣/徐玉雪",
              active: "classroom",
            },
            {
              class: "數學",
              info_classroom: "386",
              continuity: "2",
              info_teacher: "成志樵",
              active: "classroom",
            },
            {
              info_classroom: "485",
              info_teacher: "黃芳瑩",
              class: "微處理機",
              active: "classroom",
            },
            {
              continuity: "",
              info_teacher: "林泱妗",
              class: "體育",
              info_classroom: "",
            },
            {
              info_classroom: "485",
              continuity: "2",
              class: "電路學",
              info_teacher: "黃芳瑩",
              active: "classroom",
            },
            {
              class: "共學共好",
              info_classroom: "501",
              info_teacher: "鄭雅華",
            },
          ],
          Date: "星期三",
        },
        {
          Date: "星期四",
          Course: [
            {
              info_teacher: "成志樵",
              class: "電子學實習",
              continuity: "3",
              info_classroom: "581",
            },
            {
              continuity: "",
              info_classroom: "",
              class: "體育",
              info_teacher: "林泱妗",
            },
            {
              info_teacher: "葉憲民",
              class: "電子學",
              info_classroom: "501",
              continuity: "",
            },
            {
              info_teacher: "鄭雅華",
              class: "國語文",
              continuity: "2",
              info_classroom: "501",
            },
            {
              info_teacher: "鄭雅華",
              class: "共學共好",
              info_classroom: "501",
              continuity: "",
            },
          ],
        },
        {
          Course: [
            {
              info_classroom: "",
              continuity: "",
              class: "班/週會",
              info_teacher: "",
            },
            {
              info_classroom: "",
              class: "聯課活動",
              continuity: "2",
              info_teacher: "",
            },
            {
              info_teacher: "鄭雅華",
              continuity: "1",
              info_classroom: "501",
              class: "彈性課程",
            },
            {
              continuity: "",
              info_classroom: "501",
              class: "國語文",
              info_teacher: "鄭雅華",
            },
            {
              info_teacher: "葉憲民",
              continuity: "2",
              info_classroom: "501",
              class: "電子學",
            },
            {
              continuity: "",
              info_classroom: "501",
              class: "共學共好",
              info_teacher: "鄭雅華",
            },
          ],
          Date: "星期五",
        },
      ],
    };
    // 電機科
    const courseSchDocRef3 = doc(db, "courseSchedule", "courseSchedule3");
    const resetCourSchData3 = {
      data: [
        {
          Course: [
            {
              class: "化學",
              info_teacher: "陳永富",
              info_classroom: "501",
            },
            {
              info_classroom: "501",
              class: "電工機械",
              continuity: "2",
              info_teacher: "江明德",
            },
            {
              info_classroom: "353",
              info_teacher: "林郁珊",
              class: "數位音樂",
            },
            {
              class: "數學",
              info_teacher: "成志樵",
              info_classroom: "501",
            },
            {
              info_classroom: "501",
              continuity: "2",
              info_teacher: "徐玉雪",
              class: "英語文",
            },
            {
              info_teacher: "鄭雅華",
              info_classroom: "501",
              class: "共學共好",
            },
          ],
          Date: "星期一",
        },
        {
          Date: "星期二",
          Course: [
            {
              info_classroom: "583",
              class: "地理",
              info_teacher: "周嘉慧",
              active: "classroom",
            },
            {
              continuity: "3",
              class: "機電整合實習",
              info_classroom: "583",
              info_teacher: "施茗鈜",
            },
            {
              info_classroom: "484",
              info_teacher: "施茗鈜",
              continuity: "3",
              class: "智慧居家監控實習",
            },
            {
              info_classroom: "501",
              info_teacher: "鄭雅華",
              class: "共學共好",
            },
          ],
        },
        {
          Date: "星期三",
          Course: [
            {
              info_classroom: "486/488",
              info_teacher: "林怡欣/徐玉雪",
              class: "多元選修",
              active: "classroom",
            },
            {
              info_teacher: "成志樵",
              info_classroom: "386",
              continuity: "2",
              class: "數學",
              active: "classroom",
            },
            {
              info_classroom: "383",
              class: "電工機械",
              info_teacher: "江明德",
              active: "classroom",
            },
            {
              continuity: "",
              class: "體育",
              info_teacher: "林泱妗",
              info_classroom: "",
            },
            {
              info_teacher: "江明德",
              info_classroom: "383",
              class: "工業配線",
              continuity: "2",
            },
            {
              class: "共學共好",
              info_classroom: "501",
              info_teacher: "鄭雅華",
            },
          ],
        },
        {
          Course: [
            {
              info_classroom: "581",
              class: "電子學實習",
              continuity: "3",
              info_teacher: "成志樵",
            },
            {
              info_classroom: "",
              class: "體育",
              info_teacher: "林泱妗",
              continuity: "",
            },
            {
              info_classroom: "501",
              continuity: "",
              info_teacher: "葉憲民",
              class: "電子學",
            },
            {
              info_teacher: "鄭雅華",
              info_classroom: "501",
              class: "國語文",
              continuity: "2",
            },
            {
              continuity: "",
              class: "共學共好",
              info_teacher: "鄭雅華",
              info_classroom: "501",
            },
          ],
          Date: "星期四",
        },
        {
          Course: [
            {
              info_teacher: "",
              info_classroom: "",
              continuity: "",
              class: "班/週會",
            },
            {
              info_classroom: "",
              continuity: "2",
              info_teacher: "",
              class: "聯課活動",
            },
            {
              info_teacher: "鄭雅華",
              continuity: "1",
              info_classroom: "501",
              class: "彈性課程",
            },
            {
              class: "國語文",
              info_classroom: "501",
              info_teacher: "鄭雅華",
              continuity: "",
            },
            {
              class: "電子學",
              info_classroom: "501",
              continuity: "2",
              info_teacher: "葉憲民",
            },
            {
              info_teacher: "鄭雅華",
              class: "共學共好",
              info_classroom: "501",
              continuity: "",
            },
          ],
          Date: "星期五",
        },
      ],
      type: "電機科",
    };

    // 更新課程表
    await setDoc(courseSchDocRef1, resetCourSchData1, {
      merge: true,
    });
    setGetCourSchCount1(false);
    await setDoc(courseSchDocRef2, resetCourSchData2, {
      merge: true,
    });
    setGetCourSchCount2(false);
    await setDoc(courseSchDocRef3, resetCourSchData3, {
      merge: true,
    });
    setGetCourSchCount3(false);
  };

  // 修復、測試代碼
  const TestUpdateCourSch = async (event) => {
    event.preventDefault();
    const firebaseConfig = {
      apiKey: "AIzaSyAevwFPxRd5Fi-UbeTHko_Uradt-hAeBSg",
      authDomain: "classdata-app.firebaseapp.com",
      projectId: "classdata-app",
      storageBucket: "classdata-app.appspot.com",
      messagingSenderId: "219989250207",
      appId: "1:219989250207:web:5cef212dc7e1496c6952aa",
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    // 資訊科
    const [testCourSch, setTestCourSch] = useState({
      type: "電機科",
      data: [
        {
          Date: "星期一",
          Course: [
            {
              class: "化學",
              info_teacher: "陳永富",
              info_classroom: "501",
            },
            {
              class: "電工機械",
              info_teacher: "江明德",
              info_classroom: "501",
              continuity: "2",
            },
            {
              class: "數位音樂",
              info_teacher: "林郁珊",
              info_classroom: "353",
            },
            {
              class: "數學",
              info_teacher: "成志樵",
              info_classroom: "501",
            },
            {
              class: "體育",
              info_teacher: "林泱妗",
              info_classroom: "",
              continuity: "classchange",
            },
            {
              class: "英語文",
              info_teacher: "徐玉雪",
              info_classroom: "501",
              continuity: "1",
            },
            {
              class: "共學共好",
              info_teacher: "鄭雅華",
              info_classroom: "501",
            },
          ],
        },
        {
          Date: "星期二",
          Course: [
            {
              class: "地理",
              info_teacher: "周嘉慧",
              info_classroom: "501",
            },
            {
              class: "機電整合實習",
              info_teacher: "施茗鈜",
              info_classroom: "583",
              continuity: "3",
            },
            {
              class: "智慧居家監控實習",
              info_teacher: "施茗鈜",
              info_classroom: "484",
              continuity: "3",
            },
            {
              class: "共學共好",
              info_teacher: "鄭雅華",
              info_classroom: "501",
            },
          ],
        },
        {
          Date: "星期三",
          Course: [
            {
              class: "多元選修",
              info_teacher: "徐玉雪/林怡欣",
              info_classroom: "402/403",
            },
            {
              class: "數學",
              info_teacher: "成志樵",
              info_classroom: "501",
              continuity: "2",
            },
            {
              class: "電工機械",
              info_teacher: "江明德",
              info_classroom: "501",
            },
            {
              class: "國語文",
              info_teacher: "鄭雅華",
              info_classroom: "501",
              continuity: "classchange",
            },
            {
              class: "工業配線",
              info_teacher: "江明德",
              info_classroom: "383",
              continuity: "2",
            },
            {
              class: "共學共好",
              info_teacher: "鄭雅華",
              info_classroom: "501",
            },
          ],
        },
        {
          Date: "星期四",
          Course: [
            {
              class: "電子學實習",
              info_teacher: "成志樵",
              info_classroom: "581",
              continuity: "3",
            },
            {
              class: "體育",
              info_teacher: "林泱妗",
              info_classroom: "",
            },
            {
              class: "電子學",
              info_teacher: "葉憲民",
              info_classroom: "501",
            },
            {
              class: "英語文",
              info_teacher: "徐玉雪",
              info_classroom: "501",
              continuity: "classchange",
            },
            {
              class: "國語文",
              info_teacher: "鄭雅華",
              info_classroom: "501",
              continuity: "",
            },
            {
              class: "共學共好",
              info_teacher: "鄭雅華",
              info_classroom: "501",
            },
          ],
        },
        {
          Date: "星期五",
          Course: [
            {
              class: "班週會",
              info_teacher: "",
              info_classroom: "501",
              continuity: "",
            },
            {
              class: "社團活動",
              info_teacher: "",
              info_classroom: "",
              continuity: "2",
            },
            {
              class: "彈性課程",
              info_teacher: "鄭雅華",
              info_classroom: "501",
              continuity: "",
            },
            {
              class: "國語文",
              info_teacher: "鄭雅華",
              info_classroom: "501",
            },
            {
              class: "電子學",
              info_teacher: "葉憲民",
              info_classroom: "501",
              continuity: "2",
            },
            {
              class: "共學共好",
              info_teacher: "鄭雅華",
              info_classroom: "501",
            },
          ],
        },
      ],
    });

    const courseSchDocRef = doc(db, "courseSchedule", "courseSchedule3");
    await setDoc(courseSchDocRef, testCourSch, { merge: true });
  };

  return (
    <main
      id="updater"
      className={`${props.theme}${props.theme && props.settingPage ? " " : ""}${
        props.settingPage ? "settingOpen" : ""
      }`}>
      <div id="updaterView" style={{ scrollSnapAlign: "start" }}>
        <div id="updaterFormView">
          <form>
            <div className="versionFormBlock">
              <h2>發佈版本</h2>
              <input
                type="text"
                placeholder="Version"
                onChange={handleVersionChange}
                value={version}
              />
            </div>
            <div className="dateFormBlock">
              <h2>日期</h2>
              <input
                type="text"
                placeholder="MMDD"
                onChange={handleDateChange}
                value={date}
              />
            </div>
            <div className="contentFormBlock">
              <h2>更新內容</h2>
              <textarea
                type="area"
                placeholder="・"
                onChange={handleContentChange}
                value={content}
              />
            </div>
            <button
              className="updaterSubmit"
              // type="submit"
              onClick={updateVrsn}>
              發布更新
            </button>
          </form>
        </div>
      </div>

      <div id="updaterView">
        <div id="updaterFormView">
          <form id="courSchForm">
            <div
              className="resetDefault"
              onClick={resetCourSchDefault}
              style={{ scrollSnapAlign: "start" }}>
              <FontAwesomeIcon icon="fa-solid fa-rotate-right" />
            </div>
            <div className="versionFormBlock">
              <h2 style={{ scrollSnapAlign: "start" }}>資訊科</h2>
              <textarea
                name="courSch"
                id="courSchText"
                value={courSchData1}
                onChange={handleCourSchChange1}></textarea>
              <button className="updaterSubmit" onClick={updateCourSch}>
                發布更新
              </button>
            </div>
            <div className="versionFormBlock">
              <h2 style={{ scrollSnapAlign: "start" }}>電子科</h2>
              <textarea
                name="courSch"
                id="courSchText"
                value={courSchData2}
                onChange={handleCourSchChange2}></textarea>
              <button className="updaterSubmit" onClick={updateCourSch}>
                發布更新
              </button>
            </div>
            <div className="versionFormBlock">
              <h2 style={{ scrollSnapAlign: "start" }}>電機科</h2>
              <textarea
                name="courSch"
                id="courSchText"
                value={courSchData3}
                onChange={handleCourSchChange3}></textarea>
              <button className="updaterSubmit" onClick={updateCourSch}>
                發布更新
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Updater;
