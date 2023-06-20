import styled from "styled-components";
import { group } from "../style/common";
import { RootStatus, layoutState, rootState } from "@/state/roots";
import { WidthHideBox } from "@/components";
import logo from '@/assets/favicon500.png'
import { observer } from "mobx-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getDirFolders } from "@/request/file";
import { DataTree, TreeOpenBtn } from "@/components/tree";


const Container = styled.div`
    ${group.fill()}
    background: #f3f3f3;

    ${group.flex_row()}

    > .root-sider-container{
        ${group.trans_ease_out()}
        height:100%;
    }

    
    > .root-edit-container{
        ${group.trans_ease_out()}
        height:100%;
    }
`

export const MainRoot = () => {
    return (
        <Container onDoubleClick={() => rootState.toggle()}>


            <WidthHideBox width="100%" outerClassName="root-edit-container" hide={rootState.status !== RootStatus.edit}>
                <RootEdit></RootEdit>
            </WidthHideBox>

            <WidthHideBox width="100%" outerClassName="root-sider-container" hide={rootState.status !== RootStatus.normal} minWidth="290px" >

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
        getDirFolders([name]).then(data => console.log(data))
    }

    const [select, setSelect] = useState<string[]>([])


    const listRef = useRef<FolderItem[]>([])

    const [list, setList] = useState<FolderItem[]>(listRef.current)


    useEffect(() => {
        setList([])
        load([editDisk], '', list, setList)
    }, [editDisk])


    return <RootEditContainer>
        <div className="root-edit-content">
            <div className="root-edit-logo">
                <img src={logo} alt="ennv" />
            </div>
            <div className="root-edit-panel">
                <div className="root-edit-label">
                    请选择工作目录: {select.map(v => v.replace('/', '')).join('/')}
                </div>
                <div className="root-edit-disk-selector">{
                    rootState.diskList.map(name => (
                        <div onClick={() => { changeEditDisk(name) }} key={name} data-focus={name === editDisk} className="root-edit-disk-button">{name}</div>
                    ))
                }</div>
                <div className="root-edit-path-selector">{
                    !editDisk ? '' : <FolderSelectTree
                        list={list}
                        setList={setList}
                        selectFolder={select} setSelectFolder={setSelect} root={[editDisk]}
                    />
                }</div>
            </div>

        </div>
    </RootEditContainer>
})






type FolderItem = {
    id: string,
    pid: string,
    name: string,
    path: string[],
    isOpen: boolean,
    isLeaf: boolean,
    isLoaded: boolean,
}

const load = async (path: string[], pid: string, list: FolderItem[], setList: (list: FolderItem[]) => void) => {
    const children = (await getDirFolders(path)).map(v => (console.log(v), v)).map(val => ({
        id: path.concat([val.name]).join('/'),
        pid: pid,
        name: val.name,
        path: path.concat([val.name]),
        isOpen: false,
        isLeaf: val.isLeaf,
        isLoaded: false,
    }))

    const newList = list.filter(val => pid ? val.pid.indexOf(pid) !== 0 : false)
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
const FolderSelectTree = ({ root, selectFolder, setSelectFolder, list, setList }: {
    root: string[]
    selectFolder: string[],
    setSelectFolder: (path: string[]) => void,
    list: FolderItem[],
    setList: (list: FolderItem[]) => void
}) => {



    const toggle = (target: FolderItem) => {
        if (!target.isLoaded) return load(target.path, target.id, list, setList)
        const newList = list.map(val => val.id !== target.id ? val : Object.assign({}, val, { isOpen: !val.isOpen }))
        setList(newList)
    }

    const select = (target: FolderItem) => {
        console.log(target)
        setSelectFolder(target.path)
    }

    const match = (p1: string[], p2: string[]) => {
        if (p1.length !== p2.length) return false
        return p1.findIndex((val, idx) => val !== p2[idx]) < 0
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
                    <div className="tree-title-content"><span data-select={match(selectFolder, val.path)} onClick={() => select(val)} className="select-point">{val.name}</span></div>
                </div>
            }}
            list={list.filter(v => !v.pid)}
            isOpen={val => val.isOpen}
            isLeaf={val => val.isLeaf}
            children={val => list.filter(v => v.pid === val.id)}
        />
    </FolderSelectTreeContainer>

}