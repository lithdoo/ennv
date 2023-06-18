import styled from "styled-components";
import { group } from "../style/common";
import { RootStatus, rootState } from "@/state/roots";
import { WidthHideBox } from "@/components";
import logo from '@/assets/favicon500.png'
import { observer } from "mobx-react";
import { useState } from "react";
import { getDirFolders } from "@/request/file";


const Container = styled.div`
    ${group.fill()}
    background: #f3f3f3;

    ${group.flex_row()}

    > .root-sider-container{
        ${group.trans_ease_out()}
        height:100%;
    }

    
    > .root-edit-container{
        ${group.trans_ease_out()}
        height:100%;
    }
`

export const MainRoot = () => {
    return (
        <Container onDoubleClick={() => rootState.toggle()}>


            <WidthHideBox width="100%" outerClassName="root-edit-container" hide={rootState.status !== RootStatus.edit}>
                <RootEdit></RootEdit>
            </WidthHideBox>

            <WidthHideBox width="100%" outerClassName="root-sider-container" hide={rootState.status !== RootStatus.normal} minWidth="290px" >

            </WidthHideBox>




        </Container>
    )
}

const RootEditContainer = styled.div`


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
const RootEdit = observer(() => {

    const [editDisk, setEditDisk] = useState('')
    const [path, setPath] = useState<string[]>([])

    const changeEditDisk = (name: string) => {
        setEditDisk(name)
        getDirFolders([name]).then(data => console.log(data))
    }

    type DirItem = {
        key:string,
        name:string,
        isOpen:boolean,
        isLoaded:boolean,
        isLeaf:boolean,
    }

    return <RootEditContainer>
        <div className="root-edit-content">
            <div className="root-edit-logo">
                <img src={logo} alt="ennv" />
            </div>
            <div className="root-edit-panel">
                <div className="root-edit-label">
                    请选择工作目录: {[editDisk, ...path].join(' / ')}
                </div>
                <div className="root-edit-disk-selector">{
                    rootState.diskList.map(name => (
                        <div onClick={() => { changeEditDisk(name) }} key={name} data-focus={name === editDisk} className="root-edit-disk-button">{name}</div>
                    ))
                }</div>
                <div className="root-edit-path-selector">{


                }</div>
            </div>

        </div>
    </RootEditContainer>
})