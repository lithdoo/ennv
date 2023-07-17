import styled from "styled-components"
import { EnIconBtn, HeightHideBox } from "../components";
import { group } from "../style/common";
import { EnIcon } from "@ennv/components";
import { observer } from 'mobx-react'
// import { BarStatus, barState } from "@/state/roots";
import { TaskListLayout, stateTaskList } from "@/state";
import { EnTask, TaskStatus } from "@/utils/task";
import { fileicon, filename } from "@/utils/base";
import { useEffect, useRef } from "react";

const cssVar = {
    barHeight: '72px',
    minHeight: '24px'
}

const transiton = `
    transition: all 0.6s ease;
    *{ transition: all 0.6s ease; }
    `

const Container = styled.div`
    grid-area: header;
    ${transiton}

    border-bottom: 1px solid #ececec;

    .bar-container{

        ${group.flex_col()}

        .task-detail-outer{


        }
        .task-list-outer{
    
        }
        .task-detail-inner{
            background:#66ccff;
        }
    
        .task-list-inner{
            display: flex;
            flex-direction: row;
        }
    }





    &.${TaskListLayout.brief}{
        height: ${cssVar.barHeight};

        .task-detail-outer{
            flex: 0 0 auto;
            height: 0;

        }
        .task-list-outer{
            flex: 0 0 auto;
            height: ${cssVar.barHeight};
        }
    }

    &.${TaskListLayout.min}{
        height: ${cssVar.minHeight};

        .task-detail-outer{
            flex: 0 0 auto;
            height: 0;

        }
        .task-list-outer{
            flex: 0 0 auto;
            height: ${cssVar.barHeight};
        }
    }

    
    &.${TaskListLayout.max}{
        height: 100vh;
        .task-detail-outer{
            flex: 0 0 auto;
            height: 0;

        }
        .task-list-outer{
            flex: 0 0 auto;
            height: 100%;
        }

    }

    &.${TaskListLayout.detail}{
        height: 100vh;
        .task-detail-outer{
            flex: 1 1 0;
            height: 0;
        }
        .task-list-outer{
            flex: 0 0 auto;
            height: ${cssVar.barHeight};
        }
    }

`

export const MainTask = observer(() => {
    // const [status, setStatus] = useState<'bar' | 'min'>('bar')

    const detail :React.LegacyRef<HTMLDivElement>= useRef(null)


    useEffect(()=>{
        detail.current?.appendChild(stateTaskList.detailElement)
    })

    return (
        <Container className={stateTaskList.layout}>
            <HeightHideBox innerClassName="bar-container"
                height={
                    ((stateTaskList.layout === TaskListLayout.min) ||
                        (stateTaskList.layout === TaskListLayout.brief))
                        ? cssVar.barHeight
                        : "100%"
                }
                hide={stateTaskList.layout === TaskListLayout.min}>

                <div className="task-list-outer">
                    <div className="task-list-inner">
                        <TaskList tasks={stateTaskList.list} focus={stateTaskList.detail}></TaskList>
                        <TaskBtnGroup
                            onMinimize={() => { stateTaskList.min() }}
                            onMaximize={() => { stateTaskList.max() }}
                        ></TaskBtnGroup>
                    </div>
                </div>

                <div className="task-detail-outer">
                    <div className="task-detail-inner" ref={detail}>
                    </div>
                </div>

            </HeightHideBox>

            <HeightHideBox height={cssVar.minHeight} hide={stateTaskList.layout !== TaskListLayout.min} >
                <b style={{ lineHeight: cssVar.minHeight }} onClick={() => { stateTaskList.brief() }}>test</b>
            </HeightHideBox>
        </Container>
    )
})


const statusColor = (status: TaskStatus, op: number = 1) => {
    switch (status) {
        case TaskStatus.undo:
            return `rgba(86,86,86,${op * 255})`;
        case TaskStatus.preparing:
            return `rgba(0,0,255,${op * 255})`
        case TaskStatus.pendding:
            return `rgba(255,255,0,${op * 255})`
        case TaskStatus.error:
            return `rgba(255,0,0,${op * 255})`
        case TaskStatus.completed:
            return `rgba(0,255,0,${op * 255})`
        case TaskStatus.canceled:
            return `rgba(128,128,128,${op * 255})`
    }
}

const TaskItemContainer = styled.div`
    margin: 4px;
    border-radius: 6px;
    padding: 0 12px;
    height: 56px;


    ${[
        TaskStatus.undo,
        TaskStatus.preparing,
        TaskStatus.pendding,
        TaskStatus.error,
        TaskStatus.completed,
        TaskStatus.canceled,
    ].map(status => ({ status, color: statusColor(status) }))
        .map(({ status, color }) => `
    &[data-status="${status}"]{
        border: 1px solid ${color};
    }

    &[data-status="${status}"][data-focus="true"]{
        box-shadow: 0 2px 6px 0 rgba(0,0,0,0.2);
        background:${color};
        color: #fff;
    }

    
    `)


    }
   

    ${group.flex_row}
    ${group.flex_center}
    ${group.trans_ease_out()}
    
    > svg{
        font-size:36px;
        margin-right: 12px
    }

    > div{
        margin-right:4px;
    }
    .action-name{
        font-size:14px;
        line-height: 18px;
    }
    
    .target-path{
        font-size:12px;
    }


`
const TaskItem = observer(({ task, focus }: { task: EnTask, focus: boolean }) => {
    return (
        <TaskItemContainer
            data-focus={focus}
            data-status={task.status}
            onClick={() => { stateTaskList.focus(task) }}
        >
            <EnIcon kind={fileicon(task.path)}></EnIcon>
            <div>
                <div className="action-name">{filename(task.path)}</div>
                <div className="target-path">{task.path}</div>
            </div>
        </TaskItemContainer>
    )
})

const TaskListContainer = styled.div`
    flex:1 1 auto;

    padding: 4px;
    height: 100%;

    ${group.flex_row}
    justify-content: flex-start;
    flex-wrap: nowrap;
    align-items: stretch;

`

const TaskList = observer(({ tasks, focus }: { tasks: EnTask[], focus?: EnTask }) => {
    return <TaskListContainer>{
        tasks.map((task, key) => <TaskItem task={task} key={key} focus={task.id === focus?.id} />)
    }</TaskListContainer>
})


const TaskBtnGroupContainer = styled.div`
    flex: 0 0 auto;
`

const TaskBtnGroup = ({
    onMinimize = () => { },
    onMaximize = () => { },
}) => {
    return (
        <TaskBtnGroupContainer style={{ float: "right" }}>
            <EnIconBtn onClick={onMinimize}></EnIconBtn>
            <EnIconBtn onClick={onMaximize}></EnIconBtn>
        </TaskBtnGroupContainer>
    )
}
