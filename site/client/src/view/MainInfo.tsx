import { EnIcon } from "@ennv/components";
import styled from "styled-components";
import { group } from "../style/common";

const Container = styled.div`
    ${group.fill()}
    padding: 16px;
`

export const MainInfo = () => {

    return (
        <Container>
            <InfoPanel></InfoPanel>
        </Container>
    )
}


const InfoPanelContainer = styled.div`
    background:#66ccff;
    height:100%;
    width:100%;
    border-radius:12px;
    box-shadow: 0 3px 12px 0 rgba(0,0,0,0.2);
    color:#fff;

    .file-info{
        ${group.flex_row}
        ${group.flex_center}

        .file-icon{
            flex: 0 0 auto;
            font-size 48px;
            padding: 4px 16px
        }

        .file-info-text{
            flex: 1 1 0;
            .file-info-name{
                font-size: 18px;
                font-weight: bolder;
            }
            .file-info-path{
                font-size: 14px;
                opacity: 0.8;
            }
        }
    }
`

const InfoPanel = () => {


    return (
        <InfoPanelContainer>
            <div className="file-info">
                <div className="file-icon">
                    <EnIcon kind={['i_file', 'zip']}></EnIcon>
                </div>
                <div className="file-info-text">
                    <div className="file-info-name">node_mudules</div>
                    <div className="file-info-path">/test/node_mudules</div>
                </div>
            </div>
        </InfoPanelContainer>
    )
}

