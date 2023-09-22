import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import ReactGA from "react-ga"
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

serviceWorkerRegistration.register()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)