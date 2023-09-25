import { observer } from "mobx-react"

import logo from '@/assets/favicon500.png'
import styled from "styled-components"
import { group } from "@/style/common"
import { FolderTree } from "@/components/tree"
import { stateCurrentDir, stateWorkspaces } from "@/state"
import * as webdav from '@/utils/webdav'

const Container = styled.div`

    ${group.flex_col()}
    ${group.flex_center()}
    ${group.trans_ease_out()}
    height: 100%;

    .root-logo{
        width: 100%:
        flex: 0 0 auto;
        ${group.flex_row()}
        ${group.flex_center()}
        img{
            display: block;
            width: 36px;
            height: 36px;
            margin-left: -16px;
            margin-top: -2px;
        }
        h1 {
            font-size:28px;
            line-height: 40px;
            margin: 12px 0 8px 16px;
            color: #666;
        }
    }
    .root-select-ws-item{
        
        ${group.trans_ease_out()}
        ${group.flex_col()}
        flex: 0 0 auto;
        height: 48px;
        width: 100%;
        overflow:hidden;
        margin: 4px 0;

        .root-select-ws-title{
            ${group.trans_ease_out()}
            height: 48px;
            flex: 0 0 auto;
            padding: 1px 16px;
            position: relative;
            font-weight: bolder;
            opacity: 0.7;
            background: rgba(0,0,0,0);
            cursor: pointer;

            &::before{
                ${group.trans_ease_out()}
                content: "";
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 0;
                background:rgb(23, 92, 235);
                border-radius: 0 3px 3px 0;
            }


            >.root-select-ws-title-name{
                line-height: 26px;font-size: 16px;
            }

            >.root-select-ws-title-path{
                line-height: 18px;font-size: 12px; color: #666;
            }
        }

        &[data-current="true"]{
            .root-select-ws-title{
                background: rgb(233, 235, 237);
                opacity: 1;
                
                &::before{
                    width: 6px;
                }
            }
        }
        .root-select-ws-tree{
            flex: 1 1 0;
            overflow: auto;
            padding: 4px 0px;

            .title:hover{
                opacity: 1;
                background: rgba(0,0,0,0.06);
            }
            
            .title{
                transition: all 0.3s ease;
                font-weight: 600!important;
                opacity: 0.7;
                color: rgb(0, 0, 0);
                margin: 1px 0;
            }

            .selected {
                > .title{
                    color:rgb(23, 92, 235);
                    transition: all 0.3s ease;
                    background: rgba(0,0,0,0.06);
                }
            }

            &::-webkit-scrollbar-track
            {}
        
            &::-webkit-scrollbar
            {
                width: 4px;
            }
        
            &::-webkit-scrollbar-thumb
            {
                border-radius: 2px;
                background-color:  #ccc;
            }

        }

        &[data-current="true"]{
            flex: 1 1 auto;
        }
    }

    .root-select-add-btn{
        ${group.trans_ease_out()}
        flex: 0 0 auto;
        height:40px;
        width:40px;
        border-radius: 50%;
        margin: 16px;
        line-height:36px;
        text-align:center;
        border: 2px solid rgb(23, 92, 235);
        color: rgb(23, 92, 235);
        font-size: 24px;
        cursor: pointer;
        background: rgba(255,255,255,0);
        &:hover{
            background: rgba(255,255,255,0.2);
            border: 1px solid rgb(23, 92, 235);
        }
    }

`

export const DirTreeList = observer(() => {

    return <Container>
        <div className="root-logo">
            <img src={logo} alt="ennv" />
            <h1>Ennv</h1>
        </div>
        {stateWorkspaces.list.map(ws => <div
            key={ws.folder.filename}
            className="root-select-ws-item"
            data-current={ws.folder.filename === stateWorkspaces.current?.folder.filename}
        >
            <div className="root-select-ws-title" onClick={() => stateWorkspaces.focus(ws)}>
               <div className="root-select-ws-title-name"> {ws.folder.basename}</div>
               <div className="root-select-ws-title-path"> {ws.folder.filename}</div>
            </div>
            <div className="root-select-ws-tree">
                <FolderTree
                    target={ws.folder || null}
                    selectFolder={stateCurrentDir.ws?.folder.filename === ws.folder.filename ? (stateCurrentDir.folder ?? null) : null}
                    setSelectFolder={(folder) => { if (folder) stateCurrentDir.open(ws, folder) }}
                    queryFolderChildren={(stat)=> webdav.getDirFolders(stat?stat.filename:'/')}
                />

            </div>
        </div>)}
        <div className="root-select-add-btn" onClick={() => stateWorkspaces.edit()}> + </div>
    </Container>
})