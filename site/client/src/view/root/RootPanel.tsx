import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`

export const RootPanel = () => {
    return (
        <Container>
            <RootInfo></RootInfo>
            <RootFolderTree></RootFolderTree>
        </Container>
    )
}

const InfoContainer = styled.div`
    flex:0 0 auto;

    .route{
        font-size:18px;
        line-height:32px;
        font-weight:600;
        padding: 18px;
        margin: 12px 0;
    }

    .info{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .info-item{
            flex:1 1 auto;
            .info-title{
                text-align:center
            }

            .info-content{
                height: 72px;
                
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align:center;
            }
        }
    }
`

export const RootInfo = () => {
    return (
        <InfoContainer>
            <div className="route">
                /test/test
            </div>

            <div className="info">
                <div className="info-item">
                    <div className="info-title">占用空间</div>
                    <div className="info-content">
                        <div>129 MB</div>
                    </div>
                </div>
                <div className="info-item">
                    <div className="info-title">文件数</div>
                    <div className="info-content">
                        <div>322</div>
                    </div>
                </div>
                <div className="info-item">
                    <div className="info-title">修改时间</div>
                    <div className="info-content">
                        <div>2023-06-01</div>
                        <div>12:21:42</div>
                    </div>
                </div>
            </div>
        </InfoContainer>
    )
}

const FolderTreeContainer = styled.div``

export const RootFolderTree = () => {
    return (
        <FolderTreeContainer>
        </FolderTreeContainer>
    )
}