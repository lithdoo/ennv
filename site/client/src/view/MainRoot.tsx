import styled, { keyframes } from "styled-components";
import { group } from "../style/common";
// import { rootState } from "@/state/roots";
import { WidthHideBox } from "@/components";
import logo from '@/assets/favicon500.png'
import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import { getDirFolders } from "@/request/file";
import { DataTree, TreeOpenBtn } from "@/components/tree";
import { WorkspaceLayout, stateCurrentDir, stateWorkspaces } from "@/state";
import { EnFolder } from "@/model/file";
import { assign } from "@/utils/base";


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

    const [select, setSelect] = useState<EnFolder | null>(null)


    const listRef = useRef<FolderItem[]>([])

    const [list, setList] = useState<FolderItem[]>(listRef.current)

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
                    请选择工作目录: {select?.path}
                    {select ? <button onClick={() => submit()}>submit</button> : ""}
                </div>
                <div className="root-edit-disk-selector">{
                    stateWorkspaces.disks.map(name => (
                        <div onClick={() => { changeEditDisk(name) }} key={name} data-focus={name === editDisk} className="root-edit-disk-button">{name}</div>
                    ))
                }</div>
                <div className="root-edit-path-selector">{
                    !editDisk ? '' : <FolderSelectTree
                        list={list}
                        setList={setList}
                        selectFolder={select}
                        setSelectFolder={setSelect}
                    />
                }</div>
            </div>

        </div>
    </RootEditContainer>
})

type FolderItem = {
    name: string,
    id: string,
    pid?: string,
    path: string,
    isOpen: boolean,
    isLeaf: boolean,
    isLoaded: boolean,
}

const load = async (path: string, pid: string, list: FolderItem[], setList: (list: FolderItem[]) => void) => {
    const children = (await getDirFolders(path)).map(val => ({
        id: `${path}/${val.name}`,
        pid: pid,
        name: val.name,
        path: `${path}/${val.name}`,
        isOpen: false,
        isLeaf: val.isLeaf,
        isLoaded: false,
    }))

    const newList = list.filter(val => pid ? (val.pid || '').indexOf(pid) !== 0 : false)
        .map(val => val.id !== pid ? val : Object.assign({}, val, { isLoaded: true, isOpen: true }))
        .concat(children)

    setList(newList)
}

const FolderSelectTreeContainer = styled.div`

    .path-tree-title{
        ${group.flex_row()}

        >*{
            flex: 0 0 auto
        }

        .tree-title-content{
            flex: 1 1 0;
            overflow:hidden;
        }
    }


    .select-point{
        cursor:pointer;

        &[data-select="true"]{
            font-weight:bolder;
            color: #66ccff;
        }
    }
  


`
const FolderSelectTree = ({ selectFolder, setSelectFolder, list, setList }: {
    selectFolder: EnFolder | null,
    setSelectFolder: (folder: EnFolder | null) => void,
    list: FolderItem[],
    setList: (list: FolderItem[]) => void
}) => {



    const toggle = (target: FolderItem) => {
        if (!target.isLoaded) return load(target.path, target.id, list, setList)
        const newList = list.map(val => val.id !== target.id ? val : Object.assign({}, val, { isOpen: !val.isOpen }))
        setList(newList)
    }

    const select = (target: FolderItem) => {
        setSelectFolder(assign(new EnFolder(), {
            name: target.name,
            path: target.path,
        }))
    }

    return <FolderSelectTreeContainer>
        <DataTree<FolderItem>
            id={val => val.id}
            blank={(target) => {
                if (!target.isOpen)
                    return <div></div>
                else if (!target.isLoaded)
                    return <div>加载中...</div>
                else
                    return <div>无子节点</div>
            }}
            title={val => {
                return <div className="path-tree-title">
                    {val.isLeaf ? '' : <TreeOpenBtn isOpen={val.isOpen} onToggle={() => toggle(val)} />}
                    <div className="tree-title-content"><span data-select={selectFolder?.path === val.path} onClick={() => select(val)} className="select-point">{val.name}</span></div>
                </div>
            }}
            list={list.filter(v => !v.pid)}
            isOpen={val => val.isOpen}
            isLeaf={val => val.isLeaf}
            children={val => list.filter(v => v.pid === val.id)}
        />
    </FolderSelectTreeContainer>

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
            key={ws.folder.path}
            className="root-select-ws-item"
            data-current={ws.folder.path === stateWorkspaces.current?.folder.path}
        >
            <div className="root-select-ws-title" onClick={() => stateWorkspaces.focus(ws)}>
                {ws.folder.path}
            </div>
            <div className="root-select-ws-tree">
                <FolderSelectTree
                    list={ws.folderTree}
                    setList={(tree) => { stateWorkspaces.loadTree(ws, tree) }}
                    selectFolder={stateCurrentDir.ws?.folder.path === ws.folder.path ? (stateCurrentDir.folder ?? null) : null}
                    setSelectFolder={(folder) => { if(folder) stateCurrentDir.open(ws, folder) }}
                />
            </div>
        </div>)}
        <div className="root-select-add-btn" onClick={() => stateWorkspaces.edit()}> + </div>
    </RootSelectContainer>
})