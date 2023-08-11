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
    background: #f5f5f5;

    ${group.flex_row()}

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
    
    ${group.trans_ease_out()}
    height: 100%;

    .root-select-ws-item{
        
        ${group.trans_ease_out()}
        ${group.flex_col()}
        flex: 0 0 auto;
        height: 56px;
        overflow:hidden;

        .root-select-ws-title{
            flex: 0 0 auto;
            height: 56px;
            line-height: 56px;
            border-top: 1px solid #66ccff;
            background:#e0e0e0;
        }
        .root-select-ws-tree{
            flex: 1 1 0;
            overflow:auto

        }

        &[data-current="true"]{
            flex: 1 1 0;
        }
    }

    .root-select-add-btn{
        ${group.trans_ease_out()}
        flex: 0 0 auto;
        height:64px;
        line-height:64px;
        text-align:center;
        border: 1px solid #66ccff;
        background: #66ccff;
        margin: 4px;
        color: #fff;
        font-size: 24px;
        cursor: pointer;
        &:hover{
            opacity: 0.8;
        }
    }

`

const RootSelect = observer(() => {

    return <RootSelectContainer>
        {stateWorkspaces.list.map(ws => <div
            key={ws.folder.filename}
            className="root-select-ws-item"
            data-current={ws.folder.filename === stateWorkspaces.current?.folder.filename}
        >
            <div className="root-select-ws-title" onClick={() => stateWorkspaces.focus(ws)}>
                {ws.folder.filename}
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