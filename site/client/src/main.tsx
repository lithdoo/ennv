import React from 'react'
import ReactDOM from 'react-dom/client'
import './style/index.scss'

import styled from "styled-components"
import { MainDir } from "./view/MainDir"
import { MainInfo } from "./view/MainInfo"
import { MainRoot } from "./view/MainRoot"
import { group, vars } from "./style/common"
import { WorkspaceLayout, stateTaskList, stateWorkspaces } from "./state"
import { observer } from 'mobx-react'
import { MainTask } from "./view/MainTask"
import { connect } from './utils/task'

import './entry'
import './utils/webdav'
import { getLoadScripts, getLoadStylesheets } from './request/plugin'
import { MainTools } from './view/MainTools'

console.log(connect)

const MainContainer = styled.div`
    height:100%;
    width: 100%;
    min-height:600px;
    min-width:800px;
    display: grid;
    grid-template-areas:  'task task task'
                          'root tool tool'
                          'root dir info';
    ${group.trans_ease_out()}
    > *{
      ${group.trans_ease_out()}
      overflow: hidden;
    }

    > .task-container{
        grid-area: task;
    }
    > .info-container{
        grid-area: info;
    }
    > .root-container{
        grid-area: root;
    }
    > .dir-container{
        grid-area: dir;
    }
    > .tool-container{
        grid-area: tool;
    }
    grid-template-rows: auto auto 1fr;

    &.${WorkspaceLayout.sider}{
      grid-template-columns: ${vars.rootSiderWidth()} 1fr ${vars.infoSiderWidth};
    }

  
    &.${WorkspaceLayout.edit}{
      grid-template-columns: 1fr 0 0;
    }





`

const MainLayout = observer(() => {
  return (
    <MainContainer className={`${stateWorkspaces.layout} ${stateTaskList.layout}`}>
      <div className="task-container"><MainTask /></div>
      <div className="info-container"><MainInfo /></div>
      <div className="root-container"><MainRoot /></div>
      <div className="tool-container"><MainTools /></div>
      <div className="dir-container"><MainDir /></div>
    </MainContainer>
  )
})


getLoadScripts().then(list=>{
  list
    .map(src=>Object.assign(document.createElement('script'),{src}))
    .forEach(script=>document.head.appendChild(script))
})


getLoadStylesheets().then(list=>{
  list
    .map(href=>Object.assign(document.createElement('style'),{href,type:'stylesheet'}))
    .forEach(script=>document.head.appendChild(script))
})


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MainLayout></MainLayout>
  </React.StrictMode>,
)
