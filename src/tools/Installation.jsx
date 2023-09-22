// React
import React, { useEffect, useState } from 'react'

// 安裝引導組件（暫時停用）
function Installation(props) {
  // 安裝提示
  const userAgent = window.navigator.userAgent.toLowerCase()
  const [PWAInstallActive, setPWAInstallActive] = useState(false)
  const [PWAInstallInfo, setPWAInstallInfo] = useState('')

  // 檢測設備
  useEffect(() => {
    // 檢測行動端
    const isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i)
      },
      iOS: function () {
        return /(iPhone|iPod|iPad)/i.test(navigator.userAgent)
      },
      Windows: function () {
        return (
          navigator.userAgent.match(/IEMobile/i) ||
          navigator.userAgent.match(/WPDesktop/i)
        )
      },
      any: function () {
        return (
          isMobile.Android() ||
          isMobile.BlackBerry() ||
          isMobile.iOS() ||
          isMobile.Opera() ||
          isMobile.Windows()
        )
      },
    }

    // 檢測桌面端
    const isWindows = /windows/.test(userAgent)
    const isLinux = /linux/.test(userAgent)
    const isChromebook = /cros/.test(userAgent)
    const isMacOS = navigator.platform.indexOf('Mac') > -1

    // 檢測瀏覽器
    const isChrome = navigator.userAgent.indexOf('Chrome') > -1
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent)
    const isRunningPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      navigator.standalone ||
      document.referrer.includes('android-app://')

    // 判別
    // 正在運行 PWA 應用
    if (isRunningPWA) {
      console.log('PWA installed')
      setPWAInstallActive(false)
      props.setOperationalStatus('Running PWA App')
    }
    // 以瀏覽器開啟
    else {
      // 行動端
      if (isMobile.iOS()) {
        if (isSafari) {
          setPWAInstallActive(true)
          setPWAInstallInfo('iOS/Safari')
          props.setOperationalStatus('iOS/Safari')
        } else {
          props.setOperationalStatus('iOS')
        }
      } else if (isMobile.Android()) {
        if (isChrome) {
          // setPWAInstallActive(true)
          setPWAInstallInfo('Android/Chrome')
          props.setOperationalStatus('Android/Chrome')
        } else {
          props.setOperationalStatus('Android')
        }
      }
      // 桌面端
      else if (isWindows) {
        if (isChrome) {
          // setPWAInstallActive(true)
          props.setOperationalStatus('Windows/Chrome')
        } else {
          props.setOperationalStatus('Windows')
        }
      } else if (isMacOS) {
        if (isChrome) {
          setPWAInstallActive(true)
          setPWAInstallInfo('MacOS/Chrome')
          props.setOperationalStatus('macOS/Chrome')
        } else if (isSafari) {
          props.setOperationalStatus('macOS/Safari')
        } else {
          props.setOperationalStatus('macOS')
        }
      } else if (isLinux) {
        if (isChrome) {
          // setPWAInstallActive(true)
          setPWAInstallInfo('Linux/Chrome')
          props.setOperationalStatus('Linux/Chrome')
        } else {
          props.setOperationalStatus('Linux/Chrome')
        }
      } else if (isChromebook) {
        if (isChrome) {
          // setPWAInstallActive(true)
          setPWAInstallInfo('ChromeOS/Chrome')
          props.setOperationalStatus('ChromeOS/Chrome')
        } else {
          props.setOperationalStatus('ChromeOS')
        }
      }
      // 不支持的設備
      else {
        props.setOperationalStatus('No Support PWA App')
      }

      // 安裝引導開關
      setPWAInstallActive(false)
    }
  }, [userAgent, props.setOperationalStatus])

  const [InstallationType, setInstallationType] = useState('')
  const [InstallationActive, setInstallationActive] = useState(false)

  const [macosInstallationGuide, setmacosInstallationGuide] = useState(false) //chrome
  const [windowsInstallationGuide, setwindowsInstallationGuide] =
    useState(false) //chrome
  const [linuxInstallationGuide, setlinuxInstallationGuide] = useState(false) //chrome
  const [chromeosInstallationGuide, setchromeosInstallationGuide] =
    useState(false) //chrome
  const [iosInstallationGuide, setiosInstallationGuide] = useState(false) //safari
  const [androidInstallationGuide, setandroidInstallationGuide] =
    useState(false) //chrome

  function StartPWAInstall() {
    if (PWAInstallInfo === 'Windows/Chrome') {
      console.log('Run Windows/Chrome PWA App Installation')
      setInstallationActive(true)
      setwindowsInstallationGuide(true)
      setInstallationType('windowsChrome')
    } else if (PWAInstallInfo === 'Linux/Chrome') {
      console.log('Run Linux/Chrome PWA App Installation')
      setInstallationActive(true)
      setlinuxInstallationGuide(true)
      setInstallationType('linuxChrome')
    } else if (PWAInstallInfo === 'MacOS/Chrome') {
      console.log('Run MacOS/Chrome PWA App Installation')
      setInstallationActive(true)
      setmacosInstallationGuide(true)
      setInstallationType('macosChrome')
    } else if (PWAInstallInfo === 'ChromeOS/Chrome') {
      console.log('Run ChromeOS/Chrome PWA App Installation')
      setInstallationActive(true)
      setchromeosInstallationGuide(true)
      setInstallationType('chromeosChrome')
    } else if (PWAInstallInfo === 'iOS/Safari') {
      console.log('Run iOS/Safari PWA App Installation')
      setInstallationActive(true)
      setiosInstallationGuide(true)
      setInstallationType('iosSafari')
    } else if (PWAInstallInfo === 'Android/Chrome') {
      console.log('Run Android/Chrome PWA App Installation')
      setInstallationActive(true)
      setandroidInstallationGuide(true)
      setInstallationType('androidChrome')
    } else {
      console.log('Does not support PWA App installation')
    }
  }

  function closePWAInstallTips() {
    setPWAInstallActive(false)
  }

  // 滾動到指定安裝引導
  const scrollToInstallationGuide = () => {
    setTimeout(() => {
      const scrollTo = document.getElementById('InstallationGuide')
      scrollTo.scrollIntoView({
        behavior: 'smooth',
      })
    }, 1000)
  }

  return (
    <>
      {/* 安裝提示 */}
      {PWAInstallActive && (
        <div
          id="pwaInstallTips"
          className={`${InstallationActive ? InstallationType : ''}`}
          style={{ background: InstallationActive ? '#000000df' : '' }}>
          <div
            className="InstallTips"
            style={{
              background: InstallationActive ? '#ffffff' : '',
            }}>
            <h1>
              檢測到您未使用<span>「班級資訊平台」</span>App
            </h1>
            <div className="btnBlock">
              <span>是否要安裝？</span>
              <h5>{PWAInstallInfo}</h5>
              <div
                className="startInstall"
                onClick={() => {
                  StartPWAInstall()
                  scrollToInstallationGuide()
                }}>
                開始引導安裝
              </div>
              <div className="refuseInstall" onClick={closePWAInstallTips}>
                堅持訪問網頁版
              </div>
            </div>
          </div>
          {macosInstallationGuide && (
            <div id="InstallationGuide">
              <div className="GuideTitle">
                <h2>macOS Chrome 的安裝引導</h2>
                <span>操作不會很複雜，滑鼠點幾下就好了！</span>
                <img
                  className={`${InstallationType}GuideIMG-1`}
                  src={
                    process.env.PUBLIC_URL +
                    '/images/InstallGuideIMG/macOS-chrome/macOS-chrome.001.png'
                  }
                  alt="第一步"
                />
                <img
                  className={`${InstallationType}GuideIMG-2`}
                  src={
                    process.env.PUBLIC_URL +
                    '/images/InstallGuideIMG/macOS-chrome/macOS-chrome.002.png'
                  }
                  alt="第二步"
                />
                <img
                  className={`${InstallationType}GuideIMG-3`}
                  src={
                    process.env.PUBLIC_URL +
                    '/images/InstallGuideIMG/macOS-chrome/macOS-chrome.003.png'
                  }
                  alt="第三步"
                />
              </div>
            </div>
          )}
          {iosInstallationGuide && (
            <div id="InstallationGuide">
              <div className="GuideTitle">
                <h2>iOS Safari 的安裝引導</h2>
                <span>操作不會很複雜，手指點幾下就好了！</span>
                <span>此操作需要用 Safari 開啟網站</span>
                <img
                  className={`${InstallationType}GuideIMG-1`}
                  src={
                    process.env.PUBLIC_URL +
                    '/images/InstallGuideIMG/ios-safari/ios-safari.001.png'
                  }
                  alt="第一步"
                />
                <img
                  className={`${InstallationType}GuideIMG-2`}
                  src={
                    process.env.PUBLIC_URL +
                    '/images/InstallGuideIMG/ios-safari/ios-safari.002.png'
                  }
                  alt="第二步"
                />
                <img
                  className={`${InstallationType}GuideIMG-3`}
                  src={
                    process.env.PUBLIC_URL +
                    '/images/InstallGuideIMG/ios-safari/ios-safari.003.png'
                  }
                  alt="第三步"
                />
              </div>
            </div>
          )}
          {androidInstallationGuide && (
            <div id="InstallationGuide">
              <div className="GuideTitle">
                <h2>Android Chrome 的安裝引導</h2>
                <span>操作不會很複雜，手指點幾下就好了！</span>
                <span>此操作需要用 Chrome 開啟網站</span>
                <img
                  className={`${InstallationType}GuideIMG-1`}
                  src={
                    process.env.PUBLIC_URL +
                    '/images/InstallGuideIMG/ios-safari/ios-safari.001.png'
                  }
                  alt="第一步"
                />
                <img
                  className={`${InstallationType}GuideIMG-2`}
                  src={
                    process.env.PUBLIC_URL +
                    '/images/InstallGuideIMG/ios-safari/ios-safari.002.png'
                  }
                  alt="第二步"
                />
                <img
                  className={`${InstallationType}GuideIMG-3`}
                  src={
                    process.env.PUBLIC_URL +
                    '/images/InstallGuideIMG/ios-safari/ios-safari.003.png'
                  }
                  alt="第三步"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Installation
