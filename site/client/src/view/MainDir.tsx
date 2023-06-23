import { useState } from "react";
import styled from "styled-components";
import { EnFolder, EnFile, FileType } from "../model/file";
import { EnIcon } from "@ennv/components";
import { group } from "../style/common";
import { stateCurrentDir } from "@/state";
import { observer } from "mobx-react";

const Container = styled.div`
    grid-area: center;
    ${group.flex_col()}
    ${group.fill()}
`

export const MainDir = observer(() => {
    const focus = stateCurrentDir.active ?? null
    const list = stateCurrentDir.list
    const toggle = (target: EnFile | EnFolder) => {
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
    const root = (stateCurrentDir.ws?.path.split('/') ?? []).filter(v => !!v)
    const routes = stateCurrentDir.path.split('/').filter(v => !!v)
        .map((val, idx) => val === root[idx] ? '' : val)
        .filter(v => !!v)
        .reduce((res, name) => {
            const parent = res[res.length - 1]
            return res.concat([{ name, path: `${parent.path}/${name}` }])
        }, [{ name: '$ROOT', path: stateCurrentDir.ws?.path || '' }])

    return (
        <NavBarContainer>
            <div className="route-list">
                {
                    routes.map((route, index) => <span key={index}>
                        <span className="route" onClick={() => {
                            if (stateCurrentDir.ws) stateCurrentDir.open(stateCurrentDir.ws, route.path)
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
    focus: EnFile | EnFolder | null,
    toggle: (f: EnFile | EnFolder) => void
    list: (EnFile | EnFolder)[]
}) => {

    return (
        <FileGridContainer>
            <div className="file-grid-content">

                {
                    list.map(item => <FileItem
                        key={item.name}
                        item={item}
                        isFocus={focus === item}
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

    .text{
        font-size:16px;
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

const FileItem = ({ item: target, isFocus, onToggle }: {
    item: EnFile | EnFolder,
    isFocus: boolean,
    onToggle: () => void
}) => {

    const icon = target instanceof EnFile
        ? target.type.icon
        : ['i_file', 'folder']

    return (
        <FileItemContainer className={isFocus ? ' focus' : ''} onClick={onToggle}>
            <div className="icon">
                <EnIcon family={icon[0]} name={icon[1]} />
            </div>
            <div className="title">
                {target.name}
            </div>
        </FileItemContainer>
    )
}