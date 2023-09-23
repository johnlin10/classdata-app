import React, { useEffect, useState } from 'react'
import { useNavigate, Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet'
// CSS
import '../App.css'
// 自定義函式庫
import useUrlParams from '../js/UpdateUrlParams'
// DataBase
import { ServiceData, ToolsData, DocsData } from '../AppData/AppData.js'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Service(props) {
  // 頁面動畫
  const [pageTitleAni, setPageTitleAni] = useState(true)
  useEffect(() => {
    setPageTitleAni(false)
  }, [])
  const { urlParams, removeUrlParam, addUrlParams } = useUrlParams()
  return (
    <>
      <main
        id="folder"
        className={`${props.theme}${
          props.theme && props.settingPage ? ' ' : ''
        }${props.settingPage ? 'settingOpen' : ''}`}>
        <Helmet>
          <title>班級資訊平台｜服務</title>
          <meta name="description" content="學校、班級的最新資訊" />
          <meta property="og:title" content="班級資訊平台" />
          <meta property="og:description" content="學校、班級的最新資訊" />
        </Helmet>
        <div className={`view${pageTitleAni ? ' PTAni' : ''}`}>
          <div id="folder-view">
            <div id="folder-view-content">
              <h1 className="services">服務</h1>
              <section className="folder-block">
                {ServiceData.map((ServiceData, index) => (
                  <div
                    className={ServiceData.classbackground}
                    onClick={
                      ServiceData.link
                        ? () => props.navigateClick(ServiceData.link)
                        : () => {}
                    }
                    key={index}>
                    <div
                      className="space"
                      style={{
                        height: ServiceData.divHight,
                        backgroundImage: ServiceData.stylebackground
                          ? `url(${process.env.PUBLIC_URL}${ServiceData.stylebackground})`
                          : '',
                      }}></div>
                    <div className="serviceBlockTitle">
                      <div>
                        <h1>{ServiceData.ServiceName}</h1>
                        <span>{ServiceData.content}</span>
                      </div>
                      {ServiceData.btn && (
                        <button
                          onClick={
                            ServiceData.btn[0].link
                              ? () => window.open(ServiceData.btn[0].link)
                              : ServiceData.btn[0].function
                          }>
                          {ServiceData.btn[0].content}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </section>
              <h1 className="tools">工具</h1>
              <section className="folder-block">
                {ToolsData.map((ToolsData, index) => (
                  <div
                    className={ToolsData.class}
                    style={{ backgroundImage: ToolsData.stylebackground }}
                    key={index}
                    onClick={() => props.navigateClick(ToolsData.link)}>
                    <div
                      className={`target ${
                        ToolsData.class.includes('target') ? 'active' : ''
                      }`}>
                      <FontAwesomeIcon icon="fa-solid fa-link" />
                    </div>
                    {/* <div
                    className="space"
                    style={{ height: ToolsData.divHight }}></div>
                  <h1>{ToolsData.ServiceName}</h1>
                  <span>{ToolsData.content}</span> */}

                    <div
                      className="space"
                      style={{
                        height: ToolsData.divHight,
                        backgroundImage: ToolsData.stylebackground
                          ? `url(${process.env.PUBLIC_URL}${ToolsData.stylebackground})`
                          : '',
                      }}></div>
                    <div className="serviceBlockTitle">
                      <div>
                        <h1>{ToolsData.ServiceName}</h1>
                        <span>{ToolsData.content}</span>
                      </div>
                      {ToolsData.btn && (
                        <button
                          onClick={
                            ToolsData.btn[0].link
                              ? () => window.open(ToolsData.btn[0].link)
                              : ToolsData.btn[0].function
                          }>
                          {ToolsData.btn[0].content}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </section>
              <h1 className="docs">文檔</h1>
              <section className="folder-block">
                {DocsData.map((DocsData, index) => (
                  <div
                    className={DocsData.class}
                    style={{ backgroundImage: DocsData.stylebackground }}
                    key={index}
                    onClick={() => [props.openDoc(DocsData.url)]}>
                    <div
                      className={`target ${
                        DocsData.class.includes('target') ? 'active' : ''
                      }`}>
                      <FontAwesomeIcon icon="fa-solid fa-link" />
                    </div>
                    <div
                      className="space"
                      style={{
                        height: DocsData.divHight,
                        backgroundImage: DocsData.stylebackground
                          ? `url(${process.env.PUBLIC_URL}${DocsData.stylebackground})`
                          : '',
                      }}></div>
                    <div className="serviceBlockTitle">
                      <div>
                        <h1>{DocsData.ServiceName}</h1>
                        <span>{DocsData.content}</span>
                      </div>
                      {DocsData.btn && (
                        <button
                          onClick={
                            DocsData.btn[0].link
                              ? () => window.open(DocsData.btn[0].link)
                              : DocsData.btn[0].function
                          }>
                          {DocsData.btn[0].content}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </div>
        </div>
      </main>
      <Outlet />
    </>
  )
}

export default Service
