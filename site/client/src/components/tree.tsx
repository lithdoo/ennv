
import { EnIcon } from "@ennv/components"
import styled from "styled-components"



const TreeItemContainer = styled.div`

.tree-item-children{
    padding-left:16px;
    overflow: hidden;
    &[data-open="true"]{
        height: auto;
    }
    &[data-open="false"]{
        height: 0;
    }
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




    return <TreeItemContainer>
        <div className="title">
            {title(target)}
        </div>

        {(() => {
            const childNodeList = isLeaf(target) ? null : children(target)

            if (!childNodeList) return ''

            if (childNodeList.length === 0) return blank(target)

            return <div className="tree-item-children" data-open={isOpen(target)}>{children(target).map(t =>
                <TreeItem<T>
                    key={genKey(t)}
                    target={t}
                    blank={blank}
                    genKey={genKey}
                    title={title}
                    isLeaf={isLeaf}
                    isOpen={isOpen}
                    children={children} />
            )}</div>
        })()}

    </TreeItemContainer>
}


export function DataTree<T>({ list, blank, id, title, isLeaf, isOpen, children }: {
    list: T[],
    id: (t: T) => string,
    blank: (t: T) => string | JSX.Element
    title: (t: T) => string | JSX.Element
    isLeaf: (t: T) => boolean,
    isOpen: (t: T) => boolean,
    children: (t: T) => T[],
}) {
    return <>{
        list.map(target => <TreeItem<T>
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

const TreeOpenBtnContainer = styled.div`
    height: 24px;
    width:  22px;
    line-height: 24px;
    font-size: 20px;
    margin-left:-6px;
    cursor: pointer;
    &[data-open="true"]{
        transform: rotate(90deg);
    }
`
export function TreeOpenBtn({ isOpen, onToggle }: {
    isOpen: boolean,
    onToggle: () => void,
}) {
    return <TreeOpenBtnContainer data-open={isOpen} onClick={onToggle}>
        <EnIcon family="i_base" name="option-right"></EnIcon>
    </TreeOpenBtnContainer>
}