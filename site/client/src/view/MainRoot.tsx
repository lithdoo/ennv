import styled from "styled-components";
import { group } from "../style/common";
// import { rootState } from "@/state/roots";
import { WidthHideBox } from "@/components";
import logo from '@/assets/favicon500.png'
import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
// import { getDirFolders } from "@/request/file";
import {  FolderTree } from "@/components/tree";
import { FolderTreeItem, WorkspaceLayout, stateCurrentDir, stateWorkspaces } from "@/state";
// import { EnFolder } from "@/model/file";
import * as webdav from '@/utils/webdav'
import { FileStat } from '@/utils/webdav'


const Container = styled.div`
    ${group.fill()}
    ${group.flex_row()}

    background:#E27750;
    color:#fff;
    font-size:14px;

    > .root-sider-container{
        ${group.trans_ease_out()}
        height:100%;
        > *{
            height:100%;
            overflow:auto;
        }
    }

    > .root-edit-container{
        ${group.trans_ease_out()}
        height:100%;
        > *{
            height:100%;
            overflow:auto;
        }
    }
`

export const MainRoot = () => {
    return (
        <Container>
            <WidthHideBox width="100%" outerClassName="root-edit-container" hide={stateWorkspaces.layout !== WorkspaceLayout.edit}>
                <RootEdit></RootEdit>
            </WidthHideBox>

            <WidthHideBox width="100%" outerClassName="root-sider-container" hide={stateWorkspaces.layout !== WorkspaceLayout.sider} minWidth="290px" >
                <RootSelect></RootSelect>
            </WidthHideBox>
        </Container>
    )
}

const RootEditContainer = styled.div`
    .root-edit-content{
        width: 80%;
        max-width: 640px;
        min-width: 480px;
        margin: 0 auto;

        .root-edit-logo{
            text-align:center;
            > img{
                margin-top: 120px;
                height:240px;
                pointer-events:none;
                user-select: none;
            }
        }

        .root-edit-disk-selector{
            ${group.flex_row}

            margin: 8px -12px;
            flex-wrap: wrap;

            > .root-edit-disk-button{
                margin: 8px 12px;
                min-width: 64px;
                border: 2px solid #66ccff;
                font-weight: bolder;
                line-height: 32px;
                border-radius: 4px;
                color: #66ccff;
                text-align: center;
                cursor: pointer;
                &[data-focus="true"]{
                    background: #66ccff;
                    color: #fff;
                }
            }
        }
    }
`
const RootEdit = observer(() => {

    const [editDisk, setEditDisk] = useState('')

    const changeEditDisk = (name: string) => {
        setEditDisk(name)
    }

    const submit = () => { if (select) stateWorkspaces.open(select) }

    const [select, setSelect] = useState<FileStat | null>(null)


    const listRef = useRef<FolderTreeItem[]>([])

    const [list, setList] = useState<FolderTreeItem[]>(listRef.current)

    useEffect(() => {
        setList([])
        if (editDisk) load(editDisk, '', list, setList)
    }, [editDisk])

    return <RootEditContainer>
        <div className="root-edit-content">
            <div className="root-edit-logo">
                <img src={logo} alt="ennv" />
            </div>
            <div className="root-edit-panel">
                <div className="root-edit-label">
                    请选择工作目录: {select?.filename}
                    {select ? <button onClick={() => submit()}>submit</button> : ""}
                </div>
                <div className="root-edit-disk-selector">{
                    stateWorkspaces.disks.map(name => (
                        <div onClick={() => { changeEditDisk(name) }} key={name} data-focus={name === editDisk} className="root-edit-disk-button">{name}</div>
                    ))
                }</div>
                <div className="root-edit-path-selector">{
                    !editDisk ? '' :<FolderTree
                    target={null}
                    selectFolder={select}
                    setSelectFolder={setSelect}
                    queryFolderChildren={(stat)=> webdav.getDirFolders(stat?stat.filename:'/')}
                    ></FolderTree>
                }</div>
            </div>

        </div>
    </RootEditContainer>
})



const load = async (path: string, pid: string, list: FolderTreeItem[], setList: (list: FolderTreeItem[]) => void) => {
    const children = (await webdav.getDirFolders(path))
        .map((stat) => ({
            id: stat.filename,
            stat,
            pid,
            isLoaded: false, isOpen: false, isLeaf: false,
        }))

    const newList = list.filter(val => pid ? (val.pid || '').indexOf(pid) !== 0 : false)
        .map(val => val.id !== pid ? val : Object.assign({}, val, { isLoaded: true, isOpen: true }))
        .concat(children)

    setList(newList)
}

const RootSelectContainer = styled.div`

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
            width: 48px;
            height: 48px;
            margin-left: -16px;
        }
        h1 {
            font-size: 36px;
            line-height: 56px;
            margin: 12px 0 12px 16px;
        }
    }
    .root-select-ws-item{
        
        ${group.trans_ease_out()}
        ${group.flex_col()}
        flex: 0 0 auto;
        height: 56px;
        width: 100%;
        overflow:hidden;
        margin: 6px 0;

        .root-select-ws-title{
            ${group.trans_ease_out()}
            height: 56px;
            flex: 0 0 auto;
            padding: 4px 24px;
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
                background: rgba(255,255,255,0.9);
                border-radius: 0 3px 3px 0;
            }


            >.root-select-ws-title-name{
                line-height: 26px;font-size: 16px;
            }

            >.root-select-ws-title-path{
                line-height: 18px;font-size: 12px;
            }
        }

        &[data-current="true"]{
            .root-select-ws-title{
                background: rgba(0,0,0,0.1);
                opacity: 1;

                &::before{
                    width: 6px;
                }
            }
        }
        .root-select-ws-tree{
            flex: 1 1 0;
            overflow: auto;
            padding: 8px 12px;

            &::-webkit-scrollbar-track
            {}
        
            &::-webkit-scrollbar
            {
                width: 4px;
            }
        
            &::-webkit-scrollbar-thumb
            {
                border-radius: 2px;
                background-color: rgba(255,255,255,0.5);
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
        border: 1px solid rgba(255,255,255,1);
        color: #fff;
        font-size: 24px;
        cursor: pointer;
        background: rgba(255,255,255,0);
        &:hover{
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.2);
        }
    }

`

const RootSelect = observer(() => {

    return <RootSelectContainer>
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
    </RootSelectContainer>
})