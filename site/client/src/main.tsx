import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './style/index.scss'
import { MainLayout } from './layout/Main.tsx'
import {MainDir} from './view/MainDir.tsx'
import {MainInfo} from './view/MainInfo.tsx'
import {MainRoot} from './view/MainRoot.tsx'
import {MainTask} from './view/MainTask.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MainLayout>
      {/* <App /> */}
      <MainDir />
      <MainInfo />
      <MainRoot />
      <MainTask />
    </MainLayout>
  </React.StrictMode>,
)
