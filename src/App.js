import React, { useState } from 'react'
import './App.css'
import { NewUpdatePost } from './AppData/NewUpdateData.js'
import { UpdatePost } from './AppData/UpdateData.js'

function App () {
  // Menu狀態
  const [menuActive, setActive] = useState(false)
  // Menu點擊事件處理
  const menuBtnClick = () => {
    setActive(prevActive => !prevActive)
  }

  // 頁面狀態
  const [homeSelect, setHomeSelect] = useState(true)
  const [postSelect, setPostSelect] = useState(false)
  const [folderSelect, setFolderSelect] = useState(false)
  const [developmentSelect, setDevelopmentSelect] = useState(false)

  // App更新內容頁面獲取資料庫‘content’內容換行
  const formatContent = (content) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>{line}</span>
    ))
  }

  return (
    <>
      <nav>
        <div id='header'>
          <ul id='header-ul'>
            <li id='header-li' className="version">
              <span>5.0 Beta 2</span>
            </li>
            <li id='header-li'>
              <img className="icon" src='./classdata-icon/classdata-icon.001.png'></img>
            </li>
            <li id='header-li' className='menuicon' onClick={menuBtnClick}>
              <span className={`menuicon-top ${menuActive ? 'active' : ''}`}></span>
              <span className={`menuicon-bottom ${menuActive ? 'active' : ''}`}></span>
            </li>
          </ul>
        </div>
        <menu id="menu" className={`${menuActive ? 'open' : ''}`}>
          <div id="menu-view">
            <div>
              <ul>
                <li></li>
                <li></li>
              </ul>
            </div>
          </div>
        </menu>
      </nav>

      <footer>
        <div id="footer">
          <ul id="footer-ul">
            <li id="footer-li" className="" onClick={() => [setHomeSelect(true), setPostSelect(false), setFolderSelect(false), setDevelopmentSelect(false)]}>
              <div className={`home-square li-borderRadius ${homeSelect ? '' : 'display-none'}`}></div>
              <div className={`home-circle-L li-circle-L ${homeSelect ? '' : 'display-none'}`}></div>
              <div className={`home-circle-R li-circle-R ${homeSelect ? '' : 'display-none'}`}></div>
              <div className={`li-view home ${homeSelect ? 'bg-black footerBoxShadow' : ''}`}>
                <i className="fa-solid fa-house"></i>
                <span>首頁</span>
              </div>
            </li>
            <li id="footer-li" className="" onClick={() => [setHomeSelect(false), setPostSelect(true), setFolderSelect(false), setDevelopmentSelect(false)]}>
              <div className={`post-square li-borderRadius ${postSelect ? '' : 'display-none'}`}></div>
              <div className={`post-circle-L li-circle-L ${postSelect ? '' : 'display-none'}`}></div>
              <div className={`post-circle-R li-circle-R ${postSelect ? '' : 'display-none'}`}></div>
              <div className={`li-view post ${postSelect ? 'bg-black footerBoxShadow' : ''}`}>
                <i className="fa-solid fa-bell"></i>
                <span>公告</span>
              </div>
            </li>
            <li id="footer-li" className="" onClick={() => [setHomeSelect(false), setPostSelect(false), setFolderSelect(true), setDevelopmentSelect(false)]}>
              <div className={`folder-square li-borderRadius ${folderSelect ? '' : 'display-none'}`}></div>
              <div className={`folder-circle-L li-circle-L ${folderSelect ? '' : 'display-none'}`}></div>
              <div className={`folder-circle-R li-circle-R ${folderSelect ? '' : 'display-none'}`}></div>
              <div className={`li-view folder ${folderSelect ? 'bg-black footerBoxShadow' : ''}`}>
                <i className="fa-solid fa-shapes"></i>
                <span>服務</span>
              </div>
            </li>
            <li id="footer-li" className="" onClick={() => [setHomeSelect(false), setPostSelect(false), setFolderSelect(false), setDevelopmentSelect(true)]}>
              <div className={`development-square li-borderRadius ${developmentSelect ? '' : 'display-none'}`}></div>
              <div className={`development-circle-L li-circle-L ${developmentSelect ? '' : 'display-none'}`}></div>
              <div className={`development-circle-R li-circle-R ${developmentSelect ? '' : 'display-none'}`}></div>
              <div className={`li-view development ${developmentSelect ? 'bg-black footerBoxShadow' : ''}`}>
                <i className="fa-solid fa-code"></i>
                <span>開發日誌</span>
              </div>
            </li>
          </ul>
        </div>
      </footer>

      <main id="home" style={{ display: homeSelect ? 'block' : 'none' }}>
        <div id="home-view">
          <div id="home-view-content">
            <section className="home-block">
              <div className="home-post">
                <div className="space" style={{ height: '150px' }}></div>
                <h1>全新介面</h1>
                <span>平台回爐重造！</span>
              </div>
              <div className="home-post">
                <div className="space" style={{ height: '150px' }}></div>
                <h1>全新架構</h1>
                <span>平台架構升級！</span>
              </div>
            </section>
            <section className="home-block">
              <div className="home-post">
                <div className="space" style={{ height: '150px' }}></div>
                <h1>課程表</h1>
              </div>
            </section>
          </div>
        </div>
        <br />
        <br />
      </main>

      <main id="post" style={{ display: postSelect ? 'block' : 'none' }}>
        <div id="post-view">
          <div id="post-view-content">
            <section className="post-block">
              <h1>校務公告</h1>
              <div className="post-post bg-red-orange">
                <h5>2023.1.23 MON</h5>
                <h1>開學日 2/13 MON</h1>
              </div>
              <div className="post-post bg-red-orange">
                <h5>2023.1.21 SAT</h5>
                <h1>寒假輔導課</h1>
                <span>於 2/6 Mon ~ 2/10 Fri 舉辦</span>
              </div>
            </section>
            <section className="post-block">
              <div className="post-post">
                <h1></h1>
              </div>
            </section>
          </div>
        </div>
        <br />
        <br />
      </main>

      <main id="folder" style={{ display: folderSelect ? 'block' : 'none' }}>
        <div id="folder-view">
          <div id="folder-view-content">
            <section class="folder-block">
              <h1 class="OpenHide">服務</h1>
              <div class="folder-post">
                <div class="space" style={{ height: '50px' }}></div>
                <h1>課程表</h1>
                <span>二年甲班 課程表</span>
              </div>
            </section>
            <section class="folder-block">
              <h1 class="OpenHide">工具</h1>
              <div class="folder-post">
                <span>開發中...</span>
              </div>
            </section>
          </div>
        </div>
        <br />
        <br />
      </main>

      <main id="development" style={{ display: developmentSelect ? 'block' : 'none' }}>
        <div className='navSpace'></div>
        <div id="development-view">
          <div id="development-view-content">
            <section className="development-block">
              <h1 className="newVersion">當前版本</h1>
              {NewUpdatePost.map(NewUpdatePost => (
                <div className="development-post bg-purple-blue">
                  <h1>{NewUpdatePost.title}</h1>
                  <h5>{NewUpdatePost.time}</h5>
                  {formatContent(NewUpdatePost.content)}
                </div>
              ))}
            </section>
            <section className="development-block">
              <h1 className="newVersion">歷史版本</h1>
              {UpdatePost.map(UpdatePost => (
                <div className="development-post bg-history">
                  <h3>{UpdatePost.title}</h3>
                  <h5>{UpdatePost.time}</h5>
                  {formatContent(UpdatePost.content)}
                </div>
              ))}
            </section>
          </div>
        </div>
        <br />
        <br />
      </main>
    </>
  )
}

export default App