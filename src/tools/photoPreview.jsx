import React, { useEffect, useState } from 'react'
import './css/photoPreview.css'

// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function PhotoPreview(props) {
  const [scale, setScale] = useState()

  // console.log(scale)
  useEffect(() => {
    setScale()
    setCurrentPos({ x: 0, y: 0 })
    setDragStart({ x: 0, y: 0 })
  }, [props.photoPreviewUrl])

  const handleWheel = (event) => {
    if (!scale) {
      setScale(1)
    }
    // const whellOffset0 = -0.0001
    // const whellOffset1 = -0.0001
    const newScale = scale + event.deltaY * 0.0005
    if (newScale >= 1 && newScale <= 1.75) {
      const rect = event.target.getBoundingClientRect()
      const offsetX = event.clientX - rect.left
      const offsetY = event.clientY - rect.top
      const dx = offsetX - rect.width / 2
      const dy = offsetY - rect.height / 2
      const newCurrentPos = {
        x: currentPos.x - dx * (newScale - scale),
        y: currentPos.y - dy * (newScale - scale),
      }

      setScale(newScale)
      setCurrentPos(newCurrentPos)
      if (scale < 1.1 && newScale < 1.005) {
        setScale()
        setCurrentPos({ x: 0, y: 0 })
      }
      console.log(newScale)
    }
  }

  const [isDragging, setIsDragging] = useState(false)
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = (event) => {
    event.preventDefault()
    setIsDragging(true)
    setDragStart({
      x: event.clientX - currentPos.x,
      y: event.clientY - currentPos.y,
    })
  }
  const handleMouseMove = (event) => {
    if (isDragging) {
      setCurrentPos({
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y,
      })
    }
  }
  const handleMouseUp = () => {
    setIsDragging(false)
    if (scale < 1.1 || !scale) {
      setCurrentPos({ x: 0, y: 0 })
    }
  }

  const handleTouchStart = (event) => {
    setIsDragging(true)
    setDragStart({
      x: event.touches[0].clientX - currentPos.x,
      y: event.touches[0].clientY - currentPos.y,
    })
  }

  let lastDistance = null
  const handleTouchMove = (event) => {
    if (event.touches.length === 1) {
      // 單指觸控，執行移動圖片的操作
      if (isDragging) {
        setCurrentPos({
          x: event.touches[0].clientX - dragStart.x,
          y: event.touches[0].clientY - dragStart.y,
        })
      }
    } else if (event.touches.length === 2) {
      // 獲取兩個觸摸點的坐標
      const x1 = event.touches[0].clientX
      const y1 = event.touches[0].clientY
      const x2 = event.touches[1].clientX
      const y2 = event.touches[1].clientY

      // 計算兩個觸摸點之間的距離
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

      if (lastDistance !== null) {
        // 計算縮放比例
        const newScale = distance / lastDistance

        // 更新圖片的縮放
        setScale(newScale)
      }

      lastDistance = distance
    }
  }
  const handleTouchEnd = () => {
    setIsDragging(false)
    if (scale < 1.1 || !scale) {
      setCurrentPos({ x: 0, y: 0 })
    }
    lastDistance = null
  }

  return (
    <div
      id="photoPreview"
      className={`${props.theme}${
        props.photoPreviewUrl && props.theme ? ' ' : ''
      }${props.photoPreviewUrl ? 'open' : ''}`}>
      <div className="photoView">
        <img
          src={props.photoPreviewUrl}
          alt=""
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `${
              currentPos.x != 0 && currentPos.y != 0
                ? `translate(${currentPos.x}px, ${currentPos.y}px)`
                : ''
            } ${scale ? `scale(${scale})` : ''}`,
            transition: `${
              currentPos.x != 0 || (currentPos.y != 0 && scale < 1.1)
                ? '0s'
                : '0.5s cubic-bezier(0.5, 0, 0.3, 1)'
            }`,
          }}
        />
        <div
          className="photoMask"
          onClick={() => props.setPhotoPreviewUrl('')}></div>
      </div>
    </div>
  )
}

export default PhotoPreview
