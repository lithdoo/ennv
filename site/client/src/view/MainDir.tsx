import { useState } from "react";
import styled from "styled-components";
import { EnFolder, EnFile, FileType } from "../model/file";
import { EnIcon } from "@ennv/components";
import { group } from "../style/common";

const Container = styled.div`
    grid-area: center;
    ${group.flex_col}
`



export const MainDir = () => {


    const [focus, setFocus] = useState<EnFile | EnFolder | null>(null)
    const [list] = useState(
        new Array(100).fill(0)
            .map(() => {
                return new EnFile()
            })
            .map((item, index) => {
                item.name = `image-${index}.jpg`
                item.size = 10000
                item.type = FileType.type(item.name)
                return item
            })
    )

    const toggle = (target: EnFile | EnFolder) => {
        console.log(1)
        if (focus !== target) {
            setFocus(target)
        } else {
            setFocus(null)
        }
    }

    return (
        <Container>
            <NavBar></NavBar>
            <FileGrid list={list} toggle={toggle} focus={focus}></FileGrid>
        </Container>
    )

}



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
        }
    }    
`
const NavBar = () => {
    const routes = ['test', 'node_mudules']

    return (
        <NavBarContainer>
            <div className="route-list">
                <span className="root">$root</span>/
                {
                    routes.map((route, index) => <span key={index}><span className="route">{route}</span>/</span>)
                }
            </div>
        </NavBarContainer>
    )
}

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
    ${group.trans_ease}
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