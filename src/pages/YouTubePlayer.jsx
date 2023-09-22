import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import YouTube from 'react-youtube'
import YoutubeBackground from 'react-youtube-background'

import './css/youTubePlayer.css'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { event } from 'react-ga'
// Widget
import PageTitle from '../widgets/PageTitle'

let latestVideoUrl = ''
let currentVideoIndex = 0
function VideoForm(props) {
  const [themeColor, setThemeColor] = useState([
    '#a82525',
    '#fffffff1',
    '#a82525',
    '#fffffff1',
  ])
  const [error, setError] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoId, setVideoId] = useState('')
  const [loop, setLoop] = useState(0)
  const favoritesList = JSON.parse(localStorage.getItem('favorites')) || []
  const [player, setPlayer] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [musicModeTitle, setMusicModeTitle] = useState('')

  // const opts = {
  //   playerVars: {
  //     autoplay: 1,
  //     loop: loop === 2 ? 1 : 0,
  //     controls: 1,
  //     fs: 1,
  //     rel: 0,
  //   },
  // }

  const [VIDEO_ID, setVIDEO_ID] = useState('')
  useEffect(() => {
    if (videoId) {
      setVIDEO_ID(videoId)
    }
  }, [videoId])

  const opts = useMemo(
    () => ({
      host: 'https://www.youtube-nocookie.com',
      mute: false,
      playerVars: {
        autoplay: 1,
        loop: loop === 2 ? 1 : 0,
        playlist: videoId,
        controls: 1,
        fs: 1,
        rel: 0,
      },
    }),
    [loop, videoId]
  )

  const [intervalId, setIntervalId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const onReady = (event) => {
    // 嵌入的播放器已經準備就緒
    setPlayer(event.target)
    event.target.playVideo()
    const iframe = event.target.getIframe()
    iframe.classList.add('youTubePlayer')
  }
  const handleStateChange = (event) => {
    setIsPlaying(event.data === 1)
    // 進度條更新
    if (event.data === 1) {
      if (intervalId) {
        clearInterval(intervalId)
      }
      const interval = setInterval(() => {
        const currentTime = player.getCurrentTime()
        const duration = player.getDuration()
        const prog = (currentTime / duration) * 100
        setProgress(prog)
        setCurrentTime(currentTime)
        setDuration(duration)
      }, 100)
      setIntervalId(interval)
    }
    // 影片加載狀態
    if (event.target.getPlayerState() === 3) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }
  const handlePlayPause = () => {
    if (player) {
      const state = player.getPlayerState()
      if (state === 1) {
        player.pauseVideo()
      } else {
        player.playVideo()
      }
    }
  }
  const handleSeek = (event) => {
    if (player) {
      const duration = player.getDuration()
      const seekTo =
        (event.nativeEvent.offsetX / event.target.offsetWidth) * duration
      player.seekTo(seekTo)
    }
  }
  const handleBackward = () => {
    if (player) {
      const currentTime = player.getCurrentTime()
      player.seekTo(Math.max(currentTime - 5, 0), true)
    }
  }
  const handleForward = () => {
    if (player) {
      const currentTime = player.getCurrentTime()
      player.seekTo(currentTime + 5, true)
    }
  }

  function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        // 按下空格键
        handlePlayPause()
      } else if (event.code === 'ArrowLeft') {
        // 按下左方向键
        handleBackward()
      } else if (event.code === 'ArrowRight') {
        // 按下右方向键
        handleForward()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePlayPause, handleBackward, handleForward])

  const setVideo = (video) => {
    // 查找當前影片在播放清單中的索引
    currentVideoIndex = favoritesList.findIndex(
      (item) => item.url === video.url
    )
    setVideoUrl(video.url)
  }

  const [isOnEnd, setIsOnEnd] = useState(false)
  const onEnd = (event) => {
    console.log(currentVideoIndex)
    // 影片播放完畢
    if (loop === 1) {
      // 選擇下一個要播放的影片
      if (currentVideoIndex > 0) {
        currentVideoIndex =
          (currentVideoIndex - 1 + favoritesList.length) % favoritesList.length
      } else {
        currentVideoIndex = favoritesList.length - 1
      }
      const nextVideo = favoritesList[currentVideoIndex]
      console.log(currentVideoIndex)
      console.log(nextVideo)
      // 更新當前影片索引
      currentVideoIndex = favoritesList.findIndex(
        (item) => item.url === nextVideo.url
      )
      setVideoUrl(nextVideo.url)
      setIsOnEnd(true)

      setMusicModeTitle(searchVideoData())
    }
  }

  useEffect(() => {
    if (isOnEnd) {
      handleSubmit()
    }
    setIsOnEnd(false)
  }, [isOnEnd])

  const handleSubmit = (event) => {
    const stack = new Error().stack
    console.log(stack)
    if (event) {
      event.preventDefault()
    }
    // 根據輸入的 URL 解析影片 ID// 動態生成嵌入代碼
    let id = ''
    setProgress(0)
    if (videoUrl.includes('youtu.be')) {
      id = videoUrl.split('/').pop()
    } else if (videoUrl.includes('youtube.com')) {
      id = new URL(videoUrl).searchParams.get('v')
    } else {
      setError('請輸入正確的 YouTube 網址')
      return
    }
    // 將影片 ID 設置到 videoId 狀態中
    setVideoId(id)
    setMusicModeTitle()
    console.log(id)

    // 查找播放清單中對應的影片對象
    const video = favoritesList.find((item) => item.url === videoUrl)
    if (video) {
      setVideo(video)
    }
  }

  // 單曲循環設定
  const [urltarget, setUrltarget] = useState(false)
  const loopSet = () => {
    if (loop >= 2) {
      setLoop(0)
      return
    }
    setLoop(loop + 1)
  }
  useEffect(() => {
    if (props.youtubeUrl) {
      setVideoUrl(props.youtubeUrl)
      setTimeout(() => {
        setUrltarget(true)
      }, 500)
    }
    console.log(props.youtubeUrl)
  }, [props.youtubeUrl])
  useEffect(() => {
    if (urltarget || loop > 0) {
      // handleSubmit()
    }
    setUrltarget(false)
  }, [urltarget, loop])

  // =================================================================================================================

  // 提示彈窗4s消失
  useEffect(() => {
    setTimeout(() => {
      setError('')
    }, 4000)
  }, [error])

  // 阻止內嵌 YouTube iframe 阻止 window.onfocus 事件
  useEffect(() => {
    let isFocused = document.hasFocus()
    focusInput()

    const interval = setInterval(() => {
      if (!isFocused && document.hasFocus()) {
        focusInput()
      }
      isFocused = document.hasFocus()
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // 在網站聚焦時觸發聚焦輸入框 focusInput
  const focusInput = () => {
    setTimeout(() => {
      const input = document.querySelector('#videoUrl')
      if (input) {
        input.focus()
        input.blur()
        input.focus()
      }
    }, 500)
  }
  useEffect(() => {
    focusInput()
    window.onfocus = focusInput
  }, [])

  // 儲存上一組連結（用於比對）
  useEffect(() => {
    latestVideoUrl = videoUrl
  }, [videoUrl])

  // 聆聽輸入框的 focus 事件
  useEffect(() => {
    const input = document.querySelector('#videoUrl')
    const form = document.querySelector('.youTubeUrlForm')
    const handleFocus = () => {
      navigator.clipboard.readText().then((clipboardText) => {
        const isYoutubeLink =
          /https?:\/\/(www\.)?youtube\.com\/watch\?v=.+|https?:\/\/youtu\.be\/.+/.test(
            clipboardText
          )
        const isBilibiliLink =
          /https?:\/\/(www\.)?bilibili\.com\/video\/BV.+/.test(clipboardText)
        if (clipboardText === latestVideoUrl) {
          // 剪貼板的內容與儲存的連結相同
          return
        } else if (isYoutubeLink || isBilibiliLink) {
          // 貼上連結
          setVideoUrl(clipboardText)
          setTimeout(() => {
            props.setGlobalError('已自動貼上 YouTube 網址')
            props.setGlobalErrorIcon(
              <FontAwesomeIcon icon="fa-solid fa-clipboard" />
            )
          }, 250)
          searchVideoData()
        }
      })
    }
    input.addEventListener('focus', handleFocus)
    return () => {
      input.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Esc 退出影片
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setEmbedCode('')
        setVideoUrl('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // 收藏連結功能
  const [saveActive, setSaveActive] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [favorited, setFavorited] = useState(false)
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || []
    setFavorites(favorites)
    setSaveActive(false)
    if (favorites.some((favorite) => favorite.url === videoUrl)) {
      setFavorited(true)
    }
  }, [saveActive])

  // 檢查是否已被收藏
  const checkFavorite = (event) => {
    const inputUrl = event.target.value
    const favorites = JSON.parse(localStorage.getItem('favorites')) || []
    if (favorites.some((favorite) => favorite.url === inputUrl)) {
      setFavorited(true)
    } else {
      setFavorited(false)
    }
  }

  const [videoTitlePreview, setVideoTitlePreview] = useState(
    '允許剪貼板權限後，可自動貼上 YouTube 影片連結'
  )
  useEffect(() => {
    searchVideoData()
    if (videoUrl) {
      props.openYoutubeUrl(videoUrl)
    }
    props.setYoutubeUrl(videoUrl)
  }, [videoUrl])
  const searchVideoData = async () => {
    if (
      !videoUrl ||
      (!videoUrl.includes('youtu.be') &&
        !videoUrl.includes('youtube.com') &&
        !videoUrl.includes('bilibili.com'))
    )
      return

    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoIdMatch = videoUrl.match(
        /https?:\/\/(www\.)?youtube\.com\/watch\?v=(.+)|https?:\/\/youtu\.be\/(.+)/
      )
      if (videoIdMatch) {
        const videoId = videoIdMatch[2] || videoIdMatch[3]
        // 使用 YouTube API 取得影片標題
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        )
        const data = await response.json()
        if (data.items && data.items[0] && data.items[0].snippet) {
          setVideoTitlePreview(data.items[0].snippet.title)
          setMusicModeTitle(data.items[0].snippet.title)
          console.log('music title')
          return data.items[0].snippet.title
          // console.log(data.items[0].snippet.title)
        } else {
          setVideoTitlePreview('允許剪貼板權限後，可自動貼上 YouTube 影片連結')
        }
      }
    }
  }

  // 狀態改變時，檢查是否已被收藏
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || []
    if (favorites.some((favorite) => favorite.url === videoUrl)) {
      setFavorited(true)
    } else {
      setFavorited(false)
    }
  }, [videoUrl, saveActive])

  // 將影片加入收藏
  const saveFavorite = async (videoUrl) => {
    if (
      !videoUrl ||
      (!videoUrl.includes('youtu.be') &&
        !videoUrl.includes('youtube.com') &&
        !videoUrl.includes('bilibili.com'))
    ) {
      props.setGlobalError('收藏影片失敗')
      props.setGlobalErrorIcon(
        <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" />
      )
      return
    } else if (videoUrl.includes('bilibili.com')) {
      props.setGlobalError('Bilibili 影片暫不支持收藏')
      props.setGlobalErrorIcon(
        <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" />
      )
      return
    }

    // 獲取標題
    let videoTitle = ''
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoIdMatch = videoUrl.match(
        /https?:\/\/(www\.)?youtube\.com\/watch\?v=(.+)|https?:\/\/youtu\.be\/(.+)/
      )
      if (videoIdMatch) {
        const videoId = videoIdMatch[2] || videoIdMatch[3]
        // 使用 YouTube API 取得影片標題
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        )
        const data = await response.json()
        videoTitle = data.items[0].snippet.title
      }
    }

    // 儲存影片資訊到 localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites')) || []
    if (favorites.some((favorite) => favorite.url === videoUrl)) {
      // 如果已经收藏过了，就取消收藏
      const newFavorites = favorites.filter(
        (favorite) => favorite.url !== videoUrl
      )
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    } else {
      // 如果没有收藏过，就添加收藏
      favorites.push({ url: videoUrl, title: videoTitle })
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }
    setSaveActive(true)
  }

  // 移除收藏影片
  const removeFavorite = (videoUrl) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || []
    const index = favorites.findIndex((favorite) => favorite.url === videoUrl)
    if (index > -1) {
      favorites.splice(index, 1)
      localStorage.setItem('favorites', JSON.stringify(favorites))
      setFavorites(favorites)
    }
  }

  // 播放收藏的影片
  const [playFavorite, setPlayFavorite] = useState(false)
  const playFavoriteLink = (url) => {
    // 觸發 effect 執行 handleSubmit (使用這方法是為了確保 videoUrl 是最新的數據)
    setPlayFavorite(true)
    setVideoUrl(url)
  }
  useEffect(() => {
    if (videoUrl) {
      handleSubmit()
    }
    setPlayFavorite(false)
  }, [playFavorite])

  // 收藏夾
  const [favoriteListActive, setFavoriteListActive] = useState(false)
  const favoriteList = () => {
    setFavoriteListActive(!favoriteListActive)
    console.log(favoriteListActive)
  }

  function closeVideo() {
    setVideoId('')
    setVideoUrl('')
    setFavoriteListActive(false)
    setVideoTitlePreview('允許剪貼板權限後，可自動貼上 YouTube 影片連結')
    currentVideoIndex = 0

    const newUrl = window.location.pathname + window.location.hash
    window.history.pushState({}, '', newUrl)

    setTimeout(() => {
      // 網址參數清除
      const params = new URLSearchParams(window.location.search)
      params.delete('youtubeUrl')
      const newUrl = window.location.pathname + '?' + params.toString()
      window.history.pushState({}, '', newUrl)
    }, 100)
  }

  const copyAgentUrl = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      const youtubeUrlBase =
        'https://johnlin10.github.io/classdata-app/?page=service%2FYouTubePlayer&youtubeUrl='
      let youtubeUrl = youtubeUrlBase
      const isYoutubeLink =
        /https?:\/\/(www\.)?youtube\.com\/watch\?v=.+|https?:\/\/youtu\.be\/.+/.test(
          clipboardText
        )
      if (isYoutubeLink) {
        youtubeUrl += clipboardText
        props.setGlobalError('已複製替換 代理播放網址')
      } else props.setGlobalError('已複製 代理播放網址')
      navigator.clipboard.writeText(youtubeUrl)
      props.setGlobalErrorIcon(<FontAwesomeIcon icon="fa-solid fa-copy" />)
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err)
    }
  }

  // 純音頻模式
  const [musicMode, setMusicMode] = useState(false)
  const changeMusicMode = () => {
    setMusicMode(!musicMode)
  }

  // 頁面動畫
  const [pageTitleAni, setPageTitleAni] = useState(true)
  useEffect(() => {
    setPageTitleAni(false)
  }, [])

  const closePage = () => {
    setPageTitleAni(true)
    setTimeout(() => {
      props.navigateClick('/service')
    }, 250)
  }
  return (
    <>
      <main
        id="youTubePlayer"
        className={`${props.theme}${props.settingPage ? ' settingOpen' : ''}${
          videoId ? ' playing' : ''
        }${pageTitleAni ? ' PTAni' : ''}`}>
        <PageTitle
          theme={props.theme}
          themeColor={themeColor}
          title="YouTube 播放器"
          backTo={closePage}
        />
        <div className={`view${pageTitleAni ? ' PTAni' : ''}`}>
          <div id="youTubePlayerView">
            {/* <h1 className={videoId ? 'playing' : ''}>YouTube 影片播放器</h1> */}
            {/* 表單用於收集使用者輸入 */}

            <form
              className="youTubeUrlForm"
              onSubmit={handleSubmit}
              autocomplete="off">
              <label htmlFor="videoUrl"></label>
              <div
                title="關閉影片 (Esc)"
                className={`clostVideo${videoId ? ' playing' : ''}`}
                onClick={() => closeVideo()}>
                <FontAwesomeIcon icon="fa-solid fa-xmark" />
              </div>
              <div
                className={`favoriteListBtn${videoId ? ' playing' : ''}${
                  favoriteListActive ? ' open' : ''
                }`}
                onClick={() => [favoriteList()]}>
                <FontAwesomeIcon icon="fa-solid fa-list-ul" rotation={180} />
                <FontAwesomeIcon
                  className="xmark"
                  icon="fa-solid fa-xmark"
                  style={{
                    position: 'absolute',
                    fontSize: '20px',
                    opacity: favoriteListActive ? '1' : '0',
                  }}
                />
              </div>
              <input
                type="text"
                id="videoUrl"
                title="YouTube 影片連結輸入框"
                className={videoId ? 'playing' : ''}
                name="videoUrl"
                value={videoUrl}
                placeholder="請輸入 YouTube 影片連結"
                onChange={(event) => [
                  setVideoUrl(event.target.value),
                  checkFavorite(event),
                  searchVideoData(),
                ]}
              />
              <div
                title={favorited ? '已收藏' : '未收藏'}
                className={`favoriteBtn${favorited ? ' favorited' : ''}`}
                onClick={() => saveFavorite(videoUrl)}>
                <FontAwesomeIcon
                  icon={`fa-${favorited ? 'solid' : 'regular'} fa-star`}
                />
              </div>
              <div
                title={musicMode ? '點擊開啟影片' : '點擊隱藏影片'}
                className={`videoCloseBtn${favorited ? ' close' : ''}`}
                onClick={() => changeMusicMode()}>
                <FontAwesomeIcon icon="fa-brands fa-youtube" />
                {musicMode ? (
                  <>
                    <FontAwesomeIcon
                      className="videoCloseLine"
                      icon="fa-solid fa-minus"
                    />
                    <FontAwesomeIcon
                      className="videoCloseLineShadow"
                      icon="fa-solid fa-minus"
                    />
                  </>
                ) : (
                  ''
                )}
              </div>
              <button
                type="submit"
                title="搜尋影片"
                className={videoId ? 'playing' : ''}>
                <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
              </button>
              {error && (
                <div className="error">
                  <p>{error}</p>
                </div>
              )}
            </form>
            {!videoId && <span>{videoTitlePreview}</span>}
            {/* {!videoId && (
            <span
              className="copyAgentUrl"
              title="複製YouTube影片網址後，點擊替換為代理播放網址"
              style={{
                fontSize: '10px',
              }}
              onClick={() => copyAgentUrl()}>
              複製代理播放網址
            </span>
          )} */}
            {!videoId && (
              <div style={{ display: 'flex' }}>
                <div className="youTubePlayerTips">
                  <p>
                    沒有煩人<span>廣告</span>干擾
                  </p>
                </div>
                <div className="youTubePlayerTips">
                  <p>
                    播放被<span>限制</span>的影片
                  </p>
                </div>
                <div className="youTubePlayerTips">
                  <p>
                    無痕觀看<span>不被</span>記錄
                  </p>
                </div>
              </div>
            )}
            {!videoId && favorites && (
              <div id="favoriteView">
                <p>你的收藏</p>
                <ul>
                  {[...favorites].reverse().map((favorite) => (
                    <li key={favorite.url}>
                      {/* <button
                      className="toPlayingBtn"
                      onClick={() => playFavoriteLink(favorite.url)}>
                      <FontAwesomeIcon icon="fa-solid fa-play" />
                    </button> */}
                      <a
                        title={`${favorite.title}`}
                        onClick={() => playFavoriteLink(favorite.url)}>
                        <FontAwesomeIcon icon="fa-solid fa-play" />
                        {favorite.title}
                      </a>
                      <button
                        className="copyUrl"
                        title="複製此收藏影片網址"
                        onClick={() => [
                          navigator.clipboard.writeText(favorite.url),
                          props.setGlobalError('已複製到剪貼簿'),
                          props.setGlobalErrorIcon(
                            <FontAwesomeIcon icon="fa-solid fa-copy" />
                          ),
                        ]}>
                        <FontAwesomeIcon icon="fa-solid fa-clipboard" />
                      </button>
                      <button
                        title="刪除此收藏影片"
                        className="deleteFavorites"
                        onClick={() => removeFavorite(favorite.url)}>
                        <FontAwesomeIcon icon="fa-solid fa-trash" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div id="favoriteList" className={favoriteListActive ? 'open' : ''}>
              <h5>你的收藏</h5>
              <div className="playbackCtrl">
                <div
                  title="影片模式/音樂模式"
                  className={`ctrlBtn${musicMode ? '' : ''}`}
                  onClick={() => changeMusicMode()}>
                  {musicMode ? (
                    <FontAwesomeIcon
                      icon="fa-solid fa-music"
                      style={{ marginLeft: '-2px' }}
                    />
                  ) : (
                    <FontAwesomeIcon icon="fa-brands fa-youtube" />
                  )}
                </div>
                {/* <div
                title="單播放/連續循環/單片循環"
                className={`ctrlBtn${loop > 0 ? ' open' : ''}`}
                onClick={() => loopSet()}>
                <FontAwesomeIcon icon="fa-solid fa-repeat" />
                {loop === 2 ? (
                  <FontAwesomeIcon className="single" icon="fa-solid fa-1" />
                ) : (
                  ''
                )}
              </div> */}
              </div>
              <div id="favoriteView">
                <ul>
                  {[...favorites].reverse().map((favorite) => (
                    <li key={favorite.url}>
                      <a
                        title={`${favorite.title}`}
                        onClick={() => [
                          playFavoriteLink(favorite.url),
                          setFavoriteListActive(false),
                        ]}>
                        <FontAwesomeIcon icon="fa-solid fa-play" />
                        {favorite.title}
                      </a>
                      <button
                        className="copyUrl"
                        title="複製此收藏影片網址"
                        onClick={() => [
                          navigator.clipboard.writeText(favorite.url),
                          props.setGlobalError('已複製到剪貼簿'),
                          props.setGlobalErrorIcon(
                            <FontAwesomeIcon icon="fa-solid fa-copy" />
                          ),
                        ]}>
                        <FontAwesomeIcon icon="fa-solid fa-clipboard" />
                      </button>
                      <button
                        title="刪除此收藏影片"
                        className="deleteFavorites"
                        onClick={() => removeFavorite(favorite.url)}>
                        <FontAwesomeIcon icon="fa-solid fa-trash" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* 用於顯示嵌入代碼的容器 */}
            {videoId && (
              <div className={`youTubePlayerView${musicMode ? ' music' : ''}`}>
                <YouTube
                  videoId={VIDEO_ID}
                  opts={opts}
                  onReady={onReady}
                  onEnd={onEnd}
                  onStateChange={handleStateChange}
                  containerClassName="youTubePlayer"
                />
                <div className="youtubeControls">
                  <div>
                    <h3>{musicModeTitle}</h3>
                  </div>
                  <div className="controls">
                    <div
                      title="往前5秒 [左方向鍵]"
                      className="seekTo back"
                      onClick={() => handleBackward()}>
                      <FontAwesomeIcon icon="fa-solid fa-rotate-left" />
                      <FontAwesomeIcon className="num" icon="fa-solid fa-5" />
                    </div>
                    <div
                      title="暫停/繼續 [空白鍵]"
                      className={`play${isPlaying ? ' isPlaying' : ''}`}
                      onClick={() => handlePlayPause()}>
                      {!isLoading ? (
                        isPlaying ? (
                          <FontAwesomeIcon icon="fa-solid fa-pause" />
                        ) : (
                          <FontAwesomeIcon
                            icon="fa-solid fa-play"
                            style={{ marginRight: '-3px' }}
                          />
                        )
                      ) : (
                        <FontAwesomeIcon icon="fa-solid fa-spinner" spinPulse />
                      )}
                    </div>
                    <div
                      title="往後5秒 [右 方向鍵]"
                      className="seekTo forward"
                      onClick={() => handleForward()}>
                      <FontAwesomeIcon
                        icon="fa-solid fa-rotate-left"
                        flip="horizontal"
                      />
                      <FontAwesomeIcon className="num" icon="fa-solid fa-5" />
                    </div>
                  </div>
                  <div className="progress">
                    <div className="timing">
                      <p>{formatTime(currentTime)}</p>
                      <p>{formatTime(duration)}</p>
                    </div>
                    <progress value={progress} max="100" onClick={handleSeek} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default VideoForm
