import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './style/index.scss'
import { MainLayout } from './layout/Main.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MainLayout>
      <App />
    </MainLayout>
  </React.StrictMode>,
)
