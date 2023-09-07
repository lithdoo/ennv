import styled from "styled-components"
import { EnIconBtn, HeightHideBox } from "../components";
import { group } from "../style/common";
import { EnIcon } from "@ennv/components";
import { observer } from 'mobx-react'
import { TaskListLayout, stateTaskList } from "@/state";
import { EnTask, TaskStatus } from "@/utils/task";
import { useEffect, useRef } from "react";
import { FileType } from "@/utils/file";

const cssVar = {
    barHeight: '56px',
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
    .bar-container{

        ${group.flex_col()}

        .task-detail-outer{
            overflow:hidden;
        }
        .task-detail-inner{
            border-top:1px solid rgb(236, 236, 236);
            height:100%;
            min-height:300px;
        }
        .task-list-outer{
    
        }
    
        .task-list-inner{
            display: flex;
            flex-direction: row;
        }
    }


    .task-min-content{
        cursor: pointer;
        text-align:center;
        .blank{
            color: rgba(0,0,0,0.4)
        }
        .task-min-count{
            padding 0 12px;
            display: inline-block;
            line-height:18px;
            border-radius: 8px;
            font-size: 12px;
            color: #fff;
            margin: 0 4px;
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

        
        .task-list-inner{
            height: 100vh;
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
    const detail: React.LegacyRef<HTMLDivElement> = useRef(null)
    useEffect(() => {
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
                            onBrief={() => { stateTaskList.brief() }}
                        ></TaskBtnGroup>
                    </div>
                </div>

                <div className="task-detail-outer">
                    <div className="task-detail-inner" ref={detail}>
                    </div>
                </div>

            </HeightHideBox>

            <HeightHideBox height={cssVar.minHeight} hide={stateTaskList.layout !== TaskListLayout.min} >
                <div className="task-min-content" onClick={() => { stateTaskList.brief() }}>
                    <b><TaskMinText /></b>
                </div>
            </HeightHideBox>
        </Container>
    )
})



export const TaskMinText = observer(() => {

    if (!stateTaskList.list.filter(v => v.status !== TaskStatus.undo).length)
        return <span className="blank">暂无任务</span>

    const span = (status: TaskStatus) => {
        const length = stateTaskList.list.filter(v => v.status === status).length
        if (!length) return ''
        return <span className="task-min-count" style={{ background: statusColor(status) }}>{status}: {length}</span>
    }

    return <>
        {span(TaskStatus.preparing)}
        {span(TaskStatus.pendding)}
        {span(TaskStatus.error)}
        {span(TaskStatus.completed)}
        {span(TaskStatus.canceled)}
    </>
})


const statusColor = (status: TaskStatus, op: number = 1) => {
    switch (status) {
        case TaskStatus.undo:
            return `rgba(107, 170, 179,${op * 255})`;
        case TaskStatus.preparing:
            return `rgba(1, 186, 239,${op * 255})`
        case TaskStatus.pendding:
            return `rgba(255,126,71,${op * 255})`
        case TaskStatus.error:
            return `rgba(218,27,43,${op * 255})`
        case TaskStatus.completed:
            return `rgba(0,255,197,${op * 255})`
        case TaskStatus.canceled:
            return `rgba(118,124,167,${op * 255})`
    }
}

const TaskItemContainer = styled.div`
    margin: 0 0;
    border-radius: 6px;
    padding: 0 12px;
    height: 48px;
    color: #565656;
    width: 180px;
    flex: 0 0 auto;

    ${group.trans_ease_out()}

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
        border: 2px solid ${color};
    }

    &[data-status="${status}"][data-focus="true"]{
        box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 1px;
        background:${color};
        color: #fff;
    }
    
    `)


    }
   

    ${group.flex_row}
    ${group.flex_center}
    ${group.trans_ease_out()}
    
    > svg{
        font-size:32px;
        margin-right: 8px;
        margin-left: -4px;
        flex: 0 0 auto;
    }

    > div{
        margin-right:4px;
        flex: 1 1 auto;
        overflow: hidden;
    }
    .action-name{
        margin-top: -4px;
        font-size: 14px;
        font-weight: 600;
        color: #666;
        line-height: 22px;
        ${group.ellipsis()}
    }
    
    .target-path{
        font-size: 12px;
        line-height: 14px;
        color: #999;
        ${group.ellipsis()}
    }


`
const TaskItem = observer(({ task, focus }: { task: EnTask, focus: boolean }) => {
    return (
        <TaskItemContainer
            data-focus={focus}
            data-status={task.status}
            onClick={() => { stateTaskList.focus(task) }}
        >
            <EnIcon kind={FileType.type(task.fileStat.basename).icon}></EnIcon>
            <div>
                <div title={task.fileStat.basename} className="action-name">{task.fileStat.basename}</div>
                <div title={task.path} className="target-path">{task.path}</div>
            </div>
        </TaskItemContainer>
    )
})

const TaskListContainer = styled.div`
    flex:1 1 auto;
    overflow: auto;
    height: 56px;
    padding: 0 4px;
    ${group.trans_ease_out()}
    ${group.flex_row_center()}

    .inner{
        width: 100%;
        height: 48px;
        display: grid;
        grid-auto-flow:column; 
        justify-content:start;
        align-items: start;
        grid-gap: 4px;
        padding: 0 0;
        ${group.trans_ease_out()}
    }

    &[data-status="${TaskListLayout.max}"] {
        height: 100vh;
        .inner{
            justify-content:center;
            height: 100vh;
            padding: 72px 120px;
            grid-auto-flow:row; 
            grid-gap: 8px;
            grid-template-columns: repeat(auto-fill, 180px);
            grid-template-rows: repeat(auto-fill, 48px);
        }
    }

    &::-webkit-scrollbar-track
    {
        background-color: #FFFFFF;
    }

    &::-webkit-scrollbar
    {
        width: 4px;
        height: 4px;
        background-color: #FFFFFF;
    }

    &::-webkit-scrollbar-thumb
    {
        border-radius: 2px;
        background-color: #ccc;
    }

`

const TaskList = observer(({ tasks, focus }: { tasks: EnTask[], focus?: EnTask }) => {

    const handelWheel = (e:any)=>{
        console.log(e)
        console.log(e.wheelDelta)
        console.log(e.detail)
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail || -e.deltaY)));
        const target = scrollTarget.current 
        console.log(target)

        if(target){
            (target as HTMLDivElement).scrollTo({
                left:(target as HTMLDivElement).scrollLeft - delta * 80,
                behavior: 'smooth'
            })
        }
        // document.getElementById('yourDiv').scrollLeft -= (delta * 40); // Multiplied by 40
        e.preventDefault();
    }

    const scrollTarget = useRef<any>(null)

    return <TaskListContainer ref={scrollTarget} onWheel={handelWheel}  data-status={stateTaskList.layout}>
        <div className="inner">{
            tasks.map((task, key) => <TaskItem task={task} key={key} focus={task.id === focus?.id} />)
        }</div>
    </TaskListContainer>
})

const TaskBtnGroupContainer = styled.div`
    flex: 0 0 auto;
    border-left: 1px solid rgb(238, 238, 238);
    padding: 2px;
`

const TaskBtnGroup = observer(({
    onMinimize = () => { },
    onMaximize = () => { },
    onBrief = () => { },
}) => {
    return (
        <TaskBtnGroupContainer style={{ float: "right" }}>
            <div>
                <EnIconBtn icon={['i_ennv', 'minimize']} onClick={onMinimize}></EnIconBtn>{
                    stateTaskList.status === TaskListLayout.brief
                        ? <EnIconBtn icon={['i_ennv', 'unfold-more']} onClick={onMaximize}></EnIconBtn>
                        : <EnIconBtn icon={['i_ennv', 'unfold-less']} onClick={onBrief}></EnIconBtn>
                }
            </div>
            <div>
                <EnIconBtn icon={['i_ennv', 'delete-outline']} onClick={onMaximize}></EnIconBtn>
                <EnIconBtn icon={['i_ennv', 'more-hor']} onClick={onMaximize}></EnIconBtn>
            </div>
        </TaskBtnGroupContainer>
    )
})
