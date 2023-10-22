import styled from "styled-components"
import { observer } from 'mobx-react'
import { useEffect, useRef } from "react";

import { HeightHideBox } from "@/components";
import { group } from "@/style/common";
import { TaskListLayout, stateTaskList } from "@/state";
import { TaskStatus } from "@/utils/task";

import { TaskBtnGroup } from "./BtnGroup";
import { TaskList } from "./TaskList";
import { statusColor } from "./_tools";

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
                        <TaskList></TaskList>
                        <TaskBtnGroup></TaskBtnGroup>
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
