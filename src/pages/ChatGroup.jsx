// React
import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./css/chatGroup.scss";

import { List, AutoSizer } from "react-virtualized";

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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { faEyeLowVision, faL } from "@fortawesome/free-solid-svg-icons";

import { VariableSizeList } from "react-window";

import Loader from "../widgets/Loader";

// 初始化
const firebaseConfig = {
  apiKey: "AIzaSyAevwFPxRd5Fi-UbeTHko_Uradt-hAeBSg",
  authDomain: "classdata-app.firebaseapp.com",
  projectId: "classdata-app",
  storageBucket: "classdata-app.appspot.com",
  messagingSenderId: "219989250207",
  appId: "1:219989250207:web:5cef212dc7e1496c6952aa",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const storage = getStorage();
const storageRef = ref(storage);
const imagesRef = ref(storage, "images");

function ChatGroup(props) {
  const [user, setUser] = useState(null);
  const [userUID, setUserUID] = useState("");
  const [beta, setBeta] = useState(false); // 訪問權限
  const [unloginTip, setUnloginTip] = useState("");
  const [unloginTipBtn, setUnloginTipBtn] = useState("");

  const schoolUsers = [
    process.env.REACT_APP_SCHOOL_USER1,
    process.env.REACT_APP_SCHOOL_USER2,
    process.env.REACT_APP_SCHOOL_USER3,
  ];
  const adminUsers = [process.env.REACT_APP_ADMIN, process.env.REACT_APP_SYSEM];
  const otherUsers = [process.env.REACT_APP_CHAT_01];

  // 用戶登入資訊
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // 根據登入狀態提示聊天室狀態
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUnloginTip("未登入");
        setUnloginTipBtn("前往登入");
        console.log(user);
      } else if (
        (schoolUsers.some((userAuth) => user.email.startsWith(userAuth)) &&
          user.email.endsWith(process.env.REACT_APP_SCHOOL_EMAIL)) ||
        adminUsers.some((userAuth) => user.email.startsWith(userAuth)) ||
        otherUsers.includes(user.uid)
      ) {
        setBeta(true);
        setUserUID(user.uid);
        console.log(
          `已登入: ${user.email} ${
            user.uid === process.env.REACT_APP_ADMIN_ACCOUNT ? "(管理員)" : ""
          }`
        );
      } else {
        setUserUID("");
        setBeta(false);
        console.log("非認證帳號: " + user.email);
        setUnloginTip("未認證帳號");
        setUnloginTipBtn("");
      }
    });
    return unsubscribe;
  }, [user]);

  // 傳送訊息
  const [chatText, setChatText] = useState("");
  const [reployUserName, setReployUserName] = useState("");
  const [reployMessage, setReployMessage] = useState("");
  const [reployTime, setReployTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const chatGroupInput = useRef(null);
  const submitChatText = async () => {
    let uploadedImageUrl = "";
    if (file) uploadedImageUrl = await handleUpload();
    const chatGroupDataRef = doc(db, "chat", "chatData");

    // 傳送時間設定
    const date = new Date();
    console.log(imageUrl);
    const messageData = {
      content: chatText,
      time: date,
      user: user.displayName,
      userUID: user.uid,
      userPhoto: user.photoURL,
      reployUserName: reployUserName,
      reployMessage: reployMessage,
      reployTime: reployTime,
      imageUrl: uploadedImageUrl,
    };
    if ((!chatText || chatText.trim().length === 0) && !uploadedImageUrl) {
      // 阻止发送空白消息
      setChatText("");
    } else {
      setChatText("");
      setReployUserName("");
      setReployMessage("");
      const docSnap = await getDoc(chatGroupDataRef);
      if (!docSnap.exists()) {
        await setDoc(chatGroupDataRef, {
          data: [messageData],
        });
        setChatText("");
        setReployUserName("");
        setReployMessage("");
      } else {
        await updateDoc(chatGroupDataRef, {
          data: arrayUnion(messageData),
        });
        setChatText("");
        setReployUserName("");
        setReployMessage("");
        console.log("test");
      }
      setChatText("");
      setReployUserName("");
      setReployMessage("");
      setReployTime("");
      setImageUrl();
      handleToTop();
    }
  };

  // 發送按鈕動畫
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    if (animate) {
      const button = document.querySelector(".chatGroupForm .submit button");
      const handleAnimationEnd = () => setAnimate(false);
      button.addEventListener("animationend", handleAnimationEnd);
      return () =>
        button.removeEventListener("animationend", handleAnimationEnd);
    }
  }, [animate]);

  // 回到底部
  const handleToTop = () => {
    setTimeout(() => {
      document.querySelector(".message").scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  // 觸發回覆暫存回覆內容
  const reployToMessage = (userName, message, time) => {
    // const chatMsgBlockRef =
    setReployUserName(userName);
    setReployMessage(message);
    setReployTime(time);
    console.log(reployTime);
  };

  // 獲取聊天
  const [getChatMessage, setChatMessage] = useState();
  useEffect(() => {
    // 獲取資料
    const chatGroupDataRef = doc(db, "chat", "chatData");
    const unsubscribe = onSnapshot(chatGroupDataRef, (doc) => {
      const data = doc.data();
      if (data) {
        setChatMessage(data.data);
        localStorage.setItem("chatGroupData", JSON.stringify(data));
        if (beta) {
          setTimeout(() => {
            handleToTop();
          }, 350);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 用戶發送計數
  const [messageCount, setMessageCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  useEffect(() => {
    if (user) {
      const messages = getChatMessage.filter(
        (message) => message.userUID === user.uid
      );
      setMessageCount(messages.length);
      setImageCount(
        messages.reduce(
          (count, message) => (message.imageUrl ? count + 1 : count),
          0
        )
      );
    }
  }, [getChatMessage]);

  // 資料處理 \n 自動換行
  const formatContent = (content) => {
    // 正则表达式，用于匹配链接
    const linkRegex = /(https?:\/\/[^\s]+)/g;

    // 将文本分割成行
    const lines = content.split("\n");

    // 遍历每一行，并替换链接为带有链接属性的 <a> 元素
    const formattedLines = lines.map((line, index) => {
      const matches = line.match(linkRegex);

      if (matches) {
        // 如果行中存在链接
        const parts = line.split(linkRegex);
        return (
          <p key={index} className="messageContent">
            {parts.map((part, i) => {
              if (part.match(linkRegex)) {
                // 链接部分，使用 <a> 元素
                return (
                  <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer">
                    {part}
                  </a>
                );
              } else {
                // 非链接部分
                return <span key={i}>{part}</span>;
              }
            })}
          </p>
        );
      } else {
        // 没有链接的行，直接返回原始文本
        return (
          <p key={index} className="messageContent">
            {line}
          </p>
        );
      }
    });

    return formattedLines;
  };
  // 回覆內容高度適應
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleResize = () => {
    let elements = document.querySelectorAll(".replyTo");
    elements.forEach((element) => {
      let height = element.offsetHeight;
      let messageElement = element.closest(".message");
      messageElement.style.setProperty("--height", height + "px");
    });
  };
  useEffect(() => {
    let elements = document.querySelectorAll(".replyTo");
    elements.forEach((element) => {
      let height = element.offsetHeight;
      let messageElement = element.closest(".message");
      messageElement.style.setProperty("--height", height + "px");
    });
  }, [getChatMessage]);

  // 回到最底部
  const [toTopBtn, setToTopBtn] = useState(false);
  useEffect(() => {
    const element = document.querySelector("#chatGroupView");
    if (element) {
      const handleScroll = () => {
        if (element.scrollTop < -500) {
          setToTopBtn(true);
        } else {
          setToTopBtn(false);
        }
        // console.log(element.scrollTop)
        // console.log(toTopBtn)
      };

      element.addEventListener("scroll", handleScroll);
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [getChatMessage]);

  // 時間格式化
  const setDate = (date) => {
    const options = {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    let formattedDate = date.toLocaleDateString("zh-TW", options);
    return formattedDate;
  };

  //
  const [file, setFile] = useState();
  const [imgData, setImgData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    // 為選擇的文件創建一個對象URL
    setImgData(URL.createObjectURL(e.target.files[0]));
  };
  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const imgStorageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(imgStorageRef, file);
    const URL = await getDownloadURL(imgStorageRef);

    setImgData(null);
    setFile(null);
    document.querySelector("#mediaImg").value = null;
    setIsUploading(false);

    return URL;
  };
  const [dropActive, setDropActive] = useState(false);
  const handleDragOver = (event) => {
    event.preventDefault();
    setDropActive(true);
  };
  const handleDragLeave = (event) => {
    event.preventDefault();
    setDropActive(false);
  };
  const handleDrop = (event) => {
    event.preventDefault();
    setDropActive(false);
    const file = event.dataTransfer.files[0];
    const isImage = (file) => {
      return file["type"].split("/")[0] === "image";
    };
    if (isImage(file)) {
      setFile(file);
      setImgData(URL.createObjectURL(file));
    } else {
      props.setGlobalError("僅支持圖片文件");
      props.setGlobalErrorIcon(
        <FontAwesomeIcon icon="fa-solid fa-file-image" />
      );
    }
  };

  const chatGroupTextarea = useRef(null);
  const [chatViewMargin, setChatViewMargin] = useState("0");
  useEffect(() => {
    const current = chatGroupTextarea.current;
    if (current) {
      autoHeight(current);
    }
  }, [chatText, imgData]);
  function autoHeight(element) {
    element.style.height = "40px";
    element.style.height = element.scrollHeight + "px";
    let isImgData = imgData ? 87 : 0;
    if (element.scrollHeight < 240) {
      setChatViewMargin(`${element.scrollHeight - 44 + isImgData}` + "px");
    } else {
      setChatViewMargin(240 - 44 + isImgData + "px");
    }
    console.log(chatViewMargin);
  }

  const originalMessage = (orgMsgID) => {
    const orgMsgRef = document.querySelector(`#reployID${orgMsgID}`);

    orgMsgRef.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      orgMsgRef.classList.add("orgMsgHighlight");
      setTimeout(() => {
        orgMsgRef.classList.remove("orgMsgHighlight");
      }, 2000);
    }, 300);
  };

  // 用戶清單
  const [usersListActv, setUsersListActv] = useState(false);
  const usersListActvChge = () => {
    setUsersListActv(!usersListActv);
    setReportViewActv(false);
  };
  const [getUserList, setUserList] = useState([]);

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
      setUserList(users);
    });

    return () => unsubscribe();
  }, []);

  // 訊息右鍵選單
  const [rightKeyTargetID, setRightKeyTargetID] = useState();
  const handleContextMenu = (e, id) => {
    e.preventDefault();
    setRightKeyTargetID(id);
  };

  const handleClick = () => {
    setVisible(false);
  };

  // 舉報功能
  const [reportViewActv, setReportViewActv] = useState(false);
  const reportActvChange = () => {
    setReportViewActv(!reportViewActv);
  };

  // test
  const MAX_TIME_DIFF = 180; // 最大时间差，单位秒

  const renderMessages = () => {
    const groupedMessages = [];

    for (let i = 0; i < getChatMessage.length; i++) {
      const currentMsg = getChatMessage[i];
      const prevMsg = groupedMessages[groupedMessages.length - 1]?.[0];

      if (
        prevMsg &&
        currentMsg.userUID === prevMsg.userUID &&
        currentMsg.time.seconds - prevMsg.time.seconds <= MAX_TIME_DIFF
      ) {
        groupedMessages[groupedMessages.length - 1].push(currentMsg);
      } else {
        groupedMessages.push([currentMsg]);
      }
    }

    return groupedMessages.reverse().map((group, groupIndex) => (
      <div key={groupIndex} className="messageGroup">
        {group.map((item, index) => (
          <div
            id="messageBlock"
            className={`messageBlock${
              userUID === item.userUID &&
              item.userUID != process.env.REACT_APP_CHATGROUP_SYSTEM_USER
                ? " myMessage"
                : ""
            }${
              item.userUID === process.env.REACT_APP_CHATGROUP_SYSTEM_USER
                ? " system"
                : ""
            }`}>
            <div
              id={`reployID${item.time ? item.time.seconds : ""}`}
              className={`message ${
                item.reployMessage && item.reployUserName ? "reployMsg" : ""
              }`}
              onClick={() =>
                item.reployTime ? originalMessage(item.reployTime.seconds) : {}
              }>
              <div
                className="reployToBtn"
                onClick={(event) => {
                  event.stopPropagation();
                  reployToMessage(item.user, item.content, item.time);
                }}>
                <FontAwesomeIcon icon="fa-solid fa-reply" />
              </div>
              <img
                src={item.userPhoto}
                className="userPhoto"
                alt={item.user}></img>
              <p className="userName">
                {item.userUID === process.env.REACT_APP_CHATGROUP_SYSTEM_USER
                  ? "平台通知"
                  : item.user}
              </p>
              <span
                className="messageTime"
                onClick={(event) => event.stopPropagation()}>
                {setDate(new Date(item.time.seconds * 1000))}
              </span>
              {item.reployMessage && item.reployUserName && (
                <div
                  className="replyTo"
                  onClick={() =>
                    item.reployTime
                      ? originalMessage(item.reployTime.seconds)
                      : {}
                  }>
                  <span className="reployMessage" href={`#${reployTime}`}>
                    {formatContent(item.reployMessage)}
                  </span>
                  <span className="reployUserName">
                    回覆 {item.reployUserName}
                  </span>
                </div>
              )}
              {item.imageUrl && (
                <img
                  className={`messageImg${item.content ? "" : " noContent"}`}
                  src={item.imageUrl}
                  onClick={(event) => {
                    event.stopPropagation();
                    props.setPhotoPreviewUrl(item.imageUrl);
                  }}></img>
              )}
              {formatContent(item.content)}
            </div>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <main
      id="chatGroup"
      className={`${props.theme}${props.theme && props.settingPage ? " " : ""}${
        props.settingPage ? "settingOpen" : ""
      }`}>
      {beta ? (
        <>
          <div id="chatGroupTitle">
            <div>
              <div
                id="backBtn"
                onClick={() => {
                  usersListActv
                    ? [setUsersListActv(false), setReportViewActv(false)]
                    : props.navigateClick("/chats");
                }}>
                <div>
                  <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
                </div>
              </div>
              <div className="chatGroupName">
                <p>公共討論區</p>
              </div>
            </div>
            <div>
              <div id="chatGroupOptions">
                <div
                  className={`option${usersListActv ? " open" : ""}`}
                  onClick={() => usersListActvChge()}>
                  <FontAwesomeIcon icon="fa-solid fa-users" />
                </div>
              </div>
            </div>
          </div>
          <div
            className="chatGroupContiniut"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{ paddingBottom: chatViewMargin }}>
            <div
              id="chatGroupView"
              className={`${imgData ? "image" : ""}${
                imgData && reployMessage && reployUserName ? " " : ""
              }${reployMessage && reployUserName ? "reploy" : ""}`}
              s>
              {toTopBtn && (
                <div className="toTopBtn" onClick={handleToTop}>
                  <FontAwesomeIcon icon="fa-solid fa-arrow-down" />
                </div>
              )}
              {Array.isArray(getChatMessage) ? (
                // [...getChatMessage].reverse().map((item, index) => (
                //   <div
                //     id="messageBlock"
                //     className={`messageBlock${
                //       userUID === item.userUID &&
                //       item.userUID !=
                //         process.env.REACT_APP_CHATGROUP_SYSTEM_USER
                //         ? ' myMessage'
                //         : ''
                //     }${
                //       item.userUID ===
                //       process.env.REACT_APP_CHATGROUP_SYSTEM_USER
                //         ? ' system'
                //         : ''
                //     }`}>
                //     <div
                //       id={`reployID${item.time ? item.time.seconds : ''}`}
                //       className={`message ${
                //         item.reployMessage && item.reployUserName
                //           ? 'reployMsg'
                //           : ''
                //       }`}
                //       onClick={() =>
                //         item.reployTime
                //           ? originalMessage(item.reployTime.seconds)
                //           : {}
                //       }>
                //       <div
                //         className="reployToBtn"
                //         onClick={(event) => {
                //           event.stopPropagation()
                //           reployToMessage(item.user, item.content, item.time)
                //         }}>
                //         <FontAwesomeIcon icon="fa-solid fa-reply" />
                //       </div>
                //       <img
                //         src={item.userPhoto}
                //         className="userPhoto"
                //         alt={item.user}></img>
                //       <p className="userName">
                //         {item.userUID ===
                //         process.env.REACT_APP_CHATGROUP_SYSTEM_USER
                //           ? '平台通知'
                //           : item.user}
                //       </p>
                //       <span
                //         className="messageTime"
                //         onClick={(event) => event.stopPropagation()}>
                //         {setDate(new Date(item.time.seconds * 1000))}
                //       </span>
                //       {item.reployMessage && item.reployUserName && (
                //         <div
                //           className="replyTo"
                //           onClick={() =>
                //             item.reployTime
                //               ? originalMessage(item.reployTime.seconds)
                //               : {}
                //           }>
                //           <span
                //             className="reployMessage"
                //             href={`#${reployTime}`}>
                //             {formatContent(item.reployMessage)}
                //           </span>
                //           <span className="reployUserName">
                //             回覆 {item.reployUserName}
                //           </span>
                //         </div>
                //       )}
                //       {item.imageUrl && (
                //         <img
                //           className={`messageImg${
                //             item.content ? '' : ' noContent'
                //           }`}
                //           src={item.imageUrl}
                //           onClick={(event) => {
                //             event.stopPropagation()
                //             props.setPhotoPreviewUrl(item.imageUrl)
                //           }}></img>
                //       )}
                //       {formatContent(item.content)}
                //     </div>
                //   </div>
                // ))
                renderMessages()
              ) : (
                <Loader />
              )}
            </div>
          </div>
          <div
            id="chatGroupInput"
            className={`${imgData ? "image" : ""}${
              reployMessage && reployUserName ? " reploy" : ""
            }${isUploading ? " loading" : ""}`}
            style={
              {
                // maxHeight: reployMessage && reployUserName ? '159px' : '',
              }
            }
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}>
            <div className={`load${isUploading ? " loading" : ""}`}>
              <FontAwesomeIcon
                icon="fa-solid fa-arrow-up"
                style={{ marginRight: "6px" }}
                beatFade
              />{" "}
              <span>上傳中</span>
            </div>
            {reployMessage && reployUserName && (
              <div className="reployDisplay">
                <div className="reployDisplayBlock">
                  <span className="reployDisplayName">
                    回覆 {reployUserName}
                  </span>
                  <span className="reployDisplayMessage">{reployMessage}</span>
                </div>
                <div>
                  <div
                    className="UnReployBtn"
                    onClick={() => [
                      setReployUserName(""),
                      setReployMessage(""),
                    ]}>
                    <FontAwesomeIcon icon="fa-solid fa-xmark" />
                  </div>
                </div>
              </div>
            )}
            {imgData && (
              <div className="sendImageDisplay">
                <div className="sendImageView">
                  <img
                    id="sendImage"
                    src={imgData}
                    onClick={() => props.setPhotoPreviewUrl(imgData)}
                    alt="Image"
                  />
                  <div
                    className="cancelSendImage"
                    onClick={() => [
                      setImgData(),
                      setFile(),
                      (document.querySelector("#mediaImg").value = null),
                    ]}>
                    <FontAwesomeIcon icon="fa-solid fa-xmark" />
                  </div>
                </div>
              </div>
            )}
            <div
              ref={chatGroupInput}
              className={`chatGroupForm${dropActive ? " onDrop" : ""}`}>
              <div className={`dropMask`}>放開載入圖片</div>
              <div className="mediaImports">
                <div className="mediaImportBtn">
                  <input
                    id="mediaImg"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <FontAwesomeIcon icon="fa-solid fa-image" />
                </div>
              </div>
              <div className="chatGroupInput">
                <div className="chatInputBlock">
                  <textarea
                    ref={chatGroupTextarea}
                    name="chatText"
                    title="聊天輸入框"
                    id="chatGroupTextarea"
                    placeholder="輸入訊息或拖放圖片"
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.shiftKey) {
                        if (
                          !e.target.value ||
                          e.target.value.trim().length === 0
                        ) {
                          return;
                        }
                        e.preventDefault();
                        submitChatText();
                        setAnimate(true);
                      }
                    }}></textarea>
                </div>
              </div>
              <div className="submit">
                <div className="submitBtn">
                  <button
                    title="傳送訊息"
                    onClick={submitChatText}
                    onMouseDown={() => setAnimate(true)}
                    className={animate ? "animate" : ""}>
                    <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {usersListActv && (
            <div className="usersList">
              <div className="you">
                <div className="userInfo">
                  <img
                    src={
                      user
                        ? user.photoURL
                        : `${process.env.PUBLIC_URL}/images/icons/user.png`
                    }
                    title={user ? user.displayName : "未登入"}></img>
                  <h3>{user ? user.displayName : ""}</h3>
                </div>
                <div className="userActv">
                  <p>
                    訊息： <span>{messageCount}</span>
                  </p>
                  <p>
                    圖片： <span>{imageCount}</span>
                  </p>
                </div>
              </div>
              <div className="otherUsers">
                <h3>成員</h3>
                {getUserList.map((item, index) => (
                  <div
                    className="userBlock"
                    key={index}
                    style={{
                      display: item.uid === user.uid ? "none" : "",
                    }}>
                    <div className="userInfo">
                      <img
                        src={
                          item
                            ? item.headSticker
                            : `${process.env.PUBLIC_URL}/images/icons/user.png`
                        }
                        title={item ? item.name : "未登入"}></img>
                      <p>{item ? item.name : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* {reportViewActv && <Report user={user} />} */}
        </>
      ) : (
        <div id="accessDenied">
          {unloginTipBtn ? (
            <FontAwesomeIcon icon="fa-solid fa-user-xmark" />
          ) : (
            <FontAwesomeIcon icon="fa-solid fa-user-lock" />
          )}
          <p>{unloginTip}</p>
          {unloginTipBtn && (
            <button onClick={() => [props.navigateClick("/user")]}>
              {unloginTipBtn}
            </button>
          )}
        </div>
      )}
    </main>
  );
}

function Report(props) {
  return (
    <div id="reportView">
      <div className="reportArea">
        <div className="reportBlock">
          <div className="reportTitle">
            <div className="submitReportUser">
              <img src={props.user.photoURL} alt="" />
              <p>舉報人</p>
            </div>
            <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
            <div className="reportedUser">
              <img src={props.user.photoURL} alt="" />
              <p>被舉報人</p>
            </div>
          </div>
          <div className="reportContent">
            <div className="reportContentBlock">
              <h5>舉報內容</h5>
              <p>舉報內容舉報內容舉報內容舉報內容舉報內容舉報內容</p>
            </div>
          </div>
          <div className="reportActive"></div>
        </div>
      </div>
    </div>
  );
}

export default ChatGroup;
