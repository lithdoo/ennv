import styled from "styled-components";
// import { EnFolder, EnFile } from "../model/file";
import { EnIcon } from "@ennv/components";
import { group } from "../style/common";
import { stateCurrentDir } from "@/state";
import { observer } from "mobx-react";
import { assign } from "@/utils/base";
import { FileStat } from "@/utils/webdav";
import { FileType } from "@/utils/file";

const Container = styled.div`
    grid-area: center;
    ${group.flex_col()}
    ${group.fill()}
`

export const MainDir = observer(() => {
    const focus = stateCurrentDir.active ?? null
    const list = stateCurrentDir.list
    const toggle = (target: FileStat) => {
        if (focus !== target) {
            stateCurrentDir.focus(target)
        } else {
            stateCurrentDir.blur()
        }
    }

    return (
        <Container>
            <NavBar></NavBar>
            <FileGrid
                list={list}
                focus={focus}
                toggle={toggle}
            />
        </Container>
    )
})



const NavBarContainer = styled.div`
    flex: 0 0 auto;
    display:flex;
    flex-direction: row;
    align-items:center;

    .route-list{
        padding: 16px 32px;
        font-size: 20px;
        line-height: 32px;
        font-weight: bolder;

        .root{
            color: #999;
            padding: 0 2px;
        }
        .route{
            padding: 0 2px;
            cursor: pointer;
        }
    }    
`
const NavBar = observer(() => {
    const root = (stateCurrentDir.ws?.folder.filename.split('/') ?? []).filter(v => !!v)
    const routes = [] as any[]
    //   stateCurrentDir.folder?.filename
    //     .split('/').filter(v => !!v)
    //     .map((val, idx) => val === root[idx] ? '' : val)
    //     .filter(v => !!v)
    //     .reduce((res, name) => {
    //         const parent = res[res.length - 1]
    //         return res.concat([{
    //             name, folder: assign(new EnFolder(), {
    //                 name, path: `${parent.folder.path}/${name}`
    //             })
    //         }])
    //     }, [{ name: '$ROOT', folder: stateCurrentDir.ws?.folder ?? new EnFolder() }])
    //     ?? []

    return (
        <NavBarContainer>
            <div className="route-list">
                {
                    routes.map((route, index) => <span key={index}>
                        <span className="route" onClick={() => {
                            if (stateCurrentDir.ws) stateCurrentDir.open(stateCurrentDir.ws, route.folder)
                        }}>{route.name}</span> /
                    </span>)
                }
            </div>
        </NavBarContainer>
    )
})

const FileGridContainer = styled.div`
    flex: 1 1 0;
    overflow: auto;

    &::-webkit-scrollbar-track
    {
        background-color: #FFFFFF;
    }

    &::-webkit-scrollbar
    {
        width: 4px;
        background-color: #FFFFFF;
    }

    &::-webkit-scrollbar-thumb
    {
        background-color: #ccc;
    }

    >.file-grid-content{
        display: grid;
        grid-gap: 20px 0;
        justify-content: center;
        justify-items: center;
        grid-template-columns: repeat(auto-fill,minmax(160px,200px));
    }
`

const FileGrid = ({ focus, toggle, list }: {
    focus: FileStat | null,
    toggle: (f: FileStat) => void
    list: (FileStat)[]
}) => {

    return (
        <FileGridContainer>
            <div className="file-grid-content">

                {
                    list.map(item => <FileItem
                        key={item.basename}
                        item={item}
                        isFocus={focus === item}
                        onOpen={item => { if (stateCurrentDir.ws) stateCurrentDir.open(stateCurrentDir.ws, item) }}
                        onToggle={() => toggle(item)}
                    />)
                }
            </div>
        </FileGridContainer>
    )
}

const FileItemContainer = styled.div`
    height: 140px;
    width: 140px;

    ${group.flex_col}
    ${group.flex_center}
    ${group.trans_ease_out}
    cursor: pointer;
    border-radius: 12px;


    transition: all 0.3s ease;
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
    color: #333;
    background: #fff;

    *{
        transition: all 0.3s ease-out;
    }

    float:left;

    svg{
        filter: drop-shadow( 0px 3px 4px rgba(0, 0, 0, .17));
    }

    .icon{
        font-size: 48px;
        margin-top:-12px;
    }

    .title{
        font-size:14px;
        width: 100%;
        padding:0 16px;
        text-align:center;
        height:32px;
        margin-top:4px;
        

        >div{
            transform: translate(0,-20%);
            ${group.ellipsis(2)}
        }
    }

    &.focus{
        box-shadow: 0px 3px 12px 0 rgba(0, 0, 0, .27);
        background: #66ccff;
        color: #fff;
    }

    &.focus svg{
        filter: drop-shadow(0px 0 0 rgba(0, 0, 0, 0));
    }
`

const FileItem = ({ item: target, isFocus, onToggle, onOpen }: {
    item: FileStat,
    isFocus: boolean,
    onToggle: () => void,
    onOpen: (item: FileStat) => void
}) => {

    const icon = target.type === 'file'
        ? FileType.type(target.basename).icon
        : ['i_file', 'folder']

    return (
        <FileItemContainer
            className={isFocus ? ' focus' : ''}
            onClick={onToggle}
            onDoubleClick={() => { if (target.type === 'directory') onOpen(target) }}
        >
            <div className="icon">
                <EnIcon family={icon[0]} name={icon[1]} />
            </div>
            <div className="title" title={target.basename}>
                <div>
                    {target.basename}
                </div>
            </div>
        </FileItemContainer>
    )
}