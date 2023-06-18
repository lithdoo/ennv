
import styled from "styled-components"



const TreeItemContainer = styled.div`

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

            return <div className="children" data-open={isOpen(target)}>{children(target).map(t =>
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