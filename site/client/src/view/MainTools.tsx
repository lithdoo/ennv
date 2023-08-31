import styled from "styled-components";
import { group } from "../style/common";
import { TaskListLayout, stateCurrentDir, stateTaskList } from "@/state";
import { observer } from "mobx-react";
import * as webdav from '@/utils/webdav'
import { EnIcon } from "@ennv/components";

const Container = styled.div`
    height: 40px;
    padding: 4px 8px;
    border-bottom: 1px solid #eee;
    ${group.flex_row()}
    ${group.flex_center()}
    ${group.trans_ease_out()}

    &.${TaskListLayout.max}{
        padding: 0 12px;
        height: 0;
        border-bottom: 0px solid #eee;
    }

    &.${TaskListLayout.detail}{
        padding: 0 12px;
        height: 0;
        border-bottom: 0px solid #eee;
    }
`

export const MainTools = observer(() => {
    return (
        <Container className={stateTaskList.layout}>
            <RouteList></RouteList>
        </Container>
    )
})



const RouteListContainer = styled.div`
    flex: 1 1 0;
    display:flex;
    flex-direction: row;
    align-items:center;

    .route-list{
        font-size: 14px;
        line-height: 32px;
        font-weight: bolder;

        .root{
            color: #999;
            font-weight:bold;
            padding: 0 2px;
            cursor: pointer;

            svg {
                margin-right: 4px;
                font-size: 18px;
                transform: translateY(2px);
            }
        }
        .route{
            padding: 0 2px;
            cursor: pointer;
        }
        .div{
            line-height: 32px;
            font-size: 14px;
            padding: 0 4px;
        }
    }    
`
const RouteList = observer(() => {

    const routes = (() => {
        if (!stateCurrentDir.ws) return []
        if (!stateCurrentDir.folder) return []
        const wsPath = stateCurrentDir.ws.folder.filename
        const curPath = stateCurrentDir.folder.filename
        if (curPath.indexOf(wsPath) !== 0) return []
        return curPath.replace(wsPath, '').split('/').filter(v => !!v).reduce((res, name) => {
            const above = res[res.length - 1] ? res[res.length - 1].path : wsPath
            const path = `${above}/${name}`
            return res.concat([{ path, name }])
        }, [] as { path: string, name: string }[])
    })()

    const open = async (path: string) => {
        const ws = stateCurrentDir.ws
        const stat = await webdav.getFileDetail(path);
        if ((ws) && (ws === stateCurrentDir.ws)) stateCurrentDir.open(ws, stat)
    }
    
    return (
        <RouteListContainer>
            <div className="route-list">

                <span className="root" onClick={() => {
                    const rootPath = stateCurrentDir.ws?.folder.filename
                    if (rootPath) open(rootPath)
                }}>
                    <EnIcon kind={['i_ennv','home']} /> 工作空间
                </span>
                <span className="div">/</span>
                {
                    routes.map((route, index) => <span key={index}>
                        <span className="route" onClick={() => { open(route.path) }}>{route.name}</span>
                        {index < (routes.length - 1) ? <span className="div">/</span> : ''}
                    </span>)
                }
            </div>
        </RouteListContainer>
    )
})
