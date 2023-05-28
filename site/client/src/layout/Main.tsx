import { type PropsWithChildren } from "react"
import styled from "styled-components"


const MainContainer = styled.div`
    height:100%;
    width: 100%;
    min-height:600px;
    min-width:800px;
`

export const MainLayout = ({ children }: PropsWithChildren<{}>) => {

    return (
        <MainContainer>
            {children}
        </MainContainer>
    )
}
