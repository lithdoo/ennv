import styled from "styled-components";
import { observer } from "mobx-react";

import { EnIcon } from "@ennv/components";
import { group } from "@/style/common";
import { stateCurrentDir } from "@/state";
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
            {/* <NavBar></NavBar> */}
            <FileGrid
                list={list}
                focus={focus}
                toggle={toggle}
            />
        </Container>
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
        border-radius: 2px;
        background-color: #ccc;
    }

    >.file-desc-cntr{
        height: 32px;
        line-height: 32px;
        color: rgb(37, 38, 43, 0.72);
        font-weight: 600;
        margin: 4px 0px;
        padding: 0px 12px;

        input {
            margin-right: 8px;
            transform: translateY(2px);
        }
    }
    >.file-grid-content{
        display: grid;
        padding:0 24px;
        grid-gap: 12px 0;
        justify-content: space-between;
        justify-items: center;
        grid-template-columns: repeat(auto-fill,150px);
    }
`

const FileGrid = ({ focus, toggle, list }: {
    focus: FileStat | null,
    toggle: (f: FileStat) => void
    list: (FileStat)[]
}) => {

    return (
        <FileGridContainer>
            <div className="file-desc-cntr">
                <input type="checkbox" name="" id="" /> 共 {list.length} 项
            </div>
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
    height: 168px;
    width: 120px;
    padding: 0 8px;
    margin: 0 9px;

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
        filter: drop-shadow(0px 0 0 rgba(0, 0, 0, 0));
    }

    .card{
        ${group.flex_col()}
        ${group.flex_row_center()}
        ${group.trans_ease_out()}
        padding: 4px 4px 6px;
    }

    .icon{
        font-size: 80px;
        line-height: 80px;
        text-align: center;
        height:80px;
        width:92px;
        margin-bottom:12px;
    }

    .title{
        padding: 0 4px;
        width: 100%;
        max-width: 100%;
        text-align: center;
        font-size: 13px;
        line-height: 1.5;
        margin: 0;
        margin-bottom: 2px;
        ${group.ellipsis(2)}

    }
    
    .desc{
        padding: 0 8px;
        width: 100%;
        margin: 0;
        max-width: 100%;
        text-align: center;
        font-size: 12px;
        line-height: 1.6;
        color:rgba(37, 38, 43, 0.36);
        ${group.ellipsis()}
    }

    &.focus{
        background: rgb(246, 246, 246, 1);
        color: rgb(0,0,0,0.8);
    }

    &.focus svg{
        filter: drop-shadow( 0px 3px 4px rgba(0, 0, 0, .17));
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

    const time = new Date(target.lastmod)

    const toStr = (num:number)=>{
        const str = num.toString()
        return str.length === 1 ? `0${str}`:str
    }
    const year = time.getFullYear()

    const month = toStr(time.getMonth() + 1)

    const date = toStr(time.getDate())

    const hour = toStr(time.getHours())

    const min = toStr(time.getMinutes())

   

    const dateStr = `${year === new Date().getFullYear()
            ?'':(year + ' ')}${month}/${date} ${hour}:${min}`

    return (
        <FileItemContainer
            className={isFocus ? ' focus' : ''}
            onClick={onToggle}
            onDoubleClick={() => { if (target.type === 'directory') onOpen(target) }}
        >
            <div className="card">

            <div className="icon">
                <EnIcon family={icon[0]} name={icon[1]} />
            </div>
            <p className="title" title={target.basename}>
                    {target.basename}
            </p>
            <p className="desc">
                    {dateStr}
            </p>
            </div>
        </FileItemContainer>
    )
}