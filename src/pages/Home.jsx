import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
// CSS
import '../App.css'
// DataBase
import { HomePostData, HomeServiceData } from '../AppData/AppData.js'
import GreetBanner from '../tools/GreetingBanner'
import WorldScenery from '../tools/worldScenery'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Spline from '@splinetool/react-spline'
// import forestPath from '../images/Illustrations/ForestPath.png'

// 滾動視差
import Rellax from 'rellax'

function Home(props) {
  useEffect(() => {
    const HomeTitleRellax = new Rellax('.homeTopTitle', { wrapper: '#home' })
    const bgScr = new Rellax('.bgScr', { wrapper: '#home' })
    const moreBtn = new Rellax('.moreBtn', { wrapper: '#home' })
    return () => {
      HomeTitleRellax.destroy()
      bgScr.destroy()
      moreBtn.destroy()
    }
  }, [])

  return (
    <main
      id="home"
      className={`${props.theme}${props.theme && props.settingPage ? ' ' : ''}${
        props.settingPage ? 'settingOpen' : ''
      }`}
      // style={{
      //   backgroundImage: `url(${
      //     process.env.PUBLIC_URL
      //   }/images/homePage/homePageBackground/homePageBackground${
      //     props.theme === 'dark' ? '.' : ''
      //   }${props.theme}.png`,
      // }}
    >
      <Helmet>
        <title>班級資訊平台｜首頁</title>
        <meta name="description" content="學校、班級的最新資訊" />
        <meta property="og:title" content="班級資訊平台" />
        <meta property="og:description" content="學校、班級的最新資訊" />
      </Helmet>
      <div id="home-view">
        <div className="homeTopSpc">
          <h1 className="homeTopTitle" data-rellax-speed="-4">
            <FontAwesomeIcon
              icon="fa-solid fa-school"
              alt="班級資訊平台 icon"
              style={{ marginRight: '12px', marginBottom: '2px' }}
            />
            班級資訊平台
          </h1>
          <p className="homeTopTitle" data-rellax-speed="-3.75">
            班級、學校的即時資訊
          </p>
          <div
            className="moreBtn"
            data-rellax-speed="-2"
            onClick={() =>
              document.querySelector('#home-view-content').scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                marginTop: '54px',
              })
            }>
            <p>
              <FontAwesomeIcon
                icon="fa-solid fa-chevron-down"
                style={{ marginRight: '6px' }}
              />
              更多
            </p>
          </div>
          <img
            className="bgScr bgScr1"
            src={`${
              process.env.PUBLIC_URL
            }/images/homePage/homePageBackground/screenShot/exSch${
              props.theme === 'dark' ? '.' : ''
            }${props.theme}.png`}
            alt="服務/考程表"
            title="服務/考程表"
            data-rellax-speed="-4.3"
          />
          <img
            className="bgScr bgScr2"
            src={`${
              process.env.PUBLIC_URL
            }/images/homePage/homePageBackground/screenShot/courSch${
              props.theme === 'dark' ? '.' : ''
            }${props.theme}.png`}
            alt="服務/課程表"
            title="服務/課程表"
            data-rellax-speed="-5"
          />
          <img
            className="bgScr bgScr3"
            src={`${
              process.env.PUBLIC_URL
            }/images/homePage/homePageBackground/screenShot/chatGroup${
              props.theme === 'dark' ? '.' : ''
            }${props.theme}.png`}
            alt="討論"
            title="討論"
            data-rellax-speed="-5"
          />
          <img
            className="bgScr bgScr4"
            src={`${process.env.PUBLIC_URL}/images/homePage/homePageBackground/screenShot/youtubePlayer.png`}
            alt="服務/YouTube影片播放器"
            title="服務/YouTube影片播放器"
            data-rellax-speed="-4.3"
          />
        </div>
        <div id="webIntroduction"></div>
        {/* <div className="homeTopSpc"></div> */}
        <div id="home-view-content">
          {/* <div className="topBg">
            <picture>
              <source
                media="(min-width: 823px)"
                srcset="https://firebasestorage.googleapis.com/v0/b/classdata-app.appspot.com/o/resources%2Fbg%2F%E2%80%8E%E2%80%8E%E2%80%8E%E2%80%8EForestPath_2400x1200.png?alt=media&token=2e9aff87-4a6e-4969-ab5a-420483aee57d"
              />
              <img
                src="https://firebasestorage.googleapis.com/v0/b/classdata-app.appspot.com/o/resources%2Fbg%2F%E2%80%8E%E2%80%8EForestPath_2100x1500.png?alt=media&token=dc369143-a984-40ba-81c0-24df67743f0e"
                alt="image"
              />
            </picture>
            <img src="" alt="" />
          </div> */}
          {/* <WorldScenery />
          <GreetBanner isTop={props.isTop} /> */}
          <h1 className="homeTitle firstTitle">平台公告</h1>
          <section className="home-block">
            {HomePostData.map((HomePostData, index) => (
              <div
                className={HomePostData.classbackground}
                // style={{
                //   backgroundImage: `url(${process.env.PUBLIC_URL}/images/homePage/${HomePostData.stylebackground})`,
                // }}
                onClick={() => props.openPost(HomePostData.postlink)}
                key={index}>
                {HomePostData.stylebackground && (
                  <img
                    src={`${
                      HomePostData.stylebackground.includes('https://')
                        ? HomePostData.stylebackground
                        : `${process.env.PUBLIC_URL}/images/homePage/${HomePostData.stylebackground}`
                    }`}
                    alt=""
                  />
                )}

                {/* <div
                  className="space"
                  style={{ height: HomePostData.divHight }}></div> */}
                <span>{HomePostData.postTime}</span>
                <h1>{HomePostData.postTitle}</h1>
                <p>{HomePostData.content}</p>
              </div>
            ))}
          </section>
        </div>
        <div id="webStatement">
          <p>
            版權所有 <FontAwesomeIcon icon="fa-regular fa-copyright" /> 2023
            Johnlin10
          </p>
        </div>
      </div>
    </main>
  )
}

export default Home
