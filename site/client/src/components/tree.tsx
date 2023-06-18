
import styled from "styled-components"



const TreeItemContainer = styled.div`

`

export function TreeItem<T>(props: {
    target: T,
    genKey: (t: T) => string,
    title: (t: T) => string | JSX.Element
    isLeaf: (t: T) => boolean,
    isOpen: (t: T) => boolean,
    children: (t: T) => T[],
}) {

    const { target, genKey, title, isLeaf, children, isOpen } = props

    return <TreeItemContainer>
        <div className="title">
            {title(target)}
        </div>

        {isLeaf(target)
            ? ''
            : <div className="children" data-open={isOpen(target)}>{children(target).map(t =>
                <TreeItem<T>
                    key={genKey(t)}
                    target={t}
                    genKey={genKey}
                    title={title}
                    isLeaf={isLeaf}
                    isOpen={isOpen}
                    children={children} />
            )}</div>
        }

    </TreeItemContainer>
}