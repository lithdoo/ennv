import styled from "styled-components"
import { useState } from "react";
import { EnIconBtn, HeightHideBox } from "../components";
import { EnTask } from "../model/task";
import { taskList } from "../model/_mock";
import { group } from "../style/common";
import { EnIcon } from "@ennv/components";

const cssVar = {
    barHeight: '72px',
    minHeight: '24px'
}

const transiton = `
    transition: all 0.3s ease;
    *{ transition: all 0.3s ease; }
    `

const Container = styled.div`
    grid-area: header;
    ${transiton}

    border-bottom: 1px solid #ececec;
    &.bar{
        height: ${cssVar.barHeight}
    }

    &.min{
        height: ${cssVar.minHeight}
    }

    .bar-container{
        display: flex;
        flex-direction: row;
    }

`

export const MainTask = () => {
    const [status, setStatus] = useState<'bar' | 'min'>('bar')

    return (
        <Container className={status}>
            <HeightHideBox innerClassName="bar-container" height={cssVar.barHeight} hide={status !== 'bar'}>
                <TaskList tasks={taskList}></TaskList>
                <TaskBtnGroup onMinimize={() => { setStatus('min') }}></TaskBtnGroup>
            </HeightHideBox>

            <HeightHideBox height={cssVar.minHeight} hide={status !== 'min'} >
                <b style={{ lineHeight: cssVar.minHeight }} onClick={() => { setStatus('bar') }}>test</b>
            </HeightHideBox>
        </Container>
    )
}


const TaskItemContainer = styled.div`
    background: #ccc;
    margin: 6px;
    border-radius: 6px;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,0.2);
    padding: 0 12px;
    
    > svg{
        font-size:36px;
        margin-right: 12px
    }

    > div{
        margin-right:6px
    }
    .action-name{
        font-size:14px;
        line-height: 18px;
    }
    
    .target-path{
        font-size:12px;
    }

    ${group.flex_row}
    ${group.flex_center}

`
const TaskItem = ({ task }: { task: EnTask }) => {
    return (
        <TaskItemContainer>
            <EnIcon kind={task.action.icon}></EnIcon>
            <div>
                <div className="action-name">{task.action.name}</div>
                <div className="target-path">{task.target.dirPath}</div>
            </div>
        </TaskItemContainer>
    )
}


const TaskListContainer = styled.div`
    flex:1 1 auto;

    padding: 4px;
    height: 100%;

    ${group.flex_row}
    justify-content: flex-start;
    flex-wrap: nowrap;
    align-items: stretch;

`

const TaskList = ({ tasks }: { tasks: EnTask[] }) => {
    return <TaskListContainer>{
        tasks.map((task,key) => <TaskItem task={task}  key={key}/>)
    }</TaskListContainer>
}


const TaskBtnGroupContainer = styled.div`
    flex: 0 0 auto;
`

const TaskBtnGroup = ({ onMinimize = () => { } }) => {
    return (
        <TaskBtnGroupContainer style={{ float: "right" }}>
            <EnIconBtn onClick={onMinimize}></EnIconBtn>
        </TaskBtnGroupContainer>
    )
}
