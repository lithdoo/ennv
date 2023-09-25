import styled from "styled-components";

import { group } from "@/style/common";
import { WidthHideBox } from "@/components";
import { WorkspaceLayout, stateWorkspaces } from "@/state";

import { HomeSelector } from './HomeSelector'
import { DirTreeList } from "./DirTreeList";


const Container = styled.div`
    ${group.fill()}
    ${group.flex_row()}

    background:rgb(249, 250, 251);
    border-right: 1px solid rgb(238, 238, 238);
    color:rgba(0, 0, 0, 0.88);
    font-size:14px;

    > .root-sider-container{
        ${group.trans_ease_out()}
        height:100%;
        > *{
            height:100%;
            overflow:auto;
        }
    }

    > .root-edit-container{
        ${group.trans_ease_out()}
        height:100%;
        > *{
            height:100%;
            overflow:auto;
        }
    }
`

export const MainRoot = () => {
    return (
        <Container>
            <WidthHideBox width="100%" outerClassName="root-edit-container" hide={stateWorkspaces.layout !== WorkspaceLayout.edit}>
                <HomeSelector></HomeSelector>
            </WidthHideBox>

            <WidthHideBox width="100%" outerClassName="root-sider-container" hide={stateWorkspaces.layout !== WorkspaceLayout.sider} minWidth="200px" >
                <DirTreeList></DirTreeList>
            </WidthHideBox>
        </Container>
    )
}


