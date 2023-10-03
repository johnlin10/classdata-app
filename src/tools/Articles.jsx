import { useRef, useEffect, useState } from "react";
import { HomePostData } from "../AppData/AppData";
import "./css/Articles.scss";
import { Helmet } from "react-helmet";

// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// 自定義函式庫
import useUrlParams from "../js/UpdateUrlParams";

export default function Articles(props) {
  // 頁面動畫
  const [pageTitleAni, setPageTitleAni] = useState(true);
  useEffect(() => {
    setPageTitleAni(false);
  }, []);

  // 資料處理 \n 自動換行
  const formatContent = (content) => {
    return content.split("\n").map((line, index) => <p key={index}>{line}</p>);
  };
  const [postData, setPostData] = useState([]);
  const [postTitle, setPostTitle] = useState("標題");
  const [postDescription, setPostDescription] = useState("描述");
  useEffect(() => {
    // 假設要找postlink值為'v5update'的postData
    const postlinkToFind = props.readArticle;

    // 使用filter篩選出postlink等於要找的值的資料組，再用map取得它的postData
    const foundPostsData = HomePostData.filter(
      (item) => item.postlink === postlinkToFind
    ).map((item) => item.postData);

    // 將找到的資料設為postData的狀態
    setPostData(foundPostsData);
    // console.log(foundPostsData[0])
  }, [props.openPost, props.readArticle]);

  useEffect(() => {
    const postlinkToFind = props.readArticle;
    const foundPostsData = HomePostData.filter(
      (item) => item.postlink === postlinkToFind
    ).map((item) => item);
    if (foundPostsData[0]) {
      setPostTitle(foundPostsData[0].postTitle);
      setPostDescription(foundPostsData[0].content);
    }
  }, [postData]);

  // 關閉文章頁面
  const { urlParams, removeUrlParam, addUrlParams } = useUrlParams();
  function closePost() {
    setPageTitleAni(true);
    props.setReadArticle("");

    setTimeout(() => {
      const updatedParams = { ...urlParams };
      delete updatedParams.post;

      removeUrlParam("post");
      props.setPostActive(false);
    }, 500);
  }

  const scrollTop = useRef(null);

  const [topTitleActv, setTopTitleActv] = useState(false);
  useEffect(() => {
    const currentScrollTop = scrollTop.current;
    const handleScroll = () => {
      if (currentScrollTop.scrollTop > 0) {
        setTopTitleActv(true);
      } else {
        setTopTitleActv(false);
      }
    };
    if (currentScrollTop) {
      currentScrollTop.addEventListener("scroll", handleScroll);
      return () => {
        currentScrollTop.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <div ref={scrollTop} id="Article" className={`${props.theme}`}>
      <Helmet>
        <title>{postTitle}｜班級資訊平台</title>
        <meta name="description" content={postTitle} />
        <meta
          property="og:title"
          content={`${postDescription}｜班級資訊平台`}
        />
        <meta property="og:description" content={postDescription} />
      </Helmet>

      <div
        id="articles"
        className={`${pageTitleAni ? "" : "open"}${
          topTitleActv ? " top" : ""
        }`}>
        <button
          id="articlesClose"
          className={pageTitleAni ? "" : "open"}
          onClick={closePost}
          title="關閉">
          <FontAwesomeIcon icon="fa-solid fa-xmark" />
        </button>
        <div id="articlesPost">
          {postData[0] &&
            postData[0].map((item, index) => (
              <div key={index} className={`post-data-container`}>
                {/* 標題 */}
                {item.postUltraTitle && <h1>{item.postUltraTitle}</h1>}
                {item.postLargeTitle && <h3>{item.postLargeTitle}</h3>}
                {/* 時間戳 */}
                {item.postTime && <p className="time">{item.postTime}</p>}
                {/* 內容文字 */}
                {item.postContent && (
                  <p className={`content ${item.postContent[0].type}`}>
                    {item.postContent[0].content}
                  </p>
                )}
                {/* 代碼 */}
                {item.postCode && (
                  <>
                    <pre className="codeType">{item.postCode[0].type}</pre>
                    <pre className="code">
                      {formatContent(item.postCode[0].code)}
                    </pre>
                  </>
                )}
                {/* 註解文字 */}
                {item.postNote && <p className="note">{item.postNote}</p>}
                {/* 分隔線 */}
                {item.postHr && <hr className="hr"></hr>}
                {/* 圖片 */}
                {item.postImage && (
                  <>
                    <img
                      src={`${
                        item.postImage[0].src.includes("https://")
                          ? item.postImage[0].src
                          : `${process.env.PUBLIC_URL}${item.postImage[0].src}`
                      }`}
                      alt={item.postImage[0].alt}
                      title={item.postImage[0].alt}
                      className="image"
                    />
                    <p className="imageNote">{item.postImage[0].alt}</p>
                  </>
                )}
                {/* 狀態區塊 */}
                {item.postActive && (
                  <div className="postActive">
                    <p className={item.postActive[0].type}>
                      {item.postActive[0].content}
                    </p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      <div
        id="articlesBackMask"
        className={`${pageTitleAni ? "" : "open"}`}
        onClick={closePost}></div>
    </div>
  );
}
