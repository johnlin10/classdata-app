// React
import React, { useEffect, useState, useRef } from 'react'
import './css/music.css'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { musicData } from '../AppData/musicData'

function Music(props) {
  const audioRef = useRef()
  const [musicPlayActive, setMusicPlayActive] = useState(false)
  const [musicPlayer, setMusicPlayer] = useState(false)
  const musicPlayerChange = () => {
    setMusicPlayer((prevActive) => !prevActive)
  }

  // 儲存當前歌曲名稱，用於尋找資料庫
  const [musicPlaying, setMusicPlaying] = useState('')
  function handlePlay(Name) {
    setMusicPlaying('')
    audioRef.current.pause()
    setMusicPlayActive(false)
    setTimeout(() => {
      setMusicPlaying(Name)
      setName(Name)
      audioRef.current.play()
      setMusicPlayActive(true)
    }, 250)
  }
  // 歌曲資訊
  const [name, setName] = useState('')
  const [singer, setSinger] = useState('')
  const [album, setAlbum] = useState('')
  const [audioPath, setAudioPath] = useState('')
  const [imgPath, setImgPath] = useState('')
  useEffect(() => {
    // 調用歌曲
    const result = musicData.find((item) => item.name === musicPlaying)
    // 歌曲資訊
    if (result) {
      // 設定當前歌曲資訊
      setName(result.name)
      setSinger(result.singer)
      setAlbum(result.album)
      setAudioPath(result.data[0].audioPath)
      setImgPath(result.data[0].imgPath)
      // 開始播放
      setTimeout(() => {
        audioRef.current.play()
        setMusicPlayActive(true)
      }, 500)
    } else {
      setName('未播放')
      setSinger('')
      setAlbum('')
      setAudioPath('')
      setImgPath('')
    }
  }, [musicPlaying])
  // 播放/暫停
  const musicPlayActiveChange = () => {
    // setMusicPlayActive((prevActive) => !prevActive)
    if (!musicPlayActive && audioPath) {
      audioRef.current.play()
      setMusicPlayActive(true)
    } else {
      audioRef.current.pause()
      setMusicPlayActive(false)
    }
  }

  // 上一首/下一首
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const playNextSong = () => {
    const nextSongIndex = (currentSongIndex + 1) % musicData.length
    setCurrentSongIndex(nextSongIndex)
    setMusicPlaying(musicData[nextSongIndex].name)
  }
  const playPrevSong = () => {
    const prevSongIndex =
      (currentSongIndex - 1 + musicData.length) % musicData.length
    setCurrentSongIndex(prevSongIndex)
    setMusicPlaying(musicData[prevSongIndex].name)
  }

  // 進度條
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const audio = audioRef.current
    const updateProgress = () => {
      setProgress(audio.currentTime / audio.duration)
    }
    audio.addEventListener('timeupdate', updateProgress)
    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
    }
  }, [])

  return (
    <>
      <main
        id="music"
        className={`${props.theme}${
          props.theme && props.settingPage ? ' ' : ''
        }${props.settingPage ? 'settingOpen' : ''}`}>
        <div className="musicView">
          <div className="musicContentView">
            {musicData.map((music) => (
              <div
                className="musicListBlock"
                key={music}
                onClick={() => handlePlay(music.name)}>
                <div className="listTitle">
                  <div className="listTitleL">
                    <img
                      src={`${process.env.PUBLIC_URL}/music/albumBG/${music.data[0].imgPath}`}
                      alt="test"
                    />
                    <p>{music.name}</p>
                  </div>
                  <div className="listTitleR">
                    <span>{music.singer}</span>
                  </div>
                </div>
                <div className="listInfo"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <div id="player" className={musicPlayer ? 'open' : ''}>
        <div className="musicPlayerContent" onClick={musicPlayerChange}>
          <img
            src={`${process.env.PUBLIC_URL}/music/albumBG/${
              imgPath ? imgPath : 'Empty.png'
            }`}
            alt="test"
          />
          <p>{name}</p>
          <span>{singer}</span>
        </div>
        <div className="musicControl">
          <div
            className="lastBtn"
            onClick={audioPath ? playPrevSong : () => {}}
            style={{ color: audioPath ? '' : '#dfdfdf' }}>
            <FontAwesomeIcon icon="fa-solid fa-backward-step" />
          </div>
          <div
            className="playBtn"
            onClick={musicPlayActiveChange}
            style={{ color: audioPath ? '' : '#dfdfdf' }}>
            {musicPlayActive ? (
              <FontAwesomeIcon icon="fa-solid fa-pause" />
            ) : (
              <FontAwesomeIcon
                icon="fa-solid fa-play"
                style={{ marginLeft: '3px' }}
              />
            )}
          </div>
          <div
            className="nextBtn"
            onClick={audioPath ? playNextSong : () => {}}
            style={{ color: audioPath ? '' : '#dfdfdf' }}>
            <FontAwesomeIcon icon="fa-solid fa-forward-step" />
          </div>

          <audio
            ref={audioRef}
            src={`${process.env.PUBLIC_URL}/music/audio/${audioPath}`}
            onEnded={() => setMusicPlayActive(false)}
            onPause={() => setMusicPlayActive(false)}
            onPlay={() => setMusicPlayActive(true)}></audio>
        </div>
      </div>
      <div id="progView">
        <progress
          id="musicProg"
          className={musicPlayer ? 'open' : ''}
          value={progress}
          max={1}
        />
        <input
          className={musicPlayer ? 'open' : ''}
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={(e) => {
            const newProgress = e.target.value
            setProgress(newProgress)
            audioRef.current.currentTime =
              newProgress * audioRef.current.duration
          }}
        />
      </div>
    </>
  )
}

export default Music
