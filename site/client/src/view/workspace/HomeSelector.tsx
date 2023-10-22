import logo from '@/assets/favicon500.png'
import { FolderTreeItem, stateWorkspaces } from '@/state'
import { group } from '@/style/common'
import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { EnFile } from "@ennv/disk"
import { FolderTree } from '@/components/tree'
import * as disk from '@/request/disk'


const load = async (diskName: string, pid: string, list: FolderTreeItem[], setList: (list: FolderTreeItem[]) => void) => {
    const children = (await disk.getDirFolders(diskName,'/'))
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

const Container = styled.div`
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
export const HomeSelector = observer(() => {

    const [editDisk, setEditDisk] = useState('')

    const changeEditDisk = (name: string) => {
        setEditDisk(name)
    }

    const submit = () => { if (select &&editDisk) stateWorkspaces.open(editDisk,select) }

    const [select, setSelect] = useState<EnFile | null>(null)

    const listRef = useRef<FolderTreeItem[]>([])

    const [list, setList] = useState<FolderTreeItem[]>(listRef.current)

    useEffect(() => {
        setList([])
        if (editDisk) load(editDisk, '', list, setList)
    }, [editDisk])

    return <Container>
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
                    queryFolderChildren={(stat)=> disk.getDirFolders(editDisk,stat?stat.filename:'/')}
                    ></FolderTree>
                }</div>
            </div>

        </div>
    </Container>
})


