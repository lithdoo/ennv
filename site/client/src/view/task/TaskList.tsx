import { group } from "@/style/common"
import { EnTask, TaskStatus } from "@/utils/task"
import styled from "styled-components"
import { statusColor } from "./_tools"
import { stateTaskList, TaskListLayout } from "@/state"
import { FileType } from "@/utils/file"
import { EnIcon } from "@ennv/components"
import { observer } from 'mobx-react'
import { useRef } from "react"

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

export const TaskList = observer(() => {

    const handelWheel = (e: any) => {
        console.log(e)
        console.log(e.wheelDelta)
        console.log(e.detail)
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail || -e.deltaY)));
        const target = scrollTarget.current
        console.log(target)

        if (target) {
            (target as HTMLDivElement).scrollTo({
                left: (target as HTMLDivElement).scrollLeft - delta * 80,
                behavior: 'smooth'
            })
        }
        // document.getElementById('yourDiv').scrollLeft -= (delta * 40); // Multiplied by 40
        e.preventDefault();
    }

    const scrollTarget = useRef<any>(null)

    return <TaskListContainer ref={scrollTarget} onWheel={handelWheel} data-status={stateTaskList.layout}>
        <div className="inner">{
            stateTaskList.list.map((task, key) => <TaskItem task={task} key={key} focus={task.id === stateTaskList.detail?.id} />)
        }</div>
    </TaskListContainer>
})

