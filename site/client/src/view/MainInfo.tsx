import { EnIcon } from "@ennv/components";
import styled from "styled-components";
import { group } from "../style/common";
import { observer } from "mobx-react";
import { useState } from "react";
// import { EnFileDetail, EnFolderDetail, EnFsBase } from "@/model/file";
import { stateSiderInfo, stateTaskList } from "@/state";
import { EnTask } from "@/utils/task";
import { FileStat } from "@/utils/webdav";
import { FileType } from "@/utils/file";

const Container = styled.div`
    ${group.fill()}
    position:relative;
`

export const MainInfo = () => {

    return (
        <Container>
            <DirInfoPanel></DirInfoPanel>
            <TargetInfoPanel></TargetInfoPanel>
        </Container>
    )
}

const TargetInfoPanelContainer = styled.div`
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;

    padding-top:16px;
    padding-bottom:16px;

    padding-left:0;
    padding-right:0;


    width:1px;

    ${group.trans_ease_out()}


    .target-info-panel-outer{
        ${group.trans_ease_out()}

        background: rgb(236, 236, 236);

        width:100%;
        height:100%;
        border-radius:12px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

        overflow:hidden;
    }

    &[data-show="true"]{
        width:100%;
        
        padding-left:16px;
        padding-right:16px;

        padding-top:16px;
        padding-bottom:16px;


        .target-info-panel-outer{
            background: rgb(246, 246, 246, 1);
            position: relative;
            width:100%;
            height:100%;
            border-radius:12px;
            box-shadow: 0 3px 12px 0 rgba(0,0,0,0.1);
        }
    }

    .target-info-panel-inner{
        height:100%;
        width:100%;
        min-width:260px;
    }

`
const TargetInfoPanel = observer(() => {
    const [show, setShow] = useState(true)

    setTimeout(() => {
        setShow(!show)
    }, 5000)

    return <TargetInfoPanelContainer data-show={!!(stateSiderInfo.loadingTarget || stateSiderInfo.currentTarget)}>
        <div className="target-info-panel-outer">
            <LoadingMask show={!!stateSiderInfo.loadingTarget}></LoadingMask>
            <div className="target-info-panel-inner">{
                stateSiderInfo.currentTarget
                    ? <DetailInfo detail={stateSiderInfo.currentTarget}></DetailInfo>
                    : ''
            }{
                    stateSiderInfo.currentTarget
                        ? <DetailActions detail={stateSiderInfo.currentTarget}></DetailActions>
                        : ''
                }</div>
        </div>
    </TargetInfoPanelContainer>
})


const DirInfoPanelContainer = styled.div`
    padding: 16px;
    background: #fff;
`
const DirInfoPanel = observer(() => <DirInfoPanelContainer>
    <LoadingMask show={!!stateSiderInfo.loadingDir}></LoadingMask>
    <div className="target-info-panel-inner">{
        stateSiderInfo.currentDir
            ? <DetailInfo detail={stateSiderInfo.currentDir}></DetailInfo>
            : ''
    }{
            stateSiderInfo.currentDir
                ? <DetailActions detail={stateSiderInfo.currentDir}></DetailActions>
                : ''
        }</div>
</DirInfoPanelContainer>)


const LoadingMaskContainer = styled.div`
    position: absolute;
    top:0;left:0;right:0;
    height:0;
    overflow:hidden;
    opacity:0;
    background: inherit;

    z-index: 1;
    ${group.trans_ease_out()}
    .content{
        ${group.trans_ease_out()}
        padding-top: 0;
        text-align: center;
    }
    
    &[data-show="true"]{
        padding-top: 32px;
        height: 100%;
        opacity: 1;
    }
`
const LoadingMask = ({ show }: { show: boolean }) => <LoadingMaskContainer data-show={show}>
    <div className="content">Loading……</div>
</LoadingMaskContainer>

const DetailInfoContainer = styled.div`
    ${group.flex_row}
    ${group.flex_center}

    .file-icon{
        flex: 0 0 auto;
        font-size 48px;
        padding: 4px 16px
    }

    .file-info-text{
        flex: 1 1 0;
        overflow:hidden;
        .file-info-name{
            font-size: 18px;
            font-weight: bolder;
            padding-right: 16px;
            ${group.ellipsis()}
        }
        .file-info-path{
            font-size: 14px;
            opacity: 0.8;
            padding-right: 16px;
            ${group.ellipsis()}
        }
    }
`
const DetailInfo = ({ detail }: { detail: FileStat }) => {
    const icon: [string, string] = detail.type === 'file'
        ? FileType.type(detail.basename).icon
        : ['i_file', 'folder']

    return <DetailInfoContainer>
        <div className="file-icon">
            <EnIcon kind={icon}></EnIcon>
        </div>
        <div className="file-info-text">
            <div className="file-info-name">{detail.basename}</div>
            <div className="file-info-path">{detail.filename}</div>
        </div>
    </DetailInfoContainer>
}



const DetailActionsContainer = styled.div`

.action{
    ${group.flex_row()}
    ${group.flex_center()}
    ${group.trans_ease_out()}
    cursor: pointer;
    padding:  6px 9px;
    margin: 6px 9px;
    border-radius: 6px;
    &:hover{
        background:rgba(32,32,32,0.7);
        color: #fff;
        box-shadow:0 2px 4px rgba(0,0,0,0.2);
    }

    .icon{
        flex: 0 0 auto;
        margin-right:12px;
        font-size: 24px;
    }

    .name{
        flex: 1 1 0;
    }
}

`
const DetailActions = ({ detail }: { detail: FileStat }) => {

    const actions = EnTask.fileActions(detail)


    return <DetailActionsContainer>{
        actions.map(v => <div
            className="action"
            key={v.key}
            onClick={() => stateTaskList.create(v.key, detail)}
        >
            <div className="icon" style={{ color: v.option.icon[2] }}>
                <EnIcon
                    kind={[v.option.icon[0], v.option.icon[1]]}
                ></EnIcon>
            </div>

            <div className="name">{v.option.name}</div>
        </div>)
    }</DetailActionsContainer>
}