import React from 'react'
import ReactDOM from 'react-dom/client'
import './style/index.scss'

import styled from "styled-components"
import { MainDir } from "./view/MainDir"
import { MainInfo } from "./view/MainInfo"
import { MainRoot } from "./view/MainRoot"
import { group, vars } from "./style/common"
import { TaskListLayout, WorkspaceLayout, stateTaskList, stateWorkspaces } from "./state"
import { observer } from 'mobx-react'
import { MainTask } from "./view/MainTask"
import { connect } from './utils/task'

console.log(connect)

const MainContainer = styled.div`
    height:100%;
    width: 100%;
    min-height:600px;
    min-width:800px;
    display: grid;
    grid-template-areas:  'task task task'
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


    &.${TaskListLayout.min}{
      grid-template-rows: ${vars.taskBarMinHeight()} 1fr;
    }

    &.${TaskListLayout.brief}{
      grid-template-rows: ${vars.taskBarHeight()} 1fr;
    }

    &.${TaskListLayout.max}{
      grid-template-rows: 1fr 0;
    }


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
      <div className="dir-container"><MainDir /></div>
    </MainContainer>
  )
})


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MainLayout></MainLayout>
  </React.StrictMode>,
)
