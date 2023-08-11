
import { group } from "@/style/common"
import { FileStat } from "@/utils/webdav"
import { EnIcon } from "@ennv/components"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"


// &[data-open="true"]{
//     height: auto;
// }
// &[data-open="false"]{
//     height: 0;
// }
const TreeItemContainer = styled.div`
.tree-item-children-cntr{
    height:0;
    overflow: hidden;
    ${group.trans_ease_out()}
   
}
.tree-item-children{
    padding-left:18px;

}


`

export function TreeItem<T>(props: {
    target: T,
    genKey: (t: T) => string,
    blank: (t: T) => string | JSX.Element
    title: (t: T) => string | JSX.Element
    isLeaf: (t: T) => boolean,
    isOpen: (t: T) => boolean,
    children: (t: T) => T[],
}) {

    const { target, genKey, title, isLeaf, children, isOpen, blank } = props
    const childrenListElement = useRef<HTMLDivElement | null>(null)
    const childrenCntrElement = useRef<HTMLDivElement | null>(null)
    const childNodeList = isLeaf(target) ? null : children(target)
    const isOpenVal = useRef(false)
    isOpenVal.current = isOpen(target)

    useEffect(() => {
        if (!childrenCntrElement.current) return
        if (!childrenListElement.current) return
        if (
            (childrenCntrElement.current.style.height === '0')
            && (!isOpenVal.current)
        ) return

        if (
            (childrenCntrElement.current.style.height === 'auto')
            && (isOpenVal.current)
        ) return

        if (childrenCntrElement.current.style.height == 'auto') {
            childrenCntrElement.current.style.height = childrenListElement.current.clientHeight + 'px'
        }

        setTimeout(() => {
            console.log(4)
            if (!childrenCntrElement.current) return
            if (!childrenListElement.current) return

            childrenCntrElement.current.style.height = isOpenVal.current
                ? childrenListElement.current.clientHeight + 'px'
                : '0'
        })

        setTimeout(() => {
            if (!childrenCntrElement.current) return
            if (!childrenListElement.current) return

            childrenCntrElement.current.style.height = isOpenVal.current
                ? 'auto'
                : '0'
        }, 300)

    }, [target,childrenCntrElement, childrenListElement])

    return <TreeItemContainer>
        <div className="title">
            {title(target)}
        </div>
        <div ref={childrenCntrElement} className="tree-item-children-cntr" data-open={isOpenVal}>
            {(() => {

                if (!childNodeList) return ''

                if (childNodeList.length === 0) return blank(target)

                return <div ref={childrenListElement} className="tree-item-children">{
                    children(target).map(t =>
                        <TreeItem<T>
                            key={genKey(t)}
                            target={t}
                            blank={blank}
                            genKey={genKey}
                            title={title}
                            isLeaf={isLeaf}
                            isOpen={isOpen}
                            children={children} />
                    )}
                </div>
            })()}
        </div>



    </TreeItemContainer>
}

export function DataTree<T>({ roots, blank, id, title, isLeaf, isOpen, children }: {
    roots: T[],
    id: (t: T) => string,
    blank: (t: T) => string | JSX.Element
    title: (t: T) => string | JSX.Element
    isLeaf: (t: T) => boolean,
    isOpen: (t: T) => boolean,
    children: (t: T) => T[],
}) {
    return <>{
        roots.map(target => <TreeItem<T>
            key={id(target)}
            target={target}
            blank={blank}
            genKey={id}
            title={title}
            isLeaf={isLeaf}
            isOpen={isOpen}
            children={children}
        />)
    }</>
}

const TreeStatusBtnContainer = styled.div`
    height: 24px;
    width:  22px;
    line-height: 24px;
    font-size: 20px;
    margin-left:-6px;
    margin-right: 2px;
    cursor: pointer;
    overflow:hidden;
    ${group.trans_ease_out()}
    &[data-status="open"]{
        transform: rotate(90deg);
    }
    &[data-status="close"]{}
    
    &[data-status="hidden"]{
        margin-left:0;
        margin-right:0;
        width: 0;
    }
`
export function TreeStatusBtn({ status, onToggle }: {
    status: 'hidden' | 'close' | 'open' | 'loading',
    onToggle: () => void,
}) {
    return <TreeStatusBtnContainer data-status={status} onClick={onToggle}>
        <EnIcon family="i_base" name="option-right"></EnIcon>
    </TreeStatusBtnContainer>
}

interface FolderTreeData {
    id: string,
    stat: FileStat,
    pid?: string,
    extra?: {
        isOpen: boolean,
        isLeaf: boolean,
        isLoaded: boolean,
    }
}
const FolderTreeContainer = styled.div`
padding-left: 8px;

.path-tree-title{
    ${group.flex_row()}
    padding: 2px 0;

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
export function FolderTree({
    target,
    selectFolder,
    setSelectFolder,
    queryFolderChildren
}: {
    target: FileStat | null,
    queryFolderChildren: (stat?: FileStat) => Promise<FileStat[]>
    selectFolder: FileStat | null,
    setSelectFolder: (folder: FileStat | null) => void,
}) {
    const [list, setList] = useState<FolderTreeData[]>([])
    const refList = useRef(list)
    console.log('before', refList.current === list)
    refList.current = list
    const load = async (parent?: FileStat, pid?: string) => {
        const folders = await queryFolderChildren(parent)
        const data = folders.map(stat => ({ id: stat.filename, stat, pid }))
        setList(list.map(v => v.stat.filename === parent?.filename ? {
            ...v,
            extra: {
                isOpen: true,
                isLeaf: false,
                isLoaded: true,
            }
        } : v).concat(data))
    }

    let isLoadingExtra = false
    const loadExtra = async () => {
        if (isLoadingExtra) return
        const target = list.find(v => !v.extra)
        if (!target) return
        isLoadingExtra = true
        try {
            const folders = await queryFolderChildren(target.stat)
            isLoadingExtra = false
            setList(refList.current.map(v => {
                if (v.extra) return v
                if (v.id !== target.id) return v
                return {
                    ...target,
                    extra: {
                        isOpen: false,
                        isLeaf: !folders.length,
                        isLoaded: false,
                    }
                }
            }))
        } catch (e) {
            console.error(e)
            isLoadingExtra = false
        }
    }

    const toggle = (target: FolderTreeData) => {
        if (!target.extra) return
        if (!target.extra.isLoaded) return load(target.stat, target.id)
        const newList = list.map(val => val.id !== target.id
            ? val
            : { ...val, extra: val.extra ? { ...val.extra, isOpen: !val.extra.isOpen } : undefined }
        )
        setList(newList)
    }

    useEffect(() => {
        setTimeout(() => { loadExtra() }, 100);
    }, [list])

    useEffect(() => { load(target ? target : undefined) }, [])

    const getTreeStatus = useCallback((val: FolderTreeData) => {
        if (!val.extra) return 'hidden'
        if (val.extra.isLeaf) return 'hidden'
        if (val.extra.isOpen) return 'open'
        if (!val.extra.isOpen) return 'close'
        return 'hidden'
    }, [])

    return <FolderTreeContainer>
        <DataTree<FolderTreeData>
            id={val => val.id}
            blank={(val) => {
                if (val.extra && val.extra.isOpen) return <div>无子节点</div>
                else return ''
            }}
            title={val => {
                return <div className="path-tree-title">
                    <TreeStatusBtn
                        status={getTreeStatus(val)}
                        onToggle={() => toggle(val)}
                    />
                    <div className="tree-title-content"><span data-select={selectFolder?.filename === val.stat.filename} onClick={() => setSelectFolder(val.stat)} className="select-point">{val.stat.basename}</span></div>
                </div>
            }}
            roots={list.filter(v => !v.pid)}
            isOpen={val => !!val.extra?.isOpen}
            isLeaf={val => (!val.extra) || (val.extra.isLeaf)}
            children={val => list.filter(v => v.pid === val.id)}
        />
    </FolderTreeContainer>
}