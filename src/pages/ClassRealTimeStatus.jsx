import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import style from "./css/ClassRealTimeStatus.module.scss";

import { db, writeFirestoreDoc } from "../firebase";

import { onSnapshot, doc } from "firebase/firestore";
// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSquareMinus,
  faCircleChevronUp,
} from "@fortawesome/free-solid-svg-icons";

export default function ClassRealTimeStatus(props) {
  // 頁面動畫
  const [pageTitleAni, setPageTitleAni] = useState(true);
  useEffect(() => {
    setPageTitleAni(false);
  }, []);

  const [attendance, setAttendance] = useState(0); // 應到人數
  const [peopleCount, setPeopleCount] = useState(0); // 實到人數
  const [people, setPeople] = useState(""); // 未到人員
  const [peopleEditer, setPeopleEditer] = useState(false);
  const [editArray, setEditArray] = useState([
    // {
    //   reason: "選手",
    //   number: "2, 10, 18",
    // },
    // {
    //   reason: "理化教室",
    //   number: "22",
    // },
  ]);
  const peopleDelete = (index) => {
    setEditArray((prevEditArray) => {
      return prevEditArray.filter((_, i) => i !== index);
    });
  };
  const peopleAdd = () => {
    // 创建一个新的数据条目
    const newItem = {
      reason: "", // 你可以设置默认值或空字符串
      number: "", // 你可以设置默认值或空字符串
    };
    // 使用 setEditArray 更新状态，将新数据条目添加到数组
    setEditArray((prevEditArray) => [...prevEditArray, newItem]);
    // 只有在新数据的 reason 和 number 字段都不为空时才添加
    if (newItem.reason.trim() !== "" && newItem.number.trim() !== "") {
      // setEditArray((prevEditArray) => [...prevEditArray, newItem]);
      const formattedData = formatEditArrayToPeople([...editArray, newItem]);
      setPeople(formattedData);
    }
  };
  const handleInputChange = (e, index, field) => {
    const newValue = e.target.value;

    setEditArray((prevEditArray) => {
      return prevEditArray.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: newValue };
        }
        return item;
      });
    });
  };
  const formatEditArrayToPeople = (editArray) => {
    const formattedData = editArray.map((item) => {
      const numbers = item.number.split(",").map((number) => number.trim());
      const formattedNumbers = numbers.join("、");
      console.log(editArray.length);
      if (formattedNumbers || item.reason || editArray.length <= 1) {
        return `${formattedNumbers ? formattedNumbers : ""}${
          item.reason ? `（${item.reason}）` : ""
        }`;
      } else return;
    });

    return formattedData.filter(Boolean).join("\n");
  };
  useEffect(() => {
    const formattedData = formatEditArrayToPeople(editArray);
    if (editArray) {
      setPeople(formattedData);
      const updateDataToFirestore = () => {
        async function writeData() {
          await writeFirestoreDoc("classRealTimeStatus/people", {
            value: editArray,
          });
        }
        writeData();
      };
      updateDataToFirestore();
    }
  }, [editArray, people]);

  useEffect(() => {
    const colRef = doc(db, "classRealTimeStatus/attendance");
    const unsubscribe = onSnapshot(colRef, async (doc) => {
      const value = doc.data().value;
      setAttendance(value);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const colRef = doc(db, "classRealTimeStatus/peopleCount");
    const unsubscribe = onSnapshot(colRef, async (doc) => {
      const value = doc.data().value;
      setPeopleCount(value);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const colRef = doc(db, "classRealTimeStatus/people");
    const unsubscribe = onSnapshot(colRef, async (doc) => {
      const value = doc.data().value;
      setPeople(formatEditArrayToPeople(value));
      setEditArray(value);
    });
    return () => unsubscribe();
  }, []);

  /**
   * 當 input value 小於零 0，停止更新狀態
   * @param {event} event
   */
  const attendanceHandleChange = (event) => {
    if (event.target.value < 0) {
      setAttendance(0);
    } else {
      setAttendance(event.target.value);
      async function writeData() {
        await writeFirestoreDoc("classRealTimeStatus/attendance", {
          value: event.target.value,
        });
      }
      writeData();
    }
  };

  /**
   * 當 input value 小於零 0，停止更新狀態
   * @param {event} event
   */
  const peopleCountHandleChange = (event) => {
    if (event.target.value < 0) {
      setPeopleCount(0);
    } else {
      setPeopleCount(event.target.value);
      async function writeData() {
        await writeFirestoreDoc("classRealTimeStatus/peopleCount", {
          value: event.target.value,
        });
      }
      writeData();
    }
  };

  /**
   * 當 input value 小於零 0，停止更新狀態
   * @param {event} event
   */
  const peopleHandleChange = (event) => {
    setPeople(event.target.value);
    async function writeData() {
      await writeFirestoreDoc("classRealTimeStatus/people", {
        value: event.target.value,
      });
    }
    writeData();
  };

  // 監聽 attendance 數據更動，更新到 firestore
  // useEffect(() => {
  //   async function writeData() {
  //     await writeFirestoreDoc("classRealTimeStatus/attendance", {
  //       value: attendance,
  //     });
  //   }
  //   writeData();
  // }, [attendance]);

  // 監聽 peopleCount 數據更動，更新到 firestore
  // useEffect(() => {
  //   async function writeData() {
  //     await writeFirestoreDoc("classRealTimeStatus/peopleCount", {
  //       value: peopleCount,
  //     });
  //   }
  //   writeData();
  // }, [peopleCount]);

  const textareaRef = useRef(null);

  const handleTextareaChange = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // 重置高度以重新计算
    textarea.style.height = textarea.scrollHeight + "px"; // 设置高度为内容的滚动高度
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.addEventListener("input", handleTextareaChange);
    return () => {
      textarea.removeEventListener("input", handleTextareaChange);
    };
  }, []);

  useEffect(() => {
    handleTextareaChange();
  }, [attendance, peopleCount, people]);

  return (
    <main
      className={`${props.theme}${props.settingPage ? " settingOpen" : ""}`}>
      <Helmet>
        <title>班級即時狀態</title>
        <meta name="description" content="即時顯示臨時狀態" />
        <meta property="og:title" content="班級即時狀態" />
        <meta property="og:description" content="即時顯示臨時狀態" />
      </Helmet>
      <div className={`view${pageTitleAni ? " PTAni" : ""}`}>
        <div className={style.container}>
          <div className={style.block}>
            <h1>班級人數</h1>
            <div className={style.status_block}>
              <h3>應到人數</h3>
              <input
                type="number"
                value={attendance}
                onChange={attendanceHandleChange}
              />
            </div>
            <div className={style.status_block}>
              <h3>實到人數</h3>
              <input
                type="number"
                value={peopleCount}
                onChange={peopleCountHandleChange}
              />
            </div>
            <div className={`${style.status_block}${` ${style.edit}`}`}>
              <h3>未到人員</h3>
              <p ref={textareaRef}>{people}</p>
              <div
                className={`${style.editView}${
                  peopleEditer ? ` ${style.open}` : ""
                }`}>
                <p onClick={() => setPeopleEditer(!peopleEditer)}>
                  編輯器
                  <FontAwesomeIcon icon={faCircleChevronUp} />
                </p>
                <div className={style.editer}>
                  {editArray.map((item, index) => (
                    <div className={style.editer_block} key={index}>
                      <input
                        type="text"
                        name="人員"
                        value={item.number}
                        onChange={(e) => handleInputChange(e, index, "number")}
                      />
                      <input
                        type="text"
                        name="原因"
                        value={item.reason}
                        onChange={(e) => handleInputChange(e, index, "reason")}
                      />
                      <button onClick={() => peopleDelete(index)}>
                        <FontAwesomeIcon icon={faSquareMinus} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => peopleAdd()}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
