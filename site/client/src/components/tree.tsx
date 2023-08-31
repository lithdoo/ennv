
import { group } from "@/style/common"
import { FileStat } from "@/utils/webdav"
import { EnIcon } from "@ennv/components"
import { useCallback, useEffect, useRef, useState } from "react"
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
`

export function TreeItem<T>(props: {
    target: T,
    layer: number,
    itemCls: (t: T) => string[]
    genKey: (t: T) => string,
    blank: (t: T) => string | JSX.Element
    title: (t: T) => string | JSX.Element
    isLeaf: (t: T) => boolean,
    isOpen: (t: T) => boolean,
    children: (t: T) => T[],
}) {

    const { target, genKey, title, isLeaf, children, isOpen, blank, itemCls } = props
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

    }, [target, childrenCntrElement, childrenListElement])

    return <TreeItemContainer className={itemCls(target).join(' ')}>
        <div className="title"
            style={{ paddingLeft: props.layer * 14 + 'px' }}>
            {title(target)}
        </div>
        <div
            ref={childrenCntrElement}
            className="tree-item-children-cntr"
            data-open={isOpenVal}>
            {(() => {

                if (!childNodeList) return ''

                if (childNodeList.length === 0) return blank(target)

                return <div ref={childrenListElement} className="tree-item-children">{
                    children(target).map(t =>
                        <TreeItem<T>
                            layer={props.layer + 1}
                            key={genKey(t)}
                            target={t}
                            itemCls={itemCls}
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

export function DataTree<T>({ roots, blank, id, title, isLeaf, isOpen, children, itemCls }: {
    roots: T[],
    id: (t: T) => string,
    blank: (t: T) => string | JSX.Element
    title: (t: T) => string | JSX.Element
    isLeaf: (t: T) => boolean,
    isOpen: (t: T) => boolean,
    itemCls: (t: T) => string[],
    children: (t: T) => T[],
}) {
    return <>{
        roots.map(target => <TreeItem<T>
            layer={0}
            key={id(target)}
            target={target}
            blank={blank}
            genKey={id}
            itemCls={itemCls}
            title={title}
            isLeaf={isLeaf}
            isOpen={isOpen}
            children={children}
        />)
    }</>
}

const TreeStatusBtnContainer = styled.div`
    height: 28px;
    width:  22px;
    line-height: 28px;
    font-size: 16px;
    margin-left:-4px;
    margin-right: -3px;
    margin-top: -1px;
    cursor: pointer;
    overflow:hidden;
    ${group.trans_ease_out()}
    svg{
     ${group.trans_ease_out()}
    }
    &[data-status="open"] svg{
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
.path-tree-title{
    ${group.flex_row()}
    padding: 1px 16px;

    >*{
        flex: 0 0 auto
    }

    .tree-title-content{
        flex: 1 1 0;
        overflow:hidden;
    }
}

.tree-title-content{
    line-height: 28px;
}

.select-point{
    cursor:pointer;
}


.selected > .title{
    font-weight:bolder;
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
            itemCls={val => selectFolder?.filename === val.stat.filename ? ['selected'] : []}
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
                    <div className="tree-title-content">
                        <div
                            data-select={selectFolder?.filename === val.stat.filename}
                            onClick={() => setSelectFolder(val.stat)}

                            className="select-point">
                            {val.stat.basename}
                        </div>
                    </div>
                </div>
            }}
            roots={list.filter(v => !v.pid)}
            isOpen={val => !!val.extra?.isOpen}
            isLeaf={val => (!val.extra) || (val.extra.isLeaf)}
            children={val => list.filter(v => v.pid === val.id)}
        />
    </FolderTreeContainer>
}